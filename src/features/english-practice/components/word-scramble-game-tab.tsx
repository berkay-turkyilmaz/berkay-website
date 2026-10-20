"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Delete, Lightbulb, SkipForward, Shuffle } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { GAME_THEMES } from "../lib/game-themes";
import { letterGamePool, normalizeWord, sample, scrambleWord, shortMeaning } from "../lib/vocab";
import { ep } from "../styles";
import type { Flashcard } from "../types";
import { ProgressBar, VocabResult, VocabSetup } from "./vocab-game-kit";
import type { VocabGameProps } from "./vocab-game-types";
import { themeBtnPrimary } from "../lib/theme-utils";

const THEME = GAME_THEMES.word_scramble;
const ROUND_SIZE = 10;
const POINTS = { correct: 10, hintPenalty: 3, minPerWord: 3 } as const;

type Phase = "setup" | "playing" | "done";
type Letter = { id: number; char: string };

function makeLetters(word: string): Letter[] {
  return scrambleWord(word.toLowerCase()).split("").map((char, id) => ({ id, char }));
}

/** Unscramble the letters using the Turkish meaning as the clue. */
export function WordScrambleGameTab({ level, onLevelChange, stats, onFinish, onReview, onPlayingChange }: VocabGameProps) {
  const t = useTranslations("EnglishPath.vocab_games");
  const [phase, setPhase] = useState<Phase>("setup");
  const [words, setWords] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [result, setResult] = useState<{ xp: number; best: boolean } | null>(null);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms));
  }, []);
  useEffect(
    () => () => {
      timersRef.current.forEach(clearTimeout);
    },
    []
  );

  const pool = letterGamePool(level);
  const current = words[index];

  useEffect(() => {
    onPlayingChange?.(phase === "playing");
    return () => onPlayingChange?.(false);
  }, [phase, onPlayingChange]);

  const loadWord = useCallback((card: Flashcard) => {
    setLetters(makeLetters(card.front));
    setPicked([]);
    setHints(0);
    setFeedback("idle");
  }, []);

  const start = useCallback(() => {
    const chosen = sample(pool, ROUND_SIZE);
    setWords(chosen);
    setIndex(0);
    setScore(0);
    setCorrect(0);
    loadWord(chosen[0]);
    setPhase("playing");
  }, [pool, loadWord]);

  const next = useCallback(
    (finalScore: number, finalCorrect: number) => {
      if (index + 1 >= words.length) {
        const best = finalScore > (stats?.best ?? 0);
        onFinish("word_scramble", { score: finalScore, correct: finalCorrect, total: words.length });
        setResult({ xp: finalCorrect * 8 + 20, best });
        setPhase("done");
        return;
      }
      setIndex(index + 1);
      loadWord(words[index + 1]);
    },
    [index, words, stats?.best, onFinish, loadWord]
  );

  const submit = (sequence: number[]) => {
    if (!current) return;
    const attempt = sequence.map((id) => letters.find((l) => l.id === id)?.char ?? "").join("");
    if (normalizeWord(attempt) === normalizeWord(current.front)) {
      const gained = Math.max(POINTS.minPerWord, POINTS.correct - hints * POINTS.hintPenalty);
      const nextScore = score + gained;
      const nextCorrect = correct + 1;
      setScore(nextScore);
      setCorrect(nextCorrect);
      setFeedback("correct");
      onReview(current.id, hints === 0);
      later(() => next(nextScore, nextCorrect), 900);
    } else {
      setFeedback("wrong");
      onReview(current.id, false);
      later(() => {
        setPicked([]);
        setFeedback("idle");
      }, 700);
    }
  };

  const pick = (id: number) => {
    if (feedback !== "idle" || picked.includes(id) || !current) return;
    const seq = [...picked, id];
    setPicked(seq);
    if (seq.length === letters.length) submit(seq);
  };

  const undo = () => {
    if (feedback === "idle") setPicked((p) => p.slice(0, -1));
  };

  const reshuffle = () => {
    if (feedback !== "idle" || !current) return;
    setPicked([]);
    setLetters(makeLetters(current.front));
  };

  const hint = () => {
    if (feedback !== "idle" || !current) return;
    // Reveal the next correct letter: rebuild the picked sequence from the answer prefix.
    const target = current.front.toLowerCase();
    const used = new Set<number>();
    const seq: number[] = [];
    for (let i = 0; i <= picked.length && i < target.length; i++) {
      const match = letters.find((l) => l.char === target[i] && !used.has(l.id));
      if (!match) break;
      used.add(match.id);
      seq.push(match.id);
    }
    setHints((h) => h + 1);
    setPicked(seq);
    if (seq.length === letters.length) submit(seq);
  };

  const skip = () => {
    if (feedback !== "idle" || !current) return;
    onReview(current.id, false);
    next(score, correct);
  };

  if (phase === "setup") {
    return (
      <VocabSetup
        theme={THEME}
        icon={Shuffle}
        title={t("word_scramble.title")}
        description={t("word_scramble.desc")}
        level={level}
        onLevelChange={onLevelChange}
        poolSize={pool.length}
        minWords={ROUND_SIZE}
        onStart={start}
        best={stats?.best}
        gamesPlayed={stats?.gamesPlayed}
      />
    );
  }

  if (phase === "done" && result) {
    return (
      <VocabResult
        theme={THEME}
        score={score}
        total={words.length}
        correct={correct}
        xp={result.xp}
        isNewBest={result.best}
        onReplay={start}
        onSetup={() => setPhase("setup")}
      />
    );
  }

  const built = picked.map((id) => letters.find((l) => l.id === id)?.char ?? "").join("");

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">
          {t("progress", { n: index + 1, total: words.length })}
        </span>
        <span className="tabular-nums text-slate-500">{t("score_live", { n: score })}</span>
      </div>
      <ProgressBar value={index} max={words.length} theme={THEME} />

      <div className={cn(ep.card, "p-6 text-center space-y-2")}>
        <p className={ep.sectionLabel}>{t("word_scramble.clue")}</p>
        <p className="text-2xl font-bold text-slate-900">{current ? shortMeaning(current) : ""}</p>
        {current && <p className="text-xs text-slate-400">{t("word_scramble.letters", { n: current.front.length })}</p>}
      </div>

      <div
        className={cn(
          "min-h-[64px] rounded-xl border-2 border-dashed px-3 py-3 flex flex-wrap items-center justify-center gap-2 text-2xl font-bold tracking-widest uppercase transition-colors",
          feedback === "correct" && "border-emerald-400 bg-emerald-50 text-emerald-700",
          feedback === "wrong" && "border-rose-400 bg-rose-50 text-rose-700",
          feedback === "idle" && "border-slate-300 bg-white text-slate-900"
        )}
        aria-live="polite"
      >
        {built || <span className="text-sm font-normal normal-case tracking-normal text-slate-400">{t("word_scramble.tap_letters")}</span>}
      </div>

      <div className="flex flex-wrap justify-center gap-2.5">
        {letters.map((l) => (
          <button
            key={l.id}
            type="button"
            disabled={picked.includes(l.id) || feedback !== "idle"}
            onClick={() => pick(l.id)}
            className={cn(
              ep.touchBtn,
              "w-12 h-12 rounded-xl border-2 text-xl font-bold uppercase transition-all",
              picked.includes(l.id)
                ? "border-slate-100 bg-slate-50 text-slate-300"
                : "border-sky-200 bg-white text-sky-800 shadow-sm hover:border-sky-400 active:scale-95"
            )}
          >
            {l.char}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" onClick={undo} className={cn(ep.btnSecondary, "min-h-[44px] px-4 rounded-xl flex items-center gap-2 text-sm")}>
          <Delete className="w-4 h-4" aria-hidden /> {t("word_scramble.undo")}
        </button>
        <button type="button" onClick={reshuffle} className={cn(ep.btnSecondary, "min-h-[44px] px-4 rounded-xl flex items-center gap-2 text-sm")}>
          <Shuffle className="w-4 h-4" aria-hidden /> {t("word_scramble.reshuffle")}
        </button>
        <button type="button" onClick={hint} className={cn(themeBtnPrimary(THEME), "min-h-[44px] px-4 rounded-xl flex items-center gap-2 text-sm")}>
          <Lightbulb className="w-4 h-4" aria-hidden /> {t("hint")}
        </button>
        <button type="button" onClick={skip} className={cn(ep.btnSecondary, "min-h-[44px] px-4 rounded-xl flex items-center gap-2 text-sm")}>
          <SkipForward className="w-4 h-4" aria-hidden /> {t("skip")}
        </button>
      </div>
    </div>
  );
}
