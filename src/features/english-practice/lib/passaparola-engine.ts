import {
  PASSAPAROLA_LETTERS,
  PASSAPAROLA_QUESTIONS,
} from "../data/passaparola-questions";
import type { PassaparolaDifficulty, PassaparolaQuestion, PassaparolaRoundStats } from "../types";

export type LetterState = "pending" | "active" | "correct" | "passed" | "wrong";

export function normalizePassaparolaAnswer(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^an?\s+/, "")
    .replace(/^the\s+/, "")
    .replace(/['']/g, "'")
    .replace(/\s+/g, " ");
}

export function checkPassaparolaAnswer(question: PassaparolaQuestion, guess: string): boolean {
  const normalized = normalizePassaparolaAnswer(guess);
  if (!normalized) return false;
  const candidates = [
    normalizePassaparolaAnswer(question.answer),
    ...(question.acceptableAnswers ?? []).map(normalizePassaparolaAnswer),
  ];
  return candidates.some((c) => c === normalized);
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function pickDifficultyForAll(): PassaparolaDifficulty {
  const r = Math.random();
  if (r < 0.25) return "easy";
  if (r < 0.7) return "medium";
  return "hard";
}

/** Build one question per letter A–Z for the selected difficulty. */
export function buildPassaparolaRound(
  difficulty: PassaparolaDifficulty | "all"
): PassaparolaQuestion[] {
  return PASSAPAROLA_LETTERS.map((letter) => {
    const d = difficulty === "all" ? pickDifficultyForAll() : difficulty;
    const pool = PASSAPAROLA_QUESTIONS.filter(
      (q) => q.letter === letter && q.difficulty === d
    );
    if (pool.length === 0) {
      return PASSAPAROLA_QUESTIONS.find((q) => q.letter === letter)!;
    }
    return pickRandom(pool);
  });
}

/** Initial play order: A→Z, then passed letters are appended. */
export function buildInitialQueue(): number[] {
  return PASSAPAROLA_LETTERS.map((_, i) => i);
}

export function letterPosition(index: number, total = 26, radiusPct = 42): { x: number; y: number } {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: 50 + radiusPct * Math.cos(angle),
    y: 50 + radiusPct * Math.sin(angle),
  };
}
