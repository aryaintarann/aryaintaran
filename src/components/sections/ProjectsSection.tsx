"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Briefcase, User, Building2 } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useContent } from "@/context/ContentContext";

gsap.registerPlugin(ScrollTrigger);

const TABS = [
    { id: "freelance", label: "Freelance", icon: Briefcase },
    { id: "personal", label: "Personal", icon: User },
    { id: "work", label: "Company", icon: Building2 },
];

export default function ProjectsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const content = useContent();
    const projects = content.projects;
    const [activeTab, setActiveTab] = useState("freelance");

    useGSAP(() => {
        gsap.fromTo(
            ".projects-header",
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none none",
                },
            }
        );
        ScrollTrigger.refresh();
    }, { scope: sectionRef, dependencies: [] });

    const handleTabChange = (tabId: string) => {
        const grid = document.querySelector(".projects-grid");
        if (grid) {
            gsap.fromTo(grid, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
        }
        setActiveTab(tabId);
    };

    const filtered = projects.filter((p) => p.type === activeTab);

    return (
        <section
            id="projects"
            ref={sectionRef}
            className="relative min-h-screen flex flex-col justify-center px-4 md:px-8 py-12 md:py-24"
        >
            <div className="max-w-6xl mx-auto w-full">

                {/* Header */}
                <div className="projects-header mb-10 md:mb-14 text-center">
                    <span className="section-num block mb-3">03 / PORTFOLIO</span>
                    <h2 className="text-[clamp(3rem,8vw,8rem)] font-black leading-[0.9] tracking-[-0.03em]">
                        MY <span className="text-lime italic">BUILDS</span>
                    </h2>
                </div>

                {/* Tab bar */}
                <div className="flex gap-1 mb-8 p-1 rounded-xl border border-border bg-card w-fit mx-auto">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const count = projects.filter((p) => p.type === tab.id).length;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${activeTab === tab.id
                                    ? "bg-lime text-[#050505]"
                                    : "text-foreground/50 hover:text-foreground"
                                    }`}
                            >
                                <Icon size={15} className="sm:hidden" />
                                <span className="hidden sm:inline">{tab.label}</span>
                                {count > 0 && (
                                    <span className={`hidden sm:inline text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-[#050505]/20" : "bg-border"
                                        }`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Projects grid */}
                <div className="projects-grid">
                    {filtered.length === 0 ? (
                        <div className="flex items-center justify-center min-h-[200px]">
                            <p className="text-muted-foreground text-sm">No projects in this category yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {filtered.map((project, i) => (
                                <article
                                    key={project.index}
                                    className="group relative flex flex-col gap-4 p-5 md:p-6 rounded-2xl border border-border bg-card hover:border-lime/50 transition-all duration-300"
                                >
                                    {/* Index badge */}
                                    <span className="absolute top-5 right-5 text-[10px] font-black tracking-widest text-muted-foreground/40 select-none">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>

                                    {/* Title */}
                                    <div>
                                        <h3 className="text-lg md:text-xl font-black leading-tight mb-2 pr-8 group-hover:text-lime transition-colors duration-300">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                                            {project.description}
                                        </p>
                                    </div>

                                    {/* Stack tags */}
                                    <ul className="flex flex-wrap gap-1.5 mt-auto">
                                        {project.stack.map((tech) => (
                                            <li
                                                key={tech}
                                                className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-border bg-muted/50"
                                            >
                                                {tech}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 pt-2 border-t border-border">
                                        <Link
                                            href={`/projects/${project.slug}`}
                                            className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-lime hover:opacity-70 transition-opacity"
                                        >
                                            Details <ArrowUpRight size={13} />
                                        </Link>
                                        {project.link && project.link !== "#" && (
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors ml-auto"
                                            >
                                                Live <ArrowUpRight size={13} />
                                            </a>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                {/* See all link */}
                <div className="mt-10 flex justify-center">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 border border-border hover:border-lime text-sm font-bold tracking-wider uppercase px-6 py-3 rounded-xl transition-all duration-300 hover:text-lime"
                    >
                        View All Projects <ArrowUpRight size={15} />
                    </Link>
                </div>

            </div>
        </section>
    );
}
