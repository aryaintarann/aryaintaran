import { timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

/** Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`; fails closed when CRON_SECRET is unset. */
export function isValidCronAuth(authHeader: string | null | undefined): boolean {
  const secret = process.env.CRON_SECRET;
  return safeEqual(authHeader, secret ? `Bearer ${secret}` : undefined);
}

/**
 * Timing-safe string comparison.
 * Prevents timing attacks where attacker can measure response time
 * to guess characters of the secret one by one.
 */
function safeEqual(provided: string | null | undefined, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  try {
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    // buffers must be same length for timingSafeEqual
    if (a.length !== b.length) {
      // Still run a comparison to avoid length-based timing leak
      timingSafeEqual(b, b);
      return false;
    }
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Rate limiter shared across all serverless instances through the `check_rate_limit`
 * Postgres function (supabase/migrations/create_rate_limits.sql).
 * shortcut: falls back to a per-instance in-memory counter while that migration is not applied
 * or Supabase is unreachable; upgrade by running the migration.
 */
export async function checkRateLimit(
  key: string,
  maxAttempts = 10,
  windowMs = 15 * 60 * 1000 // 15 minutes
): Promise<RateLimitResult> {
  try {
    const { data, error } = await supabaseAdmin.rpc("check_rate_limit", {
      p_key: key,
      p_max: maxAttempts,
      p_window_seconds: Math.ceil(windowMs / 1000),
    });
    const row = Array.isArray(data) ? data[0] : null;
    if (!error && row) {
      return { allowed: row.allowed, remaining: row.remaining, resetAt: new Date(row.reset_at).getTime() };
    }
  } catch {
    // fall through to the in-memory limiter
  }
  return checkMemoryRateLimit(key, maxAttempts, windowMs);
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

function checkMemoryRateLimit(key: string, maxAttempts: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxAttempts - 1, resetAt };
  }

  if (entry.count >= maxAttempts) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: maxAttempts - entry.count, resetAt: entry.resetAt };
}

/**
 * Sanitize a path segment — strips traversal sequences and
 * allows only alphanumeric, hyphens, and underscores.
 */
export function sanitizePathSegment(input: string): string {
  return input
    .replace(/\.\./g, "")       // strip traversal
    .replace(/[/\\]/g, "")      // strip slashes
    .replace(/[^a-zA-Z0-9\-_]/g, "-") // allow only safe chars
    .replace(/-{2,}/g, "-")     // collapse multiple dashes
    .slice(0, 80)               // max length
    .replace(/^-|-$/g, "");     // trim leading/trailing dashes
}

/** Map a MIME type to a safe file extension (whitelist). */
export function safeExtFromMime(mimeType: string): string | null {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return map[mimeType] ?? null;
}
