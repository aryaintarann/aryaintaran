import { defineField, defineType } from "sanity";

export const contactContent = defineType({
  name: "contactContent",
  title: "Contact Content",
  type: "document",
  fields: [
    defineField({ name: "contactTitle", title: "Contact Title", type: "string" }),
    defineField({ name: "sendEmail", title: "Send Email Button Label", type: "string" }),
  ],
});
