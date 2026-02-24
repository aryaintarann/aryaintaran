"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { urlForImage } from "@/sanity/lib/image";
import HomeTab from "./tabs/HomeTab";
import AboutTab from "./tabs/AboutTab";
import CareerTab from "./tabs/CareerTab";
import AchievementTab from "./tabs/AchievementTab";
import ProjectsTab from "./tabs/ProjectsTab";
import GithubTab from "./tabs/GithubTab";
import ContactTab from "@/app/components/tabs/ContactTab";
import type {
    AboutProfileData,
    ContactData,
    EducationData,
    GithubData,
    HomeProfileData,
    JobData,
    ProjectData,
    SidebarProfileData,
    TranslationText,
} from "./tabs/types";

type MenuKey =
    | "home"
    | "about"
    | "career"
    | "achievement"
    | "project"
    | "personal-project"
    | "github"
    | "contact";

type LanguageKey = "id" | "en";

interface PortfolioSidebarLayoutProps {
    profile: HomeProfileData;
    aboutProfile?: AboutProfileData;
    sidebarProfile?: SidebarProfileData;
    education: EducationData[];
    jobs: JobData[];
    projects: ProjectData[];
    github: GithubData;
    contact: ContactData;
    menuContent?: Partial<TranslationText>;
    initialLanguage?: LanguageKey;
    initialMenu?: MenuKey;
}

const languageText = {
    id: {
        menu: {
            home: "Home",
            about: "About",
            career: "Karir",
            achievement: "Achievement & Certification",
            project: "Project",
            personalProject: "Personal Project",
            github: "GitHub",
            contact: "Contact",
        },
        settings: "Pengaturan",
        language: "Bahasa",
        theme: "Tema",
        homeTitle: "Selamat Datang",
        hardSkillsTitle: "Hard Skills",
        softSkillsTitle: "Soft Skills",
        hardSkillsEmpty: "Belum ada hard skill.",
        softSkillsEmpty: "Belum ada soft skill.",
        aboutTitle: "Tentang Saya",
        educationTitle: "Edukasi",
        careerTitle: "Karir",
        careerEmpty: "Belum ada data karir.",
        educationDetailLabel: "Show detail",
        hideDetailLabel: "Hide detail",
        careerWorkedOnTitle: "Apa yang Saya Kerjakan",
        careerNoWorkedOn: "Belum ada detail pekerjaan.",
        organizationExperienceTitle: "Pengalaman Organisasi",
        whatILearnedTitle: "Apa yang Saya Pelajari",
        achievementsTitle: "Prestasi",
        noOrganizationExperience: "Belum ada pengalaman organisasi.",
        noLearnedItems: "Belum ada catatan pembelajaran.",
        noAchievements: "Belum ada prestasi.",
        achievementTitle: "Achievement & Certification",
        achievementEmpty: "Belum ada data achievement atau sertifikasi.",
        projectTitle: "Project",
        projectEmpty: "Belum ada project.",
        personalProjectTitle: "Personal Project",
        personalProjectEmpty: "Belum ada personal project.",
        githubTitle: "GitHub",
        githubContributionsTitle: "GitHub Contributions",
        githubRepositoriesTitle: "Repository Saya",
        githubLoading: "Memuat data GitHub...",
        githubFailed: "Gagal memuat data GitHub.",
        githubNoProfile: "URL profil GitHub belum diisi.",
        githubNoRepositories: "Belum ada repository publik yang bisa ditampilkan.",
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
            career: "Career",
            achievement: "Achievement & Certification",
            project: "Project",
            personalProject: "Personal Project",
            github: "GitHub",
            contact: "Contact",
        },
        settings: "Settings",
        language: "Language",
        theme: "Theme",
        homeTitle: "Welcome",
        hardSkillsTitle: "Hard Skills",
        softSkillsTitle: "Soft Skills",
        hardSkillsEmpty: "No hard skills yet.",
        softSkillsEmpty: "No soft skills yet.",
        aboutTitle: "About Me",
        educationTitle: "Education",
        careerTitle: "Career",
        careerEmpty: "No career data yet.",
        educationDetailLabel: "Show detail",
        hideDetailLabel: "Hide detail",
        careerWorkedOnTitle: "What I Worked On",
        careerNoWorkedOn: "No work details yet.",
        organizationExperienceTitle: "Organization Experience",
        whatILearnedTitle: "What I Learned",
        achievementsTitle: "Achievements",
        noOrganizationExperience: "No organization experience yet.",
        noLearnedItems: "No learning notes yet.",
        noAchievements: "No achievements yet.",
        achievementTitle: "Achievement & Certification",
        achievementEmpty: "No achievement or certification data yet.",
        projectTitle: "Project",
        projectEmpty: "No projects yet.",
        personalProjectTitle: "Personal Project",
        personalProjectEmpty: "No personal projects yet.",
        githubTitle: "GitHub",
        githubContributionsTitle: "GitHub Contributions",
        githubRepositoriesTitle: "My Repositories",
        githubLoading: "Loading GitHub data...",
        githubFailed: "Failed to load GitHub data.",
        githubNoProfile: "GitHub profile URL is not configured yet.",
        githubNoRepositories: "No public repositories available to display.",
        githubEmpty: "No project repository links have been added yet.",
        contactTitle: "Contact",
        openProject: "View Project",
        openRepo: "Open Repository",
        sendEmail: "Send Email",
    },
} as const;

