import { defineField, defineType } from "sanity";

export const job = defineType({
  name: "job",
  title: "Job",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Company Name", type: "string" }),
    defineField({ name: "jobTitle", title: "Job Title", type: "string" }),
    defineField({ name: "logo", title: "Company Logo", type: "image" }),
    defineField({ name: "url", title: "Company Website", type: "url" }),
    defineField({ name: "description", title: "Job Description", type: "text" }),
    defineField({ name: "startDate", title: "Start Date", type: "date" }),
    defineField({ name: "endDate", title: "End Date", type: "date" }),
  ],
});
