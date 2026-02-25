import PortfolioSidebarLayout from "@/app/components/PortfolioSidebarLayout";
import { client } from "@/sanity/lib/client";
import {
  localizedAboutContentQuery,
  localizedAboutProfileQuery,
  localizedAchievementContentQuery,
  localizedCareerContentQuery,
  localizedContactContentQuery,
  localizedContactQuery,
  localizedEducationQuery,
  localizedGithubQuery,
  localizedHomeContentQuery,
  localizedHomeProfileQuery,
  localizedJobQuery,
  localizedPersonalProjectContentQuery,
  localizedProjectContentQuery,
  localizedProjectQuery,
  localizedSidebarProfileQuery,
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
  const language = initialLanguage;

  const safeFetch = async <T,>(
    label: string,
    query: string,
    params: Record<string, string>,
    fallback: T
  ): Promise<T> => {
    try {
      return await client.fetch<T>(query, params);
    } catch (error) {
      console.error(`[sanity] ${label} fetch failed`, error);
      return fallback;
    }
  };

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
    safeFetch("homeProfile", localizedHomeProfileQuery, {
      language,
      languageId: `home-profile-${language}`,
      mainId: "home-profile-main",
    }, {}),
    safeFetch("aboutProfile", localizedAboutProfileQuery, {
      language,
      languageId: `about-profile-${language}`,
      mainId: "about-profile-main",
    }, {}),
    safeFetch("sidebarProfile", localizedSidebarProfileQuery, {
      language,
      languageId: `sidebar-profile-${language}`,
      mainId: "sidebar-profile-main",
    }, {}),
    safeFetch("education", localizedEducationQuery, { language }, []),
    safeFetch("jobs", localizedJobQuery, { language }, []),
    safeFetch("projects", localizedProjectQuery, { language }, []),
    safeFetch("github", localizedGithubQuery, {
      language,
      languageId: `github-${language}`,
      mainId: "github-main",
    }, {}),
    safeFetch("contact", localizedContactQuery, {
      language,
      languageId: `contact-${language}`,
      mainId: "contact-main",
    }, {}),
    safeFetch("homeContent", localizedHomeContentQuery, {
      language,
      languageId: `home-content-${language}`,
      mainId: "home-content-main",
    }, {}),
    safeFetch("aboutContent", localizedAboutContentQuery, {
      language,
      languageId: `about-content-${language}`,
      mainId: "about-content-main",
    }, {}),
    safeFetch("careerContent", localizedCareerContentQuery, {
      language,
      languageId: `career-content-${language}`,
      mainId: "career-content-main",
    }, {}),
    safeFetch("achievementContent", localizedAchievementContentQuery, {
      language,
      languageId: `achievement-content-${language}`,
      mainId: "achievement-content-main",
    }, {}),
    safeFetch("projectContent", localizedProjectContentQuery, {
      language,
      languageId: `project-content-${language}`,
      mainId: "project-content-main",
    }, {}),
    safeFetch("personalProjectContent", localizedPersonalProjectContentQuery, {
      language,
      languageId: `personal-project-content-${language}`,
      mainId: "personal-project-content-main",
    }, {}),
    safeFetch("contactContent", localizedContactContentQuery, {
      language,
      languageId: `contact-content-${language}`,
      mainId: "contact-content-main",
    }, {}),
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
