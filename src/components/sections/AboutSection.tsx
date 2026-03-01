"use client";

import { useRef, useState } from "react";

const educationData = [
    {
        title: "Bachelor of Computer Science",
        school: "University Name",
        year: "2020 — 2024",
        summary: "Focused on software engineering, data structures, algorithms, and web development technologies.",
        details: [
            "GPA: 3.8 / 4.0",
            "Relevant coursework: Web Development, Database Systems, Cloud Computing",
            "Active member of coding club and hackathon participant",
            "Final project: Full-stack e-commerce platform",
        ],
        active: true,
    },
    {
        title: "High School",
        school: "School Name",
        year: "2017 — 2020",
        summary: "Science major with strong foundation in mathematics and computer fundamentals.",
        details: [
            "Science major specialization",
            "Strong foundation in mathematics and logic",
            "Introduction to programming and computer science",
            "Participated in science olympiad competitions",
        ],
        active: false,
    },
];

const careerData = [
    {
        title: "Full Stack Developer",
        company: "Company Name",
        year: "2024 — Present",
        summary: "Building and maintaining web applications using React, Next.js, Node.js, and cloud technologies.",
        details: [
            "Developed and deployed full-stack web applications",
            "Implemented RESTful APIs and database integrations",
            "Collaborated with cross-functional teams using Agile methodology",
            "Optimized application performance and user experience",
        ],
        active: true,
    },
    {
        title: "IT Support Specialist",
        company: "Company Name",
        year: "2022 — 2024",
        summary: "Provided technical support, managed infrastructure, and developed internal tools for workflow automation.",
        details: [
            "Managed and maintained company IT infrastructure",
            "Provided technical support for 50+ employees",
            "Developed internal automation tools using Python and JavaScript",
            "Implemented backup and disaster recovery procedures",
        ],
        active: false,
    },
];

