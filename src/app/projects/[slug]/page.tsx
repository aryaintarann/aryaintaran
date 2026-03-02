"use client";

import { useContent } from "@/context/ContentContext";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, ExternalLink, Github, Tag } from "lucide-react";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ProjectType } from "@/types/content";

const TYPE_LABELS: Record<ProjectType, string> = {
  personal: "Personal Project",
  freelance: "Freelance",
  work: "Work / Company",
};

const TYPE_COLORS: Record<ProjectType, string> = {
  personal: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  freelance: "bg-lime/10 text-lime border-lime/20",
  work: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const content = useContent();
  const project = content.projects.find((p) => p.slug === slug);

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState(0);

  useGSAP(() => {
    gsap.fromTo(
      ".detail-heading",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1 }
    );
    gsap.fromTo(
      ".detail-body",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.35 }
    );
  }, { scope: containerRef, dependencies: [slug] });

  // Wait for content to hydrate before returning 404
  if (!project && content.projects.length > 0) {
    notFound();
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-lime border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const hasImages = project.images && project.images.length > 0;
  const paragraphs = (project.longDescription || project.description)
    .split("\n\n")
    .filter(Boolean);

  const projectIndex = content.projects.findIndex((p) => p.slug === slug);
  const prevProject = projectIndex > 0 ? content.projects[projectIndex - 1] : null;
  const nextProject =
    projectIndex < content.projects.length - 1
      ? content.projects[projectIndex + 1]
      : null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-md border-b border-border">
        <Link
          href="/projects"
          className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          All Projects
        </Link>
        <div className="w-9 h-9 bg-lime rounded-lg flex items-center justify-center">
          <span className="text-[#050505] font-black text-sm tracking-tight">AI</span>
        </div>
      </header>

      <div ref={containerRef} className="pt-24 pb-24 px-8">
        <div className="max-w-5xl mx-auto">

          {/* ── Heading ── */}
          <div className="detail-heading mb-16">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="section-num">PROJECT {project.index}</span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full border ${TYPE_COLORS[project.type]}`}
              >
                <Tag size={10} />
                {TYPE_LABELS[project.type]}
              </span>
            </div>

            <h1 className="text-[clamp(3rem,8vw,8rem)] font-black leading-[0.9] tracking-[-0.03em] mb-6">
              {project.title.split(" ").map((word, i, arr) =>
                i === arr.length - 1 ? (
                  <span key={i} className="text-lime">{word}</span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* ── Image Gallery ── */}
          {hasImages && (
            <div className="detail-body mb-16">
              {/* Main image */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border bg-muted mb-4">
                <Image
                  src={project.images[activeImage]}
                  alt={`${project.title} screenshot ${activeImage + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 1024px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Thumbnails */}
              {project.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {project.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === i ? "border-lime" : "border-border hover:border-lime/50"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── No image placeholder ── */}
          {!hasImages && (
            <div className="detail-body mb-16 relative w-full aspect-video rounded-2xl border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-3">
              <span className="text-[clamp(4rem,10vw,8rem)] font-black text-lime/10 select-none leading-none">
                {project.index}
              </span>
              <p className="text-sm text-muted-foreground tracking-wider uppercase">
                No images available
              </p>
            </div>
          )}

          {/* ── 2-column layout: description + sidebar ── */}
          <div className="detail-body grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left: long description */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-black tracking-[-0.02em]">
                ABOUT THE <span className="text-lime">PROJECT</span>
              </h2>
              {paragraphs.map((para, i) => (
                <p key={i} className="text-lg leading-relaxed text-muted-foreground">
                  {para}
                </p>
              ))}
            </div>

            {/* Right: sidebar */}
            <div className="space-y-8">

              {/* Tech stack */}
              <div>
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border border-border bg-muted/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project type */}
              <div>
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">
                  Project Type
                </h3>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase px-3 py-2 rounded-full border ${TYPE_COLORS[project.type]}`}
                >
                  <Tag size={10} />
                  {TYPE_LABELS[project.type]}
                </span>
              </div>

              {/* CTAs — only rendered when links are present */}
              {((project.link && project.link.trim() !== "" && project.link.trim() !== "#") ||
                (project.github && project.github.trim() !== "")) && (
                <div className="space-y-3">
                  {project.link && project.link.trim() !== "" && project.link.trim() !== "#" && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-lime text-[#050505] font-bold py-3.5 px-6 rounded-xl hover:bg-lime-dark transition-colors text-sm tracking-wider uppercase w-full"
                    >
                      Visit Live Site <ExternalLink size={14} />
                    </a>
                  )}
                  {project.github && project.github.trim() !== "" && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 border border-border bg-muted/40 hover:border-lime/40 hover:text-lime font-bold py-3.5 px-6 rounded-xl transition-colors text-sm tracking-wider uppercase w-full"
                    >
                      <Github size={14} /> View on GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Prev / Next navigation ── */}
          <div className="detail-body mt-20 pt-10 border-t border-border flex items-center justify-between gap-6">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group flex items-center gap-3 hover:text-lime transition-colors"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Previous</p>
                  <p className="font-bold">{prevProject.title}</p>
                </div>
              </Link>
            ) : <div />}

            {nextProject ? (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group flex items-center gap-3 text-right hover:text-lime transition-colors"
              >
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Next</p>
                  <p className="font-bold">{nextProject.title}</p>
                </div>
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            ) : <div />}
          </div>

        </div>
      </div>

      <footer className="py-8 px-8 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Arya Intaran.
        </p>
      </footer>
    </main>
  );
}
