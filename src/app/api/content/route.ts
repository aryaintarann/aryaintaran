import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content";
import { isValidAdminToken } from "@/lib/apiSecurity";
import type { SiteContent } from "@/types/content";

/** Basic structural check — reject obviously malformed payloads. */
function isValidContent(body: unknown): body is SiteContent {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.hero === "object" && b.hero !== null &&
    typeof b.about === "object" && b.about !== null &&
    typeof b.contact === "object" && b.contact !== null &&
    Array.isArray(b.skills) &&
    Array.isArray(b.projects)
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
  if (!isValidAdminToken(req.headers.get("x-admin-token"))) {
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
