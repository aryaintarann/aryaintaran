"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { SiteContent } from "@/types/content";

const defaultContent: SiteContent = {
  hero: { name: "ARYA INTARAN", tagline: "Web Developer | IT Support | Data Entry" },
  about: {
    bio1: "A passionate Full Stack Developer with expertise in building modern web applications. I thrive on crafting intuitive user experiences and scalable backend systems.",
    bio2: "I believe in clean code, continuous learning, and the power of technology to solve real-world problems.",
    education: [],
    career: [],
  },
  skills: [],
  projects: [
    {
      index: "01",
      title: "E-Commerce",
      slug: "e-commerce",
      description: "A full-stack e-commerce solution with real-time inventory management, secure payment processing, and an intuitive admin dashboard.",
      longDescription: "",
      type: "personal" as const,
      images: [],
      stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind CSS"],
      link: "#",
    },
    {
      index: "02",
      title: "Task Management App",
      slug: "task-management-app",
      description: "Collaborative project management tool with real-time updates, Kanban boards, and team analytics for improved productivity.",
      longDescription: "",
      type: "freelance" as const,
      images: [],
      stack: ["React", "Node.js", "Socket.io", "MongoDB", "Express"],
      link: "#",
    },
    {
      index: "03",
      title: "AI Content Generator",
      slug: "ai-content-generator",
      description: "Intelligent content creation platform leveraging AI APIs for generating, editing, and optimizing written content at scale.",
      longDescription: "",
      type: "work" as const,
      images: [],
      stack: ["Next.js", "OpenAI API", "Prisma", "PostgreSQL", "Vercel"],
      link: "#",
    },
  ],
  contact: {
    email: "hello@aryaintaran.dev",
    location: "Indonesia",
    phone: "Available on request",
    social: { instagram: "", tiktok: "", github: "", linkedin: "" },
  },
};

const ContentContext = createContext<SiteContent>(defaultContent);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setContent(data))
      .catch(() => {});
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
