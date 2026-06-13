import { EMOJI_PUZZLES, EMOJI_TUTORIAL_BY_MODE } from "../data/emoji-puzzles";
import type { EmojiDecodeMode, EmojiDecodeQuestion, EmojiPuzzle, EmojiPuzzleCategory } from "../types";
import { fisherYatesShuffle } from "./exam-scoring";

export const EMOJI_DECODE_MODES: EmojiDecodeMode[] = ["picture", "combo", "chain"];

export const PUZZLES_PER_ROUND = 10;
export const STARTING_LIVES = 3;
export const SCORE_CORRECT = 100;
export const SCORE_STREAK_BONUS = 25;

export const MODE_EMOJI_COUNT: Record<EmojiDecodeMode, number> = {
  picture: 2,
  combo: 3,
  chain: 4,
};

export function getPuzzlesByCategory(category: EmojiPuzzleCategory | "all"): EmojiPuzzle[] {
  if (category === "all") return EMOJI_PUZZLES;
  return EMOJI_PUZZLES.filter((p) => p.category === category);
}

export function buildRound(
  mode: EmojiDecodeMode,
  category: EmojiPuzzleCategory | "all"
): EmojiDecodeQuestion[] {
  const pool = getPuzzlesByCategory(category);
  const picked = fisherYatesShuffle(pool).slice(0, Math.min(PUZZLES_PER_ROUND, pool.length));

  return picked.map((puzzle) => ({
    id: puzzle.id,
    answer: puzzle.answer,
    hintTr: puzzle.hintTr,
    emojis: [...puzzle.emojis[mode]],
    options: fisherYatesShuffle([puzzle.answer, ...puzzle.wrongOptions]),
    mode,
  }));
}

export function getModeTutorial(mode: EmojiDecodeMode) {
  const ex = EMOJI_TUTORIAL_BY_MODE[mode];
  return { emojis: [...ex.emojis], answer: ex.answer, hintTr: ex.hintTr };
}
