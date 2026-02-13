"use client";
import React from "react";
import Image from "next/image";
import { PortableText } from "next-sanity";
import { urlForImage } from "@/sanity/lib/image";
import dynamic from "next/dynamic";



interface AboutProps {
    profile: any;
    education: any[];
    jobs: any[];
    projects: any[];
}

export default function About({ profile, education, jobs, projects }: AboutProps) {
    const allData = { profile, education, jobs, projects };

    return (
        <section id="about" className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Profile Image */}
                    <div className="flex-1 flex justify-center md:justify-end">
                        <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-2xl overflow-hidden border-4 border-white/10 ring-4 ring-primary/20 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
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

                    {/* About Content */}
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-text mb-6">About Me</h2>

                        {profile?.location && (
                            <p className="text-primary font-medium mb-6 flex items-center justify-center md:justify-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {profile.location}
                            </p>
                        )}

                        <div className="prose prose-invert max-w-none text-secondary mb-8">
                            {profile?.fullBio ? (
                                <PortableText value={profile.fullBio} />
                            ) : (
                                <p>{profile?.shortBio}</p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            {profile?.resume && (
                                <a
                                    href={`${profile.resume.asset?.url}?dl=`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-surface border border-white/10 text-text font-medium rounded hover:bg-white/5 transition-all flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download CV
                                </a>
                            )}
                            {profile?.portfolio && (
                                <a
                                    href={`${profile.portfolio.asset?.url}?dl=`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-surface border border-white/10 text-text font-medium rounded hover:bg-white/5 transition-all flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download Portfolio
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
