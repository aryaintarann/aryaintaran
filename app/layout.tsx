import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://aryaintaran.dev'),
  title: {
    default: "Arya Intaran - Portfolio",
    template: "%s | Arya Intaran"
  },
  description: "Professional Portfolio of Arya Intaran - Website Developer & IT Support based in Bali.",
  keywords: ["Arya Intaran", "Web Developer", "IT Support", "Bali", "Portfolio", "Frontend Developer", "Next.js", "React"],
  authors: [{ name: "Arya Intaran" }],
  creator: "Arya Intaran",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aryaintaran.dev",
    title: "Arya Intaran - Portfolio",
    description: "Professional Portfolio of Arya Intaran - Website Developer & IT Support based in Bali.",
    siteName: "Arya Intaran",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Arya Intaran Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arya Intaran - Portfolio",
    description: "Professional Portfolio of Arya Intaran - Website Developer & IT Support based in Bali.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans bg-background text-text antialiased`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
