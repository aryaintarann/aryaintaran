import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "next-sanity";

export const revalidate = 0;

export async function generateStaticParams() {
    const query = groq`*[_type == "project"]{ "slug": slug.current }`;
    const slugs = await client.fetch(query) as Array<{ slug: string }>;
    return slugs.map((slugItem) => ({ slug: slugItem.slug }));
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const query = groq`*[_type == "project" && slug.current == $slug][0]`;
    const project = await client.fetch(query, { slug });

    if (!project) {
        return (
            <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl font-bold text-text mb-4">Project Not Found</h1>
                <Link href="/#projects" className="text-primary hover:underline">
                    Back to Projects
                </Link>
            </div>
        );
    }

    return (
        <article className="min-h-screen pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/#projects" className="text-secondary hover:text-primary mb-8 inline-block transition-colors">
                    &larr; Back to Projects
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold text-text mb-6">{project.title}</h1>

                <div className="flex flex-wrap gap-4 mb-8">
                    {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-primary text-background font-bold rounded hover:bg-opacity-90 transition-all">
                            Live Demo
                        </a>
                    )}
                    {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="px-6 py-2 border border-white/20 text-text font-bold rounded hover:bg-white/10 transition-all">
                            GitHub Repo
                        </a>
                    )}
                </div>

                <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-12 border border-white/10">
                    {project.image ? (
                        <Image
                            src={urlForImage(project.image).url()}
                            alt={project.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-surface flex items-center justify-center text-secondary">
                            No Image Available
                        </div>
                    )}
                </div>

                <div className="bg-surface/30 p-8 rounded-xl border border-white/5">
                    <h2 className="text-2xl font-bold text-text mb-4">About This Project</h2>
                    <div className="prose prose-invert prose-lg max-w-none text-secondary">
                        {project.description ? (
                            <PortableText value={project.description} />
                        ) : (
                            <p>{project.shortDescription}</p>
                        )}
                    </div>

                    {project.tags && (
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <h3 className="text-lg font-bold text-text mb-3">Technologies Used</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-background rounded-full text-secondary text-sm border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
