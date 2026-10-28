import type { GlobalConfig } from "payload";
import { revalidateAfterChange } from "@/hooks/revalidateContent";

export const Hero: GlobalConfig = {
  slug: "hero",
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange] },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "tagline", type: "text", required: true },
  ],
};
