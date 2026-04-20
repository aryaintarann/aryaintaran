import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aryaintaran.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/*?scrollTo="],
      },
      {
        userAgent: [
          "CCBot",
          "ChatGPT-User",
          "GPTBot",
          "Google-Extended",
          "Anthropic-ai",
          "PerplexityBot",
          "ClaudeBot",
          "Claude-Web",
          "Omgilibot",
          "Bytespider",
        ],
        allow: "/",
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
