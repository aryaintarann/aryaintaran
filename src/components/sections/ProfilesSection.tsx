"use client";

import { useRef } from "react";
import { ArrowUpRight, Github, Linkedin, Code2 } from "lucide-react";

const profiles = [
    {
        icon: Github,
        name: "GitHub",
        handle: "@aryaintaran",
        link: "https://github.com/aryaintaran",
    },
    {
        icon: Linkedin,
        name: "LinkedIn",
        handle: "Arya Intaran",
        link: "https://linkedin.com/in/aryaintaran",
    },
    {
        icon: Code2,
        name: "LeetCode",
        handle: "@aryaintaran",
        link: "https://leetcode.com/aryaintaran",
    },
];

export default function ProfilesSection() {
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section
            id="profiles"
            ref={sectionRef}
            className="min-h-screen flex flex-col justify-center px-8 py-24 max-w-6xl mx-auto"
        >
            <div className="mb-16">
                <span className="section-num block mb-4">06 / DIGITAL PRESENCE</span>
                <h2 className="text-[clamp(3rem,8vw,8rem)] font-black leading-[0.9] tracking-[-0.03em]">
                    CODING
                    <br />
                    <span className="text-[#CEF441]">PROFILES</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => {
                    const Icon = profile.icon;
                    return (
                        <a
                            key={profile.name}
                            href={profile.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group border border-border rounded-2xl p-8 hover:border-[#CEF441]/50 transition-all duration-300 hover:bg-card/50 flex items-center justify-between profile-card"
                        >
                            <div className="flex items-center gap-4">
                                <Icon
                                    size={32}
                                    strokeWidth={1.5}
                                    className="text-foreground/60 group-hover:text-[#CEF441] transition-colors"
                                />
                                <div>
                                    <h3 className="font-bold text-lg">{profile.name}</h3>
                                    <span className="text-sm text-muted-foreground">
                                        {profile.handle}
                                    </span>
                                </div>
                            </div>
                            <ArrowUpRight
                                size={20}
                                className="text-muted-foreground group-hover:text-[#CEF441] transition-colors"
                            />
                        </a>
                    );
                })}
            </div>
        </section>
    );
}
