"use client";
import React from "react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";

interface ExperienceProps {
    jobs: any[];
}

export default function Experience({ jobs }: ExperienceProps) {

    return (
        <section id="experience" className="py-20 bg-surface/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-text mb-12 text-center md:text-left">Work Experience</h2>
                {!jobs || jobs.length === 0 ? (
                    <p className="text-secondary text-center italic">No work experience added yet.</p>
                ) : (
                    <div className="space-y-12">
                        {jobs.map((job) => (
                            <div key={job._id} className="group bg-background p-6 md:p-8 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-shrink-0">
                                        {job.logo ? (
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/5">
                                                <Image
                                                    src={urlForImage(job.logo).url()}
                                                    alt={job.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center text-2xl font-bold text-secondary">
                                                {job.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors">{job.jobTitle}</h3>
                                                <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">{job.name}</a>
                                            </div>
                                            <span className="text-sm text-secondary font-mono mt-2 md:mt-0">
                                                {new Date(job.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} -
                                                {job.endDate ? new Date(job.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ' Present'}
                                            </span>
                                        </div>
                                        <p className="text-secondary leading-relaxed mt-4">{job.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
