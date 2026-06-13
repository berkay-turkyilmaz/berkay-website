import { createGroq } from "@ai-sdk/groq";
import type { LanguageModel } from "ai";

/**
 * Pluggable AI providers. Default path uses Groq (generous free tier).
 * Add HuggingFace, OpenAI-compatible, etc. here without rewriting the route handler.
 */
export type AiProviderId = "groq";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

export function resolveLanguageModel(
  provider: AiProviderId,
  modelId: string
): LanguageModel {
  switch (provider) {
    case "groq":
      return groq(modelId);
    default: {
      const _exhaustive: never = provider;
      return _exhaustive;
    }
  }
}
