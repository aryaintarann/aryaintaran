"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Reads the `scrollTo` query param from the URL and smoothly scrolls to that
 * section ID after GSAP has had time to initialize its pin-spacers.
 */
export default function ScrollToSection() {
    const searchParams = useSearchParams();
    const target = searchParams.get("scrollTo");

    useEffect(() => {
        if (!target) return;

        // Wait for GSAP ScrollTrigger pin-spacers to be created before scrolling.
        // Two-pass: first at 300ms (most cases), failsafe at 900ms.
        const scroll = () => {
            const el = document.getElementById(target);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        };

        const t1 = setTimeout(scroll, 300);
        const t2 = setTimeout(scroll, 900);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [target]);

    return null;
}
