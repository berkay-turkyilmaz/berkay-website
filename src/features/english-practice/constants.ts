import type { EnglishProgress } from "./types";

export const PROGRESS_STORAGE_KEY = "englishpath-progress-v6";
export const LEGACY_PROGRESS_KEYS = ["englishpath-progress-v5", "englishpath-progress-v4"] as const;
export const XP_PER_LEVEL = 500;

export const DEFAULT_PROGRESS: EnglishProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastStudyDate: null,
  masteredFlashcards: [],
  weakFlashcards: [],
  completedGrammar: [],
  prepositionScores: {},
  examResults: [],
  tabooStats: {
    gamesPlayed: 0,
    wordsGuessed: 0,
    bestTimedScore: 0,
    partyWins: { teamA: 0, teamB: 0 },
  },
  headsUpStats: {
    gamesPlayed: 0,
    wordsGuessed: 0,
    bestRound: 0,
  },
  charadesStats: {
    gamesPlayed: 0,
    wordsGuessed: 0,
    bestRound: 0,
  },
  categoryBlitzStats: {
    gamesPlayed: 0,
    wordsNamed: 0,
    bestRound: 0,
    bestStreak: 0,
  },
  passaparolaStats: {
    gamesPlayed: 0,
    wordsCorrect: 0,
    bestRound: 0,
    bestStreak: 0,
  },
  vocabGames: {},
  srs: {},
  settings: {
    examLevel: "all",
    vocabLevel: "A1",
    speechRate: 0.95,
    examQuestionCount: 10,
    examMode: "mixed",
    tabooRoundDuration: 60,
    headsUpRoundDuration: 60,
    charadesRoundDuration: 60,
    categoryBlitzRoundDuration: 30,
    passaparolaRoundDuration: 180,
  },
};

export const XP_REWARDS = {
  flashcardMastered: 10,
  grammarCompleted: 25,
  prepositionCorrect: 15,
  examPerCorrect: 20,
  tabooCorrect: 12,
  tabooPartyWin: 30,
  headsUpCorrect: 10,
  charadesCorrect: 10,
  categoryBlitzCorrect: 10,
  passaparolaCorrect: 15,
  vocabGameCorrect: 8,
  vocabGameFinish: 20,
  dailyStreak: 50,
} as const;
