import type { NextConfig } from "next";

// Dev tooling (React refresh) needs eval; the production bundle does not.
const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/devicons/**",
      },
      {
        protocol: "https",
        hostname: "dljamsxpzglukntosgxe.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Security headers applied to every response
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Legacy XSS auditor is exploitable and ignored by modern browsers — explicitly off (OWASP)
          { key: "X-XSS-Protection", value: "0" },
          // Limit referrer info sent to third parties
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disable browser features not used by this site
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=(), payment=()" },
          // HSTS — tell browsers to only use HTTPS for 1 year
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // shortcut: 'unsafe-inline' stays because Next's inline hydration scripts need a per-request
              // nonce, which forces every page dynamic; upgrade if static rendering stops mattering.
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com https://static.cloudflareinsights.com`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: https://dljamsxpzglukntosgxe.supabase.co https://cdn.jsdelivr.net",
              "connect-src 'self' https://dljamsxpzglukntosgxe.supabase.co https://challenges.cloudflare.com https://cloudflareinsights.com",
              "media-src 'self'",
              "frame-src 'self' https://challenges.cloudflare.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
      {
        // Prevent admin pages from being iframed anywhere
        source: "/admin(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
