"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Flame,
  Heart,
  Layers,
  Link2,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  buildRound,
  EMOJI_DECODE_MODES,
  getModeTutorial,
  PUZZLES_PER_ROUND,
  SCORE_CORRECT,
  SCORE_STREAK_BONUS,
  STARTING_LIVES,
} from "../lib/emoji-decode";
import type { EmojiDecodeMode, EmojiCluesRoundStats, EmojiPuzzleCategory } from "../types";
import { XP_REWARDS } from "../constants";
import { ep } from "../styles";
import { FadeUp, Pressable } from "./motion-primitives";

type Phase = "menu" | "playing" | "results";

type Props = {
  stats: {
    gamesPlayed: number;
    wordsGuessed: number;
    bestStreak: number;
    bestRound: number;
    bestScore: number;
  };
  onRoundComplete: (stats: EmojiCluesRoundStats) => void;
  onXp: (amount: number) => void;
};

const CATEGORIES: Array<EmojiPuzzleCategory | "all"> = [
  "all",
  "food",
  "animals",
  "nature",
  "people",
  "places",
  "daily",
];

const MODE_ICONS = {
  picture: Sparkles,
  combo: Layers,
  chain: Link2,
} as const;

function vibrate(pattern: number | number[] = 30) {
  if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(pattern);
}

