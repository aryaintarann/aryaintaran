import { useState } from "react";
import type { ProjectData } from "./types";

interface ProjectsTabProps {
    title: string;
    projects: ProjectData[];
    emptyText: string;
}

const MODAL_TRANSITION_MS = 240;

const getSkillLogoText = (skill: string) => {
    const clean = skill.replace(/[^a-zA-Z0-9+.#]/g, " ").trim();
    if (!clean) return "SK";
    const parts = clean.split(/\s+/);
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

const getTagIcon = (tag: string) => {
    const normalized = tag
        .toLowerCase()
        .trim()
        .replace(/[()]/g, "")
        .replace(/\./g, "")
        .replace(/\s+/g, " ");

    const iconByToken: Array<{ tokens: string[]; icon: string }> = [
        { tokens: ["html", "html5"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
        { tokens: ["css", "css3"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
        { tokens: ["bootstrap"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
        { tokens: ["sass", "scss"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" },
        { tokens: ["typescript", "ts"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
        { tokens: ["javascript", "js"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
        { tokens: ["react"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { tokens: ["redux"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
        { tokens: ["next", "nextjs"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
        { tokens: ["vue", "vuejs"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
        { tokens: ["nuxt", "nuxtjs"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg" },
        { tokens: ["angular"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
        { tokens: ["tailwind"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
        { tokens: ["node"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        { tokens: ["express", "expressjs"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
        { tokens: ["nestjs", "nest"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg" },
        { tokens: ["laravel"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
        { tokens: ["php"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
        { tokens: ["python"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { tokens: ["django"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
        { tokens: ["flask"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
        { tokens: ["java"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
        { tokens: ["spring"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
        { tokens: ["mysql"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
        { tokens: ["postgres", "postgresql"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
        { tokens: ["sqlite"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" },
        { tokens: ["mongodb"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
        { tokens: ["redis"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
        { tokens: ["kotlin"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
        { tokens: ["swift"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" },
        { tokens: ["go", "golang"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" },
        { tokens: ["rust"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg" },
        { tokens: ["c#", "csharp"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" },
        { tokens: ["c++", "cpp"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
        { tokens: ["docker"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
        { tokens: ["kubernetes", "k8s"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
        { tokens: ["git"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
        { tokens: ["github"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
        { tokens: ["gitlab"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg" },
        { tokens: ["figma"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
        { tokens: ["firebase"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
        { tokens: ["supabase"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
        { tokens: ["linux"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
        { tokens: ["ubuntu"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg" },
        { tokens: ["vscode", "visual studio code"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
        { tokens: ["postman"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
        { tokens: ["npm"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" },
        { tokens: ["yarn"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/yarn/yarn-original.svg" },
        { tokens: ["pnpm"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pnpm/pnpm-original.svg" },
        { tokens: ["webpack"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg" },
        { tokens: ["vite"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" },
        { tokens: ["graphql"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
        { tokens: ["aws"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
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

const getImageUrl = (image: ProjectData["image"], width: number, height: number) => {
    void width;
    void height;
    if (!image) return "";
    if (typeof image === "string") return image;
    return "";
};

const getLogoUrl = (logo: ProjectData["logo"], width: number, height: number) => {
    void width;
    void height;
    if (!logo) return "";
    if (typeof logo === "string") return logo;
    return "";
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
                    style={{ backgroundImage: `url(${getImageUrl(project.image, 1200, 700)})` }}
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
                        style={{ backgroundImage: `url(${getLogoUrl(project.logo, 64, 64)})` }}
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
                    ) : index === 0 ? (
                        <div
                            key={`${project._id}-fallback-main-stack`}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-[10px] font-bold uppercase text-primary"
                            title={tag}
                        >
                            {getSkillLogoText(tag)}
                        </div>
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
                className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 transition-opacity duration-300 md:items-center md:p-6 no-scrollbar ${
                    isModalOpen ? "bg-black/60 backdrop-blur-sm opacity-100" : "bg-black/0 opacity-0"
                }`}
                role="dialog"
                aria-modal="true"
                aria-label={selectedProject.title || "Project detail"}
                onClick={closeModal}
            >
                <div
                    className={`relative mt-3 w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-background shadow-2xl transition-all duration-300 md:mt-0 ${
                        isModalOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0"
                    }`}
                    style={{ backgroundColor: "rgb(var(--color-background))" }}
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="bg-background md:mr-[38%]">
                        {selectedProject.image ? (
                            <img
                                src={getImageUrl(selectedProject.image, 1600, 1000)}
                                alt={selectedProject.title || "Project preview"}
                                className="block max-h-[52vh] w-full object-contain object-top md:max-h-[92vh]"
                            />
                        ) : (
                            <div className="flex min-h-52 w-full items-center justify-center text-secondary md:min-h-[70vh]">No project preview</div>
                        )}
                    </div>

                    <div
                        className="relative max-h-[42vh] overflow-y-auto overflow-x-hidden bg-background p-5 md:absolute md:inset-y-0 md:right-0 md:w-[38%] md:max-h-none md:p-6 no-scrollbar"
                        style={{ backgroundColor: "rgb(var(--color-background))" }}
                    >
                        <button
                            type="button"
                            onClick={closeModal}
                            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background text-text"
                            aria-label="Close"
                        >
                            ×
                        </button>

                        <div className="pr-10">
                            <h3 className="text-2xl font-semibold text-text md:text-3xl">{selectedProject.title || "Project"}</h3>
                            <p className="mt-2 text-base text-secondary md:text-lg">
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
