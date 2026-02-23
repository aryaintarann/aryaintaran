import { defineField, defineType } from "sanity";

export const personalProjectContent = defineType({
  name: "personalProjectContent",
  title: "Personal Project Content",
  type: "document",
  fields: [
    defineField({ name: "personalProjectTitle", title: "Personal Project Title", type: "string" }),
    defineField({ name: "personalProjectEmpty", title: "Personal Project Empty Text", type: "string" }),
  ],
});
