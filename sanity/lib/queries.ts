import { groq } from "next-sanity";

export const profileQuery = groq`
  *[_type == "profile"][0] {
    _id,
    fullName,
    headline,
    profileImage,
    heroImage,
    shortBio,
    email,
    location,
    fullBio,
    resume {
      asset-> {
        url
      }
    },
    portfolio {
      asset-> {
        url
      }
    },
    socialLinks,
    skills
  }
`;

export const educationQuery = groq`
  *[_type == "education"] | order(startDate desc) {
    _id,
    schoolName,
    degree,
    fieldOfStudy,
    startDate,
    endDate,
    description
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

export const contactQuery = groq`*[_type == "contact"][0]`;
