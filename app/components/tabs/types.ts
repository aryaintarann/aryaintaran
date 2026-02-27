type RichTextChild = {
    text?: string;
};

type RichTextBlock = {
    children?: RichTextChild[];
};

export type GenericImage = Record<string, unknown> | string | null;

export interface HomeProfileData {
    _id?: string;
    fullName?: string;
    summary?: string;
    hardSkills?: string[];
    softSkills?: string[];
}

export interface AboutProfileData {
    _id?: string;
    aboutMe?: string;
}

export interface SidebarProfileData {
    _id?: string;
    profileImage?: GenericImage;
    headline?: string;
}

export interface ProfileData {
    fullName?: string;
    name?: string;
    headline?: string;
    summary?: string;
    hardSkills?: string[];
    softSkills?: string[];
    shortBio?: string;
    fullBio?: string | RichTextBlock[];
    email?: string;
    location?: string;
    profileImage?: GenericImage;
    skills?: string[];
}

export interface EducationData {
    _id: string;
    schoolName?: string;
    degree?: string;
    fieldOfStudy?: string;
    logo?: GenericImage;
    startDate?: string;
    endDate?: string;
    description?: string | RichTextBlock[];
    organizationExperience?: string[];
    achievements?: string[];
}

export interface JobData {
    _id: string;
    name?: string;
    jobTitle?: string;
    logo?: GenericImage;
    url?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

export interface ProjectData {
    _id: string;
    _createdAt?: string;
    title?: string;
    shortDescription?: string;
    description?: string | RichTextBlock[];
    image?: GenericImage;
    logo?: GenericImage;
    link?: string;
    githubLink?: string;
    tags?: string[];
    slug?: {
        current?: string;
    };
}

export interface ContactData {
    email?: string;
    whatsapp?: string;
    linkedin?: string;
    instagram?: string;
    tiktok?: string;
    github?: string;
}

export interface GithubData {
    profileUrl?: string;
    username?: string;
    description?: string;
    contributionsTitle?: string;
    repositoriesTitle?: string;
    githubContributionsTitle?: string;
    githubRepositoriesTitle?: string;
    showContributions?: boolean;
    showRepositories?: boolean;
    repositoriesLimit?: number;
}

export interface TranslationText {
    homeTitle: string;
    hardSkillsTitle: string;
    softSkillsTitle: string;
    hardSkillsEmpty: string;
    softSkillsEmpty: string;
    aboutTitle: string;
    educationTitle: string;
    careerTitle: string;
    careerEmpty: string;
    educationDetailLabel: string;
    hideDetailLabel: string;
    careerWorkedOnTitle: string;
    careerNoWorkedOn: string;
    organizationExperienceTitle: string;
    whatILearnedTitle: string;
    achievementsTitle: string;
    noOrganizationExperience: string;
    noLearnedItems: string;
    noAchievements: string;
    achievementTitle: string;
    achievementEmpty: string;
    projectTitle: string;
    projectEmpty: string;
    personalProjectTitle: string;
    personalProjectEmpty: string;
    githubTitle: string;
    githubContributionsTitle: string;
    githubRepositoriesTitle: string;
    githubFailed: string;
    githubNoProfile: string;
    githubNoRepositories: string;
    githubEmpty: string;
    contactTitle: string;
    openProject: string;
    openRepo: string;
    sendEmail: string;
}
