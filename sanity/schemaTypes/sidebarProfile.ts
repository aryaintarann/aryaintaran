import { defineField, defineType } from "sanity";

export const sidebarProfile = defineType({
  name: "sidebarProfile",
  title: "Sidebar Profile",
  type: "document",
  fields: [
    defineField({ name: "profileImage", title: "Profile Photo", type: "image" }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
  ],
});
