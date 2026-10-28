import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ index: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { index } = await params;
  const content = await getContent();
  const edu = content.about.education[Number(index)];
  if (!edu) return { title: "Education" };
  return {
    title: `${edu.title} — Education`,
    description: edu.summary,
    alternates: { canonical: `https://aryaintaran.dev/about/education/${index}` },
    openGraph: {
      title: `${edu.title} | Arya Intaran`,
      description: edu.summary,
      type: "website",
      url: `https://aryaintaran.dev/about/education/${index}`,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Arya Intaran" }],
    },
  };
}

export default async function EducationDetailPage({ params }: Props) {
  const { index } = await params;
  const idx = Number(index);
  const content = await getContent();
  const education = content.about.education;

  if (isNaN(idx) || idx < 0 || idx >= education.length) {
    notFound();
  }

  const edu = education[idx];
  const words = edu.title.split(" ");

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-8 py-4 bg-background/80 backdrop-blur-md border-b border-border">
        <Link
          href="/#about"
          aria-label="Back to about"
          className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </Link>
        <div className="w-9 h-9 bg-lime rounded-lg flex items-center justify-center">
          <span className="text-[#050505] font-black text-sm tracking-tight">AI</span>
        </div>
      </header>

      <div className="pt-28 pb-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Label */}
          <span className="section-num mb-8 block">02 / EDUCATION DETAILS</span>

          {/* Title */}
          <h1 className="text-[clamp(2.5rem,7vw,7rem)] font-black leading-[0.9] tracking-[-0.03em] mb-6">
            {words.map((word, wi) =>
              wi === words.length - 1 ? (
                <span key={wi} className="text-lime">
                  {word}
                </span>
              ) : (
                <span key={wi}>{word} </span>
              )
            )}
          </h1>

          {/* Meta */}
          <p className="text-lime font-semibold text-xl mb-2">{edu.school}</p>
          <p className="text-sm text-muted-foreground tracking-wider uppercase mb-12">{edu.year}</p>

          {/* Summary */}
          <div className="max-w-2xl mb-10">
            <p className="text-muted-foreground text-lg leading-relaxed">{edu.summary}</p>
          </div>

          {/* Details */}
          {edu.details.length > 0 && (
            <ul className="space-y-4 max-w-2xl mb-16">
              {edu.details.map((detail, j) => (
                <li key={j} className="flex items-start gap-4 text-muted-foreground">
                  <span className="text-lime mt-1 text-sm shrink-0">●</span>
                  <span className="text-base leading-relaxed">{detail}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Navigation between items */}
          <div className="flex flex-col sm:flex-row gap-4">
            {idx > 0 && (
              <Link
                href={`/about/education/${idx - 1}`}
                className="inline-flex items-center gap-2 border-2 border-border text-foreground font-bold py-3 px-8 rounded-xl hover:border-lime hover:text-lime transition-colors text-sm tracking-wider uppercase"
              >
                <ArrowLeft size={14} /> Previous
              </Link>
            )}
            {idx < education.length - 1 && (
              <Link
                href={`/about/education/${idx + 1}`}
                className="inline-flex items-center gap-2 bg-lime text-[#050505] font-bold py-3 px-8 rounded-xl hover:bg-lime-dark transition-colors text-sm tracking-wider uppercase"
              >
                Next →
              </Link>
            )}
            <Link
              href="/#about"
              className="inline-flex items-center gap-2 border-2 border-border text-muted-foreground font-bold py-3 px-8 rounded-xl hover:border-lime hover:text-lime transition-colors text-sm tracking-wider uppercase"
            >
              All Education
            </Link>
          </div>
        </div>
      </div>

      <footer className="py-8 px-4 md:px-8 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Arya Intaran.{" "}
          <a href="/privacy-policy" className="underline underline-offset-2 hover:text-foreground transition-colors">
            Privacy Policy
          </a>
        </p>
      </footer>
    </main>
  );
}
