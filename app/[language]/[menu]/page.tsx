import PortfolioPage, { type LanguageKey, type MenuKey } from "@/app/PortfolioPage";
import { notFound } from "next/navigation";

interface LanguageMenuPageProps {
  params: Promise<{ language: string; menu: string }>;
}

const validMenus = new Set<MenuKey>([
  "home",
  "about",
  "career",
  "achievement",
  "project",
  "personal-project",
  "github",
  "contact",
]);

export const revalidate = 300;

export default async function LanguageMenuPage({ params }: LanguageMenuPageProps) {
  const { language, menu } = await params;

  if (language !== "id" && language !== "en") {
    notFound();
  }

  if (!validMenus.has(menu as MenuKey)) {
    notFound();
  }

  return (
    <PortfolioPage
      initialLanguage={language as LanguageKey}
      initialMenu={menu as MenuKey}
    />
  );
}
