"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";
import dynamic from "next/dynamic";

const DownloadPDFButton = dynamic(() => import("./DownloadPDFButton"), { ssr: false });

interface HeroProps {
    profile: any;
    education: any[];
    jobs: any[];
    projects: any[];
}

export default function Hero({ profile, education, jobs, projects }: HeroProps) {
    const container = useRef(null);
    const textRef = useRef(null);

    const allData = { profile, education, jobs, projects };

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from(".hero-text-element", {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
        })
            .from(".hero-image", {
                scale: 0.8,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            }, "-=0.5");

    }, { scope: container });

    return (
        <section ref={container} id="about" className="min-h-screen flex items-center justify-center pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse md:flex-row items-center gap-12">
                <div className="flex-1 text-center md:text-left">
                    <h2 className="hero-text-element text-primary font-medium tracking-wide mb-4">
                        HELLO, I'M
                    </h2>
                    <h1 className="hero-text-element text-5xl md:text-7xl font-bold text-text mb-6">
                        {profile?.fullName || "Developer"}
                    </h1>
                    <h3 className="hero-text-element text-2xl md:text-3xl text-secondary mb-8">
                        {profile?.headline || "Building digital experiences"}
                    </h3>
                    <p className="hero-text-element text-secondary max-w-lg mx-auto md:mx-0 mb-10 text-lg leading-relaxed">
                        {profile?.shortBio}
                    </p>
                    <div className="hero-text-element flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a
                            href="#contact"
                            className="px-8 py-3 bg-primary text-background font-bold rounded hover:bg-opacity-90 transition-all text-center"
                        >
                            Contact Me
                        </a>
                        <div className="flex gap-4">
                            {profile?.resume && (
                                <a
                                    href={`${profile.resume.asset?.url}?dl=`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-3 border border-primary text-primary font-bold rounded hover:bg-primary/10 transition-all text-center"
                                >
                                    Download CV
                                </a>
                            )}
                            <DownloadPDFButton data={allData} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex justify-center hero-image">
                    <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white/10 ring-4 ring-primary/20">
                        {profile?.profileImage ? (
                            <Image
                                src={urlForImage(profile.profileImage).url()}
                                alt={profile.fullName}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-surface flex items-center justify-center text-secondary">
                                No Image
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
