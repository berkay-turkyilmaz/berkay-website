import { streamText } from "ai";
import { NextRequest } from "next/server";
import {
  buildBkReflectSystemPrompt,
  buildBkReflectUserMessage,
} from "@/lib/agents/prompts/bk-reflect";
import { resolveLanguageModel } from "@/lib/ai/provider-registry";
import { resolveModel } from "@/lib/ai/groq-status";
import { createPlainTextStreamResponse, type StreamErrorBox } from "@/lib/ai/text-stream-response";
import { bkReflectBodySchema } from "@/app/api/bk-reflect/schema";
import { getApiError } from "@/lib/api/error-messages";
import { checkRateLimit, RULES } from "@/lib/api/rate-limit";
import { getClientIp, getRequestLang } from "@/lib/api/request";

export const maxDuration = 45;

export async function POST(req: NextRequest) {
  if (!checkRateLimit(getClientIp(req), RULES.reflect)) {
    return Response.json(
      { error: getApiError(getRequestLang(req), "rate_limited") },
      { status: 429 }
    );
  }
  try {
    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return Response.json({ error: "Geçersiz istek" }, { status: 400 });
    }

    const parsed = bkReflectBodySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.flatten().formErrors[0] ?? "Geçersiz istek" },
        { status: 400 }
      );
    }

    const resolved = await resolveModel("llama-3.3-70b-versatile");
    if (!resolved.ok) {
      return Response.json({ error: "Yorumlama servisi şu an kullanılamıyor." }, { status: 503 });
    }

    const { reference, verseText, question } = parsed.data;

    const errorBox: StreamErrorBox = { error: null };
    const result = streamText({
      onError: ({ error }) => {
        errorBox.error = error;
      },
      model: resolveLanguageModel("groq", resolved.model),
      system: buildBkReflectSystemPrompt(),
      messages: [
        {
          role: "user",
          content: buildBkReflectUserMessage({ reference, verseText, question }),
        },
      ],
      temperature: 0.35,
      maxOutputTokens: 1_500,
    });

    return createPlainTextStreamResponse(result.textStream, { logLabel: "BK Reflect", errorBox });
  } catch (err) {
    console.error("[BK Reflect Route]:", err);
    return Response.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
