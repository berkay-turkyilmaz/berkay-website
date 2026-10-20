import { streamText } from "ai";
import { NextRequest } from "next/server";
import { buildBexSystemPrompt } from "@/lib/agents/prompts/bex-chat";
import { resolveLanguageModel } from "@/lib/ai/provider-registry";
import { normalizeBexLanguage } from "@/lib/ai/bex-language";
import { createPlainTextStreamResponse, type StreamErrorBox } from "@/lib/ai/text-stream-response";
import { chatPostBodySchema } from "@/app/api/chat/schema";
import { getApiError } from "@/lib/api/error-messages";
import { checkRateLimit, RULES } from "@/lib/api/rate-limit";
import { getClientIp, getRequestLang } from "@/lib/api/request";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const lang = getRequestLang(req);
  if (!checkRateLimit(getClientIp(req), RULES.chat)) {
    return Response.json({ error: getApiError(lang, "rate_limited") }, { status: 429 });
  }
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
        { error: getApiError(lang, "api_error") },
        { status: 503 }
      );
    }

    const resolvedMode = mode === "terminal" ? "engineer" : mode;

    const systemPrompt = buildBexSystemPrompt(
      resolvedMode,
      responseLength,
      normalizeBexLanguage(language)
    );

    const errorBox: StreamErrorBox = { error: null };
    const result = streamText({
      onError: ({ error }) => {
        errorBox.error = error;
      },
      model: resolveLanguageModel(provider, model),
      system: systemPrompt,
      messages,
      temperature,
      maxOutputTokens: 2_048,
    });

    return createPlainTextStreamResponse(result.textStream, { logLabel: "BEX", errorBox });
  } catch (error) {
    console.error("[BEX General API Error]:", error);
    return new Response(
      JSON.stringify({ error: getApiError(lang, "internal") }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
