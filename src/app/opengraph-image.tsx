import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Goke — AI-Powered Career Advancement";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#2a5144",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 24,
            letterSpacing: "-1px",
          }}
        >
          Goke
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.2,
            maxWidth: 800,
            marginBottom: 24,
          }}
        >
          Stop Guessing. Start Moving Forward in Your Career.
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.8)",
            maxWidth: 700,
            lineHeight: 1.5,
            marginBottom: 40,
          }}
        >
          AI-powered career analysis, resume optimization, and personalized career planning.
        </div>

        {/* CTA pill */}
        <div
          style={{
            background: "#487f6a",
            color: "#ffffff",
            fontSize: 20,
            fontWeight: 600,
            padding: "14px 32px",
            borderRadius: 100,
          }}
        >
          Free to get started — goke.io
        </div>
      </div>
    ),
    { ...size }
  );
}
