import { useState } from "react";
import { urlForImage } from "@/sanity/lib/image";
import type { ProjectData } from "./types";

interface ProjectsTabProps {
    title: string;
    projects: ProjectData[];
    emptyText: string;
}

const MODAL_TRANSITION_MS = 240;

const getTagIcon = (tag: string) => {
    const normalized = tag.toLowerCase().trim();

    const iconByToken: Array<{ tokens: string[]; icon: string }> = [
        { tokens: ["typescript", "ts"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
        { tokens: ["javascript", "js"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
        { tokens: ["react"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { tokens: ["next", "nextjs"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
        { tokens: ["tailwind"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
        { tokens: ["node"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        { tokens: ["laravel"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
        { tokens: ["php"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
        { tokens: ["mysql"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
        { tokens: ["postgres", "postgresql"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
        { tokens: ["kotlin"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
        { tokens: ["go", "golang"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" },
    ];

    const matched = iconByToken.find(({ tokens }) =>
        tokens.some((token) => normalized === token || normalized.includes(token))
    );

    return matched?.icon || null;
};

const getDisplayTags = (project: ProjectData) =>
    (project.tags || []).filter((tag) => !/(featured|unggulan|personal)/i.test(tag));

const getPlainTextFromValue = (value: ProjectData["description"]): string => {
    if (!value) return "";
    if (typeof value === "string") return value.trim();

    if (!Array.isArray(value)) return "";

    return value
        .map((block) => {
            if (!block || typeof block !== "object" || !("children" in block)) return "";
            const children = (block as { children?: unknown }).children;
            if (!Array.isArray(children)) return "";

            return children
                .map((child) => {
                    if (!child || typeof child !== "object" || !("text" in child)) return "";
                    const text = (child as { text?: unknown }).text;
                    return typeof text === "string" ? text : "";
                })
                .join("");
        })
        .filter(Boolean)
        .join("\n")
        .trim();
};

const getProjectDescription = (project: ProjectData): string => {
    const richTextDescription = getPlainTextFromValue(project.description);
    if (richTextDescription) return richTextDescription;
    return project.shortDescription?.trim() || "";
};

const renderProjectCard = (project: ProjectData, onOpen: (item: ProjectData) => void) => (
    <article
        key={project._id}
        role="button"
        tabIndex={0}
        onClick={() => onOpen(project)}
        onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpen(project);
            }
        }}
        onMouseMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - bounds.left;
            const y = event.clientY - bounds.top;
            event.currentTarget.style.setProperty("--mouse-x", `${x}px`);
            event.currentTarget.style.setProperty("--mouse-y", `${y}px`);
        }}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface transition-colors hover:border-primary/35 [--mouse-x:50%] [--mouse-y:50%]"
    >
        <div className="relative h-52 w-full bg-background">
            {project.image ? (
                <div
                    role="img"
                    aria-label={project.title || "Project preview"}
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${urlForImage(project.image as never).width(1200).height(700).url()})` }}
                ></div>
            ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-secondary">No preview</div>
            )}

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/55 group-hover:opacity-100">
                <span className="translate-y-2 text-base font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    View Project →
                </span>
            </div>

            {project.logo && (
                <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center overflow-hidden rounded-md border border-white/20 bg-background/90">
                    <div
                        role="img"
                        aria-label={`${project.title || "Project"} logo`}
                        className="h-6 w-6 bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${urlForImage(project.logo as never).width(64).height(64).url()})` }}
                    ></div>
                </div>
            )}

            {(project.tags || []).some((tag) => /(featured|unggulan)/i.test(tag)) && (
                <span className="absolute right-3 top-3 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-background">
                    Featured
                </span>
            )}
        </div>

        <div className="relative flex grow flex-col border-t border-white/10 p-5">
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background:
                        "radial-gradient(520px circle at var(--mouse-x) var(--mouse-y), rgb(255 255 255 / 0.18), transparent 60%)",
                }}
            ></div>

            <div className="relative z-10">
            <h3 className="text-xl font-semibold text-text">{project.title}</h3>
            {project.shortDescription && (
                <p className="mt-2 line-clamp-3 text-base leading-relaxed text-secondary">
                    {project.shortDescription}
                </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
                {getDisplayTags(project).slice(0, 12).map((tag, index) => {
                    const icon = getTagIcon(tag);
                    return icon ? (
                        <div
                            key={`${project._id}-icon-${index}`}
                            role="img"
                            aria-label={tag}
                            className="h-7 w-7 bg-contain bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${icon})` }}
                        ></div>
                    ) : (
                        <span key={`${project._id}-tag-${index}`} className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-secondary">
                            {tag}
                        </span>
                    );
                })}
            </div>
            </div>
        </div>
    </article>
);

export default function ProjectsTab({ title, projects, emptyText }: ProjectsTabProps) {
    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (project: ProjectData) => {
        setSelectedProject(project);
        requestAnimationFrame(() => {
            setIsModalOpen(true);
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        window.setTimeout(() => {
            setSelectedProject(null);
        }, MODAL_TRANSITION_MS);
    };

    const selectedProjectDescription = selectedProject ? getProjectDescription(selectedProject) : "";

    return (
        <>
        <div>
            <h2 className="text-3xl font-bold text-text">{title}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
                {projects.length > 0
                    ? projects.map((project) => renderProjectCard(project, openModal))
                    : <p className="text-secondary">{emptyText}</p>}
            </div>
        </div>

        {selectedProject && (
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center p-3 transition-opacity duration-300 md:p-6 ${
                    isModalOpen ? "bg-black/75 opacity-100" : "bg-black/0 opacity-0"
                }`}
                role="dialog"
                aria-modal="true"
                aria-label={selectedProject.title || "Project detail"}
                onClick={closeModal}
            >
                <div
                    className={`relative grid max-h-[94vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-surface transition-all duration-300 md:grid-cols-[1.6fr_1fr] ${
                        isModalOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0"
                    }`}
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="min-h-65 bg-background">
                        {selectedProject.image ? (
                            <div
                                role="img"
                                aria-label={selectedProject.title || "Project preview"}
                                className="h-full w-full bg-contain bg-center bg-no-repeat"
                                style={{
                                    backgroundImage: `url(${urlForImage(selectedProject.image as never).width(1600).height(1000).url()})`,
                                }}
                            ></div>
                        ) : (
                            <div className="flex h-full min-h-65 items-center justify-center text-secondary">No project preview</div>
                        )}
                    </div>

                    <div className="relative overflow-y-auto bg-surface p-6">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background text-text"
                            aria-label="Close"
                        >
                            ×
                        </button>

                        <div className="pr-10">
                            <h3 className="text-3xl font-semibold text-text">{selectedProject.title || "Project"}</h3>
                            <p className="mt-2 text-xl text-secondary">
                                {selectedProject.shortDescription || "Project showcase"}
                            </p>

                            {selectedProjectDescription && (
                                <p className="mt-5 whitespace-pre-line text-base text-secondary">
                                    {selectedProjectDescription}
                                </p>
                            )}

                            <div className="mt-6 space-y-5 text-base">
                                <div>
                                    <p className="text-sm uppercase tracking-wide text-secondary">Type</p>
                                    <p className="mt-1 font-semibold text-text">{title}</p>
                                </div>

                                <div>
                                    <p className="text-sm uppercase tracking-wide text-secondary">Main Stack</p>
                                    <p className="mt-1 font-semibold text-text">{getDisplayTags(selectedProject)[0] || "Not specified"}</p>
                                </div>

                                <div>
                                    <p className="text-sm uppercase tracking-wide text-secondary">Category</p>
                                    <p className="mt-1 font-semibold text-text">{getDisplayTags(selectedProject)[1] || "General"}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center gap-2">
                                {getDisplayTags(selectedProject).map((tag, index) => {
                                    const icon = getTagIcon(tag);
                                    return icon ? (
                                        <div
                                            key={`${selectedProject._id}-detail-icon-${index}`}
                                            role="img"
                                            aria-label={tag}
                                            className="h-7 w-7 bg-contain bg-center bg-no-repeat"
                                            style={{ backgroundImage: `url(${icon})` }}
                                        ></div>
                                    ) : (
                                        <span
                                            key={`${selectedProject._id}-detail-tag-${index}`}
                                            className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-secondary"
                                        >
                                            {tag}
                                        </span>
                                    );
                                })}
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3">
                                {selectedProject.githubLink && (
                                    <a
                                        href={selectedProject.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-background px-5 py-2.5 text-sm font-semibold text-text"
                                    >
                                        GitHub
                                        <span aria-hidden="true">→</span>
                                    </a>
                                )}

                                {selectedProject.link && (
                                    <a
                                        href={selectedProject.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-background"
                                    >
                                        Visit Project
                                        <span aria-hidden="true">→</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
