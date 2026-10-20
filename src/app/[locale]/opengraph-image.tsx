import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const alt = "Berkay Türkyılmaz — Frontend Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#F6F2EA";
const INK = "#1B1915";
const MUTED = "#6B625A";
const ACCENT = "#BA3F12";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: PAPER,
          color: INK,
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", fontSize: 34 }}>
          <span>Berkay Türkyılmaz</span>
          <span style={{ color: ACCENT }}>.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 84,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              maxWidth: 980,
            }}
          >
            {t("og_image_headline")}
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 28,
              color: MUTED,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {t("og_image_tagline")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            height: 6,
            width: 120,
            background: ACCENT,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
