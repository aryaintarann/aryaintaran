import fs from "fs";
import path from "path";
import type { SiteContent } from "@/types/content";

const contentPath = path.join(process.cwd(), "src/data/content.json");

export function getContent(): SiteContent {
  const raw = fs.readFileSync(contentPath, "utf-8");
  return JSON.parse(raw) as SiteContent;
}

export function saveContent(data: SiteContent): void {
  fs.writeFileSync(contentPath, JSON.stringify(data, null, 2), "utf-8");
}