export function EmojiCluesGameTab({ stats, onRoundComplete, onXp }: Props) {
  const t = useTranslations("EnglishPath.emoji_clues");
  const [phase, setPhase] = useState<Phase>("menu");
  const [mode, setMode] = useState<EmojiDecodeMode>("picture");
  const [category, setCategory] = useState<EmojiPuzzleCategory | "all">("all");
  const [questions, setQuestions] = useState<ReturnType<typeof buildRound>>([]);
  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreakRound, setBestStreakRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const question = questions[index];
  const ModeIcon = MODE_ICONS[mode];

  const startRound = () => {
    const round = buildRound(mode, category);
    setQuestions(round);
    setIndex(0);
    setLives(STARTING_LIVES);
    setScore(0);
    setStreak(0);
    setBestStreakRound(0);
    setCorrectCount(0);
    setWrongCount(0);
    setFeedback(null);
    setPicked(null);
    setLocked(false);
    setPhase("playing");
  };

  const endRound = useCallback(
    (final: EmojiCluesRoundStats) => {
      setPhase("results");
      onRoundComplete(final);
    },
    [onRoundComplete]
  );

  const handleAnswer = (option: string) => {
    if (!question || locked) return;
    setLocked(true);
    setPicked(option);
    const correct = option === question.answer;
    const isLast = index + 1 >= questions.length;

    if (correct) {
      const newStreak = streak + 1;
      const points = SCORE_CORRECT + newStreak * SCORE_STREAK_BONUS;
      const newScore = score + points;
      const newCorrect = correctCount + 1;
      const newBest = Math.max(bestStreakRound, newStreak);

      setStreak(newStreak);
      setBestStreakRound(newBest);
      setScore(newScore);
      setCorrectCount(newCorrect);
      setFeedback("correct");
      vibrate([20, 30, 20]);
      onXp(XP_REWARDS.emojiCluesCorrect + Math.min(newStreak, 5));

      setTimeout(() => {
        if (isLast) {
          endRound({
            correct: newCorrect,
            wrong: wrongCount,
            bestStreak: newBest,
            total: questions.length,
            score: newScore,
          });
        } else {
          setIndex((i) => i + 1);
          setFeedback(null);
          setPicked(null);
          setLocked(false);
        }
      }, 900);
    } else {
      const newWrong = wrongCount + 1;
      const nextLives = lives - 1;

      setStreak(0);
      setWrongCount(newWrong);
      setFeedback("wrong");
      vibrate([60, 40, 60]);
      setLives(nextLives);

      setTimeout(() => {
        if (nextLives <= 0 || isLast) {
          endRound({
            correct: correctCount,
            wrong: newWrong,
            bestStreak: bestStreakRound,
            total: questions.length,
            score,
          });
        } else {
          setIndex((i) => i + 1);
          setFeedback(null);
          setPicked(null);
          setLocked(false);
        }
      }, 1400);
    }
  };

  const renderEmojiRow = (emojis: string[], size: "sm" | "lg" = "lg") => (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2",
        size === "lg" ? "text-4xl sm:text-5xl" : "text-2xl"
      )}
    >
      {emojis.map((emoji, i) => (
        <span key={`${emoji}-${i}`} className="inline-flex items-center gap-2">
          {i > 0 && <span className="text-teal-500 font-bold text-xl sm:text-2xl">+</span>}
          <span>{emoji}</span>
        </span>
      ))}
    </div>
  );

  if (phase === "menu") {
    return (
      <div className="space-y-5 max-w-lg mx-auto pb-8">
        <FadeUp>
          <div className={cn(ep.heroGradient, "rounded-2xl p-6 text-white text-center shadow-lg")}>
            <p className="text-3xl mb-2">🧩</p>
            <h2 className="text-2xl font-bold">{t("title")}</h2>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">{t("tagline")}</p>
          </div>
        </FadeUp>

        <div className={cn(ep.card, "p-4 border-teal-100 bg-teal-50/50")}>
          <p className="text-sm font-semibold text-teal-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 shrink-0" />
            {t("rule_title")}
          </p>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">{t("rule_body")}</p>
        </div>

        <div>
          <p className={cn(ep.sectionLabel, "mb-2 px-1")}>{t("pick_mode")}</p>
          <div className="space-y-2">
            {EMOJI_DECODE_MODES.map((m) => {
              const Icon = MODE_ICONS[m];
              const tutorial = getModeTutorial(m);
              const active = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    ep.clickable,
                    "w-full text-left p-4 rounded-xl border transition-all",
                    active
                      ? "border-teal-400 bg-white ring-2 ring-teal-100 shadow-sm"
                      : "border-slate-200 bg-white hover:border-teal-200"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg shrink-0",
                        active ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800">{t(`modes.${m}.title`)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{t(`modes.${m}.rule`)}</p>
                      <div className="mt-3 py-2 px-3 rounded-lg bg-slate-50 border border-slate-100">
                        {renderEmojiRow([...tutorial.emojis], "sm")}
                        <p className="text-xs text-center mt-2 text-teal-700 font-semibold">
                          = {tutorial.answer}
                          <span className="text-slate-400 font-normal"> ({tutorial.hintTr})</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className={cn(ep.sectionLabel, "mb-2 px-1")}>{t("pick_category")}</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                  category === cat
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-teal-300"
                )}
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>
        </div>

        <div className={cn(ep.card, "p-3 text-center text-xs text-slate-500")}>
          {t("round_info", { count: PUZZLES_PER_ROUND, lives: STARTING_LIVES })}
        </div>

        <Pressable
          type="button"
          onClick={startRound}
          className={cn(ep.btnPrimary, "w-full py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2")}
        >
          <Play className="w-5 h-5" />
          {t("start")}
        </Pressable>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className={cn(ep.card, "p-2")}>
            <p className="text-base font-bold text-slate-800">{stats.gamesPlayed}</p>
            <p className="text-[9px] text-slate-400 uppercase">{t("stat_games")}</p>
          </div>
          <div className={cn(ep.card, "p-2")}>
            <p className="text-base font-bold text-slate-800">{stats.wordsGuessed}</p>
            <p className="text-[9px] text-slate-400 uppercase">{t("stat_words")}</p>
          </div>
          <div className={cn(ep.card, "p-2")}>
            <p className="text-base font-bold text-amber-600">{stats.bestStreak}</p>
            <p className="text-[9px] text-slate-400 uppercase">{t("stat_streak")}</p>
          </div>
          <div className={cn(ep.card, "p-2")}>
            <p className="text-base font-bold text-teal-600">{stats.bestScore}</p>
            <p className="text-[9px] text-slate-400 uppercase">{t("stat_score")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "results") {
    const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    return (
      <div className={cn(ep.gameFullscreen, "items-center justify-center p-6 max-w-md mx-auto")}>
        <Trophy className="w-14 h-14 text-amber-500 mb-3" />
        <h2 className="text-2xl font-bold text-slate-800">{lives > 0 ? t("round_clear") : t("round_over")}</h2>
        <p className="text-4xl font-black text-teal-600 mt-3 tabular-nums">{score}</p>
        <p className="text-sm text-slate-500">{t("points")}</p>
        <p className="text-sm text-slate-600 mt-4">
          {correctCount}/{questions.length} {t("correct_label")} · %{pct}
        </p>
        {bestStreakRound > 1 && (
          <p className="text-sm text-amber-600 font-medium mt-2 flex items-center gap-1">
            <Flame className="w-4 h-4" /> {t("best_streak", { n: bestStreakRound })}
          </p>
        )}
        <div className="flex gap-3 w-full mt-8">
          <button type="button" onClick={() => setPhase("menu")} className={cn(ep.btnSecondary, "flex-1 py-3 rounded-xl")}>
            {t("menu")}
          </button>
          <button
            type="button"
            onClick={startRound}
            className={cn(ep.btnPrimary, "flex-1 py-3 rounded-xl flex items-center justify-center gap-2")}
          >
            <RotateCcw className="w-4 h-4" /> {t("again")}
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className={cn(ep.gameFullscreen, "safe-area-pad max-w-lg mx-auto pb-4")}>
      <div className="flex items-center justify-between px-3 pt-3 gap-2">
        <button
          type="button"
          onClick={() => setPhase("menu")}
          className="p-2 rounded-xl bg-white border border-slate-200"
          aria-label={t("quit")}
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: STARTING_LIVES }).map((_, i) => (
            <Heart
              key={i}
              className={cn(
                "w-5 h-5 transition-colors",
                i < lives ? "fill-rose-500 text-rose-500" : "fill-slate-200 text-slate-200"
              )}
            />
          ))}
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-400">{t("question_label")}</p>
          <p className="text-sm font-bold text-slate-800 tabular-nums">
            {index + 1}/{questions.length}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-1.5 px-3 mt-2">
        {questions.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full max-w-8 transition-colors",
              i < index ? "bg-teal-500" : i === index ? "bg-teal-300" : "bg-slate-200"
            )}
          />
        ))}
      </div>

      <div className="flex items-center justify-between px-3 mt-3 text-sm">
        <span className="inline-flex items-center gap-1 text-teal-700 font-semibold bg-teal-50 px-2 py-1 rounded-full text-xs">
          <ModeIcon className="w-3.5 h-3.5" />
          {t(`modes.${mode}.title`)}
        </span>
        <span className="font-mono font-bold text-slate-700 tabular-nums">{score} pt</span>
        {streak > 0 && (
          <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-xs">
            <Flame className="w-3.5 h-3.5" /> {streak}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={cn(
            ep.card,
            "mx-3 mt-4 p-6 text-center border-2 transition-colors",
            feedback === "correct" && "border-emerald-400 bg-emerald-50",
            feedback === "wrong" && "border-rose-400 bg-rose-50"
          )}
        >
          <p className="text-sm font-medium text-slate-700 mb-4">{t(`modes.${mode}.prompt`)}</p>
          {renderEmojiRow(question.emojis)}
          <p className="text-xs text-slate-400 mt-4">{t(`modes.${mode}.hint`)}</p>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 pt-4 border-t border-slate-200/80"
              >
                <p className="text-base font-bold text-slate-800">{question.answer}</p>
                <p className="text-sm text-teal-700">{question.hintTr}</p>
                {feedback === "wrong" && picked && (
                  <p className="text-xs text-rose-600 mt-1">{t("wrong_pick", { word: picked })}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-2 p-3 mt-2">
        {question.options.map((opt) => {
          const isPicked = picked === opt;
          const isCorrect = opt === question.answer;
          const show = locked && feedback;

          return (
            <button
              key={opt}
              type="button"
              disabled={locked}
              onClick={() => handleAnswer(opt)}
              className={cn(
                ep.touchBtn,
                ep.clickable,
                "py-4 px-3 rounded-xl border-2 font-semibold text-sm transition-colors",
                !show && "border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:bg-teal-50",
                show && isCorrect && "border-emerald-500 bg-emerald-100 text-emerald-900",
                show && isPicked && !isCorrect && "border-rose-500 bg-rose-100 text-rose-900",
                show && !isPicked && !isCorrect && "opacity-45",
                locked && !show && "opacity-60"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
