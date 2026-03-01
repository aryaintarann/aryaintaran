"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const projects = [
    {
        index: "01",
        title: "E-Commerce Platform",
        description:
            "A full-stack e-commerce solution with real-time inventory management, secure payment processing, and an intuitive admin dashboard.",
        stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind CSS"],
        link: "#",
    },
    {
        index: "02",
        title: "Task Management App",
        description:
            "Collaborative project management tool with real-time updates, Kanban boards, and team analytics for improved productivity.",
        stack: ["React", "Node.js", "Socket.io", "MongoDB", "Express"],
        link: "#",
    },
    {
        index: "03",
        title: "AI Content Generator",
        description:
            "Intelligent content creation platform leveraging AI APIs for generating, editing, and optimizing written content at scale.",
        stack: ["Next.js", "OpenAI API", "Prisma", "PostgreSQL", "Vercel"],
        link: "#",
    },
];

export default function ProjectsSection() {
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section
            id="projects"
            ref={sectionRef}
            className="relative overflow-hidden"
        >
            <div className="projects-pin-wrapper">
                <div className="projects-horizontal-track flex">
                    {projects.map((project) => (
                        <div
                            key={project.index}
                            className="projects-panel w-screen h-screen flex-shrink-0 flex flex-col justify-center px-8"
                        >
                            <div className="max-w-5xl mx-auto w-full">
                                <span className="section-num mb-6 block">
                                    05 / PROJECT {project.index}
                                </span>

                                <div className="flex items-start gap-8">
                                    <span className="text-[clamp(6rem,15vw,14rem)] font-black text-[#CEF441]/20 leading-none select-none">
                                        {project.index}
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
                                            className="inline-flex items-center gap-2 bg-[#CEF441] text-[#050505] font-bold py-3 px-8 rounded-xl hover:bg-[#b8d93a] transition-colors text-sm tracking-wider uppercase"
                                        >
                                            View Project <ArrowUpRight size={16} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="projects-panel w-screen h-screen flex-shrink-0 flex flex-col items-center justify-center px-8">
                        <div className="text-center">
                            <span className="section-num mb-8 block">05 / ALL PROJECTS</span>
                            <h2 className="text-[clamp(3rem,8vw,8rem)] font-black leading-[0.9] tracking-[-0.03em] mb-6">
                                VIEW
                                <br />
                                <span className="text-[#CEF441]">MORE</span>
                            </h2>
                            <p className="text-xl text-muted-foreground mb-10 max-w-lg mx-auto">
                                Explore the full collection of projects and case studies.
                            </p>
                            <a
                                href="#"
                                className="inline-flex items-center gap-2 bg-[#CEF441] text-[#050505] font-bold py-4 px-10 rounded-xl hover:bg-[#b8d93a] transition-colors text-sm tracking-wider uppercase"
                            >
                                View All Projects <ArrowUpRight size={18} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
