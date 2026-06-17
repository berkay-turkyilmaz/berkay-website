"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Eye,
  EyeOff,
  Maximize2,
  Play,
  RotateCcw,
  SkipForward,
  Smartphone,
  Trophy,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { buildSmartDeck, getDailySeenCount, markCardSeen } from "../lib/deck-shuffle";
import { HEADS_UP_CARDS, HEADS_UP_CATEGORY_LABELS } from "../data/heads-up-cards";
import type { HeadsUpCategory, HeadsUpRoundStats } from "../types";
import { ep } from "../styles";
import { XP_REWARDS } from "../constants";
import { GameTimerSlider } from "./game-timer-slider";
import { GameWordDisplay } from "./game-word-display";
import { FadeUp, Pressable } from "./motion-primitives";

type Phase = "setup" | "countdown" | "playing" | "round_end";

type Props = {
  roundDuration: number;
  onRoundDurationChange: (seconds: number) => void;
  stats: { gamesPlayed: number; wordsGuessed: number; bestRound: number };
  onRoundComplete: (stats: HeadsUpRoundStats) => void;
  onXp: (amount: number) => void;
  onPlayingChange?: (playing: boolean) => void;
};

function vibrate(pattern: number | number[] = 40) {
  if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(pattern);
}

export function HeadsUpGameTab({
  roundDuration,
  onRoundDurationChange,
  stats,
  onRoundComplete,
  onXp,
  onPlayingChange,
}: Props) {
  const t = useTranslations("EnglishPath.heads_up");
  const tg = useTranslations("EnglishPath.games");
  const [phase, setPhase] = useState<Phase>("setup");
  const [category, setCategory] = useState<HeadsUpCategory | "all">("all");
  const [difficulty, setDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [showMeaning, setShowMeaning] = useState(false);
  const [deck, setDeck] = useState<typeof HEADS_UP_CARDS>([]);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(roundDuration);
  const [countdown, setCountdown] = useState(3);
  const [roundStats, setRoundStats] = useState<HeadsUpRoundStats>({
    correct: 0,
    passed: 0,
    total: 0,
  });
  const [fullscreen, setFullscreen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const roundStatsRef = useRef(roundStats);
  const endedRef = useRef(false);

  roundStatsRef.current = roundStats;

  useEffect(() => {
    onPlayingChange?.(phase === "playing");
    return () => onPlayingChange?.(false);
  }, [phase, onPlayingChange]);

  const pool = useMemo(() => {
    let cards =
      category === "all"
        ? HEADS_UP_CARDS
        : HEADS_UP_CARDS.filter((c) => c.category === category);
    if (difficulty !== "all") {
      cards = cards.filter((c) => (c.difficulty ?? "medium") === difficulty);
    }
    return cards;
  }, [category, difficulty]);

  const deckKey = useMemo(
    () =>
      difficulty === "all" ? `heads-up-${category}` : `heads-up-${category}-${difficulty}`,
    [category, difficulty]
  );

  const dailySeenCount = useMemo(
    () => getDailySeenCount(deckKey, pool),
    [deckKey, pool]
  );

  const card = deck[index];
  const categories = ["all", ...Object.keys(HEADS_UP_CATEGORY_LABELS)] as const;

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRound = () => {
    const newDeck = buildSmartDeck(pool, Math.min(30, pool.length), deckKey);
    setDeck(newDeck);
    setIndex(0);
    endedRef.current = false;
    setShowMeaning(false);
    setRoundStats({ correct: 0, passed: 0, total: newDeck.length });
    setCountdown(3);
    setPhase("countdown");
  };

  useEffect(() => {
    setShowMeaning(false);
  }, [index]);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      setTimeLeft(roundDuration);
      setPhase("playing");
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 700);
    return () => clearTimeout(id);
  }, [phase, countdown, roundDuration]);

  useEffect(() => {
    if (phase !== "playing") return;
    clearTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return clearTimer;
  }, [phase, roundDuration]);

  const endRound = useCallback(
    (final: HeadsUpRoundStats) => {
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
      endRound(roundStatsRef.current);
    }
  }, [timeLeft, phase, endRound]);

  const advance = (patch: Partial<HeadsUpRoundStats>) => {
    const leaving = deck[index];
    if (leaving) markCardSeen(deckKey, leaving.id);

    const next = { ...roundStatsRef.current, ...patch };
    setRoundStats(next);
    if (index + 1 >= deck.length) {
      endRound(next);
      return;
    }
    setIndex((i) => i + 1);
  };

  const handleCorrect = () => {
    vibrate(30);
    onXp(XP_REWARDS.headsUpCorrect);
    advance({ correct: roundStatsRef.current.correct + 1 });
  };

  const handlePass = () => {
    vibrate([20, 30, 20]);
    advance({ passed: roundStatsRef.current.passed + 1 });
  };

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setFullscreen(true);
    } catch {
      setFullscreen(true);
    }
  };

  const quitToSetup = () => {
    clearTimer();
    setPhase("setup");
    setShowMeaning(false);
  };

  if (phase === "setup") {
    return (
      <div className="space-y-6 max-w-lg mx-auto pb-8">
        <FadeUp>
          <div className={cn(ep.heroGradient, "relative overflow-hidden rounded-2xl p-6 text-white text-center shadow-lg")}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(13,148,136,0.3),transparent_50%)]" />
            <motion.span
              className="text-4xl inline-block mb-2 relative"
              animate={{ y: [0, -6, 0] }}
              transition={{ type: "tween", duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              📱
            </motion.span>
            <h2 className="text-2xl sm:text-3xl font-bold relative">{t("title")}</h2>
            <p className="text-slate-300 text-sm leading-relaxed mt-2 relative">{t("subtitle")}</p>
          </div>
        </FadeUp>

        <div className={cn(ep.card, "p-5 space-y-4")}>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-600">{t("how_title")}</p>
          <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
            <li>{t("how_1")}</li>
            <li>{t("how_2")}</li>
            <li>{t("how_3")}</li>
          </ol>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat as HeadsUpCategory | "all")}
              className={cn(ep.chip, category === cat && ep.chipActive)}
            >
              {cat === "all" ? t("all") : HEADS_UP_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {(["all", "easy", "medium", "hard"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={cn(ep.chip, difficulty === d && ep.chipActive)}
            >
              {d === "all" ? t("all") : t(`diff.${d}`)}
            </button>
          ))}
        </div>

        <div className={cn(ep.card, "p-5")}>
          <GameTimerSlider
            value={roundDuration}
            onChange={onRoundDurationChange}
            min={45}
            accentClass="accent-violet-500"
          />
        </div>

        <p className="text-center text-xs text-slate-400 font-mono">
          {pool.length} {t("cards")}
          {dailySeenCount > 0 && (
            <span className="text-slate-300"> · {dailySeenCount} {t("seen_today")}</span>
          )}
        </p>

        <Pressable
          type="button"
          onClick={startRound}
          className={cn(ep.btnPrimary, ep.touchBtn, "w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-lg")}
        >
          <Play className="w-6 h-6" /> {t("start")}
        </Pressable>

        <div className="grid grid-cols-3 gap-2 text-center">
          <MiniStat label={t("stat_games")} value={stats.gamesPlayed} />
          <MiniStat label={t("stat_words")} value={stats.wordsGuessed} />
          <MiniStat label={t("stat_best")} value={stats.bestRound} />
        </div>
      </div>
    );
  }

  if (phase === "countdown") {
    return (
      <div className={cn(ep.gameFullscreen, "items-center justify-center")}>
        <motion.span
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-8xl font-black text-teal-600"
        >
          {countdown || "GO!"}
        </motion.span>
        <p className="mt-4 text-slate-500 text-sm">{t("get_ready")}</p>
      </div>
    );
  }

  if (phase === "round_end") {
    return (
      <div className={cn(ep.gameFullscreen, "items-center justify-center p-6")}>
        <Trophy className="w-14 h-14 text-amber-500 mb-4" />
        <h2 className="text-3xl font-black text-slate-800 mb-2">{t("round_done")}</h2>
        <p className="text-5xl font-black text-teal-600 mb-1">{roundStats.correct}</p>
        <p className="text-slate-500 mb-8">{t("words_guessed")}</p>
        <div className="flex gap-3 w-full max-w-xs">
          <button
            type="button"
            onClick={quitToSetup}
            className={cn(ep.btnSecondary, "flex-1 py-3 rounded-2xl")}
          >
            {t("menu")}
          </button>
          <button
            type="button"
            onClick={startRound}
            className={cn(ep.btnPrimary, "flex-1 py-3 rounded-2xl flex items-center justify-center gap-2")}
          >
            <RotateCcw className="w-4 h-4" /> {t("again")}
          </button>
        </div>
      </div>
    );
  }

  if (!card) return null;

  return (
    <div className={cn(ep.gameFullscreen, "safe-area-pad")}>
      <div className="flex items-center justify-between px-4 pt-3 pb-2 gap-2">
        <button
          type="button"
          onClick={quitToSetup}
          className="md:hidden p-2 rounded-xl bg-white border border-slate-200"
          aria-label="Quit"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
        <div className="w-9 md:w-0" />
        <div
          className={cn(
            "font-mono font-bold text-xl tabular-nums px-4 py-1 rounded-full",
            timeLeft <= 10 ? "bg-rose-100 text-rose-600" : "bg-teal-100 text-teal-700"
          )}
        >
          {timeLeft}s
        </div>
        <button
          type="button"
          onClick={enterFullscreen}
          className="p-2 rounded-xl bg-white/80 border border-slate-200"
          aria-label="Fullscreen"
        >
          <Maximize2 className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="px-4 mb-2">
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 transition-all"
            style={{ width: `${roundDuration > 0 ? (timeLeft / roundDuration) * 100 : 0}%` }}
          />
        </div>
      </div>

      <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest px-4 mb-2">
        {t("friends_describe")}
      </p>

      <div className="flex-1 flex items-center justify-center px-4 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl p-6 sm:p-10 text-center min-w-0">
              <span className="text-xs font-bold text-violet-500 uppercase tracking-widest">
                {HEADS_UP_CATEGORY_LABELS[card.category]}
              </span>
              <div className="mt-4 px-1 min-w-0 flex justify-center">
                <GameWordDisplay word={card.word} />
              </div>
              {card.hint && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowMeaning((v) => !v)}
                    className="mt-5 mx-auto flex items-center gap-2 text-sm font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-xl border border-violet-100"
                  >
                    {showMeaning ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showMeaning ? tg("hide_meaning") : tg("show_meaning")}
                  </button>
                  {showMeaning && (
                    <p className="mt-3 text-lg text-violet-700 font-semibold">{card.hint}</p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="text-center text-[10px] text-slate-400 px-4 mb-2">
        {index + 1} / {deck.length} · {t("tilt_hint")}
      </p>

      <div className="grid grid-cols-2 gap-3 p-4 pb-8 max-w-lg mx-auto w-full">
        <button
          type="button"
          onClick={handlePass}
          className={cn(
            ep.touchBtn,
            "py-5 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-bold flex flex-col items-center gap-1 active:bg-slate-50"
          )}
        >
          <SkipForward className="w-7 h-7 text-amber-500" />
          <span className="text-sm">{t("pass")}</span>
        </button>
        <button
          type="button"
          onClick={handleCorrect}
          className={cn(
            ep.touchBtn,
            ep.btnSuccess,
            "py-5 rounded-2xl flex flex-col items-center gap-1"
          )}
        >
          <Check className="w-7 h-7" />
          <span className="text-sm">{t("got_it")}</span>
        </button>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className={cn(ep.card, "p-3")}>
      <p className="text-xl font-black text-slate-800">{value}</p>
      <p className="text-[9px] uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}
