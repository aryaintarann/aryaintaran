"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            gsap.utils.toArray<HTMLElement>(".hero-orb").forEach((orb, i) => {
                gsap.to(orb, {
                    x: () => gsap.utils.random(-80, 80),
                    y: () => gsap.utils.random(-60, 60),
                    duration: gsap.utils.random(6, 10),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: i * 0.8,
                });

                gsap.to(orb, {
                    scale: gsap.utils.random(0.8, 1.3),
                    opacity: gsap.utils.random(0.03, 0.12),
                    duration: gsap.utils.random(4, 7),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: i * 0.5,
                });
            });

            gsap.to(".hero-grid", {
                rotation: 0.5,
                duration: 20,
                repeat: -1,
                yoyo: true,
                ease: "none",
            });

            gsap.to(".hero-deco-text", {
                x: 60,
                duration: 15,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            gsap.utils.toArray<HTMLElement>(".hero-particle").forEach((p, i) => {
                gsap.to(p, {
                    y: -window.innerHeight,
                    x: gsap.utils.random(-100, 100),
                    opacity: 0,
                    duration: gsap.utils.random(6, 12),
                    repeat: -1,
                    delay: i * 1.5,
                    ease: "none",
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="home"
            ref={sectionRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden px-8"
        >
            <div
                className="hero-orb absolute rounded-full pointer-events-none blur-[120px]"
                style={{
                    width: "600px",
                    height: "600px",
                    top: "10%",
                    left: "15%",
                    background: "rgba(206, 244, 65, 0.07)",
                }}
            />
            <div
                className="hero-orb absolute rounded-full pointer-events-none blur-[100px]"
                style={{
                    width: "450px",
                    height: "450px",
                    bottom: "15%",
                    right: "10%",
                    background: "rgba(206, 244, 65, 0.05)",
                }}
            />
            <div
                className="hero-orb absolute rounded-full pointer-events-none blur-[80px]"
                style={{
                    width: "300px",
                    height: "300px",
                    top: "50%",
                    left: "60%",
                    background: "rgba(206, 244, 65, 0.04)",
                }}
            />

            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "256px 256px",
                }}
            />

            <div className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden">
                <div
                    className="flex whitespace-nowrap animate-marquee"
                    style={{ color: "var(--foreground)", opacity: 0.03 }}
                >
                    {Array.from({ length: 4 }).map((_, i) => (
                        <span
                            key={i}
                            className="text-[clamp(3rem,10vw,11rem)] font-black tracking-[-0.05em] leading-none mx-8"
                        >
                            Web Developer &nbsp;|&nbsp; IT Support &nbsp;|&nbsp; Data Entry &nbsp;&nbsp;•&nbsp;&nbsp;
                        </span>
                    ))}
                </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <h1 className="hero-bg-text text-center leading-none">
                    ARYA
                    <br />
                    INTARAN
                </h1>
            </div>

            <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-20">
                <div className="relative w-[clamp(280px,35vw,550px)] h-[75vh]">
                    <img
                        src="/hero-portrait.png"
                        alt="Arya Intaran"
                        className="w-full h-full object-cover object-top grayscale"
                    />
                    <div
                        className="absolute bottom-0 left-0 right-0 h-1/3"
                        style={{
                            background: "linear-gradient(to top, var(--background), transparent)",
                        }}
                    />
                </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h2 className="hero-name text-[clamp(5rem,15vw,16rem)] font-black leading-[0.85] tracking-[-0.03em] text-center text-foreground z-10 overflow-hidden">
                    <span className="hero-name-line inline-block">ARYA</span>
                    <br />
                    <span className="hero-name-line inline-block">INTARAN</span>
                </h2>
            </div>

            <div
                className="hero-grid absolute inset-[-20%] pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />

            {[
                { w: 3, h: 4, left: "10%", opacity: 0.3 },
                { w: 4, h: 2, left: "25%", opacity: 0.5 },
                { w: 3, h: 5, left: "40%", opacity: 0.35 },
                { w: 2, h: 3, left: "55%", opacity: 0.45 },
                { w: 3, h: 4, left: "70%", opacity: 0.3 },
                { w: 4, h: 3, left: "85%", opacity: 0.5 },
            ].map((p, i) => (
                <div
                    key={i}
                    className="hero-particle absolute rounded-full bg-[#CEF441] pointer-events-none"
                    style={{
                        width: `${p.w}px`,
                        height: `${p.h}px`,
                        left: p.left,
                        bottom: "-10px",
                        opacity: p.opacity,
                    }}
                />
            ))}

            <div className="scroll-indicator absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-0">
                <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-muted-foreground">
                    SCROLL
                </span>
                <div className="scroll-line w-px h-8 bg-gradient-to-b from-[#CEF441] to-transparent" />
            </div>
        </section>
    );
}
