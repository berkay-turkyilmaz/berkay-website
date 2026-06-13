import { streamText } from "ai";
import { NextRequest } from "next/server";
import { buildBexSystemPrompt, type BexLanguage } from "@/lib/agents/prompts/bex-chat";
import { resolveLanguageModel } from "@/lib/ai/provider-registry";
import { chatPostBodySchema } from "@/app/api/chat/schema";

export const maxDuration = 30;

function normalizeBexLanguage(
  language: "tr" | "en" | "de" | "auto"
): BexLanguage {
  if (language === "auto") return "en";
  return language;
}

export async function POST(req: NextRequest) {
  try {
    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return Response.json({ error: "Geçersiz JSON gövdesi" }, { status: 400 });
    }

    const parsed = chatPostBodySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json(
        {
          error: "Geçersiz istek",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      messages,
      mode,
      model,
      responseLength,
      temperature,
      language,
      provider,
    } = parsed.data;

    if (!process.env.GROQ_API_KEY?.trim()) {
      return Response.json(
        { error: "GROQ_API_KEY is not configured on the server." },
        { status: 503 }
      );
    }

    const systemPrompt = buildBexSystemPrompt(
      mode,
      responseLength,
      normalizeBexLanguage(language)
    );

    const result = streamText({
      model: resolveLanguageModel(provider, model),
      system: systemPrompt,
      messages,
      temperature,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.textStream) {
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (err) {
          console.error("[BEX Stream Error]:", err);
          const errMsg =
            err instanceof Error ? err.message : "Bilinmeyen model hatası";
          controller.enqueue(encoder.encode(`__ERR_EXTRACT__:${errMsg}`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    console.error("[BEX General API Error]:", error);
    return new Response(
      JSON.stringify({ error: "Sunucu içi bir hata oluştu" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
