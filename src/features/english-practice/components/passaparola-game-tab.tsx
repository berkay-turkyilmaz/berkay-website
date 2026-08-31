"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  CircleDot,
  Clock,
  Play,
  RotateCcw,
  SkipForward,
  Trophy,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  PASSAPAROLA_DIFFICULTY_COUNTS,
  PASSAPAROLA_LETTERS,
} from "../data/passaparola-questions";
import type {
  PassaparolaDifficulty,
  PassaparolaQuestion,
  PassaparolaRoundStats,
} from "../types";
import { XP_REWARDS } from "../constants";
import { GAME_THEMES } from "../lib/game-themes";
import {
  buildInitialQueue,
  buildPassaparolaRound,
  checkPassaparolaAnswer,
  letterPosition,
  type LetterState,
} from "../lib/passaparola-engine";
import { themeAccentText, themeChip, themeProgressBar, themeStatBadge } from "../lib/theme-utils";
import { ep } from "../styles";
import { GameTimerSlider } from "./game-timer-slider";
import { FadeUp, Pressable } from "./motion-primitives";

const PP_THEME = GAME_THEMES.passaparola;

type Phase = "setup" | "playing" | "round_end";

type Props = {
  roundDuration: number;
  onRoundDurationChange: (seconds: number) => void;
  stats: {
    gamesPlayed: number;
    wordsCorrect: number;
    bestRound: number;
    bestStreak: number;
  };
  onRoundComplete: (stats: PassaparolaRoundStats) => void;
  onXp: (amount: number) => void;
  onPlayingChange?: (playing: boolean) => void;
};

function letterBg(state: LetterState, isCurrent: boolean): string {
  if (state === "correct") return "bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/30";
  if (state === "wrong") return "bg-rose-600 text-white border-rose-700";
  if (state === "passed") return "bg-amber-400 text-amber-950 border-amber-500";
  if (isCurrent) return "bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300 scale-110 shadow-lg shadow-blue-500/40";
  return "bg-rose-500 text-white border-rose-600";
}

