import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import TopBar from "@/components/TopBar";

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: article } = await supabase
    .from('articles')
    .select('title, description, published_at, cover_image')
    .eq('slug', slug)
    .single();

  if (!article) return { title: 'Not Found' };

  return {
    title: `${article.title} | Tech News | Arya Intaran`,
    description: article.description || `Read about ${article.title} on Arya Intaran Tech News.`,
    alternates: {
      canonical: `/news/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description || `Read about ${article.title} on Arya Intaran Tech News.`,
      url: `/news/${slug}`,
      type: 'article',
      publishedTime: article.published_at,
      images: article.cover_image ? [{ url: article.cover_image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description || `Read about ${article.title} on Arya Intaran Tech News.`,
      images: article.cover_image ? [article.cover_image] : [],
    }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!article) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: article.cover_image ? [article.cover_image] : [],
    datePublished: article.published_at,
    dateModified: article.published_at,
    description: article.description || `Read about ${article.title}`,
    author: [{
      '@type': 'Person',
      name: 'Arya Intaran',
      url: 'https://aryaintaran.dev'
    }]
  };

  return (
    <main className="relative pb-24 min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <TopBar />
      
      {/* Hero Banner with Cover Image */}
      {article.cover_image && (
        <div className="w-full h-[50vh] md:h-[60vh] relative mt-[72px]">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img 
            src={article.cover_image} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className={`px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto ${article.cover_image ? 'mt-[-100px] relative z-20' : 'mt-32'}`}>
        
        <article className="glass bg-card/95 rounded-3xl p-8 md:p-12 lg:p-16 border border-border shadow-2xl">
          <Link href="/news" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-10 group">
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to News
          </Link>

          <header className="mb-12">
            <div className="text-sm font-bold text-lime mb-6 tracking-widest uppercase section-num flex items-center gap-4">
              <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="w-12 h-px bg-border"></span>
              <span>Tech Edition</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-8 leading-[1.1] tracking-tight">
              {article.title}
            </h1>
          </header>

          <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none text-justify text-muted-foreground
                          [&_p]:mb-8 [&_p]:leading-relaxed [&_p]:tracking-wide
                          [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:border-b [&_h2]:border-border [&_h2]:pb-4
                          [&_a]:text-lime [&_a]:no-underline hover:[&_a]:underline
                          [&_strong]:text-foreground [&_strong]:font-bold
                          [&_blockquote]:text-left [&_blockquote]:border-l-4 [&_blockquote]:border-lime [&_blockquote]:bg-muted/30 [&_blockquote]:py-2 [&_blockquote]:px-6 [&_blockquote]:italic
                          [&_li]:mb-2
                          prose-headings:text-left prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight">
            <ReactMarkdown>
              {article.content.split('\n').filter((line: string) => line.trim() !== '').join('\n\n')}
            </ReactMarkdown>
          </div>
        </article>

        {/* CTA Section matching the portfolio style */}
        <div className="mt-16 glass rounded-3xl p-8 md:p-12 text-center border border-border">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to Elevate Your Digital Presence?</h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            At Aryaintaran, we craft high-performance, visually stunning web applications tailored to your business needs.
          </p>
          <a href="/#contact" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-background transition-all duration-200 bg-foreground border border-transparent rounded-full hover:bg-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground">
            Get a Free Consultation
          </a>
        </div>
      </div>
      
      <footer className="py-8 px-4 md:px-8 text-center border-t border-border mt-20">
        <p className="text-sm text-muted-foreground mb-3">
          © {new Date().getFullYear()} Arya Intaran.
        </p>
      </footer>
    </main>
  );
}
