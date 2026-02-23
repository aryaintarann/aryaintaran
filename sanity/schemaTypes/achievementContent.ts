import { defineField, defineType } from "sanity";

export const achievementContent = defineType({
  name: "achievementContent",
  title: "Achievement Content",
  type: "document",
  fields: [
    defineField({ name: "achievementTitle", title: "Achievement Title", type: "string" }),
    defineField({ name: "achievementEmpty", title: "Achievement Empty Text", type: "string" }),
  ],
});