export default function PortfolioSidebarLayout({
    profile,
    aboutProfile,
    sidebarProfile,
    education,
    jobs,
    projects,
    github,
    contact,
    menuContent,
    initialLanguage = "id",
    initialMenu = "home",
}: PortfolioSidebarLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const profileImageUrl = sidebarProfile?.profileImage
        ? urlForImage(sidebarProfile.profileImage as never).width(300).height(300).url()
        : "";
    const [activeMenu, setActiveMenu] = useState<MenuKey>(initialMenu);
    const [language, setLanguage] = useState<LanguageKey>(initialLanguage);
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const [openSettings, setOpenSettings] = useState(false);
    const settingsPanelRef = useRef<HTMLDivElement>(null);
    const menuNavRef = useRef<HTMLElement>(null);
    const menuButtonRefs = useRef<Partial<Record<MenuKey, HTMLButtonElement | null>>>({});
    const [menuIndicatorStyle, setMenuIndicatorStyle] = useState<{ top: number; height: number; opacity: number }>(
        {
            top: 0,
            height: 0,
            opacity: 0,
        }
    );

    const t = languageText[language];

    useEffect(() => {
        const savedTheme = window.localStorage.getItem("portfolio-theme");
        if (savedTheme === "light" || savedTheme === "dark") {
            setTheme(savedTheme);
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
        if (typeof window === "undefined") return;

        const snapshot = {
            fullName: profile?.fullName || "",
            headline: sidebarProfile?.headline || "",
            profileImageUrl: profileImageUrl || "",
        };

        window.localStorage.setItem("portfolio-sidebar-snapshot", JSON.stringify(snapshot));
    }, [profile?.fullName, profileImageUrl, sidebarProfile?.headline]);

    useEffect(() => {
        setActiveMenu(initialMenu);
    }, [initialMenu]);

    useEffect(() => {
        setLanguage(initialLanguage);
    }, [initialLanguage]);

    useEffect(() => {
        const targetPath = `/${language}/${activeMenu}`;
        if (pathname !== targetPath) {
            router.replace(targetPath, { scroll: false });
        }
    }, [activeMenu, language, pathname, router]);

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

    useEffect(() => {
        const syncMenuIndicator = () => {
            const nav = menuNavRef.current;
            const activeButton = menuButtonRefs.current[activeMenu];

            if (!nav || !activeButton) {
                setMenuIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
                return;
            }

            setMenuIndicatorStyle({
                top: activeButton.offsetTop + 4,
                height: Math.max(activeButton.offsetHeight - 8, 0),
                opacity: 1,
            });
        };

        syncMenuIndicator();
        window.addEventListener("resize", syncMenuIndicator);
        return () => window.removeEventListener("resize", syncMenuIndicator);
    }, [activeMenu]);

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
                    /(certificate|certification|sertifikat|piagam)/i.test(tag)
                )
            ),
        [projects]
    );

    const tabText: TranslationText = {
        ...t,
        ...(menuContent || {}),
    };

    const menuItems: { key: MenuKey; label: string }[] = [
        { key: "home", label: t.menu.home },
        { key: "about", label: t.menu.about },
        { key: "career", label: t.menu.career },
        { key: "achievement", label: t.menu.achievement },
        { key: "project", label: t.menu.project },
        { key: "personal-project", label: t.menu.personalProject },
        { key: "github", label: t.menu.github },
        { key: "contact", label: t.menu.contact },
    ];

    const renderActiveTab = () => {
        switch (activeMenu) {
            case "home":
                return <HomeTab profile={profile} t={tabText} />;
            case "about":
                return <AboutTab profile={aboutProfile} education={education} t={tabText} />;
            case "career":
                return <CareerTab jobs={jobs} t={tabText} />;
            case "achievement":
                return <AchievementTab achievementItems={achievementItems} t={tabText} />;
            case "project":
                return (
                    <ProjectsTab
                        title={tabText.projectTitle}
                        projects={mainProjects}
                        emptyText={tabText.projectEmpty}
                    />
                );
            case "personal-project":
                return (
                    <ProjectsTab
                        title={tabText.personalProjectTitle}
                        projects={personalProjects}
                        emptyText={tabText.personalProjectEmpty}
                    />
                );
            case "github":
                return <GithubTab github={github} contact={contact} t={tabText} />;
            case "contact":
                return <ContactTab contact={contact} sendEmail={tabText.sendEmail} title={tabText.contactTitle} />;
            default:
                return null;
        }
    };

    return (
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row md:gap-0 md:px-6 lg:px-8">
            <aside className="md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:w-80 md:shrink-0">
            <div className="flex h-full flex-col rounded-2xl bg-surface p-5">
                    <div className="mb-6 flex flex-col items-center text-center">
                        <div className="relative h-24 w-24 overflow-hidden rounded-full border border-white/20 bg-background">
                            {profileImageUrl ? (
                                <Image
                                    src={profileImageUrl}
                                    alt={profile?.fullName || "Profile"}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-secondary">No Photo</div>
                            )}
                        </div>

                        <p className="mt-4 text-base font-semibold text-text">{profile?.fullName || "Your Name"}</p>
                        <p className="mt-1 text-xs text-secondary">{sidebarProfile?.headline || "Portfolio"}</p>

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

                    <div className="mb-4 border-t border-white/10" aria-hidden="true"></div>

                    <nav ref={menuNavRef} className="relative flex flex-col gap-2 pl-3">
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute left-0 w-1.5 rounded-full bg-primary transition-all duration-300 ease-out"
                            style={{
                                top: `${menuIndicatorStyle.top}px`,
                                height: `${menuIndicatorStyle.height}px`,
                                opacity: menuIndicatorStyle.opacity,
                            }}
                        ></span>
                        {menuItems.map((item) => {
                            const active = activeMenu === item.key;
                            return (
                                <button
                                    key={item.key}
                                    ref={(element) => {
                                        menuButtonRefs.current[item.key] = element;
                                    }}
                                    type="button"
                                    onClick={() => setActiveMenu(item.key)}
                                    aria-current={active ? "page" : undefined}
                                    className={`group relative z-10 flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all duration-300 ${
                                        active
                                            ? "border-primary/40 bg-primary/20 font-semibold text-primary"
                                            : "border-transparent bg-background text-text hover:border-white/10 hover:bg-background/70"
                                    }`}
                                >
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            <div className="mx-4 hidden w-px self-stretch bg-white/10 md:block lg:mx-6" aria-hidden="true"></div>

            <section className="min-w-0 flex-1 rounded-2xl bg-background p-5 md:p-8">
                {renderActiveTab()}
            </section>
        </div>
    );
}
