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
  hero: { name: "ARYA INTARAN", tagline: "Full Stack Engineer | IT Support | Data Entry" },
  about: {
    bio1: "A passionate software engineer with expertise in building modern web applications from concept to deployment. I thrive on crafting intuitive user experiences and scalable backend systems that perform reliably under real-world conditions, handling everything from initial architecture decisions through to production monitoring and iteration.",
    bio2: "I believe in clean code, continuous learning, and the power of technology to solve real-world problems. From frontend interfaces to backend APIs and database architecture, I enjoy operating across every layer of the application — turning complex requirements into elegant, maintainable solutions that genuinely help people.",
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
      title: "E-Commerce Platform",
      slug: "e-commerce",
      description: "A full-stack e-commerce solution with real-time inventory management, secure payment processing, and an intuitive admin dashboard.",
      longDescription: "This is a comprehensive e-commerce platform built from the ground up using Next.js and TypeScript. It features a complete shopping experience including product listings, cart management, user authentication, and a secure Stripe-integrated checkout flow that handles multiple currencies and international shipping configurations.\n\nThe admin dashboard allows merchants to manage products, view real-time inventory levels, process orders, and analyze sales data through interactive charts. The system uses PostgreSQL for structured data and implements Row Level Security to support multi-tenant deployments, meaning multiple merchants can operate independently on the same infrastructure.\n\nPerformance was a core concern throughout development. Product images are served via a CDN with automatic format negotiation, lazy loading for below-fold assets, and responsive srcsets optimized for each viewport size. Server-side rendering ensures product pages are instantly indexable by search engines, while client-side navigation gives shoppers a seamless browsing experience.\n\nSecurity hardening includes CSRF protection on all mutation endpoints, rate limiting on the authentication flow, Content Security Policy headers, and Stripe Radar for fraud detection on payments. All sensitive operations are logged with structured audit trails accessible in the admin panel.\n\nThe checkout flow is optimized to minimize abandonment: users can complete a purchase as a guest or create an account, address autocomplete reduces friction at checkout, real-time stock validation prevents overselling, and order confirmation emails are sent immediately via a transactional email service with tracking links included.\n\nTesting coverage includes unit tests for all business logic, integration tests for the API layer, and end-to-end tests covering the critical purchase path. Continuous integration runs the full test suite on every pull request, ensuring that no regression ships to production without being caught automatically.",
      type: "personal" as const,
      images: [],
      stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind CSS"],
      link: "#",
    },
    {
      index: "02",
      title: "Task Management App",
      slug: "task-management-app",
      description: "Collaborative task management tool with real-time updates, Kanban boards, and team analytics for improved productivity.",
      longDescription: "A full-featured task management tool designed for distributed, collaborative teams and modern remote environments. The application supports real-time updates via WebSockets, allowing multiple users to see changes instantly without page reloads, creating a truly synchronous working environment regardless of physical location or time zone.\n\nCore features include drag-and-drop Kanban boards, task assignment, due date tracking, priority labels, file attachments, and an analytics dashboard showing individual and collective productivity metrics over time. The data model is built on MongoDB to accommodate the flexible, nested structure that task hierarchies and custom fields require.\n\nAuthentication is handled with JWT-based sessions and refresh tokens, supporting both email/password and OAuth providers. Role-based access control allows admins to manage team members, assign granular permissions, and archive completed work without data loss — keeping the workspace clean without sacrificing historical context.\n\nThe real-time engine uses Socket.io rooms scoped to each workspace, ensuring that updates are broadcast only to authorized participants. Reconnection logic gracefully handles network interruptions so users always resume with an up-to-date board state, and optimistic UI updates keep interactions feeling instant even on slower connections.\n\nA smooth mobile experience was achieved through careful attention to touch interactions: swipe gestures move cards between columns, long-press activates drag mode, and breakpoints adapt seamlessly from a single-column view on phones to the complete multi-column layout on larger screens. The interface was tested across iOS Safari and Android Chrome to ensure consistent behavior.\n\nDeployment uses a containerized Node.js environment managed with Docker Compose, enabling the entire application — API server, WebSocket server, and database — to be spun up with a single command both locally and on the production host, making handoff and environment parity straightforward.",
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
      longDescription: "An AI-powered writing assistant that allows teams to generate, edit, and optimize written material at scale. Integrates with OpenAI's GPT API to provide smart suggestions, tone adjustments, and SEO optimization recommendations directly inside the editing interface, reducing the time required to produce polished, publication-ready text.\n\nThe platform includes a rich text editor with AI-assisted writing, version history, team workspaces, and usage analytics. Deployed on Vercel with edge functions for low-latency AI responses globally, ensuring suggestions arrive within milliseconds regardless of where a team member is located.\n\nVersion history allows teams to compare drafts, roll back to previous iterations, and track the evolution of any document over time. Each revision is stored with metadata including author, timestamp, and a summary of changes, making it easy to understand how a piece developed and why specific decisions were made.\n\nEditor performance was optimized for large documents using virtual scrolling and deferred rendering, so even lengthy reports load and respond instantly. Usage analytics surface which writing formats and tones resonate best with different audiences, helping teams focus their efforts on approaches that have a proven track record.\n\nEnterprise features include single sign-on via SAML, detailed audit logging for compliance requirements, custom domain support for branded workspaces, and a public REST API for integrating the generation pipeline into existing tools like CMS platforms, marketing automation systems, and internal knowledge bases.\n\nThe billing system uses Stripe to manage subscription tiers, metered AI usage, and seat-based pricing. Customers can upgrade, downgrade, or cancel their plan at any time from the account dashboard, with prorated charges calculated automatically so nobody is ever billed unfairly for unused capacity.",
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
    social: { instagram: "https://instagram.com/", tiktok: "https://tiktok.com/", github: "https://github.com/", linkedin: "https://linkedin.com/" },
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
