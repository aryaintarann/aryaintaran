"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import { useContent } from "@/context/ContentContext";
import { User, GraduationCap, Briefcase } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const TABS = [
    { id: "about", label: "About Me", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "career", label: "Career", icon: Briefcase },
];

export default function AboutSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const content = useContent();
    const educationData = content.about.education;
    const careerData = content.about.career;
    const [activeTab, setActiveTab] = useState("about");

    useGSAP(() => {
        // Entrance animation for section
        gsap.fromTo(
            ".about-section-header",
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

        gsap.fromTo(
            ".about-portrait-container",
            { opacity: 0, scale: 0.95 },
            {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                    toggleActions: "play none none none",
                },
            }
        );

        ScrollTrigger.refresh();
    }, { scope: sectionRef, dependencies: [] });

    // Animate tab content on change
    const handleTabChange = (tabId: string) => {
        const content = document.querySelector(".about-tab-content");
        if (content) {
            gsap.fromTo(
                content,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
            );
        }
        setActiveTab(tabId);
    };

    return (
        <section
            id="about"
            ref={sectionRef}
            className="relative min-h-screen flex flex-col justify-center px-4 md:px-8 py-12 md:py-24"
        >
            <div className="max-w-6xl mx-auto w-full">

                {/* Section header */}
                <div className="about-section-header mb-10 md:mb-14 text-center">
                    <span className="section-num block mb-3">01 / ABOUT ME</span>
                    <h2 className="text-[clamp(3rem,8vw,8rem)] font-black leading-[0.9] tracking-[-0.03em]">
                        ABOUT{" "}
                        <span className="text-lime italic">ME</span>
                    </h2>
                </div>

                {/* Main grid — portrait left, tabs right */}
                <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center justify-center">

                    {/* Portrait */}
                    <div className="about-portrait-container shrink-0 w-full md:w-auto flex justify-center md:block">
                        <div className="relative w-48 h-64 md:w-64 md:h-[420px] rounded-2xl overflow-hidden border border-border">
                            <Image
                                src="/hero-portrait.webp"
                                alt="Portrait of Arya Intaran"
                                fill
                                sizes="(max-width: 768px) 192px, 256px"
                                className="object-cover object-top grayscale"
                            />
                            <div
                                className="absolute bottom-0 left-0 right-0 h-1/3"
                                style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
                            />
                        </div>
                    </div>

                    {/* Tab panel */}
                    <div className="flex-1 min-w-0 max-w-xl mx-auto md:mx-0">

                        {/* Tab bar — centered on mobile */}
                        <div className="flex gap-1 mb-8 p-1 rounded-xl border border-border bg-card w-fit mx-auto md:mx-0">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                                        activeTab === tab.id
                                            ? "bg-lime text-[#050505]"
                                            : "text-foreground/50 hover:text-foreground"
                                    }`}
                                >
                                    <Icon size={15} className="sm:hidden" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            )})}
                        </div>

                        {/* Tab content */}
                        <div className="about-tab-content min-h-[280px]">

                            {/* ── About Me ── */}
                            {activeTab === "about" && (
                                <div>
                                    <div
                                        className="text-base md:text-lg leading-relaxed text-muted-foreground prose prose-invert max-w-md prose-p:mb-4 last:prose-p:mb-0 text-center md:text-left"
                                        dangerouslySetInnerHTML={{ __html: content.about.bio }}
                                    />
                                </div>
                            )}

                            {/* ── Education ── */}
                            {activeTab === "education" && (
                                <div>
                                    {educationData.length === 0 ? (
                                        <p className="text-muted-foreground text-sm">No education data yet.</p>
                                    ) : (
                                        <ul className="space-y-5">
                                            {educationData.map((edu, i) => (
                                                <li key={i} className={`border-l-2 ${edu.active ? "border-lime" : "border-border"} pl-5 pb-1`}>
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-base font-bold mb-0.5 leading-tight">{edu.title}</h3>
                                                            <p className="text-lime font-semibold text-sm mb-1">{edu.school}</p>
                                                            <p className="text-xs text-muted-foreground tracking-wider uppercase">{edu.year}</p>
                                                            {edu.summary && (
                                                                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{edu.summary}</p>
                                                            )}
                                                        </div>
                                                        <Link
                                                            href={`/about/education/${i}`}
                                                            className="shrink-0 text-[10px] font-bold tracking-[0.2em] text-lime hover:opacity-70 transition-opacity uppercase whitespace-nowrap pt-1"
                                                        >
                                                            DETAILS →
                                                        </Link>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {/* ── Career ── */}
                            {activeTab === "career" && (
                                <div>
                                    {careerData.length === 0 ? (
                                        <p className="text-muted-foreground text-sm">No career data yet.</p>
                                    ) : (
                                        <ul className="space-y-5">
                                            {careerData.map((career, i) => (
                                                <li key={i} className={`border-l-2 ${career.active ? "border-lime" : "border-border"} pl-5 pb-1`}>
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-base font-bold mb-0.5 leading-tight">{career.title}</h3>
                                                            <p className="text-lime font-semibold text-sm mb-1">{career.company}</p>
                                                            <p className="text-xs text-muted-foreground tracking-wider uppercase">{career.year}</p>
                                                            {career.summary && (
                                                                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{career.summary}</p>
                                                            )}
                                                        </div>
                                                        <Link
                                                            href={`/about/career/${i}`}
                                                            className="shrink-0 text-[10px] font-bold tracking-[0.2em] text-lime hover:opacity-70 transition-opacity uppercase whitespace-nowrap pt-1"
                                                        >
                                                            DETAILS →
                                                        </Link>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
