/** Groq chat model ids allowed for BEX (aligned with AI Lab workspace UI). */

export const GROQ_CHAT_MODEL_IDS = [

  "llama-3.1-8b-instant",

  "llama-3.3-70b-versatile",

] as const;



export type GroqChatModelId = (typeof GROQ_CHAT_MODEL_IDS)[number];



export function isGroqChatModelId(id: string): id is GroqChatModelId {

  return (GROQ_CHAT_MODEL_IDS as readonly string[]).includes(id);

}

