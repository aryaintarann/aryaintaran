import { defineField, defineType } from "sanity";

export const aboutContent = defineType({
  name: "aboutContent",
  title: "About Content",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: { list: [{ title: "Indonesian", value: "id" }, { title: "English", value: "en" }] },
    }),
    defineField({ name: "aboutTitle", title: "About Title", type: "string" }),
    defineField({ name: "educationTitle", title: "Education Title", type: "string" }),
    defineField({ name: "educationDetailLabel", title: "Education Detail Label", type: "string" }),
  ],
});
