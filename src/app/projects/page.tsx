"use client";

import Link from "next/link";
import { useContent } from "@/context/ContentContext";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ProjectsPage() {
    const content = useContent();
    const projects = content.projects;
    const headingRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Heading entrance
        gsap.fromTo(
            ".projects-page-heading",
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1 }
        );

        // Cards stagger
        gsap.fromTo(
            ".project-card",
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out",
                stagger: 0.1,
                delay: 0.3,
            }
        );
    }, { scope: headingRef, dependencies: [] });

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Top bar */}
            <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-md border-b border-border">
                <Link
                    href="/"
                    aria-label="Back to home"
                    className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ArrowLeft
                        size={16}
                        className="group-hover:-translate-x-1 transition-transform"
                    />
                    Back to Home
                </Link>

                <div className="w-9 h-9 bg-lime rounded-lg flex items-center justify-center">
                    <span className="text-[#050505] font-black text-sm tracking-tight">
                        AI
                    </span>
                </div>
            </header>

            <div ref={headingRef} className="pt-28 pb-24 px-8">
                <div className="max-w-6xl mx-auto">

                    {/* Page heading */}
                    <div className="projects-page-heading mb-20">
                        <span className="section-num mb-6 block">ALL PROJECTS</span>
                        <h1 className="text-[clamp(3.5rem,9vw,9rem)] font-black leading-[0.9] tracking-[-0.03em]">
                            MY
                            <br />
                            <span className="text-lime">WORK</span>
                        </h1>
                        <p className="mt-8 text-xl text-muted-foreground max-w-xl">
                            A complete collection of projects I&apos;ve designed and built —
                            from side experiments to production systems.
                        </p>
                        <div className="mt-10 max-w-2xl space-y-4">
                            <p className="text-muted-foreground leading-relaxed">
                                Each piece of work listed here represents a real engineering challenge solved
                                with deliberate technology choices. I focus on writing maintainable,
                                well-tested code and building interfaces that are fast, accessible, and
                                genuinely useful to the people who use them. Good software is invisible to
                                end users — they just know everything works the way it should.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                My experience spans web applications, API design, cloud infrastructure,
                                and data-driven tooling. Whether building solo or as part of a team,
                                I bring the same level of care to architecture, developer experience, and
                                end-user outcomes alike. Clear communication and consistent documentation
                                are as important to me as clean code.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                I work primarily with TypeScript, React, and Node.js on the application layer,
                                PostgreSQL and MongoDB on the data layer, and Vercel or AWS for deployment.
                                Each technology choice is driven by the requirements of the problem, not by
                                familiarity alone. I enjoy learning new tools when they are clearly the right
                                fit, and I value simplicity over complexity wherever possible.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Open source contributions, code reviews, and pair programming have shaped my
                                approach to engineering as much as solo work has. I believe the best software
                                comes from teams where knowledge is shared freely and everyone feels safe to
                                ask questions and suggest improvements.
                            </p>
                        </div>
                    </div>

                    {/* Project grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.map((project, i) => (
                            <article
                                key={project.index}
                                className="project-card group relative border border-border rounded-2xl p-8 bg-card hover:border-lime/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(206,244,65,0.07)] flex flex-col"
                            >
                                {/* Background index number */}
                                <span
                                    aria-hidden
                                    className="absolute top-6 right-8 text-[5rem] font-black leading-none text-lime/10 select-none group-hover:text-lime/15 transition-colors"
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </span>

                                <div className="flex-1">
                                    <span className="section-num mb-4 block">
                                        PROJECT {String(i + 1).padStart(2, "0")}
                                    </span>

                                    <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-black leading-tight tracking-[-0.02em] mb-4">
                                        {project.title}
                                    </h2>

                                    <p className="text-muted-foreground leading-relaxed mb-6">
                                        {project.description}
                                    </p>

                                    {/* Stack badges */}
                                    <div className="flex flex-wrap gap-2 mb-8">
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

                                {/* CTA */}
                                <Link
                                    href={`/projects/${project.slug}`}
                                    aria-label={`View project: ${project.title}`}
                                    className="inline-flex items-center gap-2 self-start bg-lime text-[#050505] font-bold py-3 px-7 rounded-xl hover:bg-lime-dark transition-colors text-sm tracking-wider uppercase"
                                >
                                    View Project
                                    <span className="sr-only">: {project.title}</span>
                                    <ArrowUpRight size={15} />
                                </Link>
                            </article>
                        ))}

                        {/* Contact CTA card */}
                        <article className="project-card md:col-span-2 border border-dashed border-border rounded-2xl p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <span className="section-num mb-4 block">COLLABORATE</span>
                                <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-black leading-tight tracking-[-0.02em]">
                                    GOT A PROJECT
                                    <br />
                                    <span className="text-lime">IN MIND?</span>
                                </h2>
                                <p className="mt-4 text-muted-foreground max-w-md">
                                    I&apos;m always open to new opportunities and interesting collaborations.
                                </p>
                            </div>
                            <Link
                                href="/?scrollTo=contact"
                                className="shrink-0 inline-flex items-center gap-2 border-2 border-lime text-lime font-bold py-4 px-10 rounded-xl hover:bg-lime hover:text-[#050505] transition-colors text-sm tracking-wider uppercase"
                            >
                                Get In Touch <ExternalLink size={15} />
                            </Link>
                        </article>
                    </div>
                </div>
            </div>

            <footer className="py-8 px-8 text-center border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">
                    © {new Date().getFullYear()} Arya Intaran.
                </p>
                <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-4 text-sm">
                    <a href="/about" className="text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">About</a>
                    <a href="/contact" className="text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">Contact</a>
                    <a href="/privacy-policy" className="text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">Privacy Policy</a>
                </nav>
            </footer>
        </main>
    );
}
