import { defineField, defineType } from "sanity";

export const homeProfile = defineType({
  name: "homeProfile",
  title: "Home Profile Data",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: { list: [{ title: "Indonesian", value: "id" }, { title: "English", value: "en" }] },
    }),
    defineField({ name: "fullName", title: "Full Name", type: "string" }),
    defineField({ name: "summary", title: "Home Summary", type: "text" }),
    defineField({ name: "hardSkills", title: "Hard Skills", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "softSkills", title: "Soft Skills", type: "array", of: [{ type: "string" }] }),
  ],
});
