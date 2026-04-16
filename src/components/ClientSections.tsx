"use client";

import dynamic from "next/dynamic";

const AboutSection = dynamic(() => import("@/components/sections/AboutSection"), { ssr: false, loading: () => null });
const SkillsSection = dynamic(() => import("@/components/sections/SkillsSection"), { ssr: false, loading: () => null });
const ProjectsSection = dynamic(() => import("@/components/sections/ProjectsSection"), { ssr: false, loading: () => null });

export default function ClientSections() {
  return (
    <>
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
    </>
  );
}
