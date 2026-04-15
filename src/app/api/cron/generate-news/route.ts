import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ─── RSS Feed Sources (Technology focused) ──────────────────────────────────
// Multiple sources covering: AI, Web Dev, Computers, Laptops, Android, Apple
const RSS_FEEDS = [
  'https://feeds.arstechnica.com/arstechnica/technology-lab',       // Ars Technica – in-depth tech & hardware
  'https://www.theverge.com/rss/index.xml',                         // The Verge – consumer tech, Apple, Android
  'https://techcrunch.com/feed/',                                    // TechCrunch – startups, AI, web
  'https://www.wired.com/feed/category/tech/latest/rss',            // WIRED – tech culture & AI
  'https://feeds.feedburner.com/AndroidAuthority',                  // Android Authority – Android & mobile
  'https://9to5mac.com/feed/',                                       // 9to5Mac – Apple ecosystem
];

// ─── System Instruction (Journalistic Persona) ──────────────────────────────
// Following Context7 best practice: define the role via system instruction
const SYSTEM_INSTRUCTION = `You are a senior technology journalist with 15+ years of experience at world-class publications such as The Verge, Wired, and Ars Technica. You write in the style of international award-winning tech journalism: clear, authoritative, factual, and engaging for both technical and general audiences.

Your writing principles:
- Follow the AP Style Guide and principles of the Society of Professional Journalists (SPJ).
- Lead with the most important news (inverted pyramid structure).
- Never fabricate facts — only expand, analyze, and contextualize what is given.
- Use active voice and strong verbs. Avoid passive voice.
- Write naturally — no robotic or template-sounding text.
- Explain technical jargon in plain English without being condescending.
- Maintain journalistic objectivity. Present multiple angles when relevant.`;

// ─── Helper: Fetch and parse an RSS feed ────────────────────────────────────
async function fetchFeed(url: string) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const feed = parser.parse(xml);
    const items = feed.rss?.channel?.item ?? feed.feed?.entry;
    return Array.isArray(items) ? items : items ? [items] : null;
  } catch {
    return null;
  }
}

// ─── Helper: Extract cover image from RSS item ──────────────────────────────
function extractCoverImage(item: any): string | null {
  if (item['media:content']) {
    const media = Array.isArray(item['media:content']) ? item['media:content'][0] : item['media:content'];
    if (media?.['@_url']) return media['@_url'];
  }
  if (item['media:thumbnail']) {
    const thumb = Array.isArray(item['media:thumbnail']) ? item['media:thumbnail'][0] : item['media:thumbnail'];
    if (thumb?.['@_url']) return thumb['@_url'];
  }
  if (item.enclosure?.['@_url']) return item.enclosure['@_url'];
  return null;
}

// ─── Route Handler ───────────────────────────────────────────────────────────
export async function GET() {
  try {
    // 1. Try each RSS feed until we get a new unprocessed article
    let targetItem: any = null;
    let coverImage: string | null = null;

    for (const feedUrl of RSS_FEEDS) {
      const items = await fetchFeed(feedUrl);
      if (!items) continue;

      for (const item of items.slice(0, 5)) {
        const link = item.link?.['#text'] ?? item.link ?? item.guid;
        if (!link) continue;

        // Check if already processed
        const { data: existing } = await supabase
          .from('articles')
          .select('original_url')
          .eq('original_url', link)
          .single();

        if (!existing) {
          targetItem = item;
          targetItem._resolvedLink = link;
          coverImage = extractCoverImage(item);
          break;
        }
      }
      if (targetItem) break;
    }

    if (!targetItem) {
      return NextResponse.json({ message: 'No new articles found across all feeds.' });
    }

    const originalTitle = targetItem.title?.['#text'] ?? targetItem.title ?? 'Tech News';
    const originalSummary = targetItem.description ?? targetItem.summary?.['#text'] ?? targetItem.summary ?? originalTitle;

    // 2. Generate article using Gemini with system instruction & structured prompt
    // Following Context7 guidance: use systemInstruction for role definition,
    // use a detailed structured prompt for clear output format.
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const prompt = `You are given a raw news brief from a technology publication. Your task is to rewrite and expand it into a complete, publishable tech news article for an international audience.

TOPIC DOMAIN: The article must relate to one or more of these areas:
- Artificial Intelligence (AI, Machine Learning, LLMs, robotics)
- Web Development (frameworks, browsers, developer tools, cloud)
- Computers & Laptops (hardware, chips, processors, peripherals)
- Android & mobile technology
- Apple ecosystem (iPhone, Mac, iPad, iOS, macOS)
- General IT & cybersecurity

ARTICLE STRUCTURE (use Markdown headings):
1. Start with a single H1 title: "# [Your SEO-optimized, attention-grabbing title here]"
2. A strong opening paragraph (lede) — answers Who, What, When, Where, Why in 2-3 sentences. No heading.
3. "## What's Happening" — The core story in clear, factual prose. 2-3 paragraphs.
4. "## Why It Matters" — Analysis: impact for consumers, developers, or the industry. 1-2 paragraphs.
5. "## Key Takeaways" — A bullet-point list of 3-5 concise, actionable points.
6. "## The Bigger Picture" — Broader context: where this fits in the wider tech landscape. 1-2 paragraphs. Here, naturally and briefly mention that readers who want to build technology for the future can work with **Arya Intaran**, a full-stack web developer specializing in Next.js and modern web technologies at [aryaintaran.dev](https://aryaintaran.dev). Weave it in contextually — do not make it sound like an advertisement.
7. A closing sentence that leaves readers with a forward-looking thought or open question.

WRITING RULES:
- Minimum 600 words, maximum 900 words for the article body.
- Use bold (**term**) for key technical terms on first usage, not repeatedly.
- Never use the phrase "In conclusion" or "In summary".
- Do not fabricate quotes or statistics not present in the source.
- Write as if this will be published on a tier-1 tech publication.

---
SOURCE ARTICLE TITLE: ${originalTitle}
SOURCE SUMMARY: ${String(originalSummary).replace(/<[^>]*>/g, '').substring(0, 1500)}
---

Write the full article now:`;

    const result = await model.generateContent(prompt);
    const generatedContent = result.response.text();

    // 3. Parse title from the first H1 line
    let title = originalTitle;
    let contentBody = generatedContent;

    const lines = generatedContent.split('\n');
    const h1Line = lines.find(l => l.trim().startsWith('# '));
    if (h1Line) {
      title = h1Line.replace(/^#+\s*/, '').trim();
      const h1Index = lines.indexOf(h1Line);
      contentBody = lines.slice(h1Index + 1).join('\n').trim();
    }

    // 4. Generate description (first non-empty paragraph after H1)
    const descriptionLines = contentBody.split('\n').filter(l => l.trim() && !l.startsWith('#'));
    const description = descriptionLines[0]?.replace(/\*\*/g, '').substring(0, 250) ?? '';

    // 5. Build SEO slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 80);

    // 6. Store to Supabase
    const { data, error } = await supabase
      .from('articles')
      .insert([{
        title,
        slug,
        description,
        content: contentBody,
        original_url: targetItem._resolvedLink,
        cover_image: coverImage,
      }])
      .select();

    if (error) {
      console.error('Supabase Insert Error:', error);
      throw error;
    }

    return NextResponse.json({
      message: 'Successfully generated and stored article',
      article: data[0],
    });

  } catch (error: any) {
    console.error('Error generating news:', error);

    if (error?.status === 503 || error?.status === 429) {
      return NextResponse.json({
        error: 'Gemini API is currently busy or rate-limited. Please try again later.',
      }, { status: error.status });
    }

    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
