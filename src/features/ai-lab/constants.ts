import type { GroqChatModelId } from "@/lib/ai/groq-models";

import type { ChatMode, WorkspaceSettings } from "./types";



/** Display name for the AI agent across Ai Lab UI (single source of truth). */

export const AI_AGENT_NAME = "BEX";



export const DEFAULT_SETTINGS: WorkspaceSettings = {

  model: "llama-3.1-8b-instant",

  responseLength: "medium",

  theme: "system",

  language: "auto",

  temperature: 0.7,

  displayName: "",

};



/** Model list — labels/descriptions resolved via AiLabPage.settings.models i18n keys. */

export const MODEL_OPTIONS: {

  value: GroqChatModelId;

  labelKey: string;

  descKey: string;

  speedKey: string;

}[] = [

  {

    value: "llama-3.1-8b-instant",

    labelKey: "models.llama_8b_label",

    descKey: "models.llama_8b_desc",

    speedKey: "models.llama_8b_speed",

  },

  {

    value: "llama-3.3-70b-versatile",

    labelKey: "models.llama_70b_label",

    descKey: "models.llama_70b_desc",

    speedKey: "models.llama_70b_speed",

  },

];



export const LANGUAGES = [

  { code: "tr", label: "Türkçe", flag: "🇹🇷" },

  { code: "en", label: "English", flag: "🇬🇧" },

  { code: "de", label: "Deutsch", flag: "🇩🇪" },

];



export const SESSION_KEYS: Record<ChatMode, string> = {

  terminal: "bex-chat-terminal",

  pdf: "bex-chat-pdf",

  engineer: "bex-chat-engineer",

};



export const HISTORY_KEY = "bex-chat-history";

/** Maps legacy terminal mode to engineer for storage and routing. */
export function normalizeChatMode(mode: ChatMode): ChatMode {
  return mode === "terminal" ? "engineer" : mode;
}

