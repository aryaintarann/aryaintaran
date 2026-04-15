"use client";

import { useTheme } from "@/context/ThemeContext";
import {
    Home,
    User,
    Code2,
    FolderKanban,
    Mail,
    Sun,
    Moon,
    Newspaper,
    Menu,
    X,
} from "lucide-react";
import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePathname, useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "about", icon: User, label: "About" },
    { id: "skills", icon: Code2, label: "Skills" },
    { id: "projects", icon: FolderKanban, label: "Projects" },
    { id: "news", icon: Newspaper, label: "News" },
    { id: "contact", icon: Mail, label: "Contact" },
];

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();
    const router = useRouter();
    const [activeSection, setActiveSection] = useState("home");
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [pastHero, setPastHero] = useState(false);

    useEffect(() => { setIsMenuOpen(false); }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMenuOpen]);

    useGSAP(() => {
        if (pathname !== "/") {
            setPastHero(true);
            return;
        }
        const sections = gsap.utils.toArray<HTMLElement>("section[id]");
        sections.forEach((section) => {
            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onToggle: (self) => { if (self.isActive) setActiveSection(section.id); },
            });
        });
        const heroSection = document.getElementById("home");
        if (heroSection) {
            ScrollTrigger.create({
                trigger: heroSection,
                start: "bottom 80%",
                onEnter: () => setPastHero(true),
                onLeaveBack: () => setPastHero(false),
            });
        }
        ScrollTrigger.refresh();
        return () => { ScrollTrigger.getAll().forEach(st => st.kill()); };
    }, { dependencies: [pathname] });

    const handleNavigation = (id: string) => {
        setIsMenuOpen(false);
        if (pathname === "/") {
            setActiveSection(id);
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        } else {
            router.push(id === "home" ? "/" : `/#${id}`);
        }
    };

    return (
        <>
            {/* ── Desktop Pill Navbar ── */}
            <nav className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-4 py-3 items-center gap-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        (pathname === "/" && activeSection === item.id) ||
                        (pathname.startsWith("/news") && item.id === "news");
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.id)}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            aria-label={`Navigate to ${item.label}`}
                            className={`flex items-center justify-center min-w-[44px] min-h-[44px] gap-2 px-3 py-2.5 rounded-full transition-all duration-300 cursor-pointer ${isActive ? "bg-lime text-[#050505]" : "text-foreground/70 hover:text-foreground"}`}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                            {(hoveredItem === item.id || isActive) && (
                                <span className="text-xs font-semibold tracking-wider uppercase whitespace-nowrap">{item.label}</span>
                            )}
                        </button>
                    );
                })}
                <div className="w-px h-6 bg-border mx-1" />
                <button onClick={toggleTheme} aria-label="Toggle theme" className="flex items-center justify-center min-w-[44px] min-h-[44px] px-3 py-2.5 rounded-full text-foreground/70 hover:text-foreground transition-all duration-300 cursor-pointer">
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </nav>

            {/* ── Mobile Pill Hamburger ── */}
            <div
                className="md:hidden glass rounded-full"
                style={{
                    position: "fixed",
                    bottom: "24px",
                    left: "50%",
                    transform: `translateX(-50%) translateY(${pastHero ? "0px" : "16px"})`,
                    opacity: pastHero ? 1 : 0,
                    pointerEvents: pastHero ? "auto" : "none",
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                    zIndex: 50,
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 16px",
                }}
            >
                <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", borderRadius: "50%", cursor: "pointer" }}
                >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <div style={{ width: "1px", height: "24px", background: "var(--border)" }} />
                <button
                    onClick={() => setIsMenuOpen(true)}
                    aria-label="Open navigation menu"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", borderRadius: "50%", cursor: "pointer" }}
                >
                    <Menu size={22} />
                </button>
            </div>

            {/* ── Mobile Full-Screen Overlay ── */}
            {isMenuOpen && (
                <div
                    className="md:hidden"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 200,
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        background: "rgba(5, 5, 5, 0.95)",
                        overflow: "hidden",
                        /* center all children */
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* Close button — anchored top-right */}
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Close navigation menu"
                        style={{
                            position: "absolute",
                            top: "32px",
                            right: "24px",
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            border: "1px solid rgba(255,255,255,0.35)",
                            background: "transparent",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <X size={20} color="#ffffff" />
                    </button>

                    {/* Nav items — centered column, compact to avoid scroll */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        {navItems.map((item, i) => {
                            const Icon = item.icon;
                            const isActive =
                                (pathname === "/" && activeSection === item.id) ||
                                (pathname.startsWith("/news") && item.id === "news");
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.id)}
                                    aria-label={`Navigate to ${item.label}`}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "16px",
                                        width: "260px",
                                        padding: "10px 20px",
                                        borderRadius: "12px",
                                        border: isActive ? "1px solid #CEF441" : "1px solid rgba(255,255,255,0.18)",
                                        background: isActive ? "#CEF441" : "rgba(255,255,255,0.03)",
                                        color: isActive ? "#050505" : "#ffffff",
                                        cursor: "pointer",
                                        transition: `all 0.4s ease ${i * 50}ms`,
                                    }}
                                >
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} color={isActive ? "#050505" : "#ffffff"} />
                                    <span style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: isActive ? "#050505" : "#ffffff" }}>
                                        {item.label}
                                    </span>
                                    {isActive && <span style={{ marginLeft: "auto", fontSize: "8px", color: "#050505" }}>●</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}
