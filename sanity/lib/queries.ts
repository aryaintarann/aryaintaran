import { groq } from "next-sanity";

export type AppLanguage = "id" | "en";

export const localizedHomeProfileQuery = groq`
  select(
    $language == "id" => coalesce(
      *[_type == "homeProfile" && _id == $languageId][0] {
        _id,
        fullName,
        summary,
        hardSkills,
        softSkills,
        language
      },
      *[_type == "homeProfile" && _id == $mainId][0] {
        _id,
        fullName,
        summary,
        hardSkills,
        softSkills,
        language
      },
      *[_type == "homeProfile" && (!defined(language) || language == "id")] | order(_updatedAt desc)[0] {
        _id,
        fullName,
        summary,
        hardSkills,
        softSkills,
        language
      }
    ),
    coalesce(
      *[_type == "homeProfile" && _id == $languageId][0] {
        _id,
        fullName,
        summary,
        hardSkills,
        softSkills,
        language
      },
      *[_type == "homeProfile" && language == "en"] | order(_updatedAt desc)[0] {
        _id,
        fullName,
        summary,
        hardSkills,
        softSkills,
        language
      },
      *[_type == "homeProfile" && _id == $mainId][0] {
        _id,
        fullName,
        summary,
        hardSkills,
        softSkills,
        language
      },
      *[_type == "homeProfile"] | order(_updatedAt desc)[0] {
        _id,
        fullName,
        summary,
        hardSkills,
        softSkills,
        language
      }
    )
  )
`;

export const localizedAboutProfileQuery = groq`
  select(
    $language == "id" => coalesce(
      *[_type == "aboutProfile" && _id == $languageId][0] {
        _id,
        aboutMe,
        language
      },
      *[_type == "aboutProfile" && _id == $mainId][0] {
        _id,
        aboutMe,
        language
      },
      *[_type == "aboutProfile" && (!defined(language) || language == "id")] | order(_updatedAt desc)[0] {
        _id,
        aboutMe,
        language
      }
    ),
    coalesce(
      *[_type == "aboutProfile" && _id == $languageId][0] {
        _id,
        aboutMe,
        language
      },
      *[_type == "aboutProfile" && language == "en"] | order(_updatedAt desc)[0] {
        _id,
        aboutMe,
        language
      },
      *[_type == "aboutProfile" && _id == $mainId][0] {
        _id,
        aboutMe,
        language
      },
      *[_type == "aboutProfile"] | order(_updatedAt desc)[0] {
        _id,
        aboutMe,
        language
      }
    )
  )
`;

export const localizedSidebarProfileQuery = groq`
  select(
    $language == "id" => coalesce(
      *[_type == "sidebarProfile" && _id == $languageId][0] {
        _id,
        profileImage,
        headline,
        language
      },
      *[_type == "sidebarProfile" && _id == $mainId][0] {
        _id,
        profileImage,
        headline,
        language
      },
      *[_type == "sidebarProfile" && (!defined(language) || language == "id")] | order(_updatedAt desc)[0] {
        _id,
        profileImage,
        headline,
        language
      }
    ),
    coalesce(
      *[_type == "sidebarProfile" && _id == $languageId][0] {
        _id,
        profileImage,
        headline,
        language
      },
      *[_type == "sidebarProfile" && language == "en"] | order(_updatedAt desc)[0] {
        _id,
        profileImage,
        headline,
        language
      },
      *[_type == "sidebarProfile" && _id == $mainId][0] {
        _id,
        profileImage,
        headline,
        language
      },
      *[_type == "sidebarProfile"] | order(_updatedAt desc)[0] {
        _id,
        profileImage,
        headline,
        language
      }
    )
  )
`;

export const localizedEducationQuery = groq`
  *[_type == "education" && (language == $language || ($language == "id" && !defined(language)))] | order(startDate desc) {
    _id,
    schoolName,
    degree,
    fieldOfStudy,
    startDate,
    endDate,
    organizationExperience,
    achievements,
    language
  }
`;

