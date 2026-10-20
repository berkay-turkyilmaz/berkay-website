import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeContextText } from "@/lib/ai/context-analyzer";
import { getApiError } from "@/lib/api/error-messages";
import { checkRateLimit, RULES } from "@/lib/api/rate-limit";
import { getClientIp, getRequestLang } from "@/lib/api/request";

export const maxDuration = 30;

const bodySchema = z.object({
  text: z.string().min(1, "Metin boş olamaz").max(200_000, "Metin çok uzun"),
});

export async function POST(req: NextRequest) {
  if (!checkRateLimit(getClientIp(req), RULES.analyze)) {
    return NextResponse.json(
      { error: getApiError(getRequestLang(req), "rate_limited") },
      { status: 429 }
    );
  }
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz istek" },
        { status: 400 }
      );
    }

    const result = analyzeContextText(parsed.data.text);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Sunucu içi bir hata oluştu" }, { status: 500 });
  }
}
