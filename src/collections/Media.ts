import type { CollectionConfig } from "payload";
import { revalidateAfterChange, revalidateAfterDelete } from "@/hooks/revalidateContent";

export const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  upload: { mimeTypes: ["image/*"] },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [{ name: "alt", type: "text" }],
};
