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
} from "lucide-react";
import { useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "about", icon: User, label: "About" },
    { id: "skills", icon: Code2, label: "Skills" },
    { id: "projects", icon: FolderKanban, label: "Projects" },
    { id: "contact", icon: Mail, label: "Contact" },
];

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const [activeSection, setActiveSection] = useState("home");
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    useGSAP(() => {
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
    }, { dependencies: [] });

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-4 py-3 flex items-center gap-1">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`relative flex items-center gap-2 px-3 py-2.5 rounded-full transition-all duration-300 cursor-pointer ${isActive
                            ? "bg-[#CEF441] text-[#050505]"
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
                className="flex items-center gap-2 px-3 py-2.5 rounded-full text-foreground/70 hover:text-foreground transition-all duration-300 cursor-pointer"
            >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </nav>
    );
}
