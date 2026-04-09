import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    // 1. Fetch RSS Feed using native fetch
    const response = await fetch('https://search.yahoo.com/mrss/'); // Using native fetch avoids the url.parse warning
    const feedUrl = 'https://techcrunch.com/feed/';
    const rawFeed = await fetch(feedUrl);
    if (!rawFeed.ok) {
        throw new Error(`Failed to fetch RSS: ${rawFeed.statusText}`);
    }
    const xmlData = await rawFeed.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
    const feed = parser.parse(xmlData);
    
    // Some RSS feeds structure it as feed.rss.channel.item
    const items = feed.rss?.channel?.item;
    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'No articles found in RSS feed' }, { status: 404 });
    }

    // Get the latest article
    const latestItem = items[0];
    
    // Extract Image (media:content, enclosure, or from description)
    let coverImage = null;
    if (latestItem['media:content']) {
      const media = Array.isArray(latestItem['media:content']) ? latestItem['media:content'][0] : latestItem['media:content'];
      if (media['@_url']) {
        coverImage = media['@_url'];
      }
    } else if (latestItem['enclosure']) {
      const enc = Array.isArray(latestItem['enclosure']) ? latestItem['enclosure'][0] : latestItem['enclosure'];
      if (enc['@_url']) {
        coverImage = enc['@_url'];
      }
    }
    
    // Check if article already exists based on the original link
    const { data: existing } = await supabase
      .from('articles')
      .select('original_url')
      .eq('original_url', latestItem.link || '')
      .single();
      
    if (existing) {
      return NextResponse.json({ message: 'Article already generated recently.' });
    }

    // 2. Process with Gemini API
    const prompt = `Act as an expert Tech Journalist. Analyze and rewrite this news article. Your goal is to produce a high-quality, professional, and highly engaging tech news post.

CRITICAL REQUIREMENTS:
- Use English.
- Use a structured, readable Markdown format (e.g. ## Key Highlights, ## Deeper Dive, ## Why This Matters).
- Include standard Markdown elements to make it visually interesting (e.g., bullet points for summaries, bold text for key terms, blockquotes for important points).
- Ensure the very first line is the new SEO-optimized heading formatted as "# [Title]".
- Generate a single paragraph near the end that gracefully plugs our services ("Aryaintaran Web Development Services" - a full-stack Next.js and Node web developer), intertwining it naturally with the topic of the news. Make it sound like a recommendation. Don't be overly sales-pitchy.

Original Title: ${latestItem.title}
Original Summary: ${latestItem.description || latestItem.title}

Write the full article now:`

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const generatedContent = result.response.text();
    
    // Parse title from the markdown
    let title = 'Latest Tech News';
    let contentBody = generatedContent;
    
    const lines = generatedContent.split('\n');
    if (lines[0].trim().startsWith('#')) {
      title = lines[0].replace(/^#+\s*/, '').trim();
      contentBody = lines.slice(1).join('\n').trim();
    }
    
    // Make slug SEO friendly
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // 3. Store to Supabase
    const { data, error } = await supabase
      .from('articles')
      .insert([
        {
          title,
          slug,
          content: contentBody,
          original_url: latestItem.link,
          cover_image: coverImage
        }
      ])
      .select();

    if (error) {
      console.error('Supabase Insert Error:', error);
      throw error;
    }

    return NextResponse.json({ message: 'Successfully generated and stored news', article: data[0] });

  } catch (error: any) {
    console.error('Error generating news:', error);
    
    if (error?.status === 503 || error?.status === 429) {
      return NextResponse.json({ 
          error: 'Gemini API is currently busy or rate-limited. This is common on Free Tiers when executing too quickly. Please try again later.' 
      }, { status: error.status });
    }
    
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
