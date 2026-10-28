import type { CollectionConfig } from "payload";
import { revalidateAfterChange, revalidateAfterDelete } from "@/hooks/revalidateContent";

export const Skills: CollectionConfig = {
  slug: "skills",
  orderable: true,
  admin: { useAsTitle: "name" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "icon", type: "text", admin: { description: "URL ikon. Kosongkan untuk ikon otomatis berdasarkan nama." } },
  ],
};
