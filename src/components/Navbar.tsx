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

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMenuOpen]);

    useGSAP(() => {
        if (pathname !== "/") return;

        const sections = gsap.utils.toArray<HTMLElement>("section[id]");

        sections.forEach((section) => {
            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onToggle: (self) => {
                    if (self.isActive) {
                        setActiveSection(section.id);
                    }
                },
            });
        });

        ScrollTrigger.refresh();
        return () => {
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, { dependencies: [pathname] });

    const handleNavigation = (id: string) => {
        setIsMenuOpen(false);
        if (pathname === "/") {
            setActiveSection(id);
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            router.push(id === "home" ? "/" : `/#${id}`);
        }
    };

    return (
        <>
            {/* ── Desktop Pill Navbar (md and above) ── */}
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
                            className={`relative flex items-center justify-center min-w-[44px] min-h-[44px] gap-2 px-3 py-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                                isActive
                                    ? "bg-lime text-[#050505]"
                                    : "text-foreground/70 hover:text-foreground"
                            }`}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                            {(hoveredItem === item.id || isActive) && (
                                <span className="text-xs font-semibold tracking-wider uppercase whitespace-nowrap">
                                    {item.label}
                                </span>
                            )}
                        </button>
                    );
                })}

                <div className="w-px h-6 bg-border mx-1" />

                <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="flex items-center justify-center min-w-[44px] min-h-[44px] gap-2 px-3 py-2.5 rounded-full text-foreground/70 hover:text-foreground transition-all duration-300 cursor-pointer"
                >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </nav>

            {/* ── Mobile Hamburger Bar (below md) ── */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-4 py-3 flex items-center gap-3">
                <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="flex items-center justify-center w-11 h-11 rounded-full text-foreground/70 hover:text-foreground transition-all duration-300 cursor-pointer"
                >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className="w-px h-6 bg-border" />

                <button
                    onClick={() => setIsMenuOpen(true)}
                    aria-label="Open navigation menu"
                    className="flex items-center justify-center w-11 h-11 rounded-full text-foreground/70 hover:text-foreground transition-all duration-300 cursor-pointer"
                >
                    <Menu size={22} />
                </button>
            </div>

            {/* ── Mobile Full-Screen Overlay ── */}
            <div
                className={`md:hidden fixed inset-0 z-[100] transition-all duration-500 ${
                    isMenuOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
                style={{
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    background: "rgba(5, 5, 5, 0.92)",
                }}
            >
                {/* Close button */}
                <button
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close navigation menu"
                    className="absolute top-8 right-6 flex items-center justify-center w-12 h-12 rounded-full border border-border text-foreground/70 hover:text-foreground hover:border-lime transition-all duration-300 cursor-pointer"
                >
                    <X size={22} />
                </button>

                {/* Nav items list */}
                <div className="flex flex-col items-center justify-center h-full gap-3 px-8">
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
                                    transitionDelay: isMenuOpen ? `${i * 60}ms` : "0ms",
                                    transform: isMenuOpen ? "translateY(0)" : "translateY(30px)",
                                    opacity: isMenuOpen ? 1 : 0,
                                }}
                                className={`flex items-center gap-5 w-full max-w-xs px-6 py-4 rounded-2xl transition-all duration-500 cursor-pointer border ${
                                    isActive
                                        ? "bg-lime text-[#050505] border-lime"
                                        : "text-foreground/80 hover:text-foreground border-border hover:border-lime/50 hover:bg-foreground/5"
                                }`}
                            >
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                                <span className="text-lg font-bold tracking-wider uppercase">
                                    {item.label}
                                </span>
                                {isActive && (
                                    <span className="ml-auto text-xs text-[#050505]">●</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
