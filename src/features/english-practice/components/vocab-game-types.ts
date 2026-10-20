import type { VocabGameId, VocabGameStats, VocabLevelFilter } from "../types";

export type VocabGameResult = {
  score: number;
  correct: number;
  total: number;
};

/** Props every solo vocabulary game receives from the shell. */
export type VocabGameProps = {
  level: VocabLevelFilter;
  onLevelChange: (level: VocabLevelFilter) => void;
  stats?: VocabGameStats;
  speechRate: number;
  /** Called once per finished round; the shell records stats and XP. */
  onFinish: (id: VocabGameId, result: VocabGameResult) => void;
  /** Feeds the spaced-repetition box for a card. */
  onReview: (cardId: string, correct: boolean) => void;
  onPlayingChange?: (playing: boolean) => void;
};
