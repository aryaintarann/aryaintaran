"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface Article {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  published_at: string;
  cover_image: string | null;
}

interface NewsSectionClientProps {
  articles: Article[] | null;
}

export default function NewsSectionClient({ articles }: NewsSectionClientProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const header = sectionRef.current?.querySelector(".news-header");
    const cards = gsap.utils.toArray<HTMLElement>(".news-card");

    // Animate header: title + subtitle fade in from below
    if (header) {
      const headerChildren = header.querySelectorAll(".news-header-anim");
      gsap.fromTo(
        headerChildren,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Animate cards: staggered fade in from below
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: cards[0],
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    ScrollTrigger.refresh();
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section
      id="news"
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border"
    >
      <div className="news-header mb-16 md:flex md:items-end md:justify-between">
        <div>
          <div className="news-header-anim flex items-center gap-4 mb-4">
            <span className="section-num">04 / TECH NEWS</span>
            <div className="h-[1px] bg-border flex-grow max-w-[100px]"></div>
          </div>
          <h2 className="news-header-anim display-text mb-6">
            Tech <span className="text-lime">News</span>
          </h2>
          <p className="news-header-anim text-lg text-muted-foreground max-w-2xl">
            Stay updated with the latest in technology, AI, and web development. Curated and delivered fresh.
          </p>
        </div>
        <div className="news-header-anim mt-8 md:mt-0 pb-4">
          <Link
            href="/news"
            className="inline-flex items-center text-foreground font-medium text-sm transition-all hover:text-lime hover:translate-x-1"
          >
            View All News
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles?.map((article) => (
          <Link href={`/news/${article.slug}`} key={article.id} className="news-card group cursor-pointer">
            <div className="h-full glass border border-border rounded-2xl overflow-hidden tech-card flex flex-col relative bg-card">
              {article.cover_image ? (
                <div className="w-full h-56 overflow-hidden relative bg-muted">
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.style.background = "linear-gradient(135deg, rgba(206,244,65,0.15), rgba(206,244,65,0.05))";
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>
              ) : (
                <div className="w-full h-56 bg-gradient-to-br from-lime/10 to-lime/5 flex items-center justify-center">
                  <span className="text-lime/30 text-4xl font-black select-none">NEWS</span>
                </div>
              )}
              <div className="p-8 flex flex-col flex-grow">
                <div className="text-xs font-semibold text-lime mb-3 uppercase tracking-wider">
                  {new Date(article.published_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-lime transition-colors line-clamp-3">
                  {article.title}
                </h3>
                <p className="text-muted-foreground mb-6 flex-grow line-clamp-3 leading-relaxed">
                  {article.description ||
                    "Click to read the full article and uncover the details of this trending tech story."}
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
            <p className="text-muted-foreground text-lg">
              No articles generated yet. They will appear here soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
