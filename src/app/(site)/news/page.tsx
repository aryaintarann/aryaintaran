import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Metadata } from 'next';
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: 'Tech News | Arya Intaran Portfolio',
  description: 'Stay updated with the latest in technology, AI, and web development. Curated and delivered fresh.',
  alternates: {
    canonical: '/news',
  },
  openGraph: {
    title: 'Tech News | Arya Intaran',
    description: 'Stay updated with the latest in technology, AI, and web development.',
    type: 'website',
    url: '/news',
  },
};

export default async function NewsPortal() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, description, published_at, cover_image')
    .order('published_at', { ascending: false });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Tech News | Arya Intaran',
    description: 'Stay updated with the latest in technology, AI, and web development.',
    url: 'https://aryaintaran.dev/news'
  };

  return (
    <main className="relative pb-24 min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <TopBar />
      
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-16">
        <div className="mb-16 md:flex md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="section-num">04</span>
              <div className="h-[1px] bg-border flex-grow max-w-[100px]"></div>
            </div>
            <h1 className="display-text mb-6">
              Tech <span className="text-lime">News</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Stay updated with the latest in technology, AI, and web development. Curated and delivered fresh.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles?.map((article) => (
            <Link href={`/news/${article.slug}`} key={article.id} className="group cursor-pointer">
              <div className="h-full glass border border-border rounded-2xl overflow-hidden tech-card flex flex-col relative bg-card">
                {article.cover_image && (
                  <div className="w-full h-56 overflow-hidden relative">
                    <img 
                      src={article.cover_image} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                )}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="text-xs font-semibold text-lime mb-3 uppercase tracking-wider">
                    {new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 group-hover:text-lime transition-colors line-clamp-3">
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 flex-grow line-clamp-3 leading-relaxed">
                    {article.description || "Click to read the full article and uncover the details of this trending tech story."}
                  </p>
                  <div className="flex items-center text-foreground font-medium text-sm group-hover:translate-x-2 transition-transform">
                    Read Story 
                    <svg className="w-4 h-4 ml-2 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {(!articles || articles.length === 0) && (
            <div className="col-span-full py-20 text-center glass border border-border border-dashed rounded-2xl">
              <p className="text-muted-foreground text-lg">No articles generated yet. They will appear here soon.</p>
            </div>
          )}
        </div>
      </div>

      <Navbar />

      <footer className="py-8 px-4 md:px-8 text-center border-t border-border mt-20">
        <p className="text-sm text-muted-foreground mb-3">
          © {new Date().getFullYear()} Arya Intaran.
        </p>
        <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/" className="text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">Home</Link>
          <Link href="/#about" className="text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">About</Link>
          <Link href="/#contact" className="text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">Contact</Link>
        </nav>
      </footer>
    </main>
  );
}
