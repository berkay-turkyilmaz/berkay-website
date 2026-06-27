"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Ban,
  Check,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  Play,
  RotateCcw,
  SkipForward,
  Trophy,
  Users,
  Volume2,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  TABOO_CARDS,
  TABOO_CATEGORY_LABELS,
  TABOO_DIFFICULTY_COUNTS,
} from "../data/taboo-cards";
import type {
  TabooCard,
  TabooCategory,
  TabooDifficulty,
  TabooGameMode,
  TabooRoundStats,
} from "../types";
import { useSpeech } from "../hooks/use-speech";
import { XP_REWARDS } from "../constants";
import { buildSmartDeck, buildWeightedTabooDeck, getDailySeenCount, markCardSeen } from "../lib/deck-shuffle";
import { GAME_THEMES } from "../lib/game-themes";
import { themeAccentText, themeBtnPrimary, themeChip, themeProgressBar, themeSurfaceBanner } from "../lib/theme-utils";
import { ep } from "../styles";
import { GameTimerSlider } from "./game-timer-slider";
import { FadeUp, Pressable } from "./motion-primitives";

const TABOO_THEME = GAME_THEMES.taboo;

type GamePhase = "setup" | "playing" | "round_end" | "paused";

type Props = {
  speechRate: number;
  roundDuration: number;
  onRoundDurationChange: (seconds: number) => void;
  tabooStats: {
    gamesPlayed: number;
    wordsGuessed: number;
    bestTimedScore: number;
    partyWins: { teamA: number; teamB: number };
  };
  onRoundComplete: (
    stats: TabooRoundStats,
    mode: TabooGameMode,
    partyScores?: { A: number; B: number }
  ) => void;
  onXp: (amount: number) => void;
  onPlayingChange?: (playing: boolean) => void;
};

