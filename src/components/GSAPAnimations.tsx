"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GSAPAnimations() {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const timer = setTimeout(() => {
            const ctx = gsap.context(() => {
                gsap.fromTo(
                    ".hero-bg-text",
                    { opacity: 0, scale: 0.7, y: 40 },
                    { opacity: 0.08, scale: 1, y: 0, duration: 1.5, ease: "power4.out" }
                );

                const nameLines = gsap.utils.toArray<HTMLElement>(".hero-name-line");
                nameLines.forEach((line, i) => {
                    gsap.fromTo(
                        line,
                        {
                            y: 120,
                            opacity: 0,
                            rotationX: 40,
                            skewX: i === 0 ? -8 : 8,
                        },
                        {
                            y: 0,
                            opacity: 1,
                            rotationX: 0,
                            skewX: 0,
                            duration: 1.4,
                            delay: 0.3 + i * 0.2,
                            ease: "power4.out",
                        }
                    );
                });

                gsap.to(".hero-name", {
                    y: -8,
                    duration: 3,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: 2,
                });

                gsap.fromTo(
                    ".scroll-indicator",
                    { opacity: 0, y: -10 },
                    { opacity: 1, y: 0, duration: 0.8, delay: 1.5, ease: "power2.out" }
                );

                gsap.to(".scroll-indicator .scroll-line", {
                    scaleY: 1.5,
                    opacity: 0.3,
                    duration: 1.2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: 2,
                });

                gsap.fromTo(
                    ".hero-grid",
                    { opacity: 0 },
                    { opacity: 0.03, duration: 2, delay: 0.8, ease: "power2.out" }
                );

                gsap.utils.toArray<HTMLElement>(".section-num").forEach((el) => {
                    gsap.fromTo(
                        el,
                        { opacity: 0, x: -30 },
                        {
                            opacity: 1,
                            x: 0,
                            duration: 0.6,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: el,
                                start: "top 85%",
                                toggleActions: "play none none none",
                            },
                        }
                    );
                });

                const track = document.querySelector(".about-horizontal-track") as HTMLElement;
                if (track) {
                    const panels = gsap.utils.toArray<HTMLElement>(".about-panel");
                    const totalScroll = (panels.length - 1) * window.innerWidth;

                    gsap.to(track, {
                        x: -totalScroll,
                        ease: "none",
                        scrollTrigger: {
                            trigger: ".about-pin-wrapper",
                            pin: true,
                            scrub: 1,
                            start: "top top",
                            end: () => `+=${totalScroll}`,
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
                                        containerAnimation: gsap.getById?.("aboutScroll") || undefined,
                                        start: "left 80%",
                                        toggleActions: "play none none none",
                                    },
                                }
                            );
                        }
                    });
                }

                const projectsTrack = document.querySelector(".projects-horizontal-track") as HTMLElement;
                if (projectsTrack) {
                    const projectPanels = gsap.utils.toArray<HTMLElement>(".projects-panel");
                    const projectsTotalScroll = (projectPanels.length - 1) * window.innerWidth;

                    gsap.to(projectsTrack, {
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
                }

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

                gsap.utils.toArray<HTMLElement>(".capacity-bar-fill").forEach((bar) => {
                    const targetWidth = bar.style.width;
                    gsap.fromTo(
                        bar,
                        { width: "0%" },
                        {
                            width: targetWidth,
                            duration: 1.2,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: bar,
                                start: "top 95%",
                                toggleActions: "play none none none",
                            },
                        }
                    );
                });

                gsap.utils.toArray<HTMLElement>(".profile-card").forEach((card, i) => {
                    gsap.fromTo(
                        card,
                        { opacity: 0, y: 40, scale: 0.9 },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.7,
                            delay: i * 0.12,
                            ease: "back.out(1.4)",
                            scrollTrigger: {
                                trigger: card,
                                start: "top 90%",
                                toggleActions: "play none none none",
                            },
                        }
                    );
                });

                gsap.fromTo(
                    ".contact-title",
                    { opacity: 0, y: 120, clipPath: "inset(100% 0 0 0)" },
                    {
                        opacity: 1,
                        y: 0,
                        clipPath: "inset(0% 0 0 0)",
                        duration: 1.4,
                        ease: "power4.out",
                        scrollTrigger: {
                            trigger: ".contact-title",
                            start: "top 80%",
                            toggleActions: "play none none none",
                        },
                    }
                );

                gsap.fromTo(
                    ".contact-info",
                    { opacity: 0, x: -60 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: ".contact-info",
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );

                gsap.fromTo(
                    ".contact-form",
                    { opacity: 0, x: 60 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: ".contact-form",
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });

            return () => ctx.revert();
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return null;
}
