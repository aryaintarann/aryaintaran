import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ContentProvider } from "@/context/ContentContext";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aryaintaran.com";

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
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} font-(family-name:--font-space) antialiased`}>
        <ThemeProvider>
          <ContentProvider>{children}</ContentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
