import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isValidAdminToken, sanitizePathSegment, safeExtFromMime } from "@/lib/apiSecurity";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const BUCKET = "project-images";
// Strict safelist for storage paths — only allow paths within the bucket
const SAFE_PATH_REGEX = /^[a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_.]+$/;

export async function POST(req: NextRequest) {
  if (!isValidAdminToken(req.headers.get("x-admin-token"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  // Derive extension from MIME type (whitelist) — NEVER from file.name to prevent bypass
  const ext = safeExtFromMime(file.type);
  if (!ext) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  // Sanitize slug to prevent path traversal
  const rawSlug = formData.get("slug") as string | null;
  const slug = sanitizePathSegment(rawSlug ?? "project") || "project";

  const timestamp = Date.now();
  const path = `${slug}/${timestamp}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, uint8Array, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("[upload/POST] Supabase error:", error.message);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl, path });
}

export async function DELETE(req: NextRequest) {
  if (!isValidAdminToken(req.headers.get("x-admin-token"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { path } = body as Record<string, unknown>;

  // Validate path — must be a safe relative storage path (no traversal)
  if (typeof path !== "string" || !path || !SAFE_PATH_REGEX.test(path)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    console.error("[upload/DELETE] Supabase error:", error.message);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
