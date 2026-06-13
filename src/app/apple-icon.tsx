import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 28,
            background: "#18181b",
            border: "3px solid #3f3f46",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 68,
            fontWeight: 900,
            color: "#fafafa",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          B
        </div>
      </div>
    ),
    { ...size }
  );
}
