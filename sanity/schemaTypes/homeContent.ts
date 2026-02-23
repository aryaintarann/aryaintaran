import { defineField, defineType } from "sanity";

export const homeContent = defineType({
  name: "homeContent",
  title: "Home Content",
  type: "document",
  fields: [
    defineField({ name: "homeTitle", title: "Home Title", type: "string" }),
    defineField({ name: "hardSkillsTitle", title: "Hard Skills Title", type: "string" }),
    defineField({ name: "softSkillsTitle", title: "Soft Skills Title", type: "string" }),
    defineField({ name: "hardSkillsEmpty", title: "Hard Skills Empty Text", type: "string" }),
    defineField({ name: "softSkillsEmpty", title: "Soft Skills Empty Text", type: "string" }),
  ],
});
