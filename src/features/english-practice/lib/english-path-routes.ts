import type { EnglishTab } from "../types";

/** Path after `/ai-lab/english-path` (no leading slash). */
const SEGMENT_TO_TAB: Record<string, EnglishTab> = {
  "": "dashboard",
  games: "games",
  "games/taboo": "taboo",
  "games/heads-up": "heads_up",
  "games/charades": "charades",
  "games/category-blitz": "category_blitz",
  "games/passaparola": "passaparola",
  "games/word-match": "word_match",
  "games/word-scramble": "word_scramble",
  "games/hangman": "hangman",
  "games/listen-type": "listen_type",
  "games/word-sprint": "word_sprint",
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
  passaparola: "games/passaparola",
  word_match: "games/word-match",
  word_scramble: "games/word-scramble",
  hangman: "games/hangman",
  listen_type: "games/listen-type",
  word_sprint: "games/word-sprint",
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
  "passaparola",
  "word-match",
  "word-scramble",
  "hangman",
  "listen-type",
  "word-sprint",
] as const;
