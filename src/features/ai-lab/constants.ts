
import type { WorkspaceSettings } from "./types";



/** Display name for the AI agent across Ai Lab UI (single source of truth). */

export const AI_AGENT_NAME = "BEX";



export const DEFAULT_SETTINGS: WorkspaceSettings = {

  model: "openai/gpt-oss-20b",

  responseLength: "medium",

  theme: "system",

  language: "auto",

  temperature: 0.7,

  displayName: "",

};



/** Hand-written labels for known models (keys under AiLabPage.settings.models). Others show their id. */
export const KNOWN_MODELS: Record<string, { key: string }> = {
  "llama-3.1-8b-instant": { key: "llama_8b" },
  "llama-3.3-70b-versatile": { key: "llama_70b" },
  "openai/gpt-oss-20b": { key: "gpt_oss_20b" },
  "openai/gpt-oss-120b": { key: "gpt_oss_120b" },
};

/** "openai/gpt-oss-20b" -> "gpt-oss-20b" for models without a hand-written label. */
export function prettyModelId(id: string): string {
  return id.split("/").pop() ?? id;
}



export const LANGUAGES = [

  { code: "tr", label: "Türkçe", flag: "🇹🇷" },

  { code: "en", label: "English", flag: "🇬🇧" },

  { code: "de", label: "Deutsch", flag: "🇩🇪" },

  { code: "es", label: "Español", flag: "🇪🇸" },

  { code: "fr", label: "Français", flag: "🇫🇷" },

  { code: "ja", label: "日本語", flag: "🇯🇵" },

];






