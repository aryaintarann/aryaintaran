import { timingSafeEqual } from "crypto";

/**
 * Timing-safe token comparison.
 * Prevents timing attacks where attacker can measure response time
 * to guess characters of the secret token one by one.
 */
export function isValidAdminToken(provided: string | null | undefined): boolean {
  const expected = process.env.ADMIN_TOKEN;
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

/**
 * Simple in-memory rate limiter.
 * Resets after windowMs. Good enough for a personal portfolio admin.
 * Note: resets on server restart (Vercel cold starts = not persistent,
 * but still blocks bursts within a single function invocation window).
 */
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  key: string,
  maxAttempts = 10,
  windowMs = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; resetAt: number } {
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
