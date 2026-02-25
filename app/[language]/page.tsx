import PortfolioPage, { type LanguageKey } from "@/app/PortfolioPage";
import { notFound } from "next/navigation";

interface LanguagePageProps {
  params: Promise<{ language: string }>;
}

export const revalidate = 300;

export default async function LanguagePage({ params }: LanguagePageProps) {
  const { language } = await params;
  if (language !== "id" && language !== "en") {
    notFound();
  }

  return <PortfolioPage initialLanguage={language as LanguageKey} initialMenu="home" />;
}
