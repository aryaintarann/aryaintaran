import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Projects | Arya Intaran",
  description:
    "A complete collection of projects by Arya Intaran — web apps, tools, and systems built with React, Next.js, and TypeScript.",
  alternates: {
    canonical: "https://aryaintaran.com/projects",
  },
  openGraph: {
    title: "All Projects | Arya Intaran",
    description:
      "Browse the complete collection of projects built by Arya Intaran — web applications, tools, and systems.",
    type: "website",
    url: "https://aryaintaran.com/projects",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Arya Intaran — Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Projects | Arya Intaran",
    description: "Browse the complete collection of projects by Arya Intaran.",
    images: ["/opengraph-image"],
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
