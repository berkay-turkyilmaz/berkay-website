import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeContextText } from "@/lib/ai/context-analyzer";

export const maxDuration = 30;

const bodySchema = z.object({
  text: z.string().min(1, "Metin boş olamaz").max(200_000, "Metin çok uzun"),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz istek", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = analyzeContextText(parsed.data.text);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Sunucu içi bir hata oluştu" }, { status: 500 });
  }
}
