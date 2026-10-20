"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { GAME_THEMES } from "../lib/game-themes";
import { cardsForLevel, pickDistractors, shortMeaning, shuffle } from "../lib/vocab";
import { ep } from "../styles";
import type { Flashcard } from "../types";
import { VocabResult, VocabSetup } from "./vocab-game-kit";
import type { VocabGameProps } from "./vocab-game-types";

const THEME = GAME_THEMES.word_sprint;
const DURATIONS = [45, 60, 90] as const;
const MIN_POOL = 12;

type Phase = "setup" | "playing" | "done";
type Direction = "en_tr" | "tr_en";
type Question = { card: Flashcard; direction: Direction; options: string[]; correct: string };

function buildQuestion(card: Flashcard, pool: Flashcard[]): Question {
  const direction: Direction = Math.random() < 0.5 ? "en_tr" : "tr_en";
  const field = direction === "en_tr" ? "back" : "front";
  const correct = direction === "en_tr" ? shortMeaning(card) : card.front;
  const options = shuffle([correct, ...pickDistractors(card, pool, 3, field)]);
  return { card, direction, options, correct };
}

/** Timed multiple choice between English words and Turkish meanings, with streak bonuses. */
export function WordSprintGameTab({ level, onLevelChange, stats, onFinish, onReview, onPlayingChange }: VocabGameProps) {
  const t = useTranslations("EnglishPath.vocab_games");
  const [phase, setPhase] = useState<Phase>("setup");
  const [duration, setDuration] = useState<(typeof DURATIONS)[number]>(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [question, setQuestion] = useState<Question | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [asked, setAsked] = useState(0);
  const [streak, setStreak] = useState(0);
  const [result, setResult] = useState<{ xp: number; best: boolean } | null>(null);

  const queueRef = useRef<Flashcard[]>([]);
  const scoreRef = useRef({ score: 0, correct: 0, asked: 0 });
  const poolRef = useRef<Flashcard[]>([]);
  const nextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (nextTimerRef.current) clearTimeout(nextTimerRef.current);
    },
    []
  );

  const pool = cardsForLevel(level);

  useEffect(() => {
    onPlayingChange?.(phase === "playing");
    return () => onPlayingChange?.(false);
  }, [phase, onPlayingChange]);

  const nextQuestion = useCallback(() => {
    if (queueRef.current.length === 0) queueRef.current = shuffle(poolRef.current);
    const card = queueRef.current.pop() as Flashcard;
    setQuestion(buildQuestion(card, poolRef.current));
    setPicked(null);
  }, []);

  const finish = useCallback(() => {
    const { score: s, correct: c, asked: a } = scoreRef.current;
    const best = s > (stats?.best ?? 0);
    onFinish("word_sprint", { score: s, correct: c, total: a });
    setResult({ xp: c * 8 + 20, best });
    setPhase("done");
  }, [stats?.best, onFinish]);

  // Countdown. The round ends from inside the interval callback.
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setTimeout(finish, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, finish]);

  const start = () => {
    poolRef.current = pool;
    queueRef.current = shuffle(pool);
    scoreRef.current = { score: 0, correct: 0, asked: 0 };
    setScore(0);
    setCorrect(0);
    setAsked(0);
    setStreak(0);
    setTimeLeft(duration);
    nextQuestion();
    setPhase("playing");
  };

  const answer = (option: string) => {
    if (!question || picked !== null || timeLeft === 0) return;
    setPicked(option);
    const right = option === question.correct;
    const nextStreak = right ? streak + 1 : 0;
    const gained = right ? 10 + Math.min(10, Math.floor(nextStreak / 3) * 5) : 0;

    scoreRef.current = {
      score: scoreRef.current.score + gained,
      correct: scoreRef.current.correct + (right ? 1 : 0),
      asked: scoreRef.current.asked + 1,
    };
    setScore(scoreRef.current.score);
    setCorrect(scoreRef.current.correct);
    setAsked(scoreRef.current.asked);
    setStreak(nextStreak);
    onReview(question.card.id, right);
    nextTimerRef.current = setTimeout(nextQuestion, right ? 350 : 900);
  };

  if (phase === "setup") {
    return (
      <VocabSetup
        theme={THEME}
        icon={Zap}
        title={t("word_sprint.title")}
        description={t("word_sprint.desc")}
        level={level}
        onLevelChange={onLevelChange}
        poolSize={pool.length}
        minWords={MIN_POOL}
        onStart={start}
        best={stats?.best}
        gamesPlayed={stats?.gamesPlayed}
      >
        <div className="space-y-2">
          <p className={ep.sectionLabel}>{t("word_sprint.duration")}</p>
          <div className="flex gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={cn(ep.chip, "min-h-[40px] px-4", duration === d && ep.chipActive)}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>
      </VocabSetup>
    );
  }

  if (phase === "done" && result) {
    return (
      <VocabResult
        theme={THEME}
        score={score}
        total={asked}
        correct={correct}
        xp={result.xp}
        isNewBest={result.best}
        onReplay={start}
        onSetup={() => setPhase("setup")}
      />
    );
  }

  const prompt = question ? (question.direction === "en_tr" ? question.card.front : shortMeaning(question.card)) : "";

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <span
          className={cn("text-3xl font-bold tabular-nums", timeLeft <= 10 ? "text-rose-600" : "text-slate-900")}
          role="timer"
          aria-label={t("word_sprint.time_left", { n: timeLeft })}
        >
          {timeLeft}s
        </span>
        <div className="text-right text-sm">
          <p className="font-semibold tabular-nums text-slate-800">{t("score_live", { n: score })}</p>
          {streak >= 3 && <p className="text-amber-600 font-semibold">{t("word_sprint.streak", { n: streak })}</p>}
        </div>
      </div>

      <div className={cn(ep.card, "p-8 text-center space-y-1")}>
        <p className={ep.sectionLabel}>
          {question?.direction === "en_tr" ? t("word_sprint.to_turkish") : t("word_sprint.to_english")}
        </p>
        <p className="text-3xl font-bold text-slate-900">{prompt}</p>
        {question?.direction === "en_tr" && <p className="text-xs text-slate-400">{question.card.phonetic}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question?.options.map((option) => {
          const isPicked = picked === option;
          const isRight = option === question.correct;
          return (
            <button
              key={option}
              type="button"
              disabled={picked !== null}
              onClick={() => answer(option)}
              className={cn(
                ep.touchBtn,
                "min-h-[56px] rounded-xl border-2 px-4 text-base font-semibold transition-colors",
                picked === null && "border-slate-200 bg-white text-slate-800 hover:border-amber-400 hover:bg-amber-50",
                picked !== null && isRight && "border-emerald-500 bg-emerald-50 text-emerald-800",
                picked !== null && isPicked && !isRight && "border-rose-500 bg-rose-50 text-rose-800",
                picked !== null && !isPicked && !isRight && "border-slate-100 bg-slate-50 text-slate-400"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
