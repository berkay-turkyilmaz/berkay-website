"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  Clock,
  Lightbulb,
  Play,
  RotateCcw,
  SkipForward,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  CATEGORY_BLITZ_CATEGORIES,
  CATEGORY_BLITZ_DIFFICULTY_COUNTS,
  getHintSamples,
  pickLetterForCategory,
} from "../data/category-blitz";
import type {
  CategoryBlitzCategory,
  CategoryBlitzDifficulty,
  CategoryBlitzMode,
  CategoryBlitzRoundStats,
} from "../types";
import { XP_REWARDS } from "../constants";
import { GAME_THEMES } from "../lib/game-themes";
import { themeAccentText, themeChip, themeProgressBar, themeStatBadge } from "../lib/theme-utils";
import { ep } from "../styles";
import { GameTimerSlider } from "./game-timer-slider";
import { FadeUp, Pressable } from "./motion-primitives";

const CB_THEME = GAME_THEMES.category_blitz;

type Phase = "setup" | "playing" | "round_end";

type Props = {
  roundDuration: number;
  onRoundDurationChange: (seconds: number) => void;
  stats: {
    gamesPlayed: number;
    wordsNamed: number;
    bestRound: number;
    bestStreak: number;
  };
  onRoundComplete: (stats: CategoryBlitzRoundStats) => void;
  onXp: (amount: number) => void;
  onPlayingChange?: (playing: boolean) => void;
};

function shuffleCategories(
  pool: CategoryBlitzCategory[],
  count: number
): CategoryBlitzCategory[] {
  const a = [...pool];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, count);
}

