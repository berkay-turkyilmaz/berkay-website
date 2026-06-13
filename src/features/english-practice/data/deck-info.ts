import { TABOO_CARDS } from "./taboo-cards";
import { HEADS_UP_CARDS } from "./heads-up-cards";
import { CHARADES_CARDS } from "./charades-cards";
import { EMOJI_PUZZLES } from "./emoji-puzzles";

/** Her oyunun deste boyutu — oyun mekaniğine göre farklı içerik */
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
  emoji_clues: {
    count: EMOJI_PUZZLES.length,
    noteKey: "emoji_clues" as const,
  },
} as const;

export const TOTAL_UNIQUE_GAME_WORDS =
  TABOO_CARDS.length +
  HEADS_UP_CARDS.length +
  CHARADES_CARDS.length +
  EMOJI_PUZZLES.length;
