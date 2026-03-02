import { Suspense } from "react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";
import ScrollToSection from "@/components/ScrollToSection";

export default function Home() {
  return (
    <main className="relative pb-24">
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
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Arya Intaran.
        </p>
      </footer>
    </main>
  );
}