export function CategoryBlitzGameTab({
  roundDuration,
  onRoundDurationChange,
  stats,
  onRoundComplete,
  onXp,
  onPlayingChange,
}: Props) {
  const t = useTranslations("EnglishPath.category_blitz");
  const tCat = useTranslations("EnglishPath.game_categories.category_blitz");
  const tTaboo = useTranslations("EnglishPath.taboo");

  const [phase, setPhase] = useState<Phase>("setup");
  const [mode, setMode] = useState<CategoryBlitzMode>("teams");
  const [difficulty, setDifficulty] = useState<CategoryBlitzDifficulty | "all">("all");
  const [roundCount, setRoundCount] = useState(8);
  const [letter, setLetter] = useState("A");
  const [roundIndex, setRoundIndex] = useState(0);
  const [categories, setCategories] = useState<CategoryBlitzCategory[]>([]);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(roundDuration);
  const [showHints, setShowHints] = useState(false);
  const [team, setTeam] = useState<"A" | "B">("A");
  const [teamScores, setTeamScores] = useState({ A: 0, B: 0 });
  const [streak, setStreak] = useState(0);
  const [roundStats, setRoundStats] = useState<CategoryBlitzRoundStats>({
    roundsCompleted: 0,
    wordsNamed: 0,
    passed: 0,
    total: 0,
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endedRef = useRef(false);

  const pool = useMemo(() => {
    if (difficulty === "all") return CATEGORY_BLITZ_CATEGORIES;
    return CATEGORY_BLITZ_CATEGORIES.filter((c) => c.difficulty === difficulty);
  }, [difficulty]);

  const currentCategory = categories[categoryIndex];
  const hintData = currentCategory
    ? getHintSamples(currentCategory, letter)
    : { samples: [], matchesLetter: true };

  useEffect(() => {
    onPlayingChange?.(phase === "playing");
    return () => onPlayingChange?.(false);
  }, [phase, onPlayingChange]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startGame = () => {
    const cats = shuffleCategories(pool.length > 0 ? pool : CATEGORY_BLITZ_CATEGORIES, roundCount);
    setCategories(cats);
    setRoundIndex(0);
    setCategoryIndex(0);
    setLetter(pickLetterForCategory(cats[0]));
    setTimeLeft(roundDuration);
    setShowHints(false);
    setTeam("A");
    setTeamScores({ A: 0, B: 0 });
    setStreak(0);
    setRoundStats({ roundsCompleted: 0, wordsNamed: 0, passed: 0, total: cats.length });
    endedRef.current = false;
    setPhase("playing");
  };

  useEffect(() => {
    if (phase !== "playing") return;
    clearTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return clearTimer;
  }, [phase, roundIndex, categoryIndex, letter]);

  const endRound = useCallback(
    (final: CategoryBlitzRoundStats) => {
      if (endedRef.current) return;
      endedRef.current = true;
      clearTimer();
      setPhase("round_end");
      onRoundComplete(final);
    },
    [onRoundComplete]
  );

  useEffect(() => {
    if (phase === "playing" && timeLeft === 0) {
      handlePass();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase]);

  const advanceRound = (patch: Partial<CategoryBlitzRoundStats>) => {
    const next = { ...roundStats, ...patch };
    setRoundStats(next);
    if (roundIndex + 1 >= categories.length) {
      endRound(next);
      return;
    }
    setRoundIndex((i) => i + 1);
    setCategoryIndex(0);
    const nextCat = categories[roundIndex + 1];
    setLetter(
      nextCat
        ? pickLetterForCategory(nextCat)
        : pickLetterForCategory(CATEGORY_BLITZ_CATEGORIES[0])
    );
    setTimeLeft(roundDuration);
    setShowHints(false);
    if (mode === "teams") setTeam((t) => (t === "A" ? "B" : "A"));
  };

  const handleGotIt = () => {
    onXp(XP_REWARDS.categoryBlitzCorrect + Math.min(streak, 3));
    const newStreak = streak + 1;
    setStreak(newStreak);
    if (mode === "teams") {
      setTeamScores((s) => ({ ...s, [team]: s[team] + 1 }));
    }
    advanceRound({
      wordsNamed: roundStats.wordsNamed + 1,
      roundsCompleted: roundStats.roundsCompleted + 1,
    });
  };

  const handlePass = () => {
    setStreak(0);
    advanceRound({
      passed: roundStats.passed + 1,
      roundsCompleted: roundStats.roundsCompleted + 1,
    });
  };

  const quitToSetup = () => {
    clearTimer();
    setPhase("setup");
  };

  const difficulties = ["all", "easy", "medium", "hard"] as const;

  if (phase === "setup") {
    return (
      <div className="space-y-6 max-w-lg mx-auto pb-8">
        <FadeUp>
          <div
            className={cn(
              ep.heroGradient,
              "relative overflow-hidden rounded-2xl p-6 text-white text-center shadow-lg"
            )}
          >
            <Zap className="w-10 h-10 mx-auto mb-2 text-amber-300" />
            <h2 className="text-2xl sm:text-3xl font-bold">{t("title")}</h2>
            <p className="text-slate-300 text-sm leading-relaxed mt-2">{t("subtitle")}</p>
          </div>
        </FadeUp>

        <div className={cn(ep.card, "p-5 space-y-3")}>
          <p className={cn("text-xs font-bold uppercase tracking-widest", CB_THEME.accentFg)}>{t("how_title")}</p>
          <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
            <li>{t("how_1")}</li>
            <li>{t("how_2")}</li>
            <li>{t("how_3")}</li>
          </ol>
        </div>

        <div className={cn(ep.card, "p-5 space-y-4")}>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{t("mode")}</p>
          <div className="grid grid-cols-3 gap-2">
            {(["solo", "teams", "classroom"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(themeChip(CB_THEME, mode === m), "text-center py-2.5")}
              >
                {t(`modes.${m}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {difficulties.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={cn(themeChip(CB_THEME, difficulty === d))}
            >
              {d === "all" ? t("all") : t(`diff.${d}`)}
              {d !== "all" && (
                <span className="ml-1 opacity-60">({CATEGORY_BLITZ_DIFFICULTY_COUNTS[d]})</span>
              )}
            </button>
          ))}
        </div>

        <GameTimerSlider
          label={t("timer")}
          value={roundDuration}
          onChange={onRoundDurationChange}
          min={15}
          max={60}
          step={5}
          theme={CB_THEME}
        />

        <div className={cn(ep.card, "p-4 flex items-center justify-between")}>
          <span className="text-sm font-medium text-slate-600">{t("rounds")}</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={cn(ep.btnSecondary, "px-3 py-1 rounded-lg text-sm")}
              onClick={() => setRoundCount((c) => Math.max(4, c - 2))}
            >
              −
            </button>
            <span className="font-bold text-lg tabular-nums w-8 text-center">{roundCount}</span>
            <button
              type="button"
              className={cn(ep.btnSecondary, "px-3 py-1 rounded-lg text-sm")}
              onClick={() => setRoundCount((c) => Math.min(16, c + 2))}
            >
              +
            </button>
          </div>
        </div>

        <Pressable onClick={startGame} className={cn(ep.btnPrimary, "w-full py-4 rounded-xl flex items-center justify-center gap-2")}>
          <Play className="w-5 h-5" />
          {t("start")}
        </Pressable>

        <div className="grid grid-cols-3 gap-3 text-center">
          <StatBox label={t("stats.games")} value={stats.gamesPlayed} />
          <StatBox label={t("stats.words")} value={stats.wordsNamed} />
          <StatBox label={t("stats.best")} value={stats.bestRound} />
        </div>
      </div>
    );
  }

  if (phase === "round_end") {
    return (
      <div className="space-y-6 max-w-lg mx-auto pb-8 text-center">
        <Trophy className="w-14 h-14 mx-auto text-amber-500" />
        <h2 className="text-2xl font-bold text-slate-900">{t("round_complete")}</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className={cn(ep.card, "p-4")}>
            <p className={cn("text-3xl font-bold", CB_THEME.accentFg)}>{roundStats.wordsNamed}</p>
            <p className="text-xs text-slate-500 mt-1">{t("words_named")}</p>
          </div>
          <div className={cn(ep.card, "p-4")}>
            <p className="text-3xl font-bold text-slate-700">{roundStats.passed}</p>
            <p className="text-xs text-slate-500 mt-1">{t("passed")}</p>
          </div>
        </div>
        {mode === "teams" && (
          <div className={cn(ep.card, "p-4 flex justify-center gap-8")}>
            <div>
              <p className={cn("text-2xl font-bold", CB_THEME.accentFg)}>{teamScores.A}</p>
              <p className="text-xs text-slate-500">{tTaboo("team_a")}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-violet-700">{teamScores.B}</p>
              <p className="text-xs text-slate-500">{tTaboo("team_b")}</p>
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <Pressable onClick={startGame} className={cn(ep.btnPrimary, "flex-1 py-3 rounded-xl flex items-center justify-center gap-2")}>
            <RotateCcw className="w-4 h-4" /> {t("play_again")}
          </Pressable>
          <Pressable onClick={quitToSetup} className={cn(ep.btnSecondary, "flex-1 py-3 rounded-xl")}>
            {t("back")}
          </Pressable>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(ep.gameFullscreen, "flex flex-col")}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white/90">
        <button type="button" onClick={quitToSetup} className={cn(ep.touchBtn, "text-slate-500")} aria-label={t("quit")}>
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Clock className={cn("w-4 h-4", CB_THEME.icon)} />
          <span className={cn("tabular-nums font-bold", timeLeft <= 5 && "text-rose-600")}>
            {timeLeft}s
          </span>
        </div>
        <span className="text-xs text-slate-400 tabular-nums">
          {roundIndex + 1}/{categories.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-6 gap-6">
        <motion.div
          key={letter}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-5xl font-black shadow-lg shadow-teal-600/25"
        >
          {letter}
        </motion.div>

        <div className="text-center space-y-2 max-w-sm">
          <p className={cn("text-xs font-bold uppercase tracking-widest", CB_THEME.accentFg)}>{t("category")}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {currentCategory ? tCat(currentCategory.id) : ""}
          </h3>
          <p className="text-sm text-slate-500">{currentCategory?.hintTr}</p>
        </div>

        {mode === "teams" && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-sm font-semibold">
            <Users className="w-4 h-4" />
            {team === "A" ? tTaboo("team_a") : tTaboo("team_b")}
            <span className="text-slate-400">·</span>
            <span className={CB_THEME.accentFg}>{t("points", { n: teamScores[team] })}</span>
          </div>
        )}

        <p className="text-center text-sm text-slate-600 max-w-xs leading-relaxed">{t("prompt")}</p>

        <AnimatePresence>
          {showHints && hintData.samples.length > 0 && (
            <motion.div
              key={`${letter}-${currentCategory?.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(ep.card, "p-4 w-full max-w-sm")}
            >
              <p className="text-xs font-bold text-amber-600 mb-2 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                {hintData.matchesLetter ? t("examples") : t("examples_general")}
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {hintData.samples.slice(0, 6).join(" · ")}
              </p>
              {!hintData.matchesLetter && (
                <p className="text-xs text-slate-400 mt-2">{t("hint_letter_note", { letter })}</p>
              )}
            </motion.div>
          )}
          {showHints && hintData.samples.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(ep.card, "p-4 w-full max-w-sm text-sm text-slate-600")}
            >
              <p className="flex items-center gap-1 text-xs font-bold text-amber-600 mb-2">
                <Lightbulb className="w-3.5 h-3.5" /> {t("hint")}
              </p>
              {currentCategory?.hintTr}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] grid grid-cols-3 gap-2 bg-white border-t border-slate-200">
        <Pressable
          type="button"
          onClick={() => setShowHints((v) => !v)}
          className={cn(
            ep.btnSecondary,
            "py-4 rounded-xl flex flex-col items-center gap-1 text-xs",
            showHints && "ring-2 ring-amber-400 bg-amber-50"
          )}
        >
          <Lightbulb className="w-5 h-5 text-amber-500" />
          {t("hint")}
        </Pressable>
        <Pressable
          onClick={handlePass}
          className={cn(ep.btnSecondary, "py-4 rounded-xl flex flex-col items-center gap-1 text-xs")}
        >
          <SkipForward className="w-5 h-5" />
          {t("pass")}
        </Pressable>
        <Pressable
          onClick={handleGotIt}
          className={cn(ep.btnSuccess, "py-4 rounded-xl flex flex-col items-center gap-1 text-xs")}
        >
          <Check className="w-5 h-5" />
          {t("got_it")}
        </Pressable>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className={cn(ep.surfaceMuted, "p-3")}>
      <p className={cn("text-xl font-bold tabular-nums", CB_THEME.accentFg)}>{value}</p>
      <p className="text-[10px] text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}
