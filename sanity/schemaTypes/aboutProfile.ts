import { defineField, defineType } from "sanity";

export const aboutProfile = defineType({
  name: "aboutProfile",
  title: "About Profile",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: { list: [{ title: "Indonesian", value: "id" }, { title: "English", value: "en" }] },
    }),
    defineField({ name: "aboutMe", title: "Konten Tentang Saya", type: "text" }),
  ],
});
