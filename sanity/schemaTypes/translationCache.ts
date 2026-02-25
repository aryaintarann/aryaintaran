import { defineField, defineType } from "sanity";

export const translationCache = defineType({
  name: "translationCache",
  title: "Translation Cache",
  type: "document",
  fields: [
    defineField({ name: "hash", title: "Hash", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "sourceText", title: "Source Text", type: "text" }),
    defineField({ name: "targetLang", title: "Target Language", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "translatedText", title: "Translated Text", type: "text", validation: (rule) => rule.required() }),
    defineField({ name: "provider", title: "Provider", type: "string" }),
    defineField({ name: "updatedAt", title: "Updated At", type: "datetime" }),
  ],
});
