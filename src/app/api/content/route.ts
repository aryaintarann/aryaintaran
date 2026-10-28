import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content";
import { isAdminRequest } from "@/lib/adminSession";
import type { SiteContent } from "@/types/content";

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === "string";
const isStrArr = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr);

const isTimelineItem = (v: unknown) =>
  isObj(v) && isStr(v.title) && isStr(v.year) && isStr(v.summary) &&
  isStrArr(v.details) && typeof v.active === "boolean";

/** Structural check of every field the public pages read — a bad save would break the site. */
function isValidContent(body: unknown): body is SiteContent {
  if (!isObj(body)) return false;
  const { hero, about, contact, skills, projects } = body;
  return (
    isObj(hero) && isStr(hero.name) && isStr(hero.tagline) &&
    isObj(about) && isStr(about.bio) &&
    Array.isArray(about.education) && about.education.every((e) => isTimelineItem(e) && isStr((e as Record<string, unknown>).school)) &&
    Array.isArray(about.career) && about.career.every((c) => isTimelineItem(c) && isStr((c as Record<string, unknown>).company)) &&
    isObj(contact) && isStr(contact.email) && isStr(contact.location) && isStr(contact.phone) && isObj(contact.social) &&
    Array.isArray(skills) && skills.every((s) => isObj(s) && isStr(s.name) && isStr(s.icon)) &&
    Array.isArray(projects) && projects.every((p) =>
      isObj(p) && isStr(p.index) && isStr(p.title) && isStr(p.slug) && /^[a-z0-9-]+$/i.test(p.slug) &&
      isStr(p.description) && isStr(p.longDescription) && isStr(p.type) &&
      isStrArr(p.images) && isStrArr(p.stack) && isStr(p.link)
    )
  );
}

export async function GET() {
  try {
    const content = await getContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!isValidContent(body)) {
    return NextResponse.json({ error: "Invalid content structure" }, { status: 400 });
  }

  try {
    await saveContent(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
