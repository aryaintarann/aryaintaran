import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "About | Arya Intaran",
  description:
    "Learn about Arya Intaran — Full Stack Developer, IT Support, and Data Entry Specialist based in Indonesia. Background, education, career, and skills.",
  alternates: { canonical: "https://aryaintaran.com/about" },
  openGraph: {
    title: "About Arya Intaran",
    description:
      "Full Stack Developer, IT Support, and Data Entry Specialist based in Indonesia.",
    type: "website",
    url: "https://aryaintaran.com/about",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Arya Intaran" }],
  },
};

export default function AboutPage() {
  const content = getContent();
  const { bio1, bio2, education, career } = content.about;
  const activeEducation = education.filter((e) => e.active);
  const activeCareer = career.filter((c) => c.active);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-md border-b border-border">
        <Link
          href="/"
          aria-label="Back to home"
          className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <div className="w-9 h-9 bg-lime rounded-lg flex items-center justify-center">
          <span className="text-[#050505] font-black text-sm tracking-tight">AI</span>
        </div>
      </header>

      <div className="pt-28 pb-24 px-8">
        <div className="max-w-4xl mx-auto">

          {/* Heading */}
          <div className="mb-16">
            <span className="section-num mb-6 block">ABOUT ME</span>
            <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] tracking-[-0.03em] mb-8">
              ARYA
              <br />
              <span className="text-lime">INTARAN</span>
            </h1>
          </div>

          {/* Bio + Portrait */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 mb-20 items-start">
            <div>
              <p className="text-xl leading-relaxed text-muted-foreground mb-6">{bio1}</p>
              <p className="text-xl leading-relaxed text-muted-foreground mb-6">{bio2}</p>
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                Based in Indonesia, I specialize in building full-stack web applications using
                React, Next.js, TypeScript, and Node.js. I also provide IT support and
                data entry services, bringing a well-rounded technical skillset to every project.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                I enjoy the full spectrum of web development — from architecting database
                schemas and REST APIs to crafting pixel-perfect user interfaces with smooth
                animations. I believe great software is built on clean architecture, honest
                communication, and a genuine commitment to solving real problems for real people.
                Whether you need a new web application from scratch, a technical audit of an
                existing system, or reliable IT support, I bring the same level of dedication
                and attention to detail to every engagement.
              </p>
            </div>
            <div className="w-64 h-80 rounded-2xl overflow-hidden border-2 border-border shrink-0 hidden md:block">
              <Image
                src="/hero-portrait.webp"
                alt="Portrait of Arya Intaran"
                width={256}
                height={320}
                sizes="256px"
                priority
                className="object-cover object-top grayscale w-full h-full"
              />
            </div>
          </div>

          {/* What I Work With */}
          <section className="mb-16">
            <h2 className="text-2xl font-black tracking-[-0.02em] mb-6">Technologies &amp; Tools</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              My core stack is centered around the JavaScript ecosystem, with deep expertise
              in React and Next.js for frontend development, Node.js for backend services,
              and TypeScript throughout. I use PostgreSQL and Supabase for relational data,
              MongoDB for document-based needs, and Docker for containerized deployments.
              On the infrastructure side, I have practical experience with AWS and Vercel.
              I use Figma for design collaboration and Git for version control across all projects.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Beyond code, I bring a problem-solving mindset shaped by years of IT support work.
              I know how to diagnose infrastructure issues, communicate technical concepts clearly
              to non-technical stakeholders, and keep projects moving even when unexpected
              challenges arise. That breadth of experience informs how I approach every build —
              with resilience, clarity, and a focus on outcomes that genuinely matter.
            </p>
          </section>

          {/* Career */}
          {activeCareer.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-black tracking-[-0.02em] mb-8">Career</h2>
              <div className="space-y-6">
                {activeCareer.map((job, i) => (
                  <div key={i} className="border border-border rounded-2xl p-6 bg-card">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-lg font-bold">{job.title}</h3>
                        {job.company && (
                          <p className="text-muted-foreground text-sm">{job.company}</p>
                        )}
                      </div>
                      {job.year && (
                        <span className="text-xs font-semibold tracking-wider uppercase text-lime shrink-0">
                          {job.year}
                        </span>
                      )}
                    </div>
                    {job.summary && (
                      <p className="text-muted-foreground leading-relaxed">{job.summary}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {activeEducation.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-black tracking-[-0.02em] mb-8">Education</h2>
              <div className="space-y-6">
                {activeEducation.map((edu, i) => (
                  <div key={i} className="border border-border rounded-2xl p-6 bg-card">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-lg font-bold">{edu.title}</h3>
                        {edu.school && (
                          <p className="text-muted-foreground text-sm">{edu.school}</p>
                        )}
                      </div>
                      {edu.year && (
                        <span className="text-xs font-semibold tracking-wider uppercase text-lime shrink-0">
                          {edu.year}
                        </span>
                      )}
                    </div>
                    {edu.summary && (
                      <p className="text-muted-foreground leading-relaxed">{edu.summary}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-lime text-[#050505] font-bold py-3 px-8 rounded-xl hover:bg-lime-dark transition-colors text-sm tracking-wider uppercase"
            >
              View My Work <ArrowUpRight size={15} />
            </Link>
            <Link
              href="/?scrollTo=contact"
              className="inline-flex items-center gap-2 border-2 border-lime text-lime font-bold py-3 px-8 rounded-xl hover:bg-lime hover:text-[#050505] transition-colors text-sm tracking-wider uppercase"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </div>

      <footer className="py-8 px-8 text-center border-t border-border">
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
