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
  if (state === "correct")
    return "bg-emerald-500 text-white border-emerald-400/60 shadow-sm shadow-emerald-500/20";
  if (state === "wrong") return "bg-rose-500/90 text-white border-rose-400/50";
  if (state === "passed") return "bg-amber-50 text-amber-700 border-amber-200/80";
  if (isCurrent)
    return "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30 scale-[1.18] z-10";
  return "bg-white/90 text-slate-400 border-slate-200/70 shadow-sm backdrop-blur-sm";
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
      const nextStats = { ...roundStats };
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
    if (revealAnswer && feedback) return revealAnswer;
    if (!currentQuestion) return "";
    return isTr ? currentQuestion.clueTr : currentQuestion.clueEn;
  }, [currentQuestion, isTr, revealAnswer, feedback]);

  const activeLetter = currentQuestion?.letter ?? "A";

  const timerPct = Math.round((timeLeft / roundDuration) * 100);
  const lettersDone = roundStats.correct + roundStats.wrong + roundStats.passed;
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
              <p className="text-[11px] uppercase tracking-wide text-slate-400">{s.label}</p>
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
    <div className={cn(ep.gameFullscreen, "md:relative md:inset-auto bg-[#f1f5f9] md:bg-transparent")}>
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 sm:px-6 py-4 md:py-8 gap-6 md:gap-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={quitToSetup}
            className={cn(
              ep.clickable,
              "flex items-center justify-center w-10 h-10 rounded-full bg-white/80 border border-slate-200/80 text-slate-500 hover:bg-white hover:text-slate-700 shadow-sm"
            )}
            aria-label={t("quit")}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200/80 shadow-sm">
              <Clock className={cn("w-3.5 h-3.5", timeLeft <= 15 ? "text-rose-500" : "text-blue-500")} />
              <span
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  timeLeft <= 15 ? "text-rose-600" : "text-slate-700"
                )}
              >
                {timeLeft}s
              </span>
            </div>
            <span className={cn(themeStatBadge(PP_THEME), "shadow-sm")}>
              {roundStats.correct}/26
            </span>
          </div>
        </div>

        {/* Timer bar */}
        <div className="h-1 rounded-full bg-slate-200/80 overflow-hidden shrink-0 -mt-2">
          <div
            className={cn(
              "h-full transition-all duration-1000 ease-linear",
              timeLeft <= 15 ? "bg-rose-500" : themeProgressBar(PP_THEME)
            )}
            style={{ width: `${timerPct}%` }}
          />
        </div>

        {/* Main grid: wheel + panel */}
        <div className="flex-1 grid md:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:grid-cols-[minmax(0,1fr)_380px] gap-8 md:gap-10 lg:gap-12 items-center min-h-0">
          {/* Letter ring */}
          <div className="relative w-full max-w-[min(100%,440px)] mx-auto aspect-square">
            <div className="absolute inset-[6%] rounded-full bg-gradient-to-br from-white to-slate-50 border border-slate-200/60 shadow-[inset_0_2px_12px_rgba(15,23,42,0.04)]" />
            <div className="absolute inset-[10%] rounded-full border border-dashed border-slate-200/50" />

            {PASSAPAROLA_LETTERS.map((letter, i) => {
              const pos = letterPosition(i, 26, 44);
              const state = letterStates[i] ?? "pending";
              const isCurrent = i === currentIndex && !feedback;
              return (
                <div
                  key={letter}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <div
                    className={cn(
                      "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-[11px] md:text-xs font-bold border transition-all duration-300",
                      letterBg(state, isCurrent)
                    )}
                  >
                    {letter}
                  </div>
                </div>
              );
            })}

            <div className="absolute inset-[30%] rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.06)] flex flex-col items-center justify-center text-center">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-0.5">
                {t("score_label")}
              </p>
              <p className={cn("text-4xl font-black tabular-nums leading-none", themeAccentText(PP_THEME))}>
                {roundStats.correct}
              </p>
              {streak > 1 && (
                <p className="text-[11px] text-amber-600 font-semibold mt-2 px-2 py-0.5 rounded-full bg-amber-50">
                  {t("streak", { n: streak })}
                </p>
              )}
            </div>
          </div>

          {/* Interaction panel */}
          <div className="flex flex-col gap-4 md:gap-5 w-full max-w-md md:max-w-none mx-auto md:mx-0">
            {/* Active letter + progress */}
            <div className="flex items-center gap-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLetter + (feedback ?? "")}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className={cn(
                    "w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black shrink-0 shadow-lg",
                    feedback === "correct"
                      ? "bg-emerald-500 text-white shadow-emerald-500/25"
                      : feedback === "wrong"
                        ? "bg-rose-500 text-white shadow-rose-500/25"
                        : "bg-blue-600 text-white shadow-blue-600/25"
                  )}
                >
                  {activeLetter}
                </motion.div>
              </AnimatePresence>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
                  {feedback === "correct"
                    ? t("correct")
                    : feedback === "wrong"
                      ? t("wrong")
                      : t("current_letter")}
                </p>
                <p className="text-sm text-slate-500 leading-snug tabular-nums">
                  {lettersDone} / 26
                </p>
              </div>
            </div>

            {/* Clue card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion?.id ?? "empty"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "rounded-2xl border p-5 sm:p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-colors duration-300",
                  feedback === "correct"
                    ? "bg-emerald-50 border-emerald-200/80"
                    : feedback === "wrong"
                      ? "bg-rose-50 border-rose-200/80"
                      : "bg-white border-slate-200/80"
                )}
              >
                <p
                  className={cn(
                    "text-base sm:text-lg leading-relaxed font-medium",
                    feedback === "correct"
                      ? "text-emerald-800 capitalize"
                      : feedback === "wrong"
                        ? "text-rose-800 capitalize"
                        : "text-slate-700"
                  )}
                >
                  {clueText}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Input card */}
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] space-y-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
            >
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
                  "w-full px-4 py-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-base text-slate-800 placeholder:text-slate-400",
                  "focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10",
                  "disabled:opacity-50 transition-all"
                )}
              />
              <div className="flex gap-3">
                <Pressable
                  type="button"
                  onClick={() => processResult("pass")}
                  disabled={!!feedback}
                  className={cn(
                    ep.btnSecondary,
                    "flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 border-slate-200/80 hover:bg-slate-50"
                  )}
                >
                  <SkipForward className="w-4 h-4 text-amber-600" />
                  {t("pass")}
                </Pressable>
                <Pressable
                  type="submit"
                  disabled={!!feedback || !guess.trim()}
                  className={cn(
                    "flex-[1.2] py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-white",
                    "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20",
                    "disabled:opacity-40 disabled:shadow-none transition-all active:scale-[0.98]"
                  )}
                >
                  <Check className="w-4 h-4" />
                  {t("submit")}
                </Pressable>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
