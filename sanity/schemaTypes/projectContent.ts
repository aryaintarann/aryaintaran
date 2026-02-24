import { defineField, defineType } from "sanity";

export const projectContent = defineType({
  name: "projectContent",
  title: "Project Content",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: { list: [{ title: "Indonesian", value: "id" }, { title: "English", value: "en" }] },
    }),
    defineField({ name: "projectTitle", title: "Project Title", type: "string" }),
    defineField({ name: "projectEmpty", title: "Project Empty Text", type: "string" }),
  ],
});
