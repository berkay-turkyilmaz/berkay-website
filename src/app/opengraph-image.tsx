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
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.35em",
            color: "#14b8a6",
            marginBottom: 24,
          }}
        >
          BERKAY
        </div>
        <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.1, maxWidth: 900 }}>
          Software Engineer & AI Architect
        </div>
        <div style={{ fontSize: 28, color: "#a1a1aa", marginTop: 28, maxWidth: 800 }}>
          Next.js · Supabase · n8n · Groq LLM
        </div>
      </div>
    ),
    { ...size }
  );
}
