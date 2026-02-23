import { defineField, defineType } from "sanity";

export const projectContent = defineType({
  name: "projectContent",
  title: "Project Content",
  type: "document",
  fields: [
    defineField({ name: "projectTitle", title: "Project Title", type: "string" }),
    defineField({ name: "projectEmpty", title: "Project Empty Text", type: "string" }),
  ],
});