export function TabooGameTab({
  speechRate,
  roundDuration,
  onRoundDurationChange,
  tabooStats,
  onRoundComplete,
  onXp,
  onPlayingChange,
}: Props) {
  const t = useTranslations("EnglishPath.taboo");
  const tCat = useTranslations("EnglishPath.game_categories.taboo");
  const tA11y = useTranslations("EnglishPath.a11y");
  const { speak } = useSpeech(speechRate);

  const [phase, setPhase] = useState<GamePhase>("setup");
  const [mode, setMode] = useState<TabooGameMode>("timed");
  const [category, setCategory] = useState<TabooCategory | "all">("all");
  const [difficulty, setDifficulty] = useState<TabooDifficulty | "all">("all");
  const [roundSize, setRoundSize] = useState(10);
  const [showRules, setShowRules] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [deck, setDeck] = useState<TabooCard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(roundDuration);
  const [stats, setStats] = useState<TabooRoundStats>({
    correct: 0,
    skipped: 0,
    fouls: 0,
    total: 0,
  });
  const [partyTeam, setPartyTeam] = useState<"A" | "B">("A");
  const [partyScores, setPartyScores] = useState({ A: 0, B: 0 });
  const [foulFlash, setFoulFlash] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoSkipRef = useRef(false);
  const advancingRef = useRef(false);
  const statsRef = useRef(stats);
  const partyScoresRef = useRef(partyScores);

  statsRef.current = stats;
  partyScoresRef.current = partyScores;

  const filteredPool = useMemo(() => {
    return TABOO_CARDS.filter((c) => {
      if (category !== "all" && c.category !== category) return false;
      if (difficulty !== "all" && c.difficulty !== difficulty) return false;
      return true;
    });
  }, [category, difficulty]);

  const currentCard = deck[cardIndex];

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

  const buildDeck = useCallback(() => {
    const pool = filteredPool.length > 0 ? filteredPool : TABOO_CARDS;
    const deckKey =
      difficulty === "all"
        ? `taboo-${category}`
        : `taboo-${category}-${difficulty}`;
    const count = Math.min(roundSize, pool.length);
    // When "all" difficulties selected, use weighted distribution (5% easy, 45% med, 50% hard)
    if (difficulty === "all") {
      return buildWeightedTabooDeck(pool, count, deckKey);
    }
    return buildSmartDeck(pool, count, deckKey);
  }, [filteredPool, roundSize, category, difficulty]);

  const dailySeenCount = useMemo(
    () => getDailySeenCount(
      difficulty === "all" ? `taboo-${category}` : `taboo-${category}-${difficulty}`,
      filteredPool.length > 0 ? filteredPool : TABOO_CARDS
    ),
    [filteredPool, category, difficulty]
  );

  const startGame = () => {
    const newDeck = buildDeck();
    setDeck(newDeck);
    setCardIndex(0);
    setStats({ correct: 0, skipped: 0, fouls: 0, total: newDeck.length });
    setPartyScores({ A: 0, B: 0 });
    setPartyTeam("A");
    setTimeLeft(mode === "practice" ? 0 : roundDuration);
    setShowHint(false);
    autoSkipRef.current = false;
    advancingRef.current = false;
    setPhase("playing");
  };

  // Card timer — independent of card index to avoid restart cascades
  useEffect(() => {
    if (phase !== "playing" || mode === "practice") return;
    clearTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return clearTimer;
  }, [phase, mode]);

  // Reset per-card timer when index changes
  useEffect(() => {
    if (phase !== "playing" || mode === "practice") return;
    setTimeLeft(roundDuration);
    autoSkipRef.current = false;
  }, [cardIndex, phase, mode, roundDuration]);

  const endRound = useCallback(
    (finalStats: TabooRoundStats, finalPartyScores: { A: number; B: number }) => {
      clearTimer();
      setPhase("round_end");
      onRoundComplete(finalStats, mode, mode === "party" ? finalPartyScores : undefined);
      if (mode === "party") {
        const winner =
          finalPartyScores.A > finalPartyScores.B
            ? "A"
            : finalPartyScores.B > finalPartyScores.A
              ? "B"
              : null;
        if (winner) onXp(XP_REWARDS.tabooPartyWin);
      }
    },
    [mode, onRoundComplete, onXp]
  );

  useEffect(() => {
    if (phase === "playing" && deck.length > 0 && cardIndex >= deck.length) {
      endRound(stats, partyScores);
    }
  }, [phase, deck.length, cardIndex, stats, partyScores, endRound]);

  const advanceCard = useCallback(
    (
      patch: Partial<TabooRoundStats> | ((prev: TabooRoundStats) => Partial<TabooRoundStats>),
      scorePatch?: Partial<{ A: number; B: number }>
    ) => {
      if (advancingRef.current) return;
      advancingRef.current = true;

      setShowHint(false);
      setFoulFlash(false);

      const prevStats = statsRef.current;
      const patchValue = typeof patch === "function" ? patch(prevStats) : patch;
      const nextStats = { ...prevStats, ...patchValue };
      const nextParty = scorePatch
        ? { ...partyScoresRef.current, ...scorePatch }
        : partyScoresRef.current;

      const leavingCard = deck[cardIndex];
      if (leavingCard) {
        const deckKey =
          difficulty === "all"
            ? `taboo-${category}`
            : `taboo-${category}-${difficulty}`;
        markCardSeen(deckKey, leavingCard.id);
      }

      setStats(nextStats);
      if (scorePatch) setPartyScores(nextParty);

      const nextIndex = cardIndex + 1;
      if (nextIndex >= deck.length) {
        endRound(nextStats, nextParty);
        advancingRef.current = false;
        return;
      }

      setCardIndex(nextIndex);
      advancingRef.current = false;
    },
    [cardIndex, deck, category, difficulty, endRound]
  );

  useEffect(() => {
    if (phase !== "playing" || mode === "practice" || timeLeft !== 0) return;
    if (autoSkipRef.current || advancingRef.current) return;
    autoSkipRef.current = true;
    advanceCard((prev) => ({ skipped: prev.skipped + 1 }));
  }, [timeLeft, phase, mode, advanceCard]);

  const handleCorrect = () => {
    onXp(XP_REWARDS.tabooCorrect);
    const scorePatch =
      mode === "party"
        ? ({ [partyTeam]: partyScores[partyTeam] + 1 } as Partial<{ A: number; B: number }>)
        : undefined;
    if (mode === "party") setPartyTeam((t) => (t === "A" ? "B" : "A"));
    advanceCard((prev) => ({ correct: prev.correct + 1 }), scorePatch);
  };

  const handleSkip = () => {
    advanceCard((prev) => ({ skipped: prev.skipped + 1 }));
  };

  const handleFoul = () => {
    setFoulFlash(true);
    setTimeout(() => setFoulFlash(false), 600);
    if (mode === "party") {
      setPartyTeam((t) => (t === "A" ? "B" : "A"));
    }
    setStats((s) => ({ ...s, fouls: s.fouls + 1 }));
  };

  const categories = ["all", ...Object.keys(TABOO_CATEGORY_LABELS)] as const;
  const difficulties = ["all", "easy", "medium", "hard"] as const;

  const quitToSetup = () => {
    clearTimer();
    setPhase("setup");
  };

  if (phase === "setup") {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-8">
        <FadeUp>
          <div className={cn(ep.heroGradient, "relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white text-center shadow-lg")}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(244,63,94,0.28),transparent_50%)]" />
            <motion.span
              className="text-4xl inline-block mb-2 relative"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{
                type: "tween",
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
            >
              🎯
            </motion.span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight relative">{t("title")}</h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed mt-2 relative">{t("subtitle")}</p>
          </div>
        </FadeUp>

        <FadeUp delay={0.06}>
          <p className={cn(ep.sectionLabel, "mb-3 px-1")}>{t("pick_mode")}</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {(
              [
                { id: "practice" as const, icon: Eye, label: t("modes.practice"), desc: t("modes.practice_desc") },
                { id: "timed" as const, icon: Clock, label: t("modes.timed"), desc: t("modes.timed_desc") },
                { id: "party" as const, icon: Users, label: t("modes.party"), desc: t("modes.party_desc") },
              ] as const
            ).map((m) => {
              const Icon = m.icon;
              const active = mode === m.id;
              return (
                <motion.button
                  key={m.id}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -2 }}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    ep.card,
                    ep.clickable,
                    "p-5 text-left transition-all",
                    active
                      ? "border-rose-400 ring-2 ring-rose-100 bg-rose-50 shadow-sm"
                      : "hover:border-slate-300"
                  )}
                >
                  <Icon className={cn("w-7 h-7 mb-3", active ? TABOO_THEME.icon : "text-slate-400")} />
                  <p className="font-black text-slate-800">{m.label}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{m.desc}</p>
                </motion.button>
              );
            })}
          </div>
        </FadeUp>

        <div className={cn(ep.card, "p-5 sm:p-6 space-y-5")}>
          <div>
            <label className="text-sm font-semibold text-slate-600">{t("category")}</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat as TabooCategory | "all")}
                  className={cn(themeChip(TABOO_THEME, category === cat))}
                >
                  {cat === "all" ? t("all") : tCat(cat)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600">{t("difficulty")}</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {difficulties.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d as TabooDifficulty | "all")}
                  className={cn(themeChip(TABOO_THEME, difficulty === d), "capitalize")}
                >
                  {d === "all" ? t("all") : t(`diff.${d}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600">
              {t("round_size")}: {roundSize}
            </label>
            <input
              type="range"
              min={5}
              max={20}
              value={roundSize}
              onChange={(e) => setRoundSize(Number(e.target.value))}
              className="w-full mt-2 accent-rose-600"
            />
          </div>

          {mode !== "practice" && (
            <GameTimerSlider
              value={roundDuration}
              onChange={onRoundDurationChange}
              theme={TABOO_THEME}
            />
          )}

          <div className="space-y-1.5">
            <p className="text-xs text-slate-500 font-mono tabular-nums">
              {filteredPool.length} {t("cards_available")}
              {dailySeenCount > 0 && (
                <span className="text-slate-400">
                  {" "}
                  · {dailySeenCount} {t("seen_today")}
                </span>
              )}
            </p>
            <p className="text-[11px] text-slate-400">
              {t("difficulty_counts", {
                easy: TABOO_DIFFICULTY_COUNTS.easy,
                medium: TABOO_DIFFICULTY_COUNTS.medium,
                hard: TABOO_DIFFICULTY_COUNTS.hard,
              })}
            </p>
            {filteredPool.length === 0 && (
              <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                {t("no_cards_filter")}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Pressable
            type="button"
            onClick={() => setShowRules(true)}
            className={cn(ep.btnSecondary, "px-5 py-3 rounded-2xl font-semibold")}
          >
            {t("rules_btn")}
          </Pressable>
          <Pressable
            type="button"
            onClick={startGame}
            disabled={filteredPool.length === 0}
            className={cn(ep.btnDanger, ep.touchBtn, "px-10 py-4 rounded-2xl flex items-center gap-2 disabled:opacity-40 text-lg")}
          >
            <Play className="w-5 h-5" /> {t("start_game")}
          </Pressable>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <StatBox label={t("stats.games")} value={tabooStats.gamesPlayed} />
          <StatBox label={t("stats.guessed")} value={tabooStats.wordsGuessed} />
          <StatBox label={t("stats.best")} value={tabooStats.bestTimedScore} />
          <StatBox
            label={t("stats.party")}
            value={`${tabooStats.partyWins.teamA}-${tabooStats.partyWins.teamB}`}
          />
        </div>

        <AnimatePresence>
          {showRules && (
            <RulesModal onClose={() => setShowRules(false)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (phase === "round_end") {
    const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          ep.gameFullscreen,
          "md:static md:min-h-0 max-w-lg mx-auto text-center space-y-8 py-8 px-4 items-center justify-center"
        )}
      >
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <Trophy className="w-16 h-16 text-amber-500 mx-auto" />
        </motion.div>
        <h2 className="text-3xl font-black">{t("round_complete")}</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
            <Check className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
            <p className="text-2xl font-black">{stats.correct}</p>
            <p className="text-xs text-slate-500">{t("correct")}</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
            <SkipForward className="w-6 h-6 text-amber-500 mx-auto mb-1" />
            <p className="text-2xl font-black">{stats.skipped}</p>
            <p className="text-xs text-slate-500">{t("skipped")}</p>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4">
            <Ban className="w-6 h-6 text-rose-500 mx-auto mb-1" />
            <p className="text-2xl font-black">{stats.fouls}</p>
            <p className="text-xs text-slate-500">{t("fouls")}</p>
          </div>
        </div>
        <p className={cn("text-4xl font-black", themeAccentText(TABOO_THEME))}>%{accuracy}</p>
        {mode === "party" && (
          <p className="text-lg font-bold">
            {t("party_score")}: {partyScores.A} - {partyScores.B}
          </p>
        )}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={quitToSetup}
            className={cn(ep.btnSecondary, "px-6 py-3 rounded-xl font-semibold")}
          >
            {t("back_setup")}
          </button>
          <button
            type="button"
            onClick={startGame}
            className={cn(themeBtnPrimary(TABOO_THEME), "px-6 py-3 rounded-xl font-semibold flex items-center gap-2")}
          >
            <RotateCcw className="w-4 h-4" /> {t("play_again")}
          </button>
        </div>
      </motion.div>
    );
  }

  if (!currentCard) return null;

  return (
    <div className={cn(ep.gameFullscreen, "max-w-2xl mx-auto safe-area-pad")}>
      <div className="flex items-center justify-between px-2 pt-2">
        <button
          type="button"
          onClick={quitToSetup}
          className={cn(ep.clickable, "md:hidden p-2 rounded-xl bg-white border border-slate-200 shadow-sm")}
          aria-label={tA11y("quit")}
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
        <span className="hidden md:block" />
        <span className="text-sm font-mono text-slate-500">
          {cardIndex + 1} / {deck.length}
        </span>
        {mode === "party" && (
          <div className="flex items-center gap-3 text-sm font-bold">
            <span className={cn(partyTeam === "A" ? themeAccentText(TABOO_THEME) : "text-slate-400")}>
              {t("team_a")}: {partyScores.A}
            </span>
            <span className="text-slate-300">|</span>
            <span className={cn(partyTeam === "B" ? themeAccentText(TABOO_THEME) : "text-slate-400")}>
              {t("team_b")}: {partyScores.B}
            </span>
          </div>
        )}
        {mode !== "practice" && (
          <motion.div
            animate={timeLeft <= 10 ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{
              type: "tween",
              repeat: timeLeft <= 10 ? Infinity : 0,
              duration: 0.6,
              ease: "easeInOut",
            }}
            className={cn(
              "flex items-center gap-1.5 font-mono font-bold text-lg tabular-nums px-3 py-1 rounded-full",
              timeLeft <= 10 ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-800"
            )}
          >
            <Clock className="w-4 h-4" />
            {timeLeft}s
          </motion.div>
        )}
      </div>

      <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all", themeProgressBar(TABOO_THEME))}
          style={{ width: `${((cardIndex + 1) / deck.length) * 100}%` }}
        />
      </div>

      {mode === "party" && (
        <div className={cn("text-center", themeSurfaceBanner(TABOO_THEME))}>
          {t("current_turn")}: {partyTeam === "A" ? t("team_a") : t("team_b")}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className={cn(
            "relative bg-white border-2 rounded-[2rem] p-6 sm:p-8 shadow-xl transition-colors mx-1",
            foulFlash ? "border-rose-400 bg-rose-50" : "border-slate-200"
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {tCat(currentCard.category)} · {t(`diff.${currentCard.difficulty}`)}
            </span>
            <button
              type="button"
              onClick={() => speak(currentCard.word)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
              aria-label={tA11y("pronounce")}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-4xl sm:text-5xl font-black text-center mb-8 tracking-tight">
            {currentCard.word}
          </h3>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-rose-500 text-center mb-3">
              {t("forbidden")}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {currentCard.forbidden.map((word) => (
                <span
                  key={word}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25 text-sm font-bold line-through decoration-rose-500/50"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowHint((h) => !h)}
            className="mt-6 w-full py-2.5 text-sm font-medium text-slate-600 hover:text-rose-700 bg-slate-50 hover:bg-rose-50 rounded-xl flex items-center justify-center gap-2 border border-slate-100"
          >
            {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showHint ? t("hide_meaning") : t("show_meaning")}
          </button>
          <AnimatePresence>
            {showHint && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-center text-sm text-amber-600 dark:text-amber-400 italic"
              >
                {currentCard.hint}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 p-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={handleFoul}
          className={cn(ep.touchBtn, "py-4 rounded-2xl border-2 border-rose-300 bg-rose-50 text-rose-600 font-bold flex flex-col items-center gap-1 active:bg-rose-100")}
        >
          <Ban className="w-5 h-5" />
          <span className="text-xs">{t("foul_btn")}</span>
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className={cn(ep.touchBtn, "py-4 rounded-2xl border border-slate-200 bg-white font-bold flex flex-col items-center gap-1 active:bg-slate-50")}
        >
          <SkipForward className="w-5 h-5" />
          <span className="text-xs">{t("skip")}</span>
        </button>
        <button
          type="button"
          onClick={handleCorrect}
          className={cn(ep.touchBtn, ep.btnSuccess, "py-4 rounded-2xl flex flex-col items-center gap-1")}
        >
          <Check className="w-5 h-5" />
          <span className="text-xs">{t("correct_btn")}</span>
        </button>
      </div>

      <button
        type="button"
        onClick={quitToSetup}
        className="w-full py-2 text-sm text-slate-500 hover:text-slate-700"
      >
        {t("quit")}
      </button>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={cn(ep.card, "p-3")}>
      <p className="text-lg font-black text-slate-800">{value}</p>
      <p className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</p>
    </div>
  );
}

function RulesModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations("EnglishPath.taboo.rules");
  const rules = ["r1", "r2", "r3", "r4", "r5", "r6"] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            {t("title")}
          </h3>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <ol className="space-y-3 text-sm text-slate-600 list-decimal list-inside">
          {rules.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ol>
        <button
          type="button"
          onClick={onClose}
          className={cn(ep.btnPrimary, "mt-8 w-full py-3 rounded-xl font-bold")}
        >
          {t("close")}
        </button>
      </motion.div>
    </motion.div>
  );
}
