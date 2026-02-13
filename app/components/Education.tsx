"use client";
import React from "react";
import { PortableText } from "next-sanity";

interface EducationProps {
    education: any[];
}

const components = {
    list: {
        bullet: ({ children }: any) => <ul className="list-disc ml-4 space-y-2">{children}</ul>,
        number: ({ children }: any) => <ol className="list-decimal ml-4 space-y-2">{children}</ol>,
    },
    listItem: {
        bullet: ({ children }: any) => <li className="pl-1">{children}</li>,
        number: ({ children }: any) => <li className="pl-1">{children}</li>,
    },
};

export default function Education({ education }: EducationProps) {
    // if (!education || education.length === 0) return null;

    return (
        <section id="education" className="py-20 bg-surface/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-text mb-12 text-center md:text-left">Education</h2>
                {!education || education.length === 0 ? (
                    <p className="text-secondary text-center italic">No education details added yet.</p>
                ) : (
                    <div className="relative border-l border-white/10 ml-4 md:ml-0 space-y-12 pl-8 md:pl-12">
                        {education.map((edu, index) => (
                            <div key={edu._id} className="relative">
                                <span className="absolute -left-[41px] md:-left-[53px] top-1 h-5 w-5 rounded-full border-4 border-background bg-primary"></span>
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold text-text">{edu.schoolName}</h3>
                                    <span className="text-sm text-secondary font-mono">
                                        {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                                    </span>
                                </div>
                                <p className="text-primary font-medium mb-2">{edu.degree} in {edu.fieldOfStudy}</p>
                                <div className="text-secondary leading-relaxed prose prose-invert max-w-none">
                                    {edu.description && <PortableText value={edu.description} components={components} />}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
