import type { EnglishProgress } from "./types";

export const PROGRESS_STORAGE_KEY = "englishpath-progress-v4";
export const XP_PER_LEVEL = 500;

export const DEFAULT_PROGRESS: EnglishProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastStudyDate: null,
  masteredFlashcards: [],
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
  settings: {
    speechRate: 0.95,
    examQuestionCount: 10,
    examMode: "mixed",
    tabooRoundDuration: 60,
    headsUpRoundDuration: 60,
    charadesRoundDuration: 60,
    categoryBlitzRoundDuration: 30,
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
  dailyStreak: 50,
} as const;
