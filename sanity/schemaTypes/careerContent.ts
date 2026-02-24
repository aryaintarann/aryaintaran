import { defineField, defineType } from "sanity";

export const careerContent = defineType({
  name: "careerContent",
  title: "Career Content",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: { list: [{ title: "Indonesian", value: "id" }, { title: "English", value: "en" }] },
    }),
    defineField({ name: "careerTitle", title: "Career Title", type: "string" }),
    defineField({ name: "careerEmpty", title: "Career Empty Text", type: "string" }),
    defineField({ name: "hideDetailLabel", title: "Hide Detail Label", type: "string" }),
    defineField({ name: "careerWorkedOnTitle", title: "Worked On Title", type: "string" }),
    defineField({ name: "careerNoWorkedOn", title: "No Work Items Text", type: "string" }),
  ],
});
