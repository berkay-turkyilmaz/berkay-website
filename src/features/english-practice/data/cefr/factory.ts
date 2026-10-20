import type { Flashcard, FlashcardCategory, FlashcardLevel } from "../../types";

export type CefrEntry = [
  front: string,
  back: string,
  phonetic: string,
  category: FlashcardCategory,
  example: string,
];

/** Builds Flashcard objects for one CEFR level. Ids are `cefr-<level>-<n>` and stay stable. */
export function buildLevel(level: FlashcardLevel, entries: CefrEntry[]): Flashcard[] {
  const prefix = `cefr-${level.toLowerCase()}`;
  return entries.map(([front, back, phonetic, category, example], i) => ({
    id: `${prefix}-${String(i + 1).padStart(3, "0")}`,
    front,
    back,
    phonetic,
    category,
    example,
    level,
  }));
}
