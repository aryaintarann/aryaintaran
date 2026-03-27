import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isValidAdminToken, checkRateLimit } from "@/lib/apiSecurity";

// Field limits
const MAX_NAME = 100;
const MAX_EMAIL = 254; // RFC 5321 maximum
const MAX_MESSAGE = 5000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST — public, submit contact form
export async function POST(req: NextRequest) {
  // Rate limit: 3 submissions per IP per 10 minutes
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim()
    ?? req.headers.get("x-real-ip")
    ?? "unknown";

  const rateLimit = checkRateLimit(`contact:${ip}`, 3, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait before trying again." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { name, email, message, website, turnstileToken } = body as Record<string, unknown>;

  // Honeypot check — bots fill hidden `website` field; discard silently
  if (typeof website === "string" && website.length > 0) {
    return NextResponse.json({ success: true });
  }

  // Turnstile CAPTCHA verification
  if (!turnstileToken || typeof turnstileToken !== "string") {
    return NextResponse.json({ error: "CAPTCHA verification required" }, { status: 400 });
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (secretKey) {
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: secretKey,
          response: turnstileToken,
        }),
      }
    );
    const verifyData = await verifyRes.json() as { success: boolean };
    if (!verifyData.success) {
      return NextResponse.json({ error: "CAPTCHA verification failed" }, { status: 400 });
    }
  }

  // Type checks
  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  // Presence checks
  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  // Length limits
  if (trimmedName.length > MAX_NAME) {
    return NextResponse.json({ error: `Name must be ${MAX_NAME} characters or less` }, { status: 400 });
  }
  if (trimmedEmail.length > MAX_EMAIL) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }
  if (trimmedMessage.length > MAX_MESSAGE) {
    return NextResponse.json({ error: `Message must be ${MAX_MESSAGE} characters or less` }, { status: 400 });
  }

  // Email format validation
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("messages")
    .insert({ name: trimmedName, email: trimmedEmail, message: trimmedMessage });

  if (error) {
    // Never expose internal DB error details
    console.error("[messages/POST] Supabase error:", error.message);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// GET — admin only, fetch all messages
export async function GET(req: NextRequest) {
  if (!isValidAdminToken(req.headers.get("x-admin-token"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[messages/GET] Supabase error:", error.message);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PATCH — admin only, mark as read/unread
export async function PATCH(req: NextRequest) {
  if (!isValidAdminToken(req.headers.get("x-admin-token"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { id, read } = body as Record<string, unknown>;
  if (typeof id !== "string" || !id || typeof read !== "boolean") {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("messages")
    .update({ read })
    .eq("id", id);

  if (error) {
    console.error("[messages/PATCH] Supabase error:", error.message);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE — admin only
export async function DELETE(req: NextRequest) {
  if (!isValidAdminToken(req.headers.get("x-admin-token"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { id } = body as Record<string, unknown>;
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("messages")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[messages/DELETE] Supabase error:", error.message);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
