import { streamText } from "ai";
import { NextRequest } from "next/server";
import { buildBexSystemPrompt } from "@/lib/agents/prompts/bex-chat";
import { resolveLanguageModel } from "@/lib/ai/provider-registry";
import { normalizeBexLanguage } from "@/lib/ai/bex-language";
import { createPlainTextStreamResponse } from "@/lib/ai/text-stream-response";
import { chatPostBodySchema } from "@/app/api/chat/schema";
import { getApiError } from "@/lib/api/error-messages";

export const maxDuration = 60;

function getLang(req: NextRequest): string {
  const accept = req.headers.get("accept-language") ?? "";
  return accept.startsWith("tr") ? "tr" : "en";
}

export async function POST(req: NextRequest) {
  const lang = getLang(req);
  try {
    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return Response.json({ error: getApiError(lang, "invalid_json") }, { status: 400 });
    }

    const parsed = chatPostBodySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json(
        {
          error: getApiError(lang, "invalid_request"),
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

    const resolvedMode = mode === "terminal" ? "engineer" : mode;

    const systemPrompt = buildBexSystemPrompt(
      resolvedMode,
      responseLength,
      normalizeBexLanguage(language)
    );

    const result = streamText({
      model: resolveLanguageModel(provider, model),
      system: systemPrompt,
      messages,
      temperature,
    });

    return createPlainTextStreamResponse(result.textStream, {
      logLabel: "BEX",
    });
  } catch (error) {
    console.error("[BEX General API Error]:", error);
    return new Response(
      JSON.stringify({ error: getApiError(lang, "internal") }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
