import { defineField, defineType } from "sanity";

export const aboutProfile = defineType({
  name: "aboutProfile",
  title: "About Profile",
  type: "document",
  fields: [
    defineField({ name: "aboutMe", title: "Konten Tentang Saya", type: "text" }),
  ],
});
