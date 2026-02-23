import { defineField, defineType } from "sanity";

export const github = defineType({
  name: "github",
  title: "GitHub",
  type: "document",
  fields: [
    defineField({ name: "githubTitle", title: "GitHub Tab Title", type: "string" }),
    defineField({ name: "profileUrl", title: "GitHub Profile URL", type: "url" }),
    defineField({ name: "username", title: "GitHub Username", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "contributionsTitle", title: "Contributions Section Title", type: "string" }),
    defineField({ name: "repositoriesTitle", title: "Repositories Section Title", type: "string" }),
    defineField({
      name: "showContributions",
      title: "Show Contributions",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showRepositories",
      title: "Show Repositories",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "repositoriesLimit",
      title: "Repositories Limit",
      type: "number",
      initialValue: 12,
      validation: (rule) => rule.min(1).max(50),
    }),
  ],
});
