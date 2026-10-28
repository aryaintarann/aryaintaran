import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { checkRateLimit } from "@/lib/apiSecurity";
import {
  SESSION_COOKIE,
  SESSION_TTL_S,
  createSessionValue,
  isAdminRequest,
  sessionCookieOptions,
} from "@/lib/adminSession";

// Timing-safe password comparison
function isValidPassword(provided: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!provided || !expected) return false;
  try {
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length) {
      timingSafeEqual(b, b); // run anyway to prevent length-based timing leak
      return false;
    }
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// GET — is the caller's session cookie still valid?
export async function GET(req: NextRequest) {
  const authenticated = isAdminRequest(req);
  return NextResponse.json({ authenticated }, { status: authenticated ? 200 : 401 });
}

// POST — password login; sets an HttpOnly session cookie (the secret never reaches the browser)
export async function POST(req: NextRequest) {
  // Brute-force protection: max 5 attempts per IP per 15 minutes
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim()
    ?? req.headers.get("x-real-ip")
    ?? "unknown";

  const rateLimit = await checkRateLimit(`auth:${ip}`, 5, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { password } = (body ?? {}) as Record<string, unknown>;

  if (typeof password !== "string" || !password) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (isValidPassword(password)) {
    const session = createSessionValue();
    if (!session) {
      console.error("[auth] ADMIN_TOKEN is not set; cannot sign a session.");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }
    const res = NextResponse.json({ success: true });
    res.cookies.set(SESSION_COOKIE, session, sessionCookieOptions(SESSION_TTL_S));
    return res;
  }

  // Generic error message — never reveal if password vs token was wrong
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}

// DELETE — logout
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  return res;
}
