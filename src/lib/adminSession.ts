import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE = "admin_session";
export const SESSION_TTL_S = 8 * 60 * 60;

/** HMAC keyed by ADMIN_TOKEN, which therefore never leaves the server. Null when unset (fail closed). */
function sign(exp: string): string | null {
  const key = process.env.ADMIN_TOKEN;
  return key ? createHmac("sha256", key).update(`admin-session.${exp}`).digest("base64url") : null;
}

export function createSessionValue(nowMs = Date.now()): string | null {
  const exp = String(Math.floor(nowMs / 1000) + SESSION_TTL_S);
  const sig = sign(exp);
  return sig ? `${exp}.${sig}` : null;
}

export function verifySessionValue(value: string | undefined, nowMs = Date.now()): boolean {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 2) return false;
  const [exp, sig] = parts;
  if (!/^\d+$/.test(exp) || Number(exp) <= nowMs / 1000) return false;
  const expected = sign(exp);
  if (!expected) return false;
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

export function isAdminRequest(req: NextRequest): boolean {
  if (!verifySessionValue(req.cookies.get(SESSION_COOKIE)?.value)) return false;
  // Defence in depth on top of SameSite=Strict: refuse cross-origin state-changing requests.
  if (req.method !== "GET" && req.method !== "HEAD") {
    const origin = req.headers.get("origin");
    if (origin) {
      try {
        if (new URL(origin).host !== req.headers.get("host")) return false;
      } catch {
        return false;
      }
    }
  }
  return true;
}
