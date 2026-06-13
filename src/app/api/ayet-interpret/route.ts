import { streamText } from "ai";
import { NextRequest } from "next/server";
import {
  buildAyetInterpretSystemPrompt,
  buildAyetUserMessage,
} from "@/lib/agents/prompts/ayet-interpret";
import { resolveLanguageModel } from "@/lib/ai/provider-registry";
import { ayetInterpretBodySchema } from "@/app/api/ayet-interpret/schema";

export const maxDuration = 45;

export async function POST(req: NextRequest) {
  try {
    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return Response.json({ error: "Geçersiz istek" }, { status: 400 });
    }

    const parsed = ayetInterpretBodySchema.safeParse(json);
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
      system: buildAyetInterpretSystemPrompt(),
      messages: [
        {
          role: "user",
          content: buildAyetUserMessage({ reference, verseText, question }),
        },
      ],
      temperature: 0.35,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.textStream) {
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (err) {
          console.error("[Ayet Interpret Error]:", err);
          const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
          controller.enqueue(encoder.encode(`\n\n*Yorumlama sırasında bir hata oluştu: ${msg}*`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[Ayet Interpret Route]:", err);
    return Response.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
