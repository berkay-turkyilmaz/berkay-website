/**
 * Groq chat models, in order of preference. The list of models a key can actually use
 * is discovered at runtime (see groq-status.ts); this file only holds shared constants.
 */
export const GROQ_PREFERRED_MODELS = [
  "llama-3.3-70b-versatile",
  "openai/gpt-oss-20b",
  "llama-3.1-8b-instant",
  "openai/gpt-oss-120b",
] as const;

/** Model ids with a hand-written label in the UI. Anything else shows its raw id. */
export const GROQ_CHAT_MODEL_IDS = GROQ_PREFERRED_MODELS;

export type GroqChatModelId = string;

export const DEFAULT_GROQ_MODEL: GroqChatModelId = GROQ_PREFERRED_MODELS[0];

const NON_CHAT = /whisper|tts|orpheus|guard|safeguard|embed|moderation|playai|distil-whisper/i;

/** True for ids that look like text-chat models (audio, guard and embedding models excluded). */
export function isChatModelId(id: string): boolean {
  return /^[A-Za-z0-9._/:-]{2,120}$/.test(id) && !NON_CHAT.test(id);
}
