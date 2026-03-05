"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useContent } from "@/context/ContentContext";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const content = useContent();
    const educationData = content.about.education;
    const careerData = content.about.career;
    const [flippedEdu, setFlippedEdu] = useState<number | null>(null);
    const [flippedCareer, setFlippedCareer] = useState<number | null>(null);

    useGSAP(() => {
        const vw = window.innerWidth;
        const track = document.querySelector(".about-horizontal-track") as HTMLElement;
        if (!track) return;

        const panels = gsap.utils.toArray<HTMLElement>(".about-panel");
        const totalScroll = (panels.length - 1) * vw;

        const tween = gsap.to(track, {
            x: -totalScroll,
            ease: "none",
            scrollTrigger: {
                trigger: ".about-pin-wrapper",
                pin: true,
                scrub: 1,
                start: "top top",
                end: () => `+=${totalScroll}`,
                id: "aboutScroll",
            },
        });

        panels.forEach((panel, i) => {
            if (i === 0) return;
            const content = panel.children[0];
            if (content) {
                gsap.fromTo(
                    content,
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

        const aboutPortrait = sectionRef.current?.querySelector('.about-portrait-container');
        if (aboutPortrait) {
            gsap.to(aboutPortrait, {
                y: "20%",
                ease: "none",
                scrollTrigger: {
                    trigger: ".about-pin-wrapper",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                },
            });
        }
        ScrollTrigger.refresh();
    }, { scope: sectionRef, dependencies: [] });

    return (
        <section
            id="about"
            ref={sectionRef}
            className="relative overflow-hidden"
        >
            <div className="about-pin-wrapper">
                <div className="about-horizontal-track flex">
                    <div className="about-panel w-screen h-screen shrink-0 flex flex-col justify-center px-4 md:px-8">
                        <div className="max-w-5xl mx-auto w-full mt-24 md:mt-0">
                            <span className="section-num mb-4 md:mb-8 block">01 / ABOUT ME</span>
                            <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16">
                                <div className="flex-1 w-full">
                                    <h2 className="about-title text-[clamp(2.5rem,8vw,8rem)] font-black leading-[0.9] tracking-[-0.03em] mb-4 md:mb-8 text-center md:text-left">
                                        ABOUT
                                        <br className="hidden md:block" />
                                        <span className="text-lime">ME</span>
                                    </h2>
                                    <div
                                        className="text-base md:text-xl leading-relaxed text-muted-foreground mb-6 max-w-xl prose prose-invert prose-p:mb-4 last:prose-p:mb-0"
                                        dangerouslySetInnerHTML={{ __html: content.about.bio }}
                                    />
                                </div>
                                <div className="shrink-0 about-portrait-container">
                                    <div className="relative w-48 h-64 md:w-72 md:h-96 rounded-2xl overflow-hidden border-2 border-border mx-auto md:mx-0">
                                        <Image
                                            src="/hero-portrait.webp"
                                            alt="Portrait of Arya Intaran"
                                            fill
                                            priority
                                            sizes="(max-width: 768px) 192px, 288px"
                                            className="object-cover object-top grayscale w-full h-full"
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
                        className="about-panel w-screen h-screen shrink-0 relative"
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
                                className="absolute inset-0 w-full h-full flex flex-col justify-center px-4 md:px-8"
                                style={{ backfaceVisibility: "hidden" }}
                            >
                                <div className="max-w-4xl mx-auto w-full">
                                    <span className="section-num mb-6 block">02 / EDUCATION</span>
                                    <h2 className="text-[clamp(2.5rem,6vw,7rem)] font-black leading-[0.9] tracking-[-0.03em] mb-8">
                                        EDU
                                        <br />
                                        <span className="text-lime">CATION</span>
                                    </h2>
                                    <div
                                        className="max-w-2xl overflow-y-auto pr-2"
                                        style={{
                                            maxHeight: "calc(100vh - 320px)",
                                            scrollbarWidth: "thin",
                                            scrollbarColor: "rgba(206,244,65,0.3) transparent",
                                        }}
                                    >
                                        <ul className={educationData.length > 3 ? "space-y-4" : "space-y-7"}>
                                            {educationData.map((edu, i) => (
                                                <li key={i} className={`border-l-2 ${edu.active ? "border-lime" : "border-border"} pl-5`}>
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-xl font-bold mb-0.5 leading-tight">{edu.title}</h3>
                                                            <p className="text-lime font-semibold text-sm mb-1">{edu.school}</p>
                                                            <p className="text-xs text-muted-foreground tracking-wider">{edu.year}</p>
                                                            {educationData.length <= 2 && (
                                                                <p className="text-muted-foreground mt-2 text-sm">{edu.summary}</p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => setFlippedEdu(i)}
                                                            className="shrink-0 mt-1 text-[10px] font-bold tracking-[0.2em] text-lime hover:text-lime-dark transition-colors cursor-pointer pointer-events-auto uppercase whitespace-nowrap"
                                                        >
                                                            DETAILS →
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="absolute inset-0 w-full h-full flex flex-col justify-center px-4 md:px-8"
                                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                            >
                                {flippedEdu !== null && (
                                    <div className="max-w-4xl mx-auto">
                                        <span className="section-num mb-8 block">02 / EDUCATION DETAILS</span>
                                        <h2 className="text-[clamp(2rem,6vw,6rem)] font-black leading-[0.9] tracking-[-0.03em] mb-4">
                                            {educationData[flippedEdu].title.split(" ").map((word, wi) => (
                                                <span key={wi}>
                                                    {wi === educationData[flippedEdu].title.split(" ").length - 1
                                                        ? <span className="text-lime">{word}</span>
                                                        : word + " "
                                                    }
                                                </span>
                                            ))}
                                        </h2>
                                        <p className="text-lime font-semibold text-lg mb-2">
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
                                                        <span className="text-lime mt-1 text-sm">●</span>
                                                        <span className="text-base">{detail}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <button
                                            onClick={() => setFlippedEdu(null)}
                                            className="mt-10 bg-lime text-[#050505] font-bold py-3 px-8 rounded-xl cursor-pointer pointer-events-auto hover:bg-lime-dark transition-colors text-sm tracking-wider uppercase"
                                        >
                                            ← GO BACK
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div
                        className="about-panel w-screen h-screen shrink-0 relative"
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
                                className="absolute inset-0 w-full h-full flex flex-col justify-center px-4 md:px-8"
                                style={{ backfaceVisibility: "hidden" }}
                            >
                                <div className="max-w-4xl mx-auto w-full">
                                    <span className="section-num mb-6 block">03 / CAREER</span>
                                    <h2 className="text-[clamp(2.5rem,6vw,7rem)] font-black leading-[0.9] tracking-[-0.03em] mb-8">
                                        CAR
                                        <br />
                                        <span className="text-lime">EER</span>
                                    </h2>
                                    <div
                                        className="max-w-2xl overflow-y-auto pr-2"
                                        style={{
                                            maxHeight: "calc(100vh - 320px)",
                                            scrollbarWidth: "thin",
                                            scrollbarColor: "rgba(206,244,65,0.3) transparent",
                                        }}
                                    >
                                        <ul className={careerData.length > 3 ? "space-y-4" : "space-y-7"}>
                                            {careerData.map((career, i) => (
                                                <li key={i} className={`border-l-2 ${career.active ? "border-lime" : "border-border"} pl-5`}>
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-xl font-bold mb-0.5 leading-tight">{career.title}</h3>
                                                            <p className="text-lime font-semibold text-sm mb-1">{career.company}</p>
                                                            <p className="text-xs text-muted-foreground tracking-wider">{career.year}</p>
                                                            {careerData.length <= 2 && (
                                                                <p className="text-muted-foreground mt-2 text-sm">{career.summary}</p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => setFlippedCareer(i)}
                                                            className="shrink-0 mt-1 text-[10px] font-bold tracking-[0.2em] text-lime hover:text-lime-dark transition-colors cursor-pointer pointer-events-auto uppercase whitespace-nowrap"
                                                        >
                                                            DETAILS →
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="absolute inset-0 w-full h-full flex flex-col justify-center px-4 md:px-8"
                                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                            >
                                {flippedCareer !== null && (
                                    <div className="max-w-4xl mx-auto">
                                        <span className="section-num mb-8 block">03 / CAREER DETAILS</span>
                                        <h2 className="text-[clamp(2rem,6vw,6rem)] font-black leading-[0.9] tracking-[-0.03em] mb-4">
                                            {careerData[flippedCareer].title.split(" ").map((word, wi) => (
                                                <span key={wi}>
                                                    {wi === careerData[flippedCareer].title.split(" ").length - 1
                                                        ? <span className="text-lime">{word}</span>
                                                        : word + " "
                                                    }
                                                </span>
                                            ))}
                                        </h2>
                                        <p className="text-lime font-semibold text-lg mb-2">
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
                                                        <span className="text-lime mt-1 text-sm">●</span>
                                                        <span className="text-base">{detail}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <button
                                            onClick={() => setFlippedCareer(null)}
                                            className="mt-10 bg-lime text-[#050505] font-bold py-3 px-8 rounded-xl cursor-pointer pointer-events-auto hover:bg-lime-dark transition-colors text-sm tracking-wider uppercase"
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
