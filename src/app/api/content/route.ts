import { NextResponse } from "next/server";
import { getContent } from "@/lib/content";

// Public read for ContentContext. Writes now go through the Payload admin at /admin.
export async function GET() {
  try {
    return NextResponse.json(await getContent());
  } catch {
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}
