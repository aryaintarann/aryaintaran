import { NextRequest } from "next/server";
import { createClient } from "next-sanity";

const rateLimitStore = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }
  return "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (rateLimitStore.get(ip) || []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitStore.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateLimitStore.set(ip, recent);
  return false;
}

function sanitize(value: string, max = 2000) {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    if (isRateLimited(ip)) {
      return Response.json(
        {
          error: "rate_limited",
          message: "Terlalu banyak permintaan. Coba lagi beberapa menit.",
        },
        { status: 429 }
      );
    }

    const payload = (await req.json()) as {
      name?: string;
      email?: string;
      message?: string;
      website?: string;
      language?: "id" | "en";
    };

    if ((payload.website || "").trim()) {
      return Response.json({ ok: true });
    }

    const name = sanitize(payload.name || "", 120);
    const email = sanitize(payload.email || "", 160);
    const message = sanitize(payload.message || "", 4000);
    const language = payload.language === "en" ? "en" : "id";

    if (!name || !email || !message) {
      return Response.json(
        {
          error: "invalid_payload",
          message: language === "en" ? "Please complete all fields." : "Lengkapi semua field.",
        },
        { status: 400 }
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return Response.json(
        {
          error: "invalid_email",
          message: language === "en" ? "Please use a valid email address." : "Gunakan alamat email yang valid.",
        },
        { status: 400 }
      );
    }

    const token = process.env.SANITY_API_WRITE_TOKEN;
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
    const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-02-12";

    if (token && projectId) {
      const writeClient = createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
        token,
      });

      await writeClient.create({
        _type: "contactSubmission",
        name,
        email,
        message,
        language,
        ip,
        userAgent: req.headers.get("user-agent") || "",
        createdAt: new Date().toISOString(),
      });
    } else {
      console.info("[contact] SANITY_API_WRITE_TOKEN missing, message accepted without persistence");
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      {
        error: "internal_error",
        message: "Gagal mengirim pesan. Silakan coba lagi.",
      },
      { status: 500 }
    );
  }
}
