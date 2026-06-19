import { TABOO_CARDS } from "./taboo-cards";
import { HEADS_UP_CARDS } from "./heads-up-cards";
import { CHARADES_CARDS } from "./charades-cards";
import { CATEGORY_BLITZ_CATEGORIES } from "./category-blitz";
import { FLASHCARDS } from "./flashcards";

export const GAME_DECK_STATS = {
  taboo: {
    count: TABOO_CARDS.length,
    noteKey: "taboo" as const,
  },
  heads_up: {
    count: HEADS_UP_CARDS.length,
    noteKey: "heads_up" as const,
  },
  charades: {
    count: CHARADES_CARDS.length,
    noteKey: "charades" as const,
  },
  category_blitz: {
    count: CATEGORY_BLITZ_CATEGORIES.length,
    noteKey: "category_blitz" as const,
  },
} as const;

export const TOTAL_GAME_CARD_WORDS =
  TABOO_CARDS.length + HEADS_UP_CARDS.length + CHARADES_CARDS.length;

export const CATEGORY_BLITZ_SAMPLE_WORDS = CATEGORY_BLITZ_CATEGORIES.reduce(
  (sum, cat) => sum + cat.samples.length,
  0
);

/** Cards + vocabulary + category sample words — dashboard library stat */
export const TOTAL_LIBRARY_WORDS =
  TOTAL_GAME_CARD_WORDS + FLASHCARDS.length + CATEGORY_BLITZ_SAMPLE_WORDS;

/** @deprecated use TOTAL_LIBRARY_WORDS */
export const TOTAL_UNIQUE_GAME_WORDS = TOTAL_LIBRARY_WORDS;
