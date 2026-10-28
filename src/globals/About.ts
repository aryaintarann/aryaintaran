import type { Field, GlobalConfig } from "payload";
import { revalidateAfterChange } from "@/hooks/revalidateContent";

const timeline = (name: "education" | "career", org: "school" | "company"): Field => ({
  name,
  type: "array",
  fields: [
    { name: "title", type: "text", required: true },
    { name: org, type: "text", required: true },
    { name: "year", type: "text", required: true },
    { name: "summary", type: "textarea" },
    { name: "details", type: "array", fields: [{ name: "text", type: "text", required: true }] },
    { name: "active", type: "checkbox", defaultValue: true },
  ],
});

export const About: GlobalConfig = {
  slug: "about",
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange] },
  fields: [{ name: "bio", type: "richText", required: true }, timeline("education", "school"), timeline("career", "company")],
};
