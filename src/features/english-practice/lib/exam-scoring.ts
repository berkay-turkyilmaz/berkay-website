import type { ExamQuestion } from "../types";

export function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[.!?,;:'"]+$/g, "")
    .replace(/\s+/g, " ");
}

export function isAnswerCorrect(question: ExamQuestion, given: string): boolean {
  const normalizedGiven = normalizeAnswer(given);
  if (!normalizedGiven) return false;

  const acceptable = question.acceptableAnswers?.length
    ? question.acceptableAnswers
    : [question.answer];

  if (question.type === "multiple" || question.type === "true_false" || question.type === "tap") {
    return acceptable.some((a) => normalizeAnswer(a) === normalizedGiven);
  }

  if (question.type === "fill") {
    return acceptable.some((a) => normalizeAnswer(a) === normalizedGiven);
  }

  // translate — tam eşleşme veya kabul edilen alternatifler
  return acceptable.some((a) => normalizeAnswer(a) === normalizedGiven);
}

export function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
