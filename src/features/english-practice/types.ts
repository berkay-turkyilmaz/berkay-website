export type EnglishTab =
  | "dashboard"
  | "grammar"
  | "flashcards"
  | "prepositions"
  | "exam"
  | "results"
  | "games"
  | "taboo"
  | "heads_up"
  | "charades"
  | "emoji_clues";

export type FlashcardCategory =
  | "daily"
  | "food"
  | "people"
  | "travel"
  | "emotions"
  | "social"
  | "hobbies";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  phonetic: string;
  category: FlashcardCategory;
  example: string;
}

export interface GrammarRule {
  id: string;
  title: string;
  summary: string;
  formula: string;
  examples: { en: string; tr: string }[];
  tip: string;
}

export interface PrepositionExercise {
  id: string;
  sentence: string;
  answer: string;
  options: string[];
  explanation: string;
}

export type ExamQuestionType = "multiple" | "fill" | "translate" | "true_false" | "tap";

export type ExamMode = "mixed" | "multiple" | "true_false" | "fill" | "translate" | "tap";

export interface ExamQuestion {
  id: string;
  type: ExamQuestionType;
  prompt: string;
  options?: string[];
  answer: string;
  acceptableAnswers?: string[];
  explanation: string;
}

export interface ExamResult {
  id: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
  durationSec: number;
  mode?: ExamMode;
}

/** Guess-the-Emoji style: picture (2) → combo (3) → chain (4 emojis = one word). */
export type EmojiDecodeMode = "picture" | "combo" | "chain";

export type EmojiPuzzleCategory =
  | "food"
  | "animals"
  | "nature"
  | "people"
  | "places"
  | "daily";

export interface EmojiPuzzle {
  id: string;
  answer: string;
  hintTr: string;
  category: EmojiPuzzleCategory;
  emojis: {
    picture: [string, string];
    combo: [string, string, string];
    chain: [string, string, string, string];
  };
  wrongOptions: [string, string, string];
}

export interface EmojiDecodeQuestion {
  id: string;
  answer: string;
  hintTr: string;
  emojis: string[];
  options: string[];
  mode: EmojiDecodeMode;
}

export interface EmojiCluesRoundStats {
  correct: number;
  wrong: number;
  bestStreak: number;
  total: number;
  score: number;
}

export type TabooCategory =
  | "food"
  | "people"
  | "home"
  | "entertainment"
  | "places"
  | "emotions"
  | "social"
  | "hobbies"
  | "worklife";

export type TabooDifficulty = "easy" | "medium" | "hard";

export type TabooGameMode = "practice" | "timed" | "party";

export interface TabooCard {
  id: string;
  word: string;
  forbidden: string[];
  hint: string;
  category: TabooCategory;
  difficulty: TabooDifficulty;
}

export interface TabooRoundStats {
  correct: number;
  skipped: number;
  fouls: number;
  total: number;
}

export interface HeadsUpRoundStats {
  correct: number;
  passed: number;
  total: number;
}

export interface CharadesRoundStats {
  correct: number;
  passed: number;
  total: number;
}

export type HeadsUpCategory =
  | "everyday"
  | "food"
  | "people"
  | "places"
  | "nature"
  | "actions"
  | "transport";

export interface HeadsUpCard {
  id: string;
  word: string;
  category: HeadsUpCategory;
  hint?: string;
}

export type CharadesCategory = "actions" | "emotions" | "sports" | "animals" | "objects";

export interface CharadesCard {
  id: string;
  word: string;
  category: CharadesCategory;
  hint: string;
}

export interface EnglishProgress {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string | null;
  masteredFlashcards: string[];
  completedGrammar: string[];
  prepositionScores: Record<string, boolean>;
  examResults: ExamResult[];
  tabooStats: {
    gamesPlayed: number;
    wordsGuessed: number;
    bestTimedScore: number;
    partyWins: { teamA: number; teamB: number };
  };
  headsUpStats: {
    gamesPlayed: number;
    wordsGuessed: number;
    bestRound: number;
  };
  charadesStats: {
    gamesPlayed: number;
    wordsGuessed: number;
    bestRound: number;
  };
  emojiCluesStats: {
    gamesPlayed: number;
    wordsGuessed: number;
    bestStreak: number;
    bestRound: number;
    bestScore: number;
  };
  settings: {
    speechRate: number;
    examQuestionCount: number;
    examMode: ExamMode;
    tabooRoundDuration: number;
    headsUpRoundDuration: number;
    charadesRoundDuration: number;
    emojiCluesRoundDuration: number;
  };
}
