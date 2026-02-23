import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({ name: "image", title: "Image", type: "image" }),
    defineField({ name: "shortDescription", title: "Short Description", type: "text" }),
    defineField({
      name: "description",
      title: "Description",
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
    defineField({ name: "link", title: "Live Project URL", type: "url" }),
    defineField({ name: "githubLink", title: "GitHub URL", type: "url" }),
    defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }] }),
  ],
});