export const localizedJobQuery = groq`
  *[_type == "job" && (language == $language || ($language == "id" && !defined(language)))] | order(startDate desc) {
    _id,
    name,
    jobTitle,
    logo,
    url,
    description,
    startDate,
    endDate,
    language
  }
`;

export const localizedProjectQuery = groq`
  *[_type == "project" && (language == $language || ($language == "id" && !defined(language)))] | order(_createdAt desc) {
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
    tags,
    language
  }
`;

export const localizedContactQuery = groq`
  select(
    $language == "id" => coalesce(
      *[_type == "contact" && _id == $languageId][0] {
        _id,
        email,
        whatsapp,
        linkedin,
        instagram,
        tiktok,
        github,
        language
      },
      *[_type == "contact" && _id == $mainId][0] {
        _id,
        email,
        whatsapp,
        linkedin,
        instagram,
        tiktok,
        github,
        language
      },
      *[_type == "contact" && (!defined(language) || language == "id")] | order(_updatedAt desc)[0] {
        _id,
        email,
        whatsapp,
        linkedin,
        instagram,
        tiktok,
        github,
        language
      }
    ),
    coalesce(
      *[_type == "contact" && _id == $languageId][0] {
        _id,
        email,
        whatsapp,
        linkedin,
        instagram,
        tiktok,
        github,
        language
      },
      *[_type == "contact" && language == "en"] | order(_updatedAt desc)[0] {
        _id,
        email,
        whatsapp,
        linkedin,
        instagram,
        tiktok,
        github,
        language
      },
      *[_type == "contact" && _id == $mainId][0] {
        _id,
        email,
        whatsapp,
        linkedin,
        instagram,
        tiktok,
        github,
        language
      },
      *[_type == "contact"] | order(_updatedAt desc)[0] {
        _id,
        email,
        whatsapp,
        linkedin,
        instagram,
        tiktok,
        github,
        language
      }
    )
  )
`;

export const localizedGithubQuery = groq`
  select(
    $language == "id" => coalesce(
      *[_type == "github" && _id == $languageId][0] {
        _id,
        "githubTitle": githubTitle,
        "githubContributionsTitle": contributionsTitle,
        "githubRepositoriesTitle": repositoriesTitle,
        profileUrl,
        username,
        description,
        showContributions,
        showRepositories,
        repositoriesLimit,
        language
      },
      *[_type == "github" && _id == $mainId][0] {
        _id,
        "githubTitle": githubTitle,
        "githubContributionsTitle": contributionsTitle,
        "githubRepositoriesTitle": repositoriesTitle,
        profileUrl,
        username,
        description,
        showContributions,
        showRepositories,
        repositoriesLimit,
        language
      },
      *[_type == "github" && (!defined(language) || language == "id")] | order(_updatedAt desc)[0] {
        _id,
        "githubTitle": githubTitle,
        "githubContributionsTitle": contributionsTitle,
        "githubRepositoriesTitle": repositoriesTitle,
        profileUrl,
        username,
        description,
        showContributions,
        showRepositories,
        repositoriesLimit,
        language
      }
    ),
    coalesce(
      *[_type == "github" && _id == $languageId][0] {
        _id,
        "githubTitle": githubTitle,
        "githubContributionsTitle": contributionsTitle,
        "githubRepositoriesTitle": repositoriesTitle,
        profileUrl,
        username,
        description,
        showContributions,
        showRepositories,
        repositoriesLimit,
        language
      },
      *[_type == "github" && language == "en"] | order(_updatedAt desc)[0] {
        _id,
        "githubTitle": githubTitle,
        "githubContributionsTitle": contributionsTitle,
        "githubRepositoriesTitle": repositoriesTitle,
        profileUrl,
        username,
        description,
        showContributions,
        showRepositories,
        repositoriesLimit,
        language
      },
      *[_type == "github" && _id == $mainId][0] {
        _id,
        "githubTitle": githubTitle,
        "githubContributionsTitle": contributionsTitle,
        "githubRepositoriesTitle": repositoriesTitle,
        profileUrl,
        username,
        description,
        showContributions,
        showRepositories,
        repositoriesLimit,
        language
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
        repositoriesLimit,
        language
      }
    )
  )
`;

