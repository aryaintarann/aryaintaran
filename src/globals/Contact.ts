import type { GlobalConfig } from "payload";
import { revalidateAfterChange } from "@/hooks/revalidateContent";

export const Contact: GlobalConfig = {
  slug: "contact",
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange] },
  fields: [
    { name: "email", type: "email", required: true },
    { name: "location", type: "text", required: true },
    { name: "phone", type: "text", required: true },
    {
      name: "social",
      type: "group",
      fields: ["instagram", "tiktok", "github", "linkedin"].map((name) => ({ name, type: "text" as const })),
    },
  ],
};
