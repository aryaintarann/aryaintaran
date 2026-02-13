"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";

interface HeroProps {
    profile: any;
    contact: any;
}

export default function Hero({ profile, contact }: HeroProps) {
    const container = useRef(null);
    const scrollRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from(".hero-text-element", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
        })
            .from(".hero-image", {
                x: 50,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            }, "-=0.6")
            .from(".social-icon", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "back.out(1.7)"
            }, "-=0.4")
            .from(scrollRef.current, {
                y: -20,
                opacity: 0,
                duration: 0.8,
                ease: "power1.out"
            }, "-=0.4");

    }, { scope: container });

    const socialLinks = [
        {
            name: 'Email', value: contact?.email || profile?.email, href: `mailto:${contact?.email || profile?.email}`, icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            )
        },
        {
            name: 'GitHub', value: contact?.github, href: contact?.github, icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            )
        },
        {
            name: 'LinkedIn', value: contact?.linkedin, href: contact?.linkedin, icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            )
        },
        {
            name: 'Instagram', value: contact?.instagram, href: contact?.instagram, icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            )
        },
    ].filter(link => link.value);

    return (
        <section ref={container} id="home" className="min-h-screen relative overflow-hidden bg-background flex flex-col justify-center">
            {/* Background Lines Removed */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full pt-16 md:pt-0">
                <div className="flex flex-col md:flex-row items-center justify-between h-full gap-12 md:gap-8">

                    {/* Left Content */}
                    <div className="flex-1 z-10 text-center md:text-left pt-12 md:pt-0">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-6 hero-text-element">
                            <span className="w-8 h-[2px] bg-secondary inline-block"></span>
                            <span className="text-secondary font-medium tracking-widest text-sm uppercase">Hello</span>
                        </div>

                        <h1 className="hero-text-element text-3xl sm:text-4xl lg:text-6xl font-black text-text mb-4 tracking-tight leading-tight whitespace-nowrap">
                            <span className="text-text">I'm </span>
                            <span className="text-primary">{profile?.fullName}</span>
                        </h1>

                        <h2 className="hero-text-element text-xl md:text-2xl text-secondary mb-4 max-w-lg mx-auto md:mx-0 font-bold">
                            {profile?.headline || "Website Developer & IT Support"}
                        </h2>

                        <p className="hero-text-element text-base md:text-lg text-secondary/80 mb-8 max-w-md mx-auto md:mx-0 leading-relaxed">
                            {profile?.shortBio}
                        </p>

                        <div className="hero-text-element">
                            <a
                                href="#contact"
                                className="group relative px-8 py-4 bg-transparent border-2 border-primary text-primary font-bold text-sm tracking-widest uppercase overflow-hidden inline-flex items-center gap-2 hover:text-background transition-colors duration-300"
                            >
                                <span className="relative z-10">Contact Me</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                                <div className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                            </a>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="flex-1 relative h-[50vh] md:h-screen w-full flex items-end justify-center md:justify-end hero-image z-0">
                        <div className="relative w-full h-full max-h-[800px] max-w-lg">
                            {/* Decorative Splash/Shape behind image could go here */}

                            {profile?.heroImage || profile?.profileImage ? (
                                <div className="absolute bottom-0 w-full h-[90%] md:h-[85%]">
                                    <Image
                                        src={urlForImage(profile?.heroImage || profile?.profileImage).url()}
                                        alt={profile.fullName}
                                        fill
                                        className="object-contain object-bottom drop-shadow-2xl"
                                        priority
                                    />
                                    {/* Gradient to blend bottom of image if needed, or overlay */}
                                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent"></div>
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-secondary">No Image</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Elements */}
            <div className="absolute bottom-8 left-0 w-full px-4 sm:px-6 lg:px-8 flex justify-between items-end pointer-events-none">
                {/* Socials - Bottom Left */}
                <div className="hidden md:flex gap-6 pointer-events-auto pl-4 lg:pl-12 pb-4">
                    {socialLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon text-secondary hover:text-primary transition-colors transform hover:-translate-y-1"
                            aria-label={link.name}
                        >
                            {link.icon}
                        </a>
                    ))}
                </div>

                {/* Scroll Indicator - Bottom Right */}
                <div ref={scrollRef} className="hidden md:flex flex-col items-center gap-2 pointer-events-auto pr-4 lg:pr-12 pb-4 cursor-pointer" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                    <span className="text-[10px] font-bold tracking-widest text-secondary uppercase py-2" style={{ writingMode: 'vertical-rl' }}>Scroll Down</span>
                    <svg className="w-5 h-5 text-primary animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </div>
            </div>
        </section>
    );
}