export const localizedHomeContentQuery = groq`select($language == "id" => coalesce(*[_type == "homeContent" && _id == $languageId][0], *[_type == "homeContent" && _id == $mainId][0], *[_type == "homeContent" && (!defined(language) || language == "id")] | order(_updatedAt desc)[0]), coalesce(*[_type == "homeContent" && _id == $languageId][0], *[_type == "homeContent" && language == "en"] | order(_updatedAt desc)[0], *[_type == "homeContent" && _id == $mainId][0], *[_type == "homeContent"] | order(_updatedAt desc)[0]))`;
export const localizedAboutContentQuery = groq`select($language == "id" => coalesce(*[_type == "aboutContent" && _id == $languageId][0], *[_type == "aboutContent" && _id == $mainId][0], *[_type == "aboutContent" && (!defined(language) || language == "id")] | order(_updatedAt desc)[0]), coalesce(*[_type == "aboutContent" && _id == $languageId][0], *[_type == "aboutContent" && language == "en"] | order(_updatedAt desc)[0], *[_type == "aboutContent" && _id == $mainId][0], *[_type == "aboutContent"] | order(_updatedAt desc)[0]))`;
export const localizedCareerContentQuery = groq`select($language == "id" => coalesce(*[_type == "careerContent" && _id == $languageId][0], *[_type == "careerContent" && _id == $mainId][0], *[_type == "careerContent" && (!defined(language) || language == "id")] | order(_updatedAt desc)[0]), coalesce(*[_type == "careerContent" && _id == $languageId][0], *[_type == "careerContent" && language == "en"] | order(_updatedAt desc)[0], *[_type == "careerContent" && _id == $mainId][0], *[_type == "careerContent"] | order(_updatedAt desc)[0]))`;
export const localizedAchievementContentQuery = groq`select($language == "id" => coalesce(*[_type == "achievementContent" && _id == $languageId][0], *[_type == "achievementContent" && _id == $mainId][0], *[_type == "achievementContent" && (!defined(language) || language == "id")] | order(_updatedAt desc)[0]), coalesce(*[_type == "achievementContent" && _id == $languageId][0], *[_type == "achievementContent" && language == "en"] | order(_updatedAt desc)[0], *[_type == "achievementContent" && _id == $mainId][0], *[_type == "achievementContent"] | order(_updatedAt desc)[0]))`;
export const localizedProjectContentQuery = groq`select($language == "id" => coalesce(*[_type == "projectContent" && _id == $languageId][0], *[_type == "projectContent" && _id == $mainId][0], *[_type == "projectContent" && (!defined(language) || language == "id")] | order(_updatedAt desc)[0]), coalesce(*[_type == "projectContent" && _id == $languageId][0], *[_type == "projectContent" && language == "en"] | order(_updatedAt desc)[0], *[_type == "projectContent" && _id == $mainId][0], *[_type == "projectContent"] | order(_updatedAt desc)[0]))`;
export const localizedPersonalProjectContentQuery = groq`select($language == "id" => coalesce(*[_type == "personalProjectContent" && _id == $languageId][0], *[_type == "personalProjectContent" && _id == $mainId][0], *[_type == "personalProjectContent" && (!defined(language) || language == "id")] | order(_updatedAt desc)[0]), coalesce(*[_type == "personalProjectContent" && _id == $languageId][0], *[_type == "personalProjectContent" && language == "en"] | order(_updatedAt desc)[0], *[_type == "personalProjectContent" && _id == $mainId][0], *[_type == "personalProjectContent"] | order(_updatedAt desc)[0]))`;
export const localizedContactContentQuery = groq`select($language == "id" => coalesce(*[_type == "contactContent" && _id == $languageId][0], *[_type == "contactContent" && _id == $mainId][0], *[_type == "contactContent" && (!defined(language) || language == "id")] | order(_updatedAt desc)[0]), coalesce(*[_type == "contactContent" && _id == $languageId][0], *[_type == "contactContent" && language == "en"] | order(_updatedAt desc)[0], *[_type == "contactContent" && _id == $mainId][0], *[_type == "contactContent"] | order(_updatedAt desc)[0]))`;

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
