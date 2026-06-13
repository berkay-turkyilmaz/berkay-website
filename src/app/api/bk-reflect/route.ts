import { streamText } from "ai";
import { NextRequest } from "next/server";
import {
  buildBkReflectSystemPrompt,
  buildBkReflectUserMessage,
} from "@/lib/agents/prompts/bk-reflect";
import { resolveLanguageModel } from "@/lib/ai/provider-registry";
import { createPlainTextStreamResponse } from "@/lib/ai/text-stream-response";
import { bkReflectBodySchema } from "@/app/api/bk-reflect/schema";

export const maxDuration = 45;

export async function POST(req: NextRequest) {
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

    if (!process.env.GROQ_API_KEY?.trim()) {
      return Response.json(
        { error: "Yorumlama servisi şu an kullanılamıyor." },
        { status: 503 }
      );
    }

    const { reference, verseText, question } = parsed.data;

    const result = streamText({
      model: resolveLanguageModel("groq", "llama-3.3-70b-versatile"),
      system: buildBkReflectSystemPrompt(),
      messages: [
        {
          role: "user",
          content: buildBkReflectUserMessage({ reference, verseText, question }),
        },
      ],
      temperature: 0.35,
    });

    return createPlainTextStreamResponse(result.textStream, {
      logLabel: "BK Reflect",
    });
  } catch (err) {
    console.error("[BK Reflect Route]:", err);
    return Response.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
