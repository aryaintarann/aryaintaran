"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";

interface ProjectsProps {
    projects: any[];
}

export default function Projects({ projects }: ProjectsProps) {

    return (
        <section id="projects" className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-text mb-12 text-center md:text-left">Featured Projects</h2>
                {!projects || projects.length === 0 ? (
                    <p className="text-secondary text-center italic">No projects added yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <Link
                                href={`/projects/${project.slug.current}`}
                                key={project._id}
                                className="group block bg-surface rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all hover:-translate-y-1"
                            >
                                <div className="relative h-48 w-full bg-slate-900">
                                    {project.image ? (
                                        <Image
                                            src={urlForImage(project.image).url()}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-secondary">No Image</div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        {project.logo && (
                                            <div className="relative w-8 h-8 rounded bg-white/5 overflow-hidden">
                                                <Image
                                                    src={urlForImage(project.logo).url()}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors line-clamp-1">{project.title}</h3>
                                    </div>
                                    <p className="text-secondary text-sm mb-4 line-clamp-2">{project.shortDescription}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags && project.tags.slice(0, 3).map((tag: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-background text-xs text-secondary rounded">
                                                {tag}
                                            </span>
                                        ))}
                                        {project.tags && project.tags.length > 3 && (
                                            <span className="px-2 py-1 bg-background text-xs text-secondary rounded">+{project.tags.length - 3}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
