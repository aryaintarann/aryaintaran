import { client } from "@/sanity/lib/client";
import { profileQuery, educationQuery, jobQuery, projectQuery, contactQuery } from "@/sanity/lib/queries";
import Hero from "./components/Hero";
import Education from "./components/Education";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

// Revalidate data every 60 seconds
export const revalidate = 60;

export default async function Home() {
  const profile = await client.fetch(profileQuery);
  const education = await client.fetch(educationQuery);
  const jobs = await client.fetch(jobQuery);
  const projects = await client.fetch(projectQuery);
  const contact = await client.fetch(contactQuery);

  return (
    <div className="flex flex-col">
      <Hero profile={profile} education={education} jobs={jobs} projects={projects} />
      <Education education={education} />
      <Skills skills={profile?.skills || []} />
      <Experience jobs={jobs} />
      <Projects projects={projects} />
      <Contact email={profile?.email} contactData={contact} />
    </div>
  );
}
