import { groq } from "next-sanity";

export const homeProfileQuery = groq`
  coalesce(
    *[_type == "homeProfile" && _id == "home-profile-main"][0] {
      _id,
      fullName,
      summary,
      hardSkills,
      softSkills
    },
    *[_type == "homeProfile"] | order(_updatedAt desc)[0] {
      _id,
      fullName,
      summary,
      hardSkills,
      softSkills
    }
  )
`;

export const aboutProfileQuery = groq`
  coalesce(
    *[_type == "aboutProfile" && _id == "about-profile-main"][0] {
      _id,
      aboutMe
    },
    *[_type == "aboutProfile"] | order(_updatedAt desc)[0] {
      _id,
      aboutMe
    }
  )
`;

export const sidebarProfileQuery = groq`
  coalesce(
    *[_type == "sidebarProfile" && _id == "sidebar-profile-main"][0] {
      _id,
      profileImage,
      headline
    },
    *[_type == "sidebarProfile"] | order(_updatedAt desc)[0] {
      _id,
      profileImage,
      headline
    }
  )
`;

export const profileQuery = homeProfileQuery;

export const educationQuery = groq`
  *[_type == "education"] | order(startDate desc) {
    _id,
    schoolName,
    degree,
    fieldOfStudy,
    startDate,
    endDate,
    organizationExperience,
    achievements
  }
`;

export const jobQuery = groq`
  *[_type == "job"] | order(startDate desc) {
    _id,
    name,
    jobTitle,
    logo,
    url,
    description,
    startDate,
    endDate
  }
`;

export const projectQuery = groq`
  *[_type == "project"] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    logo,
    image,
    shortDescription,
    description,
    link,
    githubLink,
    tags
  }
`;

export const contactQuery = groq`
  coalesce(
    *[_type == "contact" && _id == "contact-main"][0] {
      _id,
      email,
      whatsapp,
      linkedin,
      instagram,
      tiktok,
      github
    },
    *[_type == "contact"] | order(_updatedAt desc)[0] {
      _id,
      email,
      whatsapp,
      linkedin,
      instagram,
      tiktok,
      github
    }
  )
`;

export const githubQuery = groq`
  coalesce(
    *[_type == "github" && _id == "github-main"][0] {
      _id,
      "githubTitle": githubTitle,
      "githubContributionsTitle": contributionsTitle,
      "githubRepositoriesTitle": repositoriesTitle,
      profileUrl,
      username,
      description,
      showContributions,
      showRepositories,
      repositoriesLimit
    },
    *[_type == "github"] | order(_updatedAt desc)[0] {
      _id,
      "githubTitle": githubTitle,
      "githubContributionsTitle": contributionsTitle,
      "githubRepositoriesTitle": repositoriesTitle,
      profileUrl,
      username,
      description,
      showContributions,
      showRepositories,
      repositoriesLimit
    }
  )
`;

export const homeContentQuery = groq`coalesce(*[_type == "homeContent" && _id == "home-content-main"][0], *[_type == "homeContent"] | order(_updatedAt desc)[0])`;
export const aboutContentQuery = groq`coalesce(*[_type == "aboutContent" && _id == "about-content-main"][0], *[_type == "aboutContent"] | order(_updatedAt desc)[0])`;
export const careerContentQuery = groq`coalesce(*[_type == "careerContent" && _id == "career-content-main"][0], *[_type == "careerContent"] | order(_updatedAt desc)[0])`;
export const achievementContentQuery = groq`coalesce(*[_type == "achievementContent" && _id == "achievement-content-main"][0], *[_type == "achievementContent"] | order(_updatedAt desc)[0])`;
export const projectContentQuery = groq`coalesce(*[_type == "projectContent" && _id == "project-content-main"][0], *[_type == "projectContent"] | order(_updatedAt desc)[0])`;
export const personalProjectContentQuery = groq`coalesce(*[_type == "personalProjectContent" && _id == "personal-project-content-main"][0], *[_type == "personalProjectContent"] | order(_updatedAt desc)[0])`;
export const contactContentQuery = groq`coalesce(*[_type == "contactContent" && _id == "contact-content-main"][0], *[_type == "contactContent"] | order(_updatedAt desc)[0])`;
