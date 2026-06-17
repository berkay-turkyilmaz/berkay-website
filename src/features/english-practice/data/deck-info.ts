import { TABOO_CARDS } from "./taboo-cards";
import { HEADS_UP_CARDS } from "./heads-up-cards";
import { CHARADES_CARDS } from "./charades-cards";
import { CATEGORY_BLITZ_CATEGORIES } from "./category-blitz";

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

export const TOTAL_UNIQUE_GAME_WORDS =
  TABOO_CARDS.length +
  HEADS_UP_CARDS.length +
  CHARADES_CARDS.length +
  CATEGORY_BLITZ_CATEGORIES.length;
