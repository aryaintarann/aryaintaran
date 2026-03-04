"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { SiteContent } from "@/types/content";

export type ContentContextType = SiteContent & { isLoaded: boolean };

const defaultContent: SiteContent = {
  hero: { name: "ARYA INTARAN", tagline: "Full Stack Engineer | IT Support | Data Entry" },
  about: {
    bio: "<p>Hello, I'm Arya, a Computer Science graduate. My core expertise spans Web Development, IT Support, and Data Entry. Character-wise, I am highly detail-oriented, adaptive, and solution-driven. This blend of technical problem-solving and data accuracy allows me to work efficiently and support seamless company operations</p>",
    education: [],
    career: [],
  },
  skills: [
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
    { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
    { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
    { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
    { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
    { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
    { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
    { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" },
    { name: "Supabase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" },
  ],
  projects: [
    {
      index: "01",
      title: "Legian Medical Clinic Website",
      slug: "lmcwebsite",
      description: "A Laravel-based healthcare website platform designed for Legian Medical Clinic. Equipped with a content management system.",
      longDescription: "",
      type: "freelance" as const,
      images: [],
      stack: ["Laravel", "MySQL", "Bootstrap"],
      link: "https://lmc.aryaintaran.dev",
      github: "https://github.com/aryaintarann/legian-medical-clinic",
    },
    {
      index: "02",
      title: "Savio Portfolio Website",
      slug: "saviowebsite",
      description: "Personal portfolio website built using Next.js 15 with a modern, responsive, light theme design",
      longDescription: "",
      type: "freelance" as const,
      images: [],
      stack: ["Nextjs"],
      link: "https://savio-porifolio.netlify.app/",
      github: "https://github.com/aryaintarann/savio-portfolio",
    },
    {
      index: "03",
      title: "VarsaWeb Company Profile Website",
      slug: "varsaweb",
      description: "VarsaWeb is a full-stack business website platform that comes with a custom content management system (CMS).",
      longDescription: "",
      type: "freelance" as const,
      images: [],
      stack: ["Next.js", "Supabase"],
      link: "#",
      github: "https://github.com/aryaintarann/varsaweb",
    },
    {
      index: "04",
      title: "Arya Intaran Portfolio Website",
      slug: "aryaintaran",
      description: "An interactive professional portfolio website for Arya Intaran, a Full Stack Engineer. Built with Next.js, Tailwind CSS, and Supabase.",
      longDescription: "",
      type: "personal" as const,
      images: [],
      stack: ["Next.js", "Tailwind", "GSAP", "Supabase"],
      link: "https://aryaintaran.dev",
      github: "https://github.com/aryaintarann/aryaintaran",
    },
  ],
  contact: {
    email: "aryangurahintaran@gmail.com",
    location: "Indonesia",
    phone: "Available on request",
    social: { instagram: "https://www.instagram.com/aryaintarann", tiktok: "https://tiktok.com/@aryaintaran9", github: "https://github.com/aryaintarann", linkedin: "https://www.linkedin.com/in/aryaintaran" },
  },
};

const defaultContextValue: ContentContextType = {
  ...defaultContent,
  isLoaded: false,
};

const ContentContext = createContext<ContentContextType>(defaultContextValue);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentContextType>(defaultContextValue);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setContent({ ...data, isLoaded: true }))
      .catch(() => setContent((prev) => ({ ...prev, isLoaded: true })));
  }, []);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
