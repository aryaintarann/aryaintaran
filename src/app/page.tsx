import type { Metadata } from "next";
import { Suspense } from "react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";
import ScrollToSection from "@/components/ScrollToSection";

export const metadata: Metadata = {
  title: "Arya Intaran | Web Developer & IT Support Portfolio",
  description:
    "Software engineer specializing in React, Next.js, TypeScript, and Node.js. Building scalable web applications and robust backend systems.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Arya Intaran | Web Developer & IT Support",
    description:
      "Software engineer specializing in React, Next.js, TypeScript, and Node.js. Building scalable, high-performance web applications.",
    url: "/",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="relative pb-24">
      {/* Visually hidden H1 for SEO — visual heading is in HeroSection */}
      <h1 className="sr-only">
        Arya Intaran — Full Stack Developer, IT Support &amp; Data Entry Specialist
      </h1>
      <Suspense fallback={null}>
        <ScrollToSection />
      </Suspense>
      <TopBar />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
      <Navbar />

      <footer className="py-8 px-8 text-center border-t border-border">
        <p className="text-sm text-muted-foreground mb-3">
          © {new Date().getFullYear()} Arya Intaran.
        </p>
        <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-4 text-sm">
          <a href="/about" className="text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">About</a>
          <a href="/contact" className="text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">Contact</a>
          <a href="/projects" className="text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">Projects</a>
          <a href="/privacy-policy" className="text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">Privacy Policy</a>
        </nav>
      </footer>
    </main>
  );
}
