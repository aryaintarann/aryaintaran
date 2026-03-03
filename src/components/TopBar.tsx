"use client";

import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

export default function TopBar() {
    const { theme } = useTheme();

    return (
        <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4">
            <Image
                src={theme === "dark" ? "/logo.png" : "/logo-light.png"}
                alt="Logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-lg object-contain"
                priority
            />

            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-foreground/50">
                WEB DEVELOPER | IT SUPPORT | DATA ENTRY
            </span>
        </header>
    );
}
