import type { CollectionConfig } from "payload";
import { revalidateAfterChange, revalidateAfterDelete } from "@/hooks/revalidateContent";

export const Projects: CollectionConfig = {
  slug: "projects",
  orderable: true,
  admin: { useAsTitle: "title", defaultColumns: ["title", "type", "slug", "_status"] },
  versions: { drafts: true, maxPerDoc: 20 },
  // Visitors only ever see published projects; drafts are for the logged-in admin.
  access: { read: ({ req }) => (req.user ? true : { _status: { equals: "published" } }) },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      validate: (v: unknown) => (typeof v === "string" && /^[a-z0-9-]+$/i.test(v)) || "Hanya huruf, angka, dan tanda hubung",
    },
    { name: "type", type: "select", required: true, defaultValue: "personal", options: ["personal", "freelance", "work"] },
    { name: "description", type: "textarea", required: true },
    { name: "longDescription", type: "textarea", required: true },
    { name: "images", type: "upload", relationTo: "media", hasMany: true },
    { name: "stack", type: "array", fields: [{ name: "name", type: "text", required: true }] },
    { name: "link", type: "text", required: true },
    { name: "github", type: "text" },
  ],
};
