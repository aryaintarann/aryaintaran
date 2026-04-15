"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { getSkillIcon } from "@/lib/skillIcons";
import { useContent } from "@/context/ContentContext";

gsap.registerPlugin(ScrollTrigger);

export default function SkillsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const content = useContent();
    const skills = content.skills;

    useGSAP(() => {
        gsap.set(".tech-card", { opacity: 0, y: 60, rotateX: 10 });

        ScrollTrigger.batch(".tech-card", {
            start: "top 92%",
            onEnter: (batch) => {
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 0.7,
                    stagger: 0.06,
                    ease: "power3.out",
                    overwrite: true
                });
            }
        });
        ScrollTrigger.refresh();
    }, { scope: sectionRef, dependencies: [skills] });

    return (
        <section
            id="skills"
            ref={sectionRef}
            className="min-h-screen flex flex-col justify-center px-4 md:px-8 py-24 max-w-7xl mx-auto"
        >
            <header className="text-center mb-16">
                <span className="section-num block mb-4">02 / SKILLS</span>
                <h2 className="text-[clamp(3rem,8vw,8rem)] font-black leading-[0.9] tracking-[-0.03em]">
                    TECH{" "}
                    <span className="text-lime italic">STACK</span>
                </h2>
                <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
                    The right technology will provide scalability, security, and speed.
                </p>
            </header>

            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {skills.map((skill, index) => (
                    <li
                        key={skill.name}
                        className="tech-card bg-card border border-border rounded-2xl p-6 cursor-default flex flex-col items-center justify-center gap-4 text-center"
                    >
                        {(() => {
                            const iconUrl = skill.icon || getSkillIcon(skill.name);
                            return iconUrl ? (
                                <Image
                                    src={iconUrl}
                                    alt={`${skill.name} logo`}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12"
                                    priority={index === 0}
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-xl font-black text-muted-foreground">
                                    {skill.name.slice(0, 2).toUpperCase()}
                                </div>
                            );
                        })()}
                        <h3 className="text-lg font-bold tracking-wider">
                            {skill.name}
                        </h3>
                    </li>
                ))}
            </ul>
        </section>
    );
}
