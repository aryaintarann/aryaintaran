import PortfolioSidebarLayout from "@/app/components/PortfolioSidebarLayout";
import { getPortfolioContent } from "@/lib/admin-content";
import { listPublishedProjectsForPortfolio } from "@/lib/public-projects";

export type LanguageKey = "id" | "en";
export type MenuKey =
  | "home"
  | "about"
  | "career"
  | "achievement"
  | "project"
  | "personal-project"
  | "github"
  | "contact";

interface PortfolioPageProps {
  initialLanguage: LanguageKey;
  initialMenu: MenuKey;
}

export default async function PortfolioPage({
  initialLanguage,
  initialMenu,
}: PortfolioPageProps) {
  const language = initialLanguage;
  const [content, projectsFromDb] = await Promise.all([
    getPortfolioContent(language),
    (async () => {
      try {
        return await listPublishedProjectsForPortfolio(language);
      } catch (error) {
        console.error("[mysql] projects fetch failed", error);
        return [];
      }
    })(),
  ]);

  const {
    homeProfile,
    aboutProfile,
    sidebarProfile,
    education,
    jobs,
    github,
    contact,
    homeContent,
    aboutContent,
    careerContent,
    achievementContent,
    projectContent,
    personalProjectContent,
    contactContent,
  } = content;

  const menuContent = {
    ...(homeContent || {}),
    ...(aboutContent || {}),
    ...(careerContent || {}),
    ...(achievementContent || {}),
    ...(projectContent || {}),
    ...(personalProjectContent || {}),
    ...(contactContent || {}),
    ...(github || {}),
  };

  return (
    <PortfolioSidebarLayout
      profile={homeProfile}
      aboutProfile={aboutProfile}
      sidebarProfile={sidebarProfile}
      education={education}
      jobs={jobs}
      projects={projectsFromDb}
      github={github}
      contact={contact}
      menuContent={menuContent}
      initialLanguage={initialLanguage}
      initialMenu={initialMenu}
    />
  );
}
