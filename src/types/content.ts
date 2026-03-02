export interface EducationItem {
  title: string;
  school: string;
  year: string;
  summary: string;
  details: string[];
  active: boolean;
}

export interface CareerItem {
  title: string;
  company: string;
  year: string;
  summary: string;
  details: string[];
  active: boolean;
}

export interface SkillItem {
  name: string;
  icon: string;
}

export type ProjectType = "personal" | "freelance" | "work";

export interface ProjectItem {
  index: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  type: ProjectType;
  images: string[];
  stack: string[];
  link: string;
  github?: string;
}

export interface SocialLinks {
  instagram: string;
  tiktok: string;
  github: string;
  linkedin: string;
}

export interface SiteContent {
  hero: {
    name: string;
    tagline: string;
  };
  about: {
    bio1: string;
    bio2: string;
    education: EducationItem[];
    career: CareerItem[];
  };
  skills: SkillItem[];
  projects: ProjectItem[];
  contact: {
    email: string;
    location: string;
    phone: string;
    social: SocialLinks;
  };
}
