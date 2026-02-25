import { defineField, defineType } from "sanity";

export const contactSubmission = defineType({
  name: "contactSubmission",
  title: "Contact Submission",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "email", title: "Email", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "message", title: "Message", type: "text", validation: (rule) => rule.required() }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: { list: [{ title: "Indonesian", value: "id" }, { title: "English", value: "en" }] },
    }),
    defineField({ name: "ip", title: "IP", type: "string", readOnly: true }),
    defineField({ name: "userAgent", title: "User Agent", type: "text", readOnly: true }),
    defineField({ name: "createdAt", title: "Created At", type: "datetime", readOnly: true }),
  ],
  orderings: [
    {
      title: "Newest",
      name: "newest",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
});