export function PassaparolaGameTab({
  roundDuration,
  onRoundDurationChange,
  stats,
  onRoundComplete,
  onXp,
  onPlayingChange,
}: Props) {
  const t = useTranslations("EnglishPath.passaparola");
  const locale = useLocale();
  const isTr = locale.startsWith("tr");

  const [phase, setPhase] = useState<Phase>("setup");
  const [difficulty, setDifficulty] = useState<PassaparolaDifficulty | "all">("easy");
  const [questions, setQuestions] = useState<PassaparolaQuestion[]>([]);
  const [letterStates, setLetterStates] = useState<LetterState[]>(
    () => PASSAPAROLA_LETTERS.map(() => "pending" as LetterState)
  );
  const [queue, setQueue] = useState<number[]>([]);
  const [queuePos, setQueuePos] = useState(0);
  const [deferred, setDeferred] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(roundDuration);
  const [guess, setGuess] = useState("");
  const [streak, setStreak] = useState(0);
  const [roundStats, setRoundStats] = useState<PassaparolaRoundStats>({
    correct: 0,
    passed: 0,
    wrong: 0,
    total: 26,
  });
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [revealAnswer, setRevealAnswer] = useState<string | null>(null);
  const [missedReview, setMissedReview] = useState<PassaparolaQuestion[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentIndex = queue[queuePos];
  const currentQuestion = currentIndex !== undefined ? questions[currentIndex] : undefined;

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

  const endRound = useCallback(
    (final: PassaparolaRoundStats, missed: PassaparolaQuestion[]) => {
      if (endedRef.current) return;
      endedRef.current = true;
      clearTimer();
      setMissedReview(missed);
      setPhase("round_end");
      onRoundComplete(final);
    },
    [onRoundComplete]
  );

  const getMissed = useCallback(
    (states: LetterState[]) =>
      questions.filter((_, i) => states[i] !== "correct"),
    [questions]
  );

  const advanceOrEnd = useCallback(
    (
      nextStats: PassaparolaRoundStats,
      nextStates: LetterState[],
      nextQueuePos: number,
      nextQueue: number[],
      nextDeferred: number[]
    ) => {
      if (nextQueuePos >= nextQueue.length) {
      if (nextDeferred.length > 0) {
        const first = nextDeferred[0]!;
        setQueue([...nextDeferred]);
        setDeferred([]);
        setQueuePos(0);
        setLetterStates(
          nextStates.map((s, i) =>
            i === first ? "active" : s === "active" ? "pending" : s
          )
        );
        return;
      }
        endRound(nextStats, getMissed(nextStates));
        return;
      }
      const nextLetter = nextQueue[nextQueuePos];
      setLetterStates(
        nextStates.map((s, i) =>
          i === nextLetter ? "active" : s === "active" ? "pending" : s
        )
      );
      setQueuePos(nextQueuePos);
    },
    [endRound, getMissed]
  );

  const startGame = () => {
    const qs = buildPassaparolaRound(difficulty);
    const initialQueue = buildInitialQueue();
    setQuestions(qs);
    setLetterStates(PASSAPAROLA_LETTERS.map((_, i) => (i === 0 ? "active" : "pending")));
    setQueue(initialQueue);
    setQueuePos(0);
    setDeferred([]);
    setTimeLeft(roundDuration);
    setGuess("");
    setStreak(0);
    setRoundStats({ correct: 0, passed: 0, wrong: 0, total: 26 });
    setFeedback(null);
    setRevealAnswer(null);
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
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && timeLeft === 0) {
      endRound(roundStats, getMissed(letterStates));
    }
  }, [timeLeft, phase, endRound, roundStats, letterStates, getMissed]);

  useEffect(() => {
    if (phase === "playing") {
      inputRef.current?.focus();
    }
  }, [phase, queuePos, feedback]);

  const processResult = useCallback(
    (kind: "correct" | "wrong" | "pass") => {
      if (!currentQuestion || currentIndex === undefined || feedback) return;

      const nextStates = [...letterStates];
      let nextStats = { ...roundStats };
      let nextDeferred = [...deferred];

      if (kind === "correct") {
        nextStates[currentIndex] = "correct";
        nextStats.correct += 1;
        const newStreak = streak + 1;
        setStreak(newStreak);
        onXp(XP_REWARDS.passaparolaCorrect + Math.min(newStreak, 5));
        setFeedback("correct");
        setRevealAnswer(currentQuestion.answer);
      } else if (kind === "wrong") {
        nextStates[currentIndex] = "wrong";
        nextStats.wrong += 1;
        setStreak(0);
        setFeedback("wrong");
        setRevealAnswer(currentQuestion.answer);
      } else {
        nextStates[currentIndex] = "passed";
        nextStats.passed += 1;
        setStreak(0);
        if (!nextDeferred.includes(currentIndex)) {
          nextDeferred = [...nextDeferred, currentIndex];
        }
        setDeferred(nextDeferred);
        setGuess("");
        advanceOrEnd(nextStats, nextStates, queuePos + 1, queue, nextDeferred);
        return;
      }

      setLetterStates(nextStates);
      setRoundStats(nextStats);
      setGuess("");

      setTimeout(() => {
        setFeedback(null);
        setRevealAnswer(null);
        advanceOrEnd(nextStats, nextStates, queuePos + 1, queue, nextDeferred);
      }, 1200);
    },
    [
      currentQuestion,
      currentIndex,
      feedback,
      letterStates,
      roundStats,
      deferred,
      streak,
      onXp,
      advanceOrEnd,
      queuePos,
      queue,
    ]
  );

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!currentQuestion || feedback) return;
    const ok = checkPassaparolaAnswer(currentQuestion, guess);
    processResult(ok ? "correct" : "wrong");
  };

  const quitToSetup = () => {
    clearTimer();
    setPhase("setup");
  };

  const clueText = useMemo(() => {
    if (revealAnswer && feedback) {
      return revealAnswer;
    }
    if (!currentQuestion) return "";
    const clue = isTr ? currentQuestion.clueTr : currentQuestion.clueEn;
    return `${clue} —${currentQuestion.letter}—`;
  }, [currentQuestion, isTr, revealAnswer, feedback]);

  const timerPct = Math.round((timeLeft / roundDuration) * 100);
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
            style={{ boxShadow: `0 20px 40px ${PP_THEME.heroGlow}` }}
          >
            <CircleDot className="w-10 h-10 mx-auto mb-2 text-amber-300" />
            <h2 className="text-2xl sm:text-3xl font-bold">{t("title")}</h2>
            <p className="text-slate-300 text-sm leading-relaxed mt-2">{t("subtitle")}</p>
          </div>
        </FadeUp>

        <div className={cn(ep.card, "p-5 space-y-3")}>
          <p className={cn("text-xs font-bold uppercase tracking-widest", PP_THEME.accentFg)}>
            {t("how_title")}
          </p>
          <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
            <li>{t("how_1")}</li>
            <li>{t("how_2")}</li>
            <li>{t("how_3")}</li>
            <li>{t("how_4")}</li>
          </ol>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {difficulties.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={cn(themeChip(PP_THEME, difficulty === d))}
            >
              {d === "all" ? t("all") : t(`diff.${d}`)}
              {d !== "all" && (
                <span className="ml-1 opacity-60">({PASSAPAROLA_DIFFICULTY_COUNTS[d]})</span>
              )}
            </button>
          ))}
        </div>

        <GameTimerSlider
          label={t("timer")}
          value={roundDuration}
          onChange={onRoundDurationChange}
          min={60}
          max={300}
          step={30}
          theme={PP_THEME}
        />

        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: t("stats.games"), value: stats.gamesPlayed },
            { label: t("stats.best"), value: stats.bestRound },
            { label: t("stats.words"), value: stats.wordsCorrect },
          ].map((s) => (
            <div key={s.label} className={cn(ep.card, "p-3")}>
              <p className="text-lg font-bold text-slate-800 tabular-nums">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        <Pressable
          onClick={startGame}
          className={cn(
            ep.btnPrimary,
            "w-full py-4 rounded-xl text-base flex items-center justify-center gap-2"
          )}
        >
          <Play className="w-5 h-5" /> {t("start")}
        </Pressable>
      </div>
    );
  }

  if (phase === "round_end") {
    const scorePct = Math.round((roundStats.correct / 26) * 100);
    return (
      <div className="space-y-6 max-w-lg mx-auto pb-8">
        <FadeUp>
          <div className={cn(ep.card, "p-8 text-center space-y-4")}>
            <Trophy className={cn("w-12 h-12 mx-auto", PP_THEME.icon)} />
            <h2 className="text-2xl font-bold text-slate-900">{t("round_complete")}</h2>
            <p className="text-4xl font-black text-slate-800 tabular-nums">
              {roundStats.correct}
              <span className="text-xl text-slate-400 font-semibold">/26</span>
            </p>
            <p className={themeStatBadge(PP_THEME)}>{scorePct}%</p>
            <div className="flex justify-center gap-4 text-sm text-slate-500">
              <span>{t("passed")}: {roundStats.passed}</span>
              <span>{t("wrong_count")}: {roundStats.wrong}</span>
            </div>
          </div>
        </FadeUp>

        {missedReview.length > 0 && (
          <div className={cn(ep.card, "p-5 space-y-3 max-h-64 overflow-y-auto")}>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {t("review_title")}
            </p>
            <ul className="space-y-2">
              {missedReview.map((q) => (
                <li
                  key={q.id}
                  className="flex items-start gap-3 text-sm border-b border-slate-100 pb-2 last:border-0"
                >
                  <span className="font-bold text-blue-600 w-6 shrink-0">{q.letter}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 capitalize">{q.answer}</p>
                    <p className="text-slate-500 text-xs leading-snug">
                      {isTr ? q.clueTr : q.clueEn}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          <Pressable
            onClick={startGame}
            className={cn(ep.btnPrimary, "flex-1 py-3 rounded-xl flex items-center justify-center gap-2")}
          >
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
    <div className={cn(ep.gameFullscreen, "md:relative md:inset-auto")}>
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-3 py-3 md:py-4 gap-3">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={quitToSetup}
            className={cn(ep.clickable, "p-2 rounded-lg text-slate-500 hover:bg-slate-100")}
            aria-label={t("quit")}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="tabular-nums">{timeLeft}s</span>
          </div>
          <span className={themeStatBadge(PP_THEME)}>
            {roundStats.correct}/{26}
          </span>
        </div>

        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden shrink-0">
          <div
            className={cn("h-full transition-all duration-1000", themeProgressBar(PP_THEME))}
            style={{ width: `${timerPct}%` }}
          />
        </div>

        {/* Letter ring */}
        <div className="relative flex-1 min-h-[220px] max-h-[min(52vw,320px)] mx-auto w-full aspect-square">
          <div className="absolute inset-[8%] rounded-full border-2 border-dashed border-slate-200/80" />
          {PASSAPAROLA_LETTERS.map((letter, i) => {
            const pos = letterPosition(i);
            const state = letterStates[i] ?? "pending";
            const isCurrent = i === currentIndex && !feedback;
            return (
              <div
                key={letter}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <div
                  className={cn(
                    "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border shadow-sm transition-all duration-200",
                    letterBg(state, isCurrent)
                  )}
                >
                  {letter}
                </div>
              </div>
            );
          })}
          <div className="absolute inset-[28%] rounded-full bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center p-3">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">
              {t("score_label")}
            </p>
            <p className={cn("text-3xl font-black tabular-nums", themeAccentText(PP_THEME))}>
              {roundStats.correct}
            </p>
            {streak > 1 && (
              <p className="text-xs text-amber-600 font-semibold mt-1">
                {t("streak", { n: streak })}
              </p>
            )}
          </div>
        </div>

        {/* Clue box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion?.id ?? "empty"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={cn(
              "rounded-2xl p-5 text-center shadow-lg shrink-0 transition-colors duration-300",
              feedback === "correct"
                ? "bg-emerald-600"
                : feedback === "wrong"
                  ? "bg-rose-600"
                  : "bg-gradient-to-br from-blue-700 to-blue-900"
            )}
          >
            <p
              className={cn(
                "text-lg sm:text-xl font-bold leading-snug",
                feedback ? "text-white capitalize" : "text-amber-300"
              )}
            >
              {clueText}
            </p>
            {feedback === "correct" && (
              <p className="text-emerald-100 text-sm mt-2 flex items-center justify-center gap-1">
                <Check className="w-4 h-4" /> {t("correct")}
              </p>
            )}
            {feedback === "wrong" && (
              <p className="text-rose-100 text-sm mt-2 flex items-center justify-center gap-1">
                <X className="w-4 h-4" /> {t("wrong")}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Input */}
        <form onSubmit={handleSubmit} className="space-y-3 shrink-0 pb-[env(safe-area-inset-bottom)]">
          <input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={!!feedback}
            placeholder={t("input_placeholder")}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className={cn(
              "w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 text-base font-medium",
              "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
              "disabled:opacity-60 disabled:bg-slate-50"
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <Pressable
              type="button"
              onClick={() => processResult("pass")}
              disabled={!!feedback}
              className={cn(
                ep.btnSecondary,
                "py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold border-amber-200 text-amber-800 hover:bg-amber-50"
              )}
            >
              <SkipForward className="w-4 h-4" /> {t("pass")}
            </Pressable>
            <Pressable
              type="submit"
              disabled={!!feedback || !guess.trim()}
              className={cn(
                ep.btnPrimary,
                "py-3.5 rounded-xl flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
              )}
            >
              <Check className="w-4 h-4" /> {t("submit")}
            </Pressable>
          </div>
        </form>
      </div>
    </div>
  );
}
