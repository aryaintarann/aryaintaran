"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";
import HomeTab from "./tabs/HomeTab";
import AboutTab from "./tabs/AboutTab";
import CareerTab from "./tabs/CareerTab";
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

const AchievementTab = dynamic(() => import("./tabs/AchievementTab"), {
    ssr: false,
});

const ProjectsTab = dynamic(() => import("./tabs/ProjectsTab"), {
    ssr: false,
});

const GithubTab = dynamic(() => import("./tabs/GithubTab"), {
    ssr: false,
});

const ContactTab = dynamic(() => import("@/app/components/tabs/ContactTab"), {
    ssr: false,
});

const getImageUrl = (image: unknown) => {
    if (!image) return "";
    if (typeof image === "string") return image;
    return "";
};

const COMMAND_PALETTE_TRANSITION_MS = 240;
const MOBILE_DRAWER_TRANSITION_MS = 240;
const achievementTagRegex = /(certificate|certification|sertifikat|piagam)/i;

const prefetchers: Partial<Record<MenuKey, () => Promise<unknown>>> = {
    achievement: () => import("./tabs/AchievementTab"),
    project: () => import("./tabs/ProjectsTab"),
    "personal-project": () => import("./tabs/ProjectsTab"),
    github: () => import("./tabs/GithubTab"),
    contact: () => import("@/app/components/tabs/ContactTab"),
};

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
    const profileImageUrl = getImageUrl(sidebarProfile?.profileImage);
    const [activeMenu, setActiveMenu] = useState<MenuKey>(initialMenu);
    const [language, setLanguage] = useState<LanguageKey>(initialLanguage);
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const [openSettings, setOpenSettings] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
    const [openCommandPalette, setOpenCommandPalette] = useState(false);
    const [isCommandPaletteVisible, setIsCommandPaletteVisible] = useState(false);
    const [commandQuery, setCommandQuery] = useState("");
    const settingsPanelRef = useRef<HTMLDivElement>(null);
    const commandInputRef = useRef<HTMLInputElement>(null);
    const commandPaletteTimerRef = useRef<number | null>(null);
    const mobileDrawerTimerRef = useRef<number | null>(null);
    const menuNavRef = useRef<HTMLElement>(null);
    const tabContentRef = useRef<HTMLDivElement>(null);
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
        const el = tabContentRef.current;
        if (!el) return;

        // Select the major structural elements we introduced via semantic HTML
        // This targets the header and the immediate children of the sections (like articles or grid wrappers)
        const sections = el.querySelectorAll(":scope > article > header, :scope > article > section > *, :scope > div > div");
        if (sections.length === 0) return;

        const targets: Element[] = [];
        sections.forEach((section) => {
            // Check if the element contains grid/flex child items by class or multiple children
            const isGridWrapper = section.classList.contains("grid") || section.classList.contains("flex") || (section.children.length > 2 && !section.matches("header"));

            if (isGridWrapper) {
                // Animate grid items individually
                Array.from(section.children).forEach((child) => targets.push(child));
            } else {
                targets.push(section);
            }
        });

        if (targets.length === 0) return;

        // Kill existing animations to prevent glitches during rapid tab switching
        gsap.killTweensOf(targets);

        gsap.fromTo(
            targets,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 1.2, // Slower duration
                ease: "power2.out",
                stagger: 0.2, // Slower stagger
            }
        );
    }, [activeMenu]);

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
        return () => {
            if (commandPaletteTimerRef.current !== null) {
                window.clearTimeout(commandPaletteTimerRef.current);
            }
            if (mobileDrawerTimerRef.current !== null) {
                window.clearTimeout(mobileDrawerTimerRef.current);
            }
        };
    }, []);

    const openMobileMenu = () => {
        if (mobileDrawerTimerRef.current !== null) {
            window.clearTimeout(mobileDrawerTimerRef.current);
            mobileDrawerTimerRef.current = null;
        }

        setIsMobileMenuOpen(true);
        requestAnimationFrame(() => {
            setIsMobileMenuVisible(true);
        });
    };

    const closeMobileMenu = () => {
        setIsMobileMenuVisible(false);

        if (mobileDrawerTimerRef.current !== null) {
            window.clearTimeout(mobileDrawerTimerRef.current);
        }

        mobileDrawerTimerRef.current = window.setTimeout(() => {
            setIsMobileMenuOpen(false);
            mobileDrawerTimerRef.current = null;
        }, MOBILE_DRAWER_TRANSITION_MS);
    };

    const openPalette = () => {
        if (commandPaletteTimerRef.current !== null) {
            window.clearTimeout(commandPaletteTimerRef.current);
            commandPaletteTimerRef.current = null;
        }

        setOpenCommandPalette(true);
        requestAnimationFrame(() => {
            setIsCommandPaletteVisible(true);
        });
    };

    const closePalette = () => {
        setIsCommandPaletteVisible(false);

        if (commandPaletteTimerRef.current !== null) {
            window.clearTimeout(commandPaletteTimerRef.current);
        }

        commandPaletteTimerRef.current = window.setTimeout(() => {
            setOpenCommandPalette(false);
            setCommandQuery("");
            commandPaletteTimerRef.current = null;
        }, COMMAND_PALETTE_TRANSITION_MS);
    };

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const isCommandPaletteShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";

            if (isCommandPaletteShortcut) {
                event.preventDefault();
                if (openCommandPalette) {
                    closePalette();
                } else {
                    openPalette();
                }
            }

            if (event.key === "Escape") {
                if (openCommandPalette) {
                    closePalette();
                }
                if (isMobileMenuOpen) {
                    closeMobileMenu();
                }
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [openCommandPalette, isMobileMenuOpen]);

    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const { overflow } = document.body.style;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = overflow;
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        if (!openCommandPalette || !isCommandPaletteVisible) return;
        const timer = window.setTimeout(() => commandInputRef.current?.focus(), 0);
        return () => window.clearTimeout(timer);
    }, [openCommandPalette, isCommandPaletteVisible]);

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
                    !(project?.tags || []).some((tag: string) => /personal/i.test(tag)) &&
                    !(project?.tags || []).some((tag: string) => achievementTagRegex.test(tag))
            ),
        [projects]
    );

    const achievementItems = useMemo(
        () =>
            (projects || []).filter((project) =>
                (project?.tags || []).some((tag: string) =>
                    achievementTagRegex.test(tag)
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

    const commandItems = useMemo(() => {
        const query = commandQuery.trim().toLowerCase();
        if (!query) return menuItems;
        return menuItems.filter((item) => item.label.toLowerCase().includes(query));
    }, [commandQuery, menuItems]);

    const prefetchTab = (key: MenuKey) => {
        void prefetchers[key]?.();
    };

    const handleMenuSelect = (key: MenuKey) => {
        setActiveMenu(key);
        closeMobileMenu();
    };

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
                return (
                    <ContactTab
                        contact={contact}
                        sendEmail={tabText.sendEmail}
                        title={tabText.contactTitle}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row md:gap-0 md:px-6 lg:px-8">
            <header className="mb-2 flex items-center justify-between rounded-xl border border-white/10 bg-surface/95 px-3 py-2.5 md:hidden">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/20 bg-background">
                        {profileImageUrl ? (
                            <Image
                                src={profileImageUrl}
                                alt={profile?.fullName || "Profile"}
                                fill
                                sizes="44px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-secondary">No Photo</div>
                        )}
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center">
                            <p className="truncate text-base font-semibold text-text">{profile?.fullName || "Portfolio"}</p>
                        </div>
                        <p className="truncate text-[11px] text-secondary">{sidebarProfile?.headline || t.menu[activeMenu === "personal-project" ? "personalProject" : activeMenu]}</p>
                    </div>
                </div>

                <div className="ml-3 flex shrink-0 items-center gap-2">
                    <button
                        type="button"
                        aria-label={t.language}
                        onClick={() => setLanguage((current) => (current === "id" ? "en" : "id"))}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-primary text-background"
                    >
                        <span className="text-[11px] font-bold uppercase">{language === "id" ? "ID" : "EN"}</span>
                    </button>

                    <button
                        type="button"
                        aria-label={t.theme}
                        onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-background text-text"
                    >
                        {theme === "dark" ? (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        ) : (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2.25M12 18.75V21M4.72 4.72l1.59 1.59M17.69 17.69l1.59 1.59M3 12h2.25M18.75 12H21M4.72 19.28l1.59-1.59M17.69 6.31l1.59-1.59M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                            </svg>
                        )}
                    </button>

                    <button
                        type="button"
                        aria-label={language === "en" ? "Open menu" : "Buka menu"}
                        onClick={openMobileMenu}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-background text-text"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
                        </svg>
                    </button>
                </div>
            </header>

            {isMobileMenuOpen && (
                <div
                    className={`fixed inset-0 z-9999 transition-all duration-300 md:hidden ${isMobileMenuVisible ? "bg-black/60 backdrop-blur-sm" : "bg-black/0"
                        }`}
                    onClick={closeMobileMenu}
                >
                    <aside
                        className={`h-full w-[88%] max-w-sm overflow-y-auto bg-surface p-4 shadow-2xl transition-transform duration-300 ease-out ${isMobileMenuVisible ? "translate-x-0" : "-translate-x-full"
                            }`}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mb-4 flex items-start justify-between">
                            <div className="relative h-18 w-18 overflow-hidden rounded-full border border-white/20 bg-surface">
                                {profileImageUrl ? (
                                    <Image
                                        src={profileImageUrl}
                                        alt={profile?.fullName || "Profile"}
                                        fill
                                        sizes="72px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xs text-secondary">No Photo</div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={closeMobileMenu}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-background text-text"
                                aria-label={language === "en" ? "Close menu" : "Tutup menu"}
                            >
                                ×
                            </button>
                        </div>

                        <div className="mb-6 flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center">
                                <p className="truncate text-base font-semibold text-text">{profile?.fullName || "Portfolio"}</p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <button
                                    type="button"
                                    aria-label={t.language}
                                    onClick={() => setLanguage((current) => (current === "id" ? "en" : "id"))}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-primary text-background"
                                >
                                    <span className="text-[11px] font-bold uppercase">{language === "id" ? "ID" : "EN"}</span>
                                </button>

                                <button
                                    type="button"
                                    aria-label={t.theme}
                                    onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-surface text-text"
                                >
                                    {theme === "dark" ? (
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2.25M12 18.75V21M4.72 4.72l1.59 1.59M17.69 17.69l1.59 1.59M3 12h2.25M18.75 12H21M4.72 19.28l1.59-1.59M17.69 6.31l1.59-1.59M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mb-4 border-t border-white/10" />

                        <nav className="flex flex-col gap-2">
                            {menuItems.map((item) => {
                                const active = activeMenu === item.key;
                                return (
                                    <button
                                        key={`mobile-${item.key}`}
                                        type="button"
                                        onClick={() => handleMenuSelect(item.key)}
                                        className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all duration-300 ${active
                                            ? "border-primary/40 bg-primary/20 font-semibold text-primary"
                                            : "border-transparent bg-background text-text hover:border-white/10 hover:bg-background/70"
                                            }`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className={active ? "text-primary" : "text-secondary"}>
                                                {item.key === "home" && (
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" /></svg>
                                                )}
                                                {item.key === "about" && (
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" /></svg>
                                                )}
                                                {item.key === "career" && (
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16v13H4zM9 7V5h6v2" /></svg>
                                                )}
                                                {item.key === "achievement" && (
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h8v4a4 4 0 11-8 0V6zM6 6H4a2 2 0 002 2M18 6h2a2 2 0 01-2 2M12 14v4M9 18h6" /></svg>
                                                )}
                                                {item.key === "project" && (
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M6 3h12a1 1 0 011 1v16a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" /></svg>
                                                )}
                                                {item.key === "personal-project" && (
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" /></svg>
                                                )}
                                                {item.key === "github" && (
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.25.82-.57v-2.06c-3.34.73-4.03-1.4-4.03-1.4-.55-1.37-1.34-1.73-1.34-1.73-1.1-.74.08-.73.08-.73 1.21.09 1.85 1.23 1.85 1.23 1.07 1.83 2.8 1.3 3.49 1 .11-.77.42-1.3.77-1.6-2.66-.3-5.47-1.34-5.47-5.92 0-1.3.47-2.37 1.24-3.21-.12-.3-.54-1.52.12-3.16 0 0 1.01-.33 3.3 1.23a11.3 11.3 0 0 1 6 0c2.29-1.56 3.3-1.23 3.3-1.23.66 1.64.24 2.86.12 3.16.77.84 1.24 1.9 1.24 3.21 0 4.59-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.28c0 .32.21.69.82.57A12 12 0 0 0 12 .5Z" /></svg>
                                                )}
                                                {item.key === "contact" && (
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h18v14H3zM3 7l9 6 9-6" /></svg>
                                                )}
                                            </span>
                                            <span>{item.label}</span>
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>
                </div>
            )}

            <aside className="hidden md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:w-80 md:shrink-0 md:block">
                <div className="flex h-full flex-col rounded-2xl bg-surface p-5">
                    <div className="mb-6 flex flex-col items-center text-center">
                        <div className="relative h-24 w-24 overflow-hidden rounded-full border border-white/20 bg-background">
                            {profileImageUrl ? (
                                <Image
                                    src={profileImageUrl}
                                    alt={profile?.fullName || "Profile"}
                                    fill
                                    className="object-cover"
                                    sizes="96px"
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

                        <button
                            onClick={openPalette}
                            className="mt-2 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-background px-3 py-2 text-xs text-secondary transition-colors hover:text-text"
                            type="button"
                            aria-label={language === "en" ? "Open command palette" : "Buka command palette"}
                        >
                            <span>{language === "en" ? "Command" : "Perintah"}</span>
                            <span className="rounded border border-white/20 px-1.5 py-0.5 text-[10px]">Ctrl+K</span>
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
                                    onClick={() => handleMenuSelect(item.key)}
                                    onMouseEnter={() => prefetchTab(item.key)}
                                    onFocus={() => prefetchTab(item.key)}
                                    aria-current={active ? "page" : undefined}
                                    className={`group relative z-10 flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all duration-300 ${active
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

            <section ref={tabContentRef} className="min-w-0 flex-1 rounded-2xl bg-background p-5 md:p-8">
                {renderActiveTab()}
            </section>

            {openCommandPalette && (
                <div
                    className={`fixed inset-0 z-10000 flex items-start justify-center overflow-y-auto p-3 transition-opacity duration-300 md:items-center md:p-6 ${isCommandPaletteVisible ? "bg-black/60 backdrop-blur-sm opacity-100" : "bg-black/0 opacity-0"
                        }`}
                    onClick={closePalette}
                >
                    <div
                        className={`relative mt-3 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-background shadow-2xl transition-all duration-300 md:mt-0 ${isCommandPaletteVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0"
                            }`}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={closePalette}
                            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background text-text"
                            aria-label={language === "en" ? "Close command palette" : "Tutup command palette"}
                        >
                            ×
                        </button>

                        <div className="border-b border-white/10 p-5 md:p-6">
                            <p className="text-sm uppercase tracking-wide text-secondary">{language === "en" ? "Command Palette" : "Command Palette"}</p>
                            <input
                                ref={commandInputRef}
                                type="text"
                                value={commandQuery}
                                onChange={(event) => setCommandQuery(event.target.value)}
                                placeholder={language === "en" ? "Search menu..." : "Cari menu..."}
                                className="mt-3 w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm text-text outline-none focus:border-primary/40"
                            />
                        </div>
                        <div className="max-h-[42vh] overflow-y-auto overflow-x-hidden bg-background p-4 md:max-h-none md:p-6 no-scrollbar">
                            {commandItems.length === 0 ? (
                                <p className="p-3 text-sm text-secondary">{language === "en" ? "No results" : "Tidak ada hasil"}</p>
                            ) : (
                                commandItems.map((item) => (
                                    <button
                                        key={item.key}
                                        type="button"
                                        className="mb-2 flex w-full items-center justify-between rounded-xl border border-white/10 bg-surface/40 px-4 py-3 text-left text-sm text-text transition-colors hover:border-primary/30 hover:bg-surface"
                                        onMouseEnter={() => prefetchTab(item.key)}
                                        onFocus={() => prefetchTab(item.key)}
                                        onClick={() => {
                                            setActiveMenu(item.key);
                                            closePalette();
                                        }}
                                    >
                                        <span>{item.label}</span>
                                        <span className="text-xs text-secondary">↵</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
