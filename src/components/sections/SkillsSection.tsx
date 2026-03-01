"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const skills = [
    {
        name: "React",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    },
    {
        name: "Node.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
    },
    {
        name: "Next.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
    },
    {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
    },
    {
        name: "PostgreSQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
    },
    {
        name: "AWS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    },
    {
        name: "Docker",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
    },
    {
        name: "Python",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
    },
    {
        name: "Tailwind CSS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
    },
    {
        name: "Git",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
    },
    {
        name: "MongoDB",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
    },
    {
        name: "Figma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
    },
];

export default function SkillsSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        gsap.utils.toArray<HTMLElement>(".tech-card").forEach((card, i) => {
            gsap.fromTo(
                card,
                { opacity: 0, y: 60, rotateX: 10 },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 0.7,
                    delay: i * 0.06,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 92%",
                        toggleActions: "play none none none",
                    },
                }
            );
        });
        ScrollTrigger.refresh();
    }, { scope: sectionRef, dependencies: [] });

    return (
        <section
            id="skills"
            ref={sectionRef}
            className="min-h-screen flex flex-col justify-center px-8 py-24 max-w-7xl mx-auto"
        >
            <div className="text-center mb-16">
                <span className="section-num block mb-4">04 / SKILLS</span>
                <h2 className="text-[clamp(3rem,8vw,8rem)] font-black leading-[0.9] tracking-[-0.03em]">
                    TECH{" "}
                    <span className="text-[#CEF441] italic">STACK</span>
                </h2>
                <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
                    The right technology will provide scalability, security, and speed.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {skills.map((skill) => (
                    <div
                        key={skill.name}
                        className="tech-card bg-card border border-border rounded-2xl p-6 cursor-default flex flex-col items-center justify-center gap-4 text-center"
                    >
                        <img
                            src={skill.icon}
                            alt={skill.name}
                            className="w-12 h-12"
                        />
                        <h3 className="text-lg font-bold tracking-wider">
                            {skill.name}
                        </h3>
                    </div>
                ))}
            </div>
        </section>
    );
}
