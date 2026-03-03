import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Arya Intaran — Full Stack Developer Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#050505",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "#CEF441",
            display: "flex",
          }}
        />

        {/* Badge */}
        <div
          style={{
            background: "#CEF441",
            color: "#050505",
            fontSize: 14,
            fontWeight: 900,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "8px 20px",
            borderRadius: 8,
            marginBottom: 32,
            display: "flex",
          }}
        >
          Portfolio
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            marginBottom: 24,
            display: "flex",
          }}
        >
          ARYA INTARAN
        </div>

        {/* Role */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: "#888888",
            display: "flex",
          }}
        >
          Full Stack Developer &amp; IT Support
        </div>

        {/* Bottom right URL */}
        <div
          style={{
            position: "absolute",
            bottom: 72,
            right: 72,
            fontSize: 18,
            color: "#444444",
            display: "flex",
          }}
        >
          aryaintaran.com
        </div>
      </div>
    ),
    { ...size }
  );
}
