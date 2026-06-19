import type { EnglishTab } from "../types";

export type GameThemeId = "taboo" | "heads_up" | "charades" | "category_blitz";
export type LearnThemeId = "flashcards" | "grammar" | "prepositions";

export type ThemeTokens = {
  accent: string;
  accentFg: string;
  surface: string;
  border: string;
  icon: string;
  chip: string;
  chipActive: string;
  progress: string;
  heroGlow: string;
};

export const GAME_THEMES: Record<GameThemeId, ThemeTokens> = {
  taboo: {
    accent: "rose",
    accentFg: "text-rose-700",
    surface: "bg-rose-50",
    border: "border-rose-200",
    icon: "text-rose-600",
    chip: "hover:border-rose-200 hover:text-rose-700",
    chipActive: "!bg-rose-600 !text-white !border-rose-600 shadow-sm shadow-rose-600/20",
    progress: "bg-rose-500",
    heroGlow: "rgba(244,63,94,0.22)",
  },
  heads_up: {
    accent: "violet",
    accentFg: "text-violet-700",
    surface: "bg-violet-50",
    border: "border-violet-200",
    icon: "text-violet-600",
    chip: "hover:border-violet-200 hover:text-violet-700",
    chipActive: "!bg-violet-600 !text-white !border-violet-600 shadow-sm shadow-violet-600/20",
    progress: "bg-violet-500",
    heroGlow: "rgba(139,92,246,0.22)",
  },
  charades: {
    accent: "amber",
    accentFg: "text-amber-700",
    surface: "bg-amber-50",
    border: "border-amber-200",
    icon: "text-amber-600",
    chip: "hover:border-amber-200 hover:text-amber-700",
    chipActive: "!bg-amber-500 !text-white !border-amber-500 shadow-sm shadow-amber-500/20",
    progress: "bg-amber-500",
    heroGlow: "rgba(245,158,11,0.22)",
  },
  category_blitz: {
    accent: "teal",
    accentFg: "text-teal-700",
    surface: "bg-teal-50",
    border: "border-teal-200",
    icon: "text-teal-600",
    chip: "hover:border-teal-200 hover:text-teal-700",
    chipActive: "!bg-teal-600 !text-white !border-teal-600 shadow-sm",
    progress: "bg-teal-500",
    heroGlow: "rgba(13,148,136,0.22)",
  },
};

export const LEARN_THEMES: Record<LearnThemeId, ThemeTokens> = {
  flashcards: {
    accent: "indigo",
    accentFg: "text-indigo-700",
    surface: "bg-indigo-50",
    border: "border-indigo-200",
    icon: "text-indigo-600",
    chip: "hover:border-indigo-200 hover:text-indigo-700",
    chipActive: "!bg-indigo-600 !text-white !border-indigo-600 shadow-sm",
    progress: "bg-indigo-500",
    heroGlow: "rgba(99,102,241,0.2)",
  },
  grammar: {
    accent: "sky",
    accentFg: "text-sky-700",
    surface: "bg-sky-50",
    border: "border-sky-200",
    icon: "text-sky-600",
    chip: "hover:border-sky-200 hover:text-sky-700",
    chipActive: "!bg-sky-600 !text-white !border-sky-600 shadow-sm",
    progress: "bg-sky-500",
    heroGlow: "rgba(14,165,233,0.2)",
  },
  prepositions: {
    accent: "emerald",
    accentFg: "text-emerald-700",
    surface: "bg-emerald-50",
    border: "border-emerald-200",
    icon: "text-emerald-600",
    chip: "hover:border-emerald-200 hover:text-emerald-700",
    chipActive: "!bg-emerald-600 !text-white !border-emerald-600 shadow-sm",
    progress: "bg-emerald-500",
    heroGlow: "rgba(16,185,129,0.2)",
  },
};

export function getThemeForTab(tab: EnglishTab): ThemeTokens | null {
  if (tab in GAME_THEMES) return GAME_THEMES[tab as GameThemeId];
  if (tab in LEARN_THEMES) return LEARN_THEMES[tab as LearnThemeId];
  return null;
}
