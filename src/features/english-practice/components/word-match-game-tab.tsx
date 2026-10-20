"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Layers } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { GAME_THEMES } from "../lib/game-themes";
import { cardsForLevel, sample, shortMeaning, shuffle } from "../lib/vocab";
import { ep } from "../styles";
import type { Flashcard } from "../types";
import { ProgressBar, VocabResult, VocabSetup } from "./vocab-game-kit";
import type { VocabGameProps } from "./vocab-game-types";

const THEME = GAME_THEMES.word_match;
const PAIR_OPTIONS = [6, 8, 10] as const;

type Tile = { key: string; cardId: string; text: string; side: "en" | "tr" };
type Phase = "setup" | "playing" | "done";

function buildBoard(cards: Flashcard[]): Tile[] {
  const tiles: Tile[] = cards.flatMap((c) => [
    { key: `${c.id}-en`, cardId: c.id, text: c.front, side: "en" as const },
    { key: `${c.id}-tr`, cardId: c.id, text: shortMeaning(c), side: "tr" as const },
  ]);
  return shuffle(tiles);
}

/** Memory-style matching: flip two tiles, pair every English word with its Turkish meaning. */
export function WordMatchGameTab({ level, onLevelChange, stats, onFinish, onReview, onPlayingChange }: VocabGameProps) {
  const t = useTranslations("EnglishPath.vocab_games");
  const [phase, setPhase] = useState<Phase>("setup");
  const [pairCount, setPairCount] = useState<(typeof PAIR_OPTIONS)[number]>(6);
  const [board, setBoard] = useState<Tile[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [misses, setMisses] = useState(0);
  const [result, setResult] = useState<{ score: number; xp: number; best: boolean } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockRef = useRef(false);

  const pool = cardsForLevel(level);

  useEffect(() => {
    onPlayingChange?.(phase === "playing");
    return () => onPlayingChange?.(false);
  }, [phase, onPlayingChange]);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  const start = useCallback(() => {
    const chosen = sample(pool, pairCount);
    setBoard(buildBoard(chosen));
    setOpen([]);
    setMatched([]);
    setMisses(0);
    lockRef.current = false;
    setPhase("playing");
  }, [pool, pairCount]);

  const finish = useCallback(
    (finalMisses: number) => {
      const score = Math.max(pairCount, pairCount * 10 - finalMisses * 2);
      const best = score > (stats?.best ?? 0);
      onFinish("word_match", { score, correct: pairCount, total: pairCount + finalMisses });
      setResult({ score, xp: pairCount * 8 + 20, best });
      setPhase("done");
    },
    [pairCount, stats?.best, onFinish]
  );

  const flip = (index: number) => {
    if (lockRef.current || open.includes(index) || matched.includes(board[index].cardId)) return;

    const nextOpen = [...open, index];
    setOpen(nextOpen);
    if (nextOpen.length < 2) return;

    const [a, b] = nextOpen.map((i) => board[i]);
    if (a.cardId === b.cardId && a.side !== b.side) {
      const nextMatched = [...matched, a.cardId];
      setMatched(nextMatched);
      setOpen([]);
      onReview(a.cardId, true);
      if (nextMatched.length === pairCount) finish(misses);
      return;
    }

    lockRef.current = true;
    setMisses((m) => m + 1);
    onReview(a.cardId, false);
    onReview(b.cardId, false);
    timeoutRef.current = setTimeout(() => {
      setOpen([]);
      lockRef.current = false;
    }, 900);
  };

  if (phase === "setup") {
    return (
      <VocabSetup
        theme={THEME}
        icon={Layers}
        title={t("word_match.title")}
        description={t("word_match.desc")}
        level={level}
        onLevelChange={onLevelChange}
        poolSize={pool.length}
        minWords={PAIR_OPTIONS[PAIR_OPTIONS.length - 1]}
        onStart={start}
        best={stats?.best}
        gamesPlayed={stats?.gamesPlayed}
      >
        <div className="space-y-2">
          <p className={ep.sectionLabel}>{t("word_match.pairs")}</p>
          <div className="flex gap-2">
            {PAIR_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPairCount(n)}
                className={cn(ep.chip, "min-h-[40px] px-4", pairCount === n && ep.chipActive)}
              >
                {n}
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
        score={result.score}
        total={pairCount + misses}
        correct={pairCount}
        xp={result.xp}
        isNewBest={result.best}
        onReplay={start}
        onSetup={() => setPhase("setup")}
        extra={<p className="text-sm text-slate-500">{t("word_match.misses", { n: misses })}</p>}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-semibold text-slate-700">
          {t("word_match.found", { done: matched.length, total: pairCount })}
        </span>
        <span className="text-slate-500">{t("word_match.misses", { n: misses })}</span>
      </div>
      <ProgressBar value={matched.length} max={pairCount} theme={THEME} />
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {board.map((tile, i) => {
          const isOpen = open.includes(i);
          const isMatched = matched.includes(tile.cardId);
          return (
            <button
              key={tile.key}
              type="button"
              onClick={() => flip(i)}
              disabled={isMatched}
              aria-label={isOpen || isMatched ? tile.text : t("word_match.hidden_tile")}
              className={cn(
                ep.touchBtn,
                "min-h-[76px] rounded-xl border-2 px-2 text-center text-sm font-semibold transition-all duration-200",
                isMatched
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700 opacity-70"
                  : isOpen
                    ? tile.side === "en"
                      ? "border-emerald-500 bg-white text-slate-900 shadow-md"
                      : "border-sky-500 bg-white text-slate-900 shadow-md"
                    : "border-slate-200 bg-slate-100 text-slate-400 hover:border-emerald-300"
              )}
            >
              {isOpen || isMatched ? tile.text : "?"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
