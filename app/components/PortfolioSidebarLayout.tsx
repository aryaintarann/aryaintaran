"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { PortableText } from "next-sanity";
import { urlForImage } from "@/sanity/lib/image";
import gsap from "gsap";

type MenuKey =
    | "home"
    | "about"
    | "achievement"
    | "project"
    | "personal-project"
    | "github"
    | "contact";

interface PortfolioSidebarLayoutProps {
    profile: any;
    education: any[];
    jobs: any[];
    projects: any[];
    contact: any;
}

const languageText = {
    id: {
        menu: {
            home: "Home",
            about: "About",
            achievement: "Achievement & Certification",
            project: "Project",
            personalProject: "Personal Project",
            github: "GitHub",
            contact: "Contact",
        },
        settings: "Pengaturan",
        language: "Bahasa",
        theme: "Tema",
        light: "Light",
        dark: "Dark",
        homeTitle: "Selamat Datang",
        homeDescription: "Ini adalah ringkasan profil saya.",
        summaryTitle: "Summary",
        hardSkillsTitle: "Hard Skills",
        softSkillsTitle: "Soft Skills",
        hardSkillsEmpty: "Belum ada hard skill.",
        softSkillsEmpty: "Belum ada soft skill.",
        aboutTitle: "Tentang Saya",
        achievementTitle: "Achievement & Certification",
        achievementEmpty: "Belum ada data achievement atau sertifikasi.",
        projectTitle: "Project",
        projectEmpty: "Belum ada project.",
        personalProjectTitle: "Personal Project",
        personalProjectEmpty: "Belum ada personal project.",
        githubTitle: "GitHub",
        githubEmpty: "Belum ada tautan repository GitHub pada data project.",
        contactTitle: "Contact",
        openProject: "Lihat Project",
        openRepo: "Buka Repository",
        sendEmail: "Kirim Email",
    },
    en: {
        menu: {
            home: "Home",
            about: "About",
            achievement: "Achievement & Certification",
            project: "Project",
            personalProject: "Personal Project",
            github: "GitHub",
            contact: "Contact",
        },
        settings: "Settings",
        language: "Language",
        theme: "Theme",
        light: "Light",
        dark: "Dark",
        homeTitle: "Welcome",
        homeDescription: "This is a quick overview of my profile.",
        summaryTitle: "Summary",
        hardSkillsTitle: "Hard Skills",
        softSkillsTitle: "Soft Skills",
        hardSkillsEmpty: "No hard skills yet.",
        softSkillsEmpty: "No soft skills yet.",
        aboutTitle: "About Me",
        achievementTitle: "Achievement & Certification",
        achievementEmpty: "No achievement or certification data yet.",
        projectTitle: "Project",
        projectEmpty: "No projects yet.",
        personalProjectTitle: "Personal Project",
        personalProjectEmpty: "No personal projects yet.",
        githubTitle: "GitHub",
        githubEmpty: "No project repository links have been added yet.",
        contactTitle: "Contact",
        openProject: "View Project",
        openRepo: "Open Repository",
        sendEmail: "Send Email",
    },
} as const;

