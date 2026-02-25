import { defineField, defineType } from "sanity";

export const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({ name: "fullName", title: "Full Name", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "summary", title: "Home Summary", type: "text" }),
    defineField({ name: "hardSkills", title: "Hard Skills", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "softSkills", title: "Soft Skills", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "profileImage", title: "Profile Image", type: "image" }),
    defineField({ name: "shortBio", title: "Short Bio", type: "text" }),
    defineField({
      name: "fullBio",
      title: "Full Bio",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "Quote", value: "blockquote" },
            { title: "Justify", value: "justify" },
          ],
        },
      ],
    }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "skills", title: "Skills", type: "array", of: [{ type: "string" }] }),
  ],
});
