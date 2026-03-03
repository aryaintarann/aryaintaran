"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useContent } from "@/context/ContentContext";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const content = useContent();
    const projects = content.projects;

    useGSAP(() => {
        const projectsTrack = document.querySelector(".projects-horizontal-track") as HTMLElement;
        if (!projectsTrack) return;

        const projectPanels = gsap.utils.toArray<HTMLElement>(".projects-panel");
        const projectsTotalScroll = (projectPanels.length - 1) * window.innerWidth;

        const tween = gsap.to(projectsTrack, {
            x: -projectsTotalScroll,
            ease: "none",
            scrollTrigger: {
                trigger: ".projects-pin-wrapper",
                pin: true,
                scrub: 1,
                start: "top top",
                end: () => `+=${projectsTotalScroll}`,
            },
        });

        // Panel entry fade-up animations (same pattern as AboutSection)
        projectPanels.forEach((panel, i) => {
            if (i === 0) return;
            const inner = panel.children[0];
            if (inner) {
                gsap.fromTo(
                    inner,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        scrollTrigger: {
                            trigger: panel,
                            containerAnimation: tween,
                            start: "left 80%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            }
        });

        // bg-number parallax — containerAnimation must receive the tween, not a ScrollTrigger id
        gsap.utils.toArray<HTMLElement>(".project-bg-number").forEach((num) => {
            gsap.to(num, {
                y: "25%",
                ease: "none",
                scrollTrigger: {
                    trigger: num.closest(".projects-panel"),
                    start: "left right",
                    end: "right left",
                    scrub: 1,
                    containerAnimation: tween,
                },
            });
        });

        ScrollTrigger.refresh();
    }, { scope: sectionRef, dependencies: [] });

    const displayedProjects = projects.slice(0, 3);

    return (
        <section
            id="projects"
            ref={sectionRef}
            className="relative overflow-hidden"
        >
            <div className="projects-pin-wrapper">
                <div className="projects-horizontal-track flex">

                    {/* Panel 1 — Intro */}
                    <div className="projects-panel w-screen h-screen shrink-0 flex flex-col justify-center px-8">
                        <div className="max-w-5xl mx-auto w-full">
                            <span className="section-num mb-8 block">04 / PORTFOLIO</span>
                            <h2 className="text-[clamp(3.5rem,10vw,11rem)] font-black leading-[0.9] tracking-[-0.03em] mb-8">
                                MY
                                <br />
                                <span className="text-lime">BUILDS</span>
                            </h2>
                            <p className="text-xl leading-relaxed text-muted-foreground max-w-xl">
                                A selection of what I&apos;ve built — scroll to explore each case study.
                            </p>
                            <div className="mt-10 flex items-center gap-3 text-muted-foreground">
                                <span className="text-sm tracking-widest uppercase">Scroll to explore</span>
                                <span className="text-lime text-lg">→</span>
                            </div>
                        </div>
                    </div>

                    {/* Panels 2–4 — Projects */}
                    {displayedProjects.map((project, i) => (
                        <div
                            key={project.index}
                            className="projects-panel w-screen h-screen shrink-0 flex flex-col justify-center px-8"
                        >
                            <div className="max-w-5xl mx-auto w-full">
                                <span className="section-num mb-6 block">
                                    04 / BUILD {String(i + 1).padStart(2, "0")}
                                </span>

                                <div className="flex items-start gap-8">
                                    <span className="project-bg-number text-[clamp(6rem,15vw,14rem)] font-black text-lime/20 leading-none select-none">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>

                                    <div className="flex-1 pt-4">
                                        <h2 className="text-[clamp(2rem,5vw,5rem)] font-black leading-[0.9] tracking-[-0.03em] mb-6">
                                            {project.title}
                                        </h2>
                                        <p className="text-xl leading-relaxed text-muted-foreground mb-8 max-w-2xl">
                                            {project.description}
                                        </p>

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

                                        <a
                                            href={project.link}
                                            className="inline-flex items-center gap-2 bg-lime text-[#050505] font-bold py-3 px-8 rounded-xl hover:bg-lime-dark transition-colors text-sm tracking-wider uppercase"
                                        >
                                            View Details <ArrowUpRight size={16} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Panel 5 — See All */}
                    <div className="projects-panel w-screen h-screen shrink-0 flex flex-col items-center justify-center px-8">
                        <div className="text-center">
                            <span className="section-num mb-8 block">04 / SEE ALL</span>
                            <h2 className="text-[clamp(3rem,8vw,8rem)] font-black leading-[0.9] tracking-[-0.03em] mb-6">
                                SEE
                                <br />
                                <span className="text-lime">ALL</span>
                            </h2>
                            <p className="text-xl text-muted-foreground mb-10 max-w-lg mx-auto">
                                Explore the full collection of case studies and engineering highlights.
                            </p>
                            <Link
                                href="/projects"
                                className="inline-flex items-center gap-2 bg-lime text-[#050505] font-bold py-4 px-10 rounded-xl hover:bg-lime-dark transition-colors text-sm tracking-wider uppercase"
                            >
                                View Portfolio <ArrowUpRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
