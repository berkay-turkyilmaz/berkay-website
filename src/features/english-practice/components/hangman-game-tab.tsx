"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart, Spline } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { GAME_THEMES } from "../lib/game-themes";
import { letterGamePool, normalizeWord, sample, shortMeaning } from "../lib/vocab";
import { ep } from "../styles";
import type { Flashcard } from "../types";
import { ProgressBar, VocabResult, VocabSetup } from "./vocab-game-kit";
import type { VocabGameProps } from "./vocab-game-types";

const THEME = GAME_THEMES.hangman;
const ROUND_SIZE = 6;
const MAX_LIVES = 6;
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

type Phase = "setup" | "playing" | "done";

/** Guess the word letter by letter; the Turkish meaning is the clue. */
export function HangmanGameTab({ level, onLevelChange, stats, onFinish, onReview, onPlayingChange }: VocabGameProps) {
  const t = useTranslations("EnglishPath.vocab_games");
  const [phase, setPhase] = useState<Phase>("setup");
  const [words, setWords] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [guessed, setGuessed] = useState<string[]>([]);
  const [lives, setLives] = useState(MAX_LIVES);
  const [showExample, setShowExample] = useState(false);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(0);
  const [outcome, setOutcome] = useState<"won" | "lost" | null>(null);
  const [result, setResult] = useState<{ xp: number; best: boolean } | null>(null);

  const pool = letterGamePool(level).filter((c) => c.front.length >= 4);
  const current = words[index];
  const target = current ? normalizeWord(current.front) : "";

  useEffect(() => {
    onPlayingChange?.(phase === "playing");
    return () => onPlayingChange?.(false);
  }, [phase, onPlayingChange]);

  const resetWord = () => {
    setGuessed([]);
    setLives(MAX_LIVES);
    setShowExample(false);
    setOutcome(null);
  };

  const start = useCallback(() => {
    setWords(sample(pool, ROUND_SIZE));
    setIndex(0);
    setScore(0);
    setWon(0);
    setGuessed([]);
    setLives(MAX_LIVES);
    setShowExample(false);
    setOutcome(null);
    setPhase("playing");
  }, [pool]);

  const advance = () => {
    if (index + 1 >= words.length) {
      const best = score > (stats?.best ?? 0);
      onFinish("hangman", { score, correct: won, total: words.length });
      setResult({ xp: won * 8 + 20, best });
      setPhase("done");
      return;
    }
    setIndex(index + 1);
    resetWord();
  };

  const guess = useCallback(
    (letter: string) => {
      if (!current || outcome || guessed.includes(letter)) return;
      const nextGuessed = [...guessed, letter];
      setGuessed(nextGuessed);

      if (target.includes(letter)) {
        if (target.split("").every((ch) => nextGuessed.includes(ch))) {
          setOutcome("won");
          setWon((w) => w + 1);
          setScore((s) => s + 10 + lives * 2);
          onReview(current.id, lives === MAX_LIVES);
        }
        return;
      }

      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        setOutcome("lost");
        onReview(current.id, false);
      }
    },
    [current, outcome, guessed, target, lives, onReview]
  );

  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (/^[a-z]$/i.test(e.key)) guess(e.key.toLowerCase());
      else if (e.key === "Enter" && outcome) advance();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (phase === "setup") {
    return (
      <VocabSetup
        theme={THEME}
        icon={Spline}
        title={t("hangman.title")}
        description={t("hangman.desc")}
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
        correct={won}
        xp={result.xp}
        isNewBest={result.best}
        onReplay={start}
        onSetup={() => setPhase("setup")}
      />
    );
  }

  const example = current ? current.example.replace(new RegExp(current.front, "ig"), "_____") : "";

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">{t("progress", { n: index + 1, total: words.length })}</span>
        <span className="flex items-center gap-1 text-rose-500" aria-label={t("hangman.lives", { n: lives })}>
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <Heart key={i} className={cn("w-4 h-4", i < lives ? "fill-rose-500" : "opacity-20")} aria-hidden />
          ))}
        </span>
      </div>
      <ProgressBar value={index} max={words.length} theme={THEME} />

      <div className={cn(ep.card, "p-6 text-center space-y-3")}>
        <p className={ep.sectionLabel}>{t("word_scramble.clue")}</p>
        <p className="text-2xl font-bold text-slate-900">{current ? shortMeaning(current) : ""}</p>
        {showExample ? (
          <p className="text-sm text-slate-500 italic">{example}</p>
        ) : (
          <button type="button" onClick={() => setShowExample(true)} className="text-xs font-semibold text-indigo-600 hover:underline">
            {t("hangman.show_example")}
          </button>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2 text-3xl font-bold uppercase tracking-widest" aria-live="polite">
        {target.split("").map((ch, i) => (
          <span
            key={i}
            className={cn(
              "w-9 border-b-4 text-center pb-1",
              guessed.includes(ch) || outcome === "lost" ? "border-indigo-400 text-slate-900" : "border-slate-300 text-transparent",
              outcome === "lost" && !guessed.includes(ch) && "text-rose-500"
            )}
          >
            {guessed.includes(ch) || outcome === "lost" ? ch : "_"}
          </span>
        ))}
      </div>

      {outcome ? (
        <div className="text-center space-y-3">
          <p className={cn("font-semibold", outcome === "won" ? "text-emerald-600" : "text-rose-600")}>
            {outcome === "won" ? t("hangman.won") : t("hangman.lost", { word: current?.front ?? "" })}
          </p>
          <button type="button" onClick={advance} className={cn(ep.btnPrimary, "min-h-[48px] px-8 rounded-xl")}>
            {index + 1 >= words.length ? t("finish") : t("next")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5" role="group" aria-label={t("hangman.keyboard")}>
          {ALPHABET.map((letter) => {
            const used = guessed.includes(letter);
            const hit = used && target.includes(letter);
            return (
              <button
                key={letter}
                type="button"
                disabled={used}
                onClick={() => guess(letter)}
                className={cn(
                  ep.touchBtn,
                  "min-h-[44px] rounded-lg border text-sm font-bold uppercase transition-colors",
                  !used && "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50",
                  hit && "border-emerald-300 bg-emerald-50 text-emerald-700",
                  used && !hit && "border-rose-200 bg-rose-50 text-rose-400"
                )}
              >
                {letter}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
