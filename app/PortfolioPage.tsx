import PortfolioSidebarLayout from "@/app/components/PortfolioSidebarLayout";
import { client } from "@/sanity/lib/client";
import {
  aboutContentQuery,
  aboutProfileQuery,
  achievementContentQuery,
  careerContentQuery,
  contactContentQuery,
  contactQuery,
  educationQuery,
  githubQuery,
  homeContentQuery,
  homeProfileQuery,
  jobQuery,
  personalProjectContentQuery,
  projectContentQuery,
  projectQuery,
  sidebarProfileQuery,
} from "@/sanity/lib/queries";

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
  const [
    homeProfile,
    aboutProfile,
    sidebarProfile,
    education,
    jobs,
    projects,
    github,
    contact,
    homeContent,
    aboutContent,
    careerContent,
    achievementContent,
    projectContent,
    personalProjectContent,
    contactContent,
  ] = await Promise.all([
    client.fetch(homeProfileQuery),
    client.fetch(aboutProfileQuery),
    client.fetch(sidebarProfileQuery),
    client.fetch(educationQuery),
    client.fetch(jobQuery),
    client.fetch(projectQuery),
    client.fetch(githubQuery),
    client.fetch(contactQuery),
    client.fetch(homeContentQuery),
    client.fetch(aboutContentQuery),
    client.fetch(careerContentQuery),
    client.fetch(achievementContentQuery),
    client.fetch(projectContentQuery),
    client.fetch(personalProjectContentQuery),
    client.fetch(contactContentQuery),
  ]);

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
      projects={projects}
      github={github}
      contact={contact}
      menuContent={menuContent}
      initialLanguage={initialLanguage}
      initialMenu={initialMenu}
    />
  );
}
