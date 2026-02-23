import { client } from "@/sanity/lib/client";
import { profileQuery, educationQuery, jobQuery, projectQuery, contactQuery } from "@/sanity/lib/queries";
import PortfolioSidebarLayout from "./components/PortfolioSidebarLayout";

// Revalidate data always (dynamic)
export const revalidate = 0;

export default async function Home() {
  const profile = await client.fetch(profileQuery);
  const education = await client.fetch(educationQuery);
  const jobs = await client.fetch(jobQuery);
  const projects = await client.fetch(projectQuery);
  const contact = await client.fetch(contactQuery);

  return (
    <PortfolioSidebarLayout
      profile={profile}
      education={education}
      jobs={jobs}
      projects={projects}
      contact={contact}
    />
  );
}
