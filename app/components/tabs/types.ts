import type { TypedObject } from "sanity";

export interface ProfileData {
    fullName?: string;
    name?: string;
    headline?: string;
    shortBio?: string;
    fullBio?: TypedObject | TypedObject[];
    email?: string;
    location?: string;
    profileImage?: Record<string, unknown>;
    skills?: string[];
}

export interface EducationData {
    _id: string;
    schoolName?: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    description?: TypedObject | TypedObject[];
    organizationExperience?: string[];
    achievements?: string[];
}

export interface JobData {
    _id: string;
    name?: string;
    jobTitle?: string;
    logo?: Record<string, unknown>;
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
    description?: string | TypedObject | TypedObject[];
    image?: Record<string, unknown>;
    logo?: Record<string, unknown>;
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
    githubLoading: string;
    githubFailed: string;
    githubNoProfile: string;
    githubNoRepositories: string;
    githubEmpty: string;
    contactTitle: string;
    openProject: string;
    openRepo: string;
    sendEmail: string;
}