export default function PortfolioSidebarLayout({
    profile,
    education,
    jobs,
    projects,
    contact,
}: PortfolioSidebarLayoutProps) {
    const [activeMenu, setActiveMenu] = useState<MenuKey>("home");
    const [language, setLanguage] = useState<"id" | "en">("id");
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const [openSettings, setOpenSettings] = useState(false);
    const settingsPanelRef = useRef<HTMLDivElement>(null);

    const t = languageText[language];

    useEffect(() => {
        const savedTheme = window.localStorage.getItem("portfolio-theme");
        const savedLanguage = window.localStorage.getItem("portfolio-language");

        if (savedTheme === "light" || savedTheme === "dark") {
            setTheme(savedTheme);
        }
        if (savedLanguage === "id" || savedLanguage === "en") {
            setLanguage(savedLanguage);
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        window.localStorage.setItem("portfolio-theme", theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.lang = language;
        window.localStorage.setItem("portfolio-language", language);
    }, [language]);

    useEffect(() => {
        const panel = settingsPanelRef.current;
        if (!panel) return;

        gsap.killTweensOf(panel);

        if (openSettings) {
            gsap.set(panel, { display: "block" });
            gsap.fromTo(
                panel,
                { height: 0, opacity: 0, y: -10 },
                { height: "auto", opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
            );
            return;
        }

        gsap.to(panel, {
            height: 0,
            opacity: 0,
            y: -10,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
                gsap.set(panel, { display: "none" });
            },
        });
    }, [openSettings]);

    const personalProjects = useMemo(
        () =>
            (projects || []).filter((project) =>
                (project?.tags || []).some((tag: string) => /personal/i.test(tag))
            ),
        [projects]
    );

    const mainProjects = useMemo(
        () =>
            (projects || []).filter(
                (project) =>
                    !(project?.tags || []).some((tag: string) => /personal/i.test(tag))
            ),
        [projects]
    );

    const achievementItems = useMemo(
        () =>
            (projects || []).filter((project) =>
                (project?.tags || []).some((tag: string) =>
                    /(achievement|sertification|certification|certificate|award|sertifikat)/i.test(tag)
                )
            ),
        [projects]
    );

    const githubRepositories = useMemo(
        () =>
            (projects || []).filter(
                (project) => typeof project?.githubLink === "string" && project.githubLink.length > 0
            ),
        [projects]
    );

    const allSkills = useMemo(
        () => (profile?.skills || []).filter((skill: string) => typeof skill === "string" && skill.trim().length > 0),
        [profile?.skills]
    );

    const hardSkillRegex = /(html|css|javascript|typescript|react|next|node|express|python|java|php|laravel|mysql|postgres|mongodb|docker|git|tailwind|figma|ui|ux|api|sql|firebase|supabase|aws|linux|c\+\+|c#|go|kotlin|swift)/i;
    const softSkillRegex = /(communication|teamwork|leadership|problem solving|time management|adaptability|critical thinking|collaboration|creativity|public speaking|manajemen waktu|komunikasi|kerja sama|kepemimpinan|adaptasi|problem solving)/i;

    const hardSkills = useMemo(
        () => allSkills.filter((skill: string) => hardSkillRegex.test(skill)),
        [allSkills]
    );

    const softSkills = useMemo(() => {
        const explicitSoft = allSkills.filter((skill: string) => softSkillRegex.test(skill));
        if (explicitSoft.length > 0) return explicitSoft;
        return allSkills.filter((skill: string) => !hardSkillRegex.test(skill));
    }, [allSkills]);

    const getSkillLogoText = (skill: string) => {
        const clean = skill.replace(/[^a-zA-Z0-9+.#]/g, " ").trim();
        if (!clean) return "SK";
        const parts = clean.split(/\s+/);
        if (parts.length === 1) {
            return parts[0].slice(0, 2).toUpperCase();
        }
        return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
    };

    const getHardSkillIcon = (skill: string) => {
        const normalized = skill
            .toLowerCase()
            .trim()
            .replace(/[()]/g, "")
            .replace(/\./g, "")
            .replace(/\s+/g, " ");

        const iconByToken: Array<{ tokens: string[]; icon: string }> = [
            { tokens: ["html", "html5"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
            { tokens: ["css", "css3"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
            { tokens: ["bootstrap"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
            { tokens: ["tailwind", "tailwind css"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
            { tokens: ["sass", "scss"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" },
            { tokens: ["javascript", "js", "ecmascript"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
            { tokens: ["typescript", "ts"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
            { tokens: ["react", "reactjs"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
            { tokens: ["redux"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
            { tokens: ["next", "nextjs", "next js"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
            { tokens: ["vue", "vuejs"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
            { tokens: ["nuxt", "nuxtjs"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg" },
            { tokens: ["angular"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
            { tokens: ["node", "nodejs", "node js"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
            { tokens: ["express", "expressjs"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
            { tokens: ["nestjs", "nest"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg" },
            { tokens: ["php"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
            { tokens: ["laravel"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
            { tokens: ["python"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
            { tokens: ["django"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
            { tokens: ["flask"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
            { tokens: ["java"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
            { tokens: ["spring"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
            { tokens: ["kotlin"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
            { tokens: ["swift"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" },
            { tokens: ["go", "golang"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" },
            { tokens: ["rust"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg" },
            { tokens: ["c#", "csharp"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" },
            { tokens: ["c++", "cpp"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
            { tokens: ["mysql"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
            { tokens: ["postgresql", "postgres"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
            { tokens: ["sqlite"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" },
            { tokens: ["mongodb"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
            { tokens: ["redis"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
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

    const menuItems: { key: MenuKey; label: string }[] = [
        { key: "home", label: t.menu.home },
        { key: "about", label: t.menu.about },
        { key: "achievement", label: t.menu.achievement },
        { key: "project", label: t.menu.project },
        { key: "personal-project", label: t.menu.personalProject },
        { key: "github", label: t.menu.github },
        { key: "contact", label: t.menu.contact },
    ];

    const renderProjectCard = (project: any) => (
        <div
            key={project._id}
            className="rounded-xl border border-white/10 bg-surface p-5 transition-colors hover:border-primary/40"
        >
            <h3 className="text-lg font-semibold text-text">{project.title}</h3>
            {project.shortDescription && (
                <p className="mt-2 text-sm text-secondary">{project.shortDescription}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
                {project.tags?.map((tag: string, index: number) => (
                    <span key={`${project._id}-${index}`} className="rounded-full bg-background px-3 py-1 text-xs text-secondary">
                        {tag}
                    </span>
                ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
                {project.slug?.current && (
                    <Link
                        href={`/projects/${project.slug.current}`}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-background"
                    >
                        {t.openProject}
                    </Link>
                )}
                {project.githubLink && (
                    <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-text hover:border-primary/50"
                    >
                        {t.openRepo}
                    </a>
                )}
            </div>
        </div>
    );

    return (
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row md:px-6 lg:px-8">
            <aside className="md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:w-80 md:shrink-0">
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-surface p-5">
                    <div className="mb-6 flex flex-col items-center text-center">
                        <div className="relative h-24 w-24 overflow-hidden rounded-full border border-white/20 bg-background">
                            {profile?.profileImage ? (
                                <Image
                                    src={urlForImage(profile.profileImage).width(300).height(300).url()}
                                    alt={profile?.fullName || "Profile"}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-secondary">No Photo</div>
                            )}
                        </div>

                        <p className="mt-4 text-base font-semibold text-text">{profile?.fullName || "Your Name"}</p>
                        <p className="mt-1 text-xs text-secondary">{profile?.headline || "Portfolio"}</p>

                        <button
                            onClick={() => setOpenSettings((value) => !value)}
                            className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-background text-text transition-transform duration-200 hover:scale-105"
                            aria-label={t.settings}
                            type="button"
                        >
                            <svg className={`h-4 w-4 transition-transform duration-300 ${openSettings ? "rotate-90" : "rotate-0"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.572c-.94-1.544.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>

                        <div
                            ref={settingsPanelRef}
                            className="mt-4 hidden w-full overflow-hidden"
                            style={{ height: 0, opacity: 0, transform: "translateY(-10px)" }}
                        >
                            <div className="rounded-lg border border-white/10 bg-background p-3">
                                <div className="flex flex-col items-center gap-3">
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-label={t.language}
                                        aria-checked={language === "en"}
                                        onClick={() => setLanguage((current) => (current === "id" ? "en" : "id"))}
                                        className={`relative h-8 w-14 rounded-full border border-white/15 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${language === "en" ? "bg-primary/30" : "bg-surface"}`}
                                    >
                                        <span
                                            className={`absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-background transition-transform duration-300 ${language === "en" ? "translate-x-0.5" : "translate-x-7"}`}
                                        >
                                            <span className="text-[10px] font-bold leading-none uppercase">
                                                {language === "id" ? "ID" : "EN"}
                                            </span>
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        role="switch"
                                        aria-label={t.theme}
                                        aria-checked={theme === "dark"}
                                        onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
                                        className={`relative h-8 w-14 rounded-full border border-white/15 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${theme === "dark" ? "bg-primary/30" : "bg-surface"}`}
                                    >
                                        <span
                                            className={`absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-background transition-transform duration-300 ${theme === "dark" ? "translate-x-7" : "translate-x-0.5"}`}
                                        >
                                            {theme === "dark" ? (
                                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                                </svg>
                                            ) : (
                                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2.25M12 18.75V21M4.72 4.72l1.59 1.59M17.69 17.69l1.59 1.59M3 12h2.25M18.75 12H21M4.72 19.28l1.59-1.59M17.69 6.31l1.59-1.59M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                                </svg>
                                            )}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-2 text-center">
                        {menuItems.map((item) => {
                            const active = activeMenu === item.key;
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => setActiveMenu(item.key)}
                                    className={`w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                        active
                                            ? "bg-primary text-background"
                                            : "bg-background text-text hover:bg-background/70"
                                    }`}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            <section className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-background p-5 md:p-8">
                {activeMenu === "home" && (
                    <div>
                        <h1 className="text-3xl font-bold text-text">{t.homeTitle}</h1>
                        <p className="mt-2 text-secondary">{t.homeDescription}</p>

                        <div className="mt-7 rounded-xl border border-white/10 bg-surface p-5">
                            <h2 className="text-lg font-semibold text-text">{t.summaryTitle}</h2>
                            <p className="mt-3 text-sm leading-relaxed text-secondary">{profile?.shortBio || profile?.headline}</p>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-text">{t.hardSkillsTitle}</h2>
                            {hardSkills.length > 0 ? (
                                <div className="mt-4 grid grid-cols-4 gap-4 sm:grid-cols-5 lg:grid-cols-7">
                                    {hardSkills.map((skill: string, index: number) => (
                                        <div
                                            key={`${skill}-${index}`}
                                            className="group flex items-center justify-center"
                                            title={skill}
                                        >
                                            <div className="flex h-14 w-14 items-center justify-center transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
                                                {getHardSkillIcon(skill) ? (
                                                    <img
                                                        src={getHardSkillIcon(skill) || ""}
                                                        alt={skill}
                                                        className="h-12 w-12 object-contain"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-xs font-bold uppercase text-primary">
                                                        {getSkillLogoText(skill)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-3 text-sm text-secondary">{t.hardSkillsEmpty}</p>
                            )}
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-text">{t.softSkillsTitle}</h2>
                            {softSkills.length > 0 ? (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {softSkills.map((skill: string, index: number) => (
                                        <span
                                            key={`${skill}-soft-${index}`}
                                            className="rounded-full border border-white/20 px-4 py-2 text-sm text-secondary"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-3 text-sm text-secondary">{t.softSkillsEmpty}</p>
                            )}
                        </div>
                    </div>
                )}

                {activeMenu === "about" && (
                    <div>
                        <h2 className="text-3xl font-bold text-text">{t.aboutTitle}</h2>
                        {profile?.location && <p className="mt-2 text-primary">{profile.location}</p>}

                        <div className="prose prose-invert mt-5 max-w-none text-secondary">
                            {profile?.fullBio ? <PortableText value={profile.fullBio} /> : <p>{profile?.shortBio}</p>}
                        </div>

                        {!!jobs?.length && (
                            <div className="mt-8 space-y-4">
                                {jobs.map((job) => (
                                    <div key={job._id} className="rounded-lg border border-white/10 bg-surface p-4">
                                        <p className="text-lg font-semibold text-text">{job.jobTitle}</p>
                                        <p className="text-sm text-secondary">{job.name}</p>
                                        <p className="mt-2 text-sm text-secondary">{job.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeMenu === "achievement" && (
                    <div>
                        <h2 className="text-3xl font-bold text-text">{t.achievementTitle}</h2>
                        <div className="mt-6 space-y-4">
                            {(achievementItems.length > 0 ? achievementItems : education || []).map((item: any) => (
                                <div
                                    key={item._id}
                                    className="rounded-lg border border-white/10 bg-surface p-4 text-secondary"
                                >
                                    <p className="font-semibold text-text">{item.title || item.schoolName}</p>
                                    {item.shortDescription && <p className="mt-2 text-sm">{item.shortDescription}</p>}
                                    {item.degree && (
                                        <p className="mt-2 text-sm">
                                            {item.degree} {item.fieldOfStudy ? `- ${item.fieldOfStudy}` : ""}
                                        </p>
                                    )}
                                </div>
                            ))}
                            {achievementItems.length === 0 && (!education || education.length === 0) && (
                                <p className="text-secondary">{t.achievementEmpty}</p>
                            )}
                        </div>
                    </div>
                )}

                {activeMenu === "project" && (
                    <div>
                        <h2 className="text-3xl font-bold text-text">{t.projectTitle}</h2>
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {mainProjects.length > 0 ? mainProjects.map(renderProjectCard) : <p className="text-secondary">{t.projectEmpty}</p>}
                        </div>
                    </div>
                )}

                {activeMenu === "personal-project" && (
                    <div>
                        <h2 className="text-3xl font-bold text-text">{t.personalProjectTitle}</h2>
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {personalProjects.length > 0
                                ? personalProjects.map(renderProjectCard)
                                : <p className="text-secondary">{t.personalProjectEmpty}</p>}
                        </div>
                    </div>
                )}

                {activeMenu === "github" && (
                    <div>
                        <h2 className="text-3xl font-bold text-text">{t.githubTitle}</h2>
                        {contact?.github && (
                            <a
                                href={contact.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-background"
                            >
                                {contact.github}
                            </a>
                        )}

                        <div className="mt-6 space-y-3">
                            {githubRepositories.length > 0 ? (
                                githubRepositories.map((project) => (
                                    <a
                                        key={project._id}
                                        href={project.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block rounded-lg border border-white/10 bg-surface p-4 text-text hover:border-primary/40"
                                    >
                                        <p className="font-semibold">{project.title}</p>
                                        <p className="mt-1 text-sm text-secondary">{project.githubLink}</p>
                                    </a>
                                ))
                            ) : (
                                <p className="text-secondary">{t.githubEmpty}</p>
                            )}
                        </div>
                    </div>
                )}

                {activeMenu === "contact" && (
                    <div>
                        <h2 className="text-3xl font-bold text-text">{t.contactTitle}</h2>
                        <div className="mt-6 grid gap-3 text-secondary sm:grid-cols-2">
                            {contact?.email && <p>Email: {contact.email}</p>}
                            {contact?.whatsapp && <p>WhatsApp: {contact.whatsapp}</p>}
                            {contact?.linkedin && <p>LinkedIn: {contact.linkedin}</p>}
                            {contact?.instagram && <p>Instagram: {contact.instagram}</p>}
                        </div>

                        <a
                            href={`mailto:${contact?.email || profile?.email || ""}`}
                            className="mt-6 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-background"
                        >
                            {t.sendEmail}
                        </a>
                    </div>
                )}
            </section>
        </div>
    );
}