export default function AboutSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [flippedEdu, setFlippedEdu] = useState<number | null>(null);
    const [flippedCareer, setFlippedCareer] = useState<number | null>(null);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="relative overflow-hidden"
        >
            <div className="about-pin-wrapper">
                <div className="about-horizontal-track flex">
                    <div className="about-panel w-screen h-screen flex-shrink-0 flex flex-col justify-center px-8">
                        <div className="max-w-5xl mx-auto w-full">
                            <span className="section-num mb-8 block">01 / ABOUT ME</span>
                            <div className="flex items-center gap-16">
                                <div className="flex-1">
                                    <h2 className="about-title text-[clamp(3rem,8vw,8rem)] font-black leading-[0.9] tracking-[-0.03em] mb-8">
                                        ABOUT
                                        <br />
                                        <span className="text-[#CEF441]">ME</span>
                                    </h2>
                                    <p className="text-xl leading-relaxed text-muted-foreground mb-6 max-w-xl">
                                        A passionate Full Stack Developer with expertise in building modern web
                                        applications. I thrive on crafting intuitive user experiences and
                                        scalable backend systems.
                                    </p>
                                    <p className="text-xl leading-relaxed text-muted-foreground max-w-xl">
                                        I believe in clean code, continuous learning, and the power of
                                        technology to solve real-world problems.
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="relative w-72 h-96 rounded-2xl overflow-hidden border-2 border-border">
                                        <img
                                            src="/hero-portrait.png"
                                            alt="Arya Intaran"
                                            className="w-full h-full object-cover object-top"
                                        />
                                        <div
                                            className="absolute bottom-0 left-0 right-0 h-1/4"
                                            style={{
                                                background: "linear-gradient(to top, var(--background), transparent)",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="about-panel w-screen h-screen flex-shrink-0 relative"
                        style={{ perspective: "2000px" }}
                    >
                        <div
                            className="w-full h-full transition-transform duration-1000"
                            style={{
                                transformStyle: "preserve-3d",
                                transform: flippedEdu !== null ? "rotateY(180deg)" : "rotateY(0deg)",
                            }}
                        >
                            <div
                                className="absolute inset-0 w-full h-full flex flex-col justify-center px-8"
                                style={{ backfaceVisibility: "hidden" }}
                            >
                                <div className="max-w-4xl mx-auto">
                                    <span className="section-num mb-8 block">02 / EDUCATION</span>
                                    <h2 className="text-[clamp(3rem,8vw,8rem)] font-black leading-[0.9] tracking-[-0.03em] mb-12">
                                        EDU
                                        <br />
                                        <span className="text-[#CEF441]">CATION</span>
                                    </h2>
                                    <div className="space-y-8 max-w-2xl">
                                        {educationData.map((edu, i) => (
                                            <div key={i} className={`border-l-2 ${edu.active ? "border-[#CEF441]" : "border-border"} pl-6`}>
                                                <h3 className="text-2xl font-bold mb-1">{edu.title}</h3>
                                                <p className="text-[#CEF441] font-semibold mb-2">{edu.school}</p>
                                                <p className="text-sm text-muted-foreground tracking-wider">{edu.year}</p>
                                                <p className="text-muted-foreground mt-3">{edu.summary}</p>
                                                <button
                                                    onClick={() => setFlippedEdu(i)}
                                                    className="mt-3 text-xs font-semibold tracking-[0.2em] text-[#CEF441] hover:text-[#b8d93a] transition-colors cursor-pointer pointer-events-auto uppercase"
                                                >
                                                    VIEW DETAILS →
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div
                                className="absolute inset-0 w-full h-full flex flex-col justify-center px-8"
                                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                            >
                                {flippedEdu !== null && (
                                    <div className="max-w-4xl mx-auto">
                                        <span className="section-num mb-8 block">02 / EDUCATION DETAILS</span>
                                        <h2 className="text-[clamp(2rem,6vw,6rem)] font-black leading-[0.9] tracking-[-0.03em] mb-4">
                                            {educationData[flippedEdu].title.split(" ").map((word, wi) => (
                                                <span key={wi}>
                                                    {wi === educationData[flippedEdu].title.split(" ").length - 1
                                                        ? <span className="text-[#CEF441]">{word}</span>
                                                        : word + " "
                                                    }
                                                </span>
                                            ))}
                                        </h2>
                                        <p className="text-[#CEF441] font-semibold text-lg mb-2">
                                            {educationData[flippedEdu].school}
                                        </p>
                                        <p className="text-sm text-muted-foreground tracking-wider mb-8">
                                            {educationData[flippedEdu].year}
                                        </p>
                                        <div className="max-w-2xl">
                                            <p className="text-muted-foreground mb-6 text-lg">
                                                {educationData[flippedEdu].summary}
                                            </p>
                                            <ul className="space-y-3">
                                                {educationData[flippedEdu].details.map((detail, j) => (
                                                    <li key={j} className="flex items-start gap-3 text-muted-foreground">
                                                        <span className="text-[#CEF441] mt-1 text-sm">●</span>
                                                        <span className="text-base">{detail}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <button
                                            onClick={() => setFlippedEdu(null)}
                                            className="mt-10 bg-[#CEF441] text-[#050505] font-bold py-3 px-8 rounded-xl cursor-pointer pointer-events-auto hover:bg-[#b8d93a] transition-colors text-sm tracking-wider uppercase"
                                        >
                                            ← GO BACK
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div
                        className="about-panel w-screen h-screen flex-shrink-0 relative"
                        style={{ perspective: "2000px" }}
                    >
                        <div
                            className="w-full h-full transition-transform duration-1000"
                            style={{
                                transformStyle: "preserve-3d",
                                transform: flippedCareer !== null ? "rotateY(180deg)" : "rotateY(0deg)",
                            }}
                        >
                            <div
                                className="absolute inset-0 w-full h-full flex flex-col justify-center px-8"
                                style={{ backfaceVisibility: "hidden" }}
                            >
                                <div className="max-w-4xl mx-auto">
                                    <span className="section-num mb-8 block">03 / CAREER</span>
                                    <h2 className="text-[clamp(3rem,8vw,8rem)] font-black leading-[0.9] tracking-[-0.03em] mb-12">
                                        CAR
                                        <br />
                                        <span className="text-[#CEF441]">EER</span>
                                    </h2>
                                    <div className="space-y-8 max-w-2xl">
                                        {careerData.map((career, i) => (
                                            <div key={i} className={`border-l-2 ${career.active ? "border-[#CEF441]" : "border-border"} pl-6`}>
                                                <h3 className="text-2xl font-bold mb-1">{career.title}</h3>
                                                <p className="text-[#CEF441] font-semibold mb-2">{career.company}</p>
                                                <p className="text-sm text-muted-foreground tracking-wider">{career.year}</p>
                                                <p className="text-muted-foreground mt-3">{career.summary}</p>
                                                <button
                                                    onClick={() => setFlippedCareer(i)}
                                                    className="mt-3 text-xs font-semibold tracking-[0.2em] text-[#CEF441] hover:text-[#b8d93a] transition-colors cursor-pointer pointer-events-auto uppercase"
                                                >
                                                    VIEW DETAILS →
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div
                                className="absolute inset-0 w-full h-full flex flex-col justify-center px-8"
                                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                            >
                                {flippedCareer !== null && (
                                    <div className="max-w-4xl mx-auto">
                                        <span className="section-num mb-8 block">03 / CAREER DETAILS</span>
                                        <h2 className="text-[clamp(2rem,6vw,6rem)] font-black leading-[0.9] tracking-[-0.03em] mb-4">
                                            {careerData[flippedCareer].title.split(" ").map((word, wi) => (
                                                <span key={wi}>
                                                    {wi === careerData[flippedCareer].title.split(" ").length - 1
                                                        ? <span className="text-[#CEF441]">{word}</span>
                                                        : word + " "
                                                    }
                                                </span>
                                            ))}
                                        </h2>
                                        <p className="text-[#CEF441] font-semibold text-lg mb-2">
                                            {careerData[flippedCareer].company}
                                        </p>
                                        <p className="text-sm text-muted-foreground tracking-wider mb-8">
                                            {careerData[flippedCareer].year}
                                        </p>
                                        <div className="max-w-2xl">
                                            <p className="text-muted-foreground mb-6 text-lg">
                                                {careerData[flippedCareer].summary}
                                            </p>
                                            <ul className="space-y-3">
                                                {careerData[flippedCareer].details.map((detail, j) => (
                                                    <li key={j} className="flex items-start gap-3 text-muted-foreground">
                                                        <span className="text-[#CEF441] mt-1 text-sm">●</span>
                                                        <span className="text-base">{detail}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <button
                                            onClick={() => setFlippedCareer(null)}
                                            className="mt-10 bg-[#CEF441] text-[#050505] font-bold py-3 px-8 rounded-xl cursor-pointer pointer-events-auto hover:bg-[#b8d93a] transition-colors text-sm tracking-wider uppercase"
                                        >
                                            ← GO BACK
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
