"use client";

import { useRef } from "react";

const phases = [
    {
        phase: "Phase 1",
        title: "Foundation",
        period: "2021 - 2022",
        description:
            "Started my programming journey, learning fundamentals of HTML, CSS, JavaScript, and Python. Built first web projects and explored different areas of development.",
    },
    {
        phase: "Phase 2",
        title: "Upskilling",
        period: "2022 - 2023",
        description:
            "Deepened knowledge in React, Node.js, and modern web frameworks. Started building full-stack applications and contributing to open-source projects.",
    },
    {
        phase: "Phase 3",
        title: "Professional Growth",
        period: "2023 - 2024",
        description:
            "Gained professional experience working on production applications. Mastered TypeScript, Next.js, and cloud deployment. Developed expertise in system design and architecture.",
    },
    {
        phase: "Phase 4",
        title: "Specialization",
        period: "2024 - Present",
        description:
            "Focusing on advanced full-stack development, performance optimization, and scalable architectures. Building complex applications with modern tools and best practices.",
    },
];

export default function JourneySection() {
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section
            id="journey"
            ref={sectionRef}
            className="min-h-screen flex flex-col justify-center px-8 py-24 max-w-6xl mx-auto"
        >
            <div className="mb-16">
                <span className="section-num">03 / THE JOURNEY</span>
            </div>

            <h2 className="text-[clamp(3rem,8vw,8rem)] font-black leading-[0.9] tracking-[-0.03em] mb-16">
                MISSION
                <br />
                <span className="text-[#CEF441]">LOG</span>
            </h2>

            <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />

                {phases.map((phase, i) => (
                    <div
                        key={i}
                        className="relative pl-20 pb-16 last:pb-0 journey-item"
                    >
                        <div className="absolute left-[26px] top-2 w-5 h-5 rounded-full border-2 border-[#CEF441] bg-background z-10" />

                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#CEF441] mb-2 block">
                            {phase.phase}
                        </span>

                        <h3 className="text-2xl font-black mb-1">{phase.title}</h3>
                        <span className="text-sm text-muted-foreground font-mono mb-4 block">
                            {phase.period}
                        </span>
                        <p className="text-muted-foreground leading-relaxed max-w-xl">
                            {phase.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
