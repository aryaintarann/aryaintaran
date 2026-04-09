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
        if (id === "news") {
            router.push("/news");
            return;
        }

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
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-2 md:px-4 py-3 flex items-center gap-1">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = (pathname === "/" && activeSection === item.id) || (pathname.startsWith("/news") && item.id === "news");
                
                return (
                    <button
                        key={item.id}
                        onClick={() => handleNavigation(item.id)}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        aria-label={`Navigate to ${item.label}`}
                        className={`relative flex items-center justify-center min-w-[44px] min-h-[44px] gap-2 px-3 py-2.5 rounded-full transition-all duration-300 cursor-pointer ${isActive
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
    );
}
