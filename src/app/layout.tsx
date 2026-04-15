import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ContentProvider } from "@/context/ContentContext";
import { SpeedInsights } from "@vercel/speed-insights/next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aryaintaran.dev";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Arya Intaran | Full Stack Developer Portfolio",
    template: "%s | Arya Intaran",
  },
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo-light.png",
        href: "/logo-light.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo.png",
        href: "/logo.png",
      },
    ],
  },
  description:
    "Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies. Building scalable, high-performance web applications.",
  keywords: [
    "Arya Intaran",
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js",
    "TypeScript",
    "Web Developer",
    "Portfolio",
    "IT Support",
  ],
  authors: [{ name: "Arya Intaran", url: BASE_URL }],
  creator: "Arya Intaran",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Arya Intaran | Full Stack Developer",
    description:
      "Full Stack Developer specializing in React, Next.js, and modern web technologies. Explore my portfolio and projects.",
    type: "website",
    url: BASE_URL,
    siteName: "Arya Intaran Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arya Intaran | Full Stack Developer",
    description:
      "Full Stack Developer specializing in React, Next.js, and modern web technologies.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${BASE_URL}/#person`,
      name: "Arya Intaran",
      url: BASE_URL,
      jobTitle: "Full Stack Developer",
      description: "Full Stack Developer specializing in React, Next.js, TypeScript, and modern web technologies.",
      sameAs: [
        "https://github.com/aryaintaran",
        "https://linkedin.com/in/aryaintaran",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Arya Intaran Portfolio",
      description: "Portfolio website of Arya Intaran, Full Stack Developer.",
      author: { "@id": `${BASE_URL}/#person` },
    },
    {
      "@type": "ItemList",
      "@id": `${BASE_URL}/#sitelinks`,
      "name": "Navigate Arya Intaran Portfolio",
      "itemListElement": [
        {
          "@type": "SiteNavigationElement",
          "position": 1,
          "name": "Tech News",
          "url": `${BASE_URL}/news`,
          "description": "Stay updated with the latest in technology, AI, and web development."
        },
        {
          "@type": "SiteNavigationElement",
          "position": 2,
          "name": "Projects Showcase",
          "url": `${BASE_URL}/projects`,
          "description": "Explore my portfolio of web development projects."
        },
        {
          "@type": "SiteNavigationElement",
          "position": 3,
          "name": "About Me",
          "url": `${BASE_URL}/#about`,
          "description": "Learn more about my background, skills, and experience."
        },
        {
          "@type": "SiteNavigationElement",
          "position": 4,
          "name": "Contact",
          "url": `${BASE_URL}/#contact`,
          "description": "Get in touch for freelance work and collaborations."
        }
      ]
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} font-(family-name:--font-space) antialiased`}>
        <ThemeProvider>
          <ContentProvider>{children}</ContentProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
