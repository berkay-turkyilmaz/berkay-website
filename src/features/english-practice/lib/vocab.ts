import { FLASHCARDS } from "../data/flashcards";
import type { Flashcard, FlashcardLevel, SrsEntry, VocabLevelFilter } from "../types";
import { CEFR_LEVELS } from "../types";

/** Days until a card is due again, per Leitner box (1 = failed/new, 5 = well known). */
export const SRS_INTERVAL_DAYS: Record<number, number> = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 16 };

export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function nextDueDate(box: number): string {
  const d = new Date();
  d.setDate(d.getDate() + (SRS_INTERVAL_DAYS[box] ?? 0));
  return todayKey(d);
}

/** Cards that should be reviewed today: new/failed (box 1) or past their due date. */
export function isDue(entry: SrsEntry | undefined, today = todayKey()): boolean {
  return !entry || entry.due <= today;
}

export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample<T>(items: readonly T[], count: number): T[] {
  return shuffle(items).slice(0, count);
}

export function cardsForLevel(level: VocabLevelFilter, cards: readonly Flashcard[] = FLASHCARDS): Flashcard[] {
  return level === "all" ? [...cards] : cards.filter((c) => c.level === level);
}

/** Number of cards per CEFR level, used for level pickers. */
export function levelCounts(cards: readonly Flashcard[] = FLASHCARDS): Record<FlashcardLevel, number> {
  const counts = Object.fromEntries(CEFR_LEVELS.map((l) => [l, 0])) as Record<FlashcardLevel, number>;
  for (const c of cards) counts[c.level] += 1;
  return counts;
}

/** Turkish meaning shown on a card: first alternative only ("Pirinç / Pilav" -> "Pirinç"). */
export function shortMeaning(card: Flashcard): string {
  return card.back.split(" / ")[0].split(" (")[0].trim();
}

/** Words usable in letter games: one alphabetic word, 3–12 letters. */
export function isSingleWord(card: Flashcard): boolean {
  return /^[A-Za-z]{3,12}$/.test(card.front.trim());
}

/** Words or short phrases (up to 3 words) that can be dictated and typed. */
export function isTypeable(card: Flashcard): boolean {
  const front = card.front.trim();
  const letters = front.replace(/[^A-Za-z]/g, "").length;
  return /^[A-Za-z' -]+$/.test(front) && front.split(/\s+/).length <= 3 && letters >= 3 && letters <= 24;
}

export function typeablePool(level: VocabLevelFilter): Flashcard[] {
  return cardsForLevel(level).filter(isTypeable);
}

export function letterGamePool(level: VocabLevelFilter): Flashcard[] {
  return cardsForLevel(level).filter(isSingleWord);
}

/** Lowercase, trimmed answer for comparison (keeps letters, drops punctuation and spaces). */
export function normalizeWord(value: string): string {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

/**
 * Wrong answer choices for a multiple-choice question. Prefers cards from the same level and
 * category so options are plausible, and never repeats the correct meaning.
 */
export function pickDistractors(card: Flashcard, pool: readonly Flashcard[], count: number, field: "back" | "front"): string[] {
  const correct = field === "back" ? shortMeaning(card).toLowerCase() : card.front.toLowerCase();
  const value = (c: Flashcard) => (field === "back" ? shortMeaning(c) : c.front);

  const candidates = pool.filter((c) => c.id !== card.id && value(c).toLowerCase() !== correct);
  const near = shuffle(candidates.filter((c) => c.category === card.category));
  const rest = shuffle(candidates.filter((c) => c.category !== card.category));

  const picked: string[] = [];
  for (const c of [...near, ...rest]) {
    const v = value(c);
    if (!picked.some((p) => p.toLowerCase() === v.toLowerCase())) picked.push(v);
    if (picked.length === count) break;
  }
  return picked;
}

/** Scramble a word so it never equals the original (words of 3+ letters). */
export function scrambleWord(word: string): string {
  const letters = word.split("");
  for (let attempt = 0; attempt < 12; attempt++) {
    const s = shuffle(letters).join("");
    if (s.toLowerCase() !== word.toLowerCase()) return s;
  }
  return letters.reverse().join("");
}
