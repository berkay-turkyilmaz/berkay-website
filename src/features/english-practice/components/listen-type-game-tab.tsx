"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Ear, Turtle, Volume2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useSpeech } from "../hooks/use-speech";
import { GAME_THEMES } from "../lib/game-themes";
import { themeBtnPrimary } from "../lib/theme-utils";
import { normalizeWord, sample, shortMeaning, typeablePool } from "../lib/vocab";
import { useMounted } from "@/lib/hooks";
import { ep } from "../styles";
import type { Flashcard } from "../types";
import { ProgressBar, VocabResult, VocabSetup } from "./vocab-game-kit";
import type { VocabGameProps } from "./vocab-game-types";

const THEME = GAME_THEMES.listen_type;
const ROUND_SIZE = 10;

type Phase = "setup" | "playing" | "done";

/** Dictation: listen to the word, type how it is spelled. */
export function ListenTypeGameTab({ level, onLevelChange, stats, speechRate, onFinish, onReview, onPlayingChange }: VocabGameProps) {
  const t = useTranslations("EnglishPath.vocab_games");
  const mounted = useMounted();
  const supported = mounted && typeof window !== "undefined" && "speechSynthesis" in window;
  const { speak, stop } = useSpeech(speechRate);

  const [phase, setPhase] = useState<Phase>("setup");
  const [words, setWords] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState<"idle" | "correct" | "wrong">("idle");
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [result, setResult] = useState<{ xp: number; best: boolean } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pool = typeablePool(level);
  const current = words[index];

  useEffect(() => {
    onPlayingChange?.(phase === "playing");
    return () => {
      onPlayingChange?.(false);
      stop();
    };
  }, [phase, onPlayingChange, stop]);

  // Read the new word aloud whenever the question changes.
  useEffect(() => {
    if (phase === "playing" && current && supported) speak(current.front);
  }, [phase, current, supported, speak]);

  const start = useCallback(() => {
    setWords(sample(pool, ROUND_SIZE));
    setIndex(0);
    setScore(0);
    setCorrect(0);
    setAnswer("");
    setState("idle");
    setAttempts(0);
    setPhase("playing");
  }, [pool]);

  const advance = (finalScore: number, finalCorrect: number) => {
    if (index + 1 >= words.length) {
      const best = finalScore > (stats?.best ?? 0);
      onFinish("listen_type", { score: finalScore, correct: finalCorrect, total: words.length });
      setResult({ xp: finalCorrect * 8 + 20, best });
      setPhase("done");
      return;
    }
    setIndex(index + 1);
    setAnswer("");
    setState("idle");
    setAttempts(0);
    inputRef.current?.focus();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!current || !answer.trim()) return;

    if (state !== "idle") {
      advance(score, correct);
      return;
    }

    const isRight = normalizeWord(answer) === normalizeWord(current.front);
    if (isRight) {
      const gained = attempts === 0 ? 10 : 5;
      setScore((s) => s + gained);
      setCorrect((c) => c + 1);
      setState("correct");
      onReview(current.id, attempts === 0);
      return;
    }
    if (attempts >= 1) {
      // Second miss: reveal the spelling and move on.
      setState("wrong");
      onReview(current.id, false);
      return;
    }
    setAttempts(1);
    onReview(current.id, false);
  };

  if (phase === "setup") {
    return (
      <VocabSetup
        theme={THEME}
        icon={Ear}
        title={t("listen_type.title")}
        description={t("listen_type.desc")}
        level={level}
        onLevelChange={onLevelChange}
        poolSize={pool.length}
        minWords={ROUND_SIZE}
        onStart={start}
        best={stats?.best}
        gamesPlayed={stats?.gamesPlayed}
      >
        {mounted && !supported && (
          <p className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
            {t("listen_type.unsupported")}
          </p>
        )}
      </VocabSetup>
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

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">{t("progress", { n: index + 1, total: words.length })}</span>
        <span className="tabular-nums text-slate-500">{t("score_live", { n: score })}</span>
      </div>
      <ProgressBar value={index} max={words.length} theme={THEME} />

      <div className={cn(ep.card, "p-8 text-center space-y-4")}>
        {supported ? (
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => current && speak(current.front)}
              className={cn(themeBtnPrimary(THEME), "min-h-[56px] px-6 rounded-xl flex items-center gap-2")}
            >
              <Volume2 className="w-5 h-5" aria-hidden /> {t("listen_type.play")}
            </button>
            <button
              type="button"
              onClick={() => current && speak(current.front.split("").join(" "))}
              className={cn(ep.btnSecondary, "min-h-[56px] px-5 rounded-xl flex items-center gap-2")}
              title={t("listen_type.spell_hint")}
            >
              <Turtle className="w-5 h-5" aria-hidden /> {t("listen_type.spell")}
            </button>
          </div>
        ) : (
          <p className="text-lg font-semibold text-slate-800">{current ? shortMeaning(current) : ""}</p>
        )}
        {state !== "idle" && current && (
          <div className="space-y-1">
            <p className={cn("text-xl font-bold", state === "correct" ? "text-emerald-600" : "text-rose-600")}>
              {state === "correct" ? t("listen_type.correct") : t("listen_type.answer_was", { word: current.front })}
            </p>
            <p className="text-sm text-slate-500">
              {current.phonetic} · {shortMeaning(current)}
            </p>
          </div>
        )}
        {state === "idle" && attempts === 1 && <p className="text-sm text-amber-600">{t("listen_type.try_again")}</p>}
      </div>

      <form onSubmit={submit} className="flex gap-2">
        <input
          ref={inputRef}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          readOnly={state !== "idle"}
          autoFocus
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-label={t("listen_type.input_label")}
          placeholder={t("listen_type.placeholder")}
          className="flex-1 min-h-[52px] rounded-xl border-2 border-slate-200 bg-white px-4 text-lg outline-none focus:border-violet-500"
        />
        <button type="submit" className={cn(themeBtnPrimary(THEME), "min-h-[52px] px-6 rounded-xl")}>
          {state === "idle" ? t("check") : index + 1 >= words.length ? t("finish") : t("next")}
        </button>
      </form>
    </div>
  );
}
