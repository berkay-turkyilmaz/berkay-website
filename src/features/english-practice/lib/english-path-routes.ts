import type { EnglishTab } from "../types";

/** Path after `/ai-lab/english-path` (no leading slash). */
const SEGMENT_TO_TAB: Record<string, EnglishTab> = {
  "": "dashboard",
  games: "games",
  "games/taboo": "taboo",
  "games/heads-up": "heads_up",
  "games/charades": "charades",
  "games/category-blitz": "category_blitz",
  flashcards: "flashcards",
  grammar: "grammar",
  prepositions: "prepositions",
  exam: "exam",
  results: "results",
};

const TAB_TO_SEGMENT: Partial<Record<EnglishTab, string>> = {
  dashboard: "",
  games: "games",
  taboo: "games/taboo",
  heads_up: "games/heads-up",
  charades: "games/charades",
  category_blitz: "games/category-blitz",
  flashcards: "flashcards",
  grammar: "grammar",
  prepositions: "prepositions",
  exam: "exam",
  results: "results",
};

export function parseEnglishPathTab(pathname: string): EnglishTab {
  const segments = pathname.split("/").filter(Boolean);
  const epIndex = segments.lastIndexOf("english-path");
  if (epIndex === -1) return "dashboard";
  const rest = segments.slice(epIndex + 1).join("/");
  return SEGMENT_TO_TAB[rest] ?? "dashboard";
}

export function englishPathHref(tab: EnglishTab): string {
  const segment = TAB_TO_SEGMENT[tab] ?? "";
  return segment ? `/ai-lab/english-path/${segment}` : "/ai-lab/english-path";
}

export const ENGLISH_PATH_GAME_SLUGS = [
  "taboo",
  "heads-up",
  "charades",
  "category-blitz",
] as const;
