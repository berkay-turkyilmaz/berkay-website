"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_PROGRESS, PROGRESS_STORAGE_KEY, XP_PER_LEVEL } from "../constants";
import type { EnglishProgress, ExamResult } from "../types";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function calcLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function loadProgress(): EnglishProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<EnglishProgress>;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      tabooStats: { ...DEFAULT_PROGRESS.tabooStats, ...parsed.tabooStats },
      headsUpStats: { ...DEFAULT_PROGRESS.headsUpStats, ...parsed.headsUpStats },
      charadesStats: { ...DEFAULT_PROGRESS.charadesStats, ...parsed.charadesStats },
      emojiCluesStats: { ...DEFAULT_PROGRESS.emojiCluesStats, ...parsed.emojiCluesStats },
      settings: { ...DEFAULT_PROGRESS.settings, ...parsed.settings },
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function useEnglishProgress() {
  const [progress, setProgress] = useState<EnglishProgress>(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setLoaded(true);
  }, []);

  const persist = useCallback((next: EnglishProgress) => {
    setProgress(next);
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addXp = useCallback(
    (amount: number) => {
      setProgress((prev) => {
        const today = todayKey();
        let streak = prev.streak;
        if (prev.lastStudyDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yKey = yesterday.toISOString().slice(0, 10);
          streak = prev.lastStudyDate === yKey ? streak + 1 : 1;
        }
        const xp = prev.xp + amount;
        const next: EnglishProgress = {
          ...prev,
          xp,
          level: calcLevel(xp),
          streak,
          lastStudyDate: today,
        };
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const updateProgress = useCallback(
    (patch: Partial<EnglishProgress>) => {
      setProgress((prev) => {
        const next = { ...prev, ...patch };
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const updateSettings = useCallback(
    (settings: Partial<EnglishProgress["settings"]>) => {
      setProgress((prev) => {
        const next = { ...prev, settings: { ...prev.settings, ...settings } };
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const markFlashcardMastered = useCallback(
    (id: string) => {
      setProgress((prev) => {
        if (prev.masteredFlashcards.includes(id)) return prev;
        const next = {
          ...prev,
          masteredFlashcards: [...prev.masteredFlashcards, id],
        };
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const markGrammarComplete = useCallback(
    (id: string) => {
      setProgress((prev) => {
        if (prev.completedGrammar.includes(id)) return prev;
        const next = {
          ...prev,
          completedGrammar: [...prev.completedGrammar, id],
        };
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const savePrepositionAnswer = useCallback(
    (id: string, correct: boolean) => {
      setProgress((prev) => {
        const next = {
          ...prev,
          prepositionScores: { ...prev.prepositionScores, [id]: correct },
        };
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const addExamResult = useCallback(
    (result: Omit<ExamResult, "id">) => {
      setProgress((prev) => {
        const entry: ExamResult = { ...result, id: Date.now().toString() };
        const next = {
          ...prev,
          examResults: [entry, ...prev.examResults].slice(0, 20),
        };
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const updateTabooStats = useCallback(
    (patch: Partial<EnglishProgress["tabooStats"]>) => {
      setProgress((prev) => {
        const next = {
          ...prev,
          tabooStats: { ...prev.tabooStats, ...patch },
        };
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const resetProgress = useCallback(() => {
    persist(DEFAULT_PROGRESS);
  }, [persist]);

  const updateHeadsUpStats = useCallback(
    (patch: Partial<EnglishProgress["headsUpStats"]>) => {
      setProgress((prev) => {
        const next = {
          ...prev,
          headsUpStats: { ...prev.headsUpStats, ...patch },
        };
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const updateCharadesStats = useCallback(
    (patch: Partial<EnglishProgress["charadesStats"]>) => {
      setProgress((prev) => {
        const next = {
          ...prev,
          charadesStats: { ...prev.charadesStats, ...patch },
        };
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const updateEmojiCluesStats = useCallback(
    (patch: Partial<EnglishProgress["emojiCluesStats"]>) => {
      setProgress((prev) => {
        const next = {
          ...prev,
          emojiCluesStats: { ...prev.emojiCluesStats, ...patch },
        };
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  return {
    progress,
    loaded,
    addXp,
    updateProgress,
    updateSettings,
    markFlashcardMastered,
    markGrammarComplete,
    savePrepositionAnswer,
    addExamResult,
    updateTabooStats,
    updateHeadsUpStats,
    updateCharadesStats,
    updateEmojiCluesStats,
    resetProgress,
  };
}
