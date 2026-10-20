import { ImageResponse } from "next/og";
import { BrandGlyph } from "@/components/brand/brand-glyph";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<BrandGlyph size={32} radius={7} />, { ...size });
}
