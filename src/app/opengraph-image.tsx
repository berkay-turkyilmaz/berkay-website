import { ImageResponse } from "next/og";

export const alt = "BERKAY — Software Engineer & AI Architect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #0f172a 100%)",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#14b8a6",
            }}
          />
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "0.3em",
              color: "#14b8a6",
              textTransform: "uppercase",
            }}
          >
            BERKAY TÜRKYILMAZ
          </span>
        </div>

        {/* Main heading */}
        <div
          style={{
            fontSize: 62,
            fontWeight: 900,
            lineHeight: 1.1,
            maxWidth: 860,
            marginBottom: "24px",
          }}
        >
          Software Engineer &amp; AI Architect
        </div>

        {/* Description */}
        <div style={{ fontSize: 26, color: "#a1a1aa", maxWidth: 700, lineHeight: 1.5, marginBottom: "40px" }}>
          Next.js · Supabase · n8n · Groq LLM
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            padding: "16px 24px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {["Next.js 16", "TypeScript", "AI Systems", "7 Languages"].map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "16px",
                color: "#71717a",
                fontWeight: 600,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
