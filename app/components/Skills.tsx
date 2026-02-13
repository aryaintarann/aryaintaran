"use client";
import React from "react";

interface SkillsProps {
    skills: string[];
}

export default function Skills({ skills }: SkillsProps) {
    // if (!skills || skills.length === 0) return null;

    return (
        <section id="skills" className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-text mb-12 text-center md:text-left">Technical Skills</h2>
                {!skills || skills.length === 0 ? (
                    <p className="text-secondary text-center italic">No skills added yet.</p>
                ) : (
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        {skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-6 py-3 bg-surface rounded-full text-secondary font-medium border border-white/5 hover:border-primary/50 hover:text-primary transition-colors cursor-default"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
