"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  Volume2,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { FLASHCARDS, FLASHCARD_CATEGORY_LABELS } from "../data/flashcards";
import type { Flashcard, FlashcardCategory, FlashcardLevel } from "../types";
import { LEARN_THEMES, type ThemeTokens } from "../lib/game-themes";
import { themeChip } from "../lib/theme-utils";
import { useSpeech } from "../hooks/use-speech";
import { XP_REWARDS } from "../constants";
import { ep } from "../styles";

const FC_THEME = LEARN_THEMES.flashcards;

/** Compact CEFR level badge */
const LEVEL_COLORS: Record<FlashcardLevel, string> = {
  A1: "bg-emerald-100 text-emerald-700 border-emerald-200",
  A2: "bg-teal-100 text-teal-700 border-teal-200",
  B1: "bg-blue-100 text-blue-700 border-blue-200",
  B2: "bg-violet-100 text-violet-700 border-violet-200",
};

const LEVEL_LABELS: Record<FlashcardLevel, string> = {
  A1: "A1 Beginner",
  A2: "A2 Elementary",
  B1: "B1 Intermediate",
  B2: "B2 Upper-Int",
};

type StudyMode = "all" | "learning" | "weak";

type Props = {
  mastered: string[];
  weak: string[];
  speechRate: number;
  onMaster: (id: string) => void;
  onMarkWeak: (id: string) => void;
  onUnmarkWeak: (id: string) => void;
  onXp: (amount: number) => void;
};

export function FlashcardsTab({ mastered, weak, speechRate, onMaster, onMarkWeak, onUnmarkWeak, onXp }: Props) {
  const t = useTranslations("EnglishPath.flashcards");
  const tCat = useTranslations("EnglishPath.categories");
  const { speak } = useSpeech(speechRate);

  const [category, setCategory] = useState<FlashcardCategory | "all">("all");
  const [levelFilter, setLevelFilter] = useState<FlashcardLevel | "all">("all");
  const [studyMode, setStudyMode] = useState<StudyMode>("all");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [deck, setDeck] = useState<Flashcard[]>([]);

  const categories = ["all", ...Object.keys(FLASHCARD_CATEGORY_LABELS)] as const;

  const baseFiltered = useMemo(() => {
    let cards = FLASHCARDS;
    if (category !== "all") cards = cards.filter((c) => c.category === category);
    if (levelFilter !== "all") cards = cards.filter((c) => c.level === levelFilter);
    return cards;
  }, [category, levelFilter]);

  const filtered = useMemo(() => {
    let cards = baseFiltered;
    if (studyMode === "learning") cards = cards.filter((c) => !mastered.includes(c.id));
    if (studyMode === "weak") cards = cards.filter((c) => weak.includes(c.id));
    return shuffled ? [...deck] : cards;
  }, [baseFiltered, studyMode, mastered, weak, shuffled, deck]);

  const card = filtered[index];
  const isMastered = card ? mastered.includes(card.id) : false;
  const isWeak = card ? weak.includes(card.id) : false;

  // Level stats for progress overview
  const levelStats = useMemo(() => {
    const stats: Record<FlashcardLevel, { total: number; mastered: number }> = {
      A1: { total: 0, mastered: 0 },
      A2: { total: 0, mastered: 0 },
      B1: { total: 0, mastered: 0 },
      B2: { total: 0, mastered: 0 },
    };
    FLASHCARDS.forEach((c) => {
      stats[c.level].total++;
      if (mastered.includes(c.id)) stats[c.level].mastered++;
    });
    return stats;
  }, [mastered]);

  const weakCount = useMemo(() => baseFiltered.filter((c) => weak.includes(c.id)).length, [baseFiltered, weak]);
  const learningCount = useMemo(() => baseFiltered.filter((c) => !mastered.includes(c.id)).length, [baseFiltered, mastered]);

  const shuffleDeck = () => {
    const arr = [...baseFiltered];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setDeck(arr);
    setShuffled(true);
    setIndex(0);
    setFlipped(false);
  };

  const resetShuffle = () => {
    setShuffled(false);
    setIndex(0);
    setFlipped(false);
  };

  const goNext = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % Math.max(filtered.length, 1));
  };

  const goPrev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
  };

  const handleMaster = () => {
    if (!card || isMastered) return;
    onMaster(card.id);
    onXp(XP_REWARDS.flashcardMastered);
    goNext();
  };

  const handleWeak = () => {
    if (!card) return;
    if (isWeak) {
      onUnmarkWeak(card.id);
    } else {
      onMarkWeak(card.id);
    }
  };

  const changeFilter = (cat: typeof category, lv: typeof levelFilter, mode: StudyMode) => {
    setCategory(cat);
    setLevelFilter(lv);
    setStudyMode(mode);
    setShuffled(false);
    setIndex(0);
    setFlipped(false);
  };

  if (filtered.length === 0) {
    return (
      <div className="space-y-6">
        <FilterBar
          categories={categories}
          category={category}
          levelFilter={levelFilter}
          studyMode={studyMode}
          weakCount={weakCount}
          learningCount={learningCount}
          tCat={tCat}
          t={t}
          onChange={changeFilter}
          FC_THEME={FC_THEME}
        />
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">{t("no_cards")}</p>
          <p className="text-sm text-slate-400 mt-1">{t("try_different_filter")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Level Progress Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.entries(levelStats) as [FlashcardLevel, { total: number; mastered: number }][]).map(([lv, stat]) => {
          const pct = stat.total > 0 ? Math.round((stat.mastered / stat.total) * 100) : 0;
          return (
            <button
              key={lv}
              type="button"
              onClick={() => changeFilter("all", lv, studyMode)}
              className={cn(
                "p-3 rounded-xl border text-left transition-all",
                levelFilter === lv
                  ? "ring-2 ring-teal-400 bg-teal-50 border-teal-200"
                  : "border-slate-200 bg-white/60 hover:bg-slate-50"
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded border", LEVEL_COLORS[lv])}>{lv}</span>
                <span className="text-xs text-slate-500">{pct}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="h-full bg-teal-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{stat.mastered}/{stat.total}</p>
            </button>
          );
        })}
      </div>

      <FilterBar
        categories={categories}
        category={category}
        levelFilter={levelFilter}
        studyMode={studyMode}
        weakCount={weakCount}
        learningCount={learningCount}
        tCat={tCat}
        t={t}
        onChange={changeFilter}
        FC_THEME={FC_THEME}
      />

      {/* Stats row */}
      <div className="flex items-center justify-between px-1">
        <p className={cn("text-sm font-mono", ep.mutedSm)}>
          {index + 1} / {filtered.length}
          {" · "}
          <span className="text-emerald-600">{mastered.length} mastered</span>
          {weak.length > 0 && (
            <span className="text-amber-500"> · {weak.length} need practice</span>
          )}
        </p>
        <button
          type="button"
          onClick={shuffled ? resetShuffle : shuffleDeck}
          className={cn(
            "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors",
            shuffled
              ? "bg-teal-50 border-teal-200 text-teal-700"
              : "border-slate-200 text-slate-500 hover:bg-slate-50"
          )}
        >
          <Shuffle className="w-3.5 h-3.5" />
          {shuffled ? t("shuffled") : t("shuffle")}
        </button>
      </div>

      {/* Flashcard */}
      <div className="flex flex-col items-center gap-4 max-w-lg mx-auto">
        <div
          className="perspective-1000 w-full h-72 cursor-pointer"
          onClick={() => setFlipped((f) => !f)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setFlipped((f) => !f)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={card.id + "-" + flipped}
              className="relative w-full h-full transform-style-3d"
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              {/* Front */}
              <div className={cn(ep.card, "absolute inset-0 backface-hidden p-6 flex flex-col items-center justify-center text-center")}>
                {/* Badges row */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border", LEVEL_COLORS[card.level])}>
                    {card.level}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide">{card.category}</span>
                </div>
                {isMastered && (
                  <span className="absolute top-4 right-4 text-emerald-500">
                    <Check className="w-5 h-5" />
                  </span>
                )}
                {isWeak && !isMastered && (
                  <span className="absolute top-4 right-4 text-amber-500">
                    <AlertCircle className="w-5 h-5" />
                  </span>
                )}
                <div className="text-3xl font-bold text-slate-800 mb-3">{card.front}</div>
                <div className="font-mono text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                  {card.phonetic}
                </div>
                <p className={cn("text-[10px] uppercase tracking-widest mt-6", ep.mutedSm)}>
                  {t("tap_flip")}
                </p>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-700 to-teal-800 text-white rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-xl"
                style={{ transform: "rotateY(180deg)" }}
              >
                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border mb-4", "bg-white/20 text-white border-white/30")}>
                  {LEVEL_LABELS[card.level]}
                </span>
                <div className="text-3xl font-bold mb-3">{card.back}</div>
                <p className="text-sm text-white/80 italic mb-5 px-2">&ldquo;{card.example}&rdquo;</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(card.front);
                  }}
                  className="bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-colors"
                >
                  <Volume2 className="w-4 h-4" /> {t("speak")}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full">
          <button
            type="button"
            onClick={goPrev}
            className={cn(ep.btnSecondary, "p-3 rounded-xl")}
            aria-label="Previous card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleWeak}
            disabled={isMastered}
            className={cn(
              "flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border",
              isMastered
                ? "opacity-30 cursor-not-allowed border-slate-200 text-slate-400"
                : isWeak
                  ? "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
                  : "border-slate-200 text-slate-600 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600"
            )}
          >
            {isWeak ? <X className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {isWeak ? t("remove_weak") : t("need_practice")}
          </button>

          <button
            type="button"
            onClick={() => setFlipped(false)}
            className={cn(ep.btnSecondary, "p-3 rounded-xl")}
            aria-label="Reset card"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleMaster}
            disabled={isMastered}
            className={cn(
              "flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
              isMastered
                ? "bg-emerald-100 text-emerald-700 cursor-default border border-emerald-200"
                : ep.btnPrimary
            )}
          >
            <Check className="w-4 h-4" />
            {isMastered ? t("already_mastered") : t("mark_mastered")}
          </button>

          <button
            type="button"
            onClick={goNext}
            className={cn(ep.btnSecondary, "p-3 rounded-xl")}
            aria-label="Next card"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
}

// ── Filter Bar Sub-component ───────────────────────────────────────────────────
function FilterBar({
  categories,
  category,
  levelFilter,
  studyMode,
  weakCount,
  learningCount,
  tCat,
  t,
  onChange,
  FC_THEME,
}: {
  categories: readonly string[];
  category: FlashcardCategory | "all";
  levelFilter: FlashcardLevel | "all";
  studyMode: StudyMode;
  weakCount: number;
  learningCount: number;
  tCat: (key: string) => string;
  t: (key: string) => string;
  onChange: (cat: FlashcardCategory | "all", lv: FlashcardLevel | "all", mode: StudyMode) => void;
  FC_THEME: ThemeTokens;
}) {
  return (
    <div className="space-y-3">
      {/* Study mode pills */}
      <div className="flex gap-2">
        {(["all", "learning", "weak"] as StudyMode[]).map((mode) => {
          const label =
            mode === "all"
              ? t("mode_all")
              : mode === "learning"
                ? `${t("mode_learning")} (${learningCount})`
                : `${t("mode_weak")} (${weakCount})`;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => onChange(category, levelFilter, mode)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full font-medium border transition-colors",
                studyMode === mode
                  ? mode === "weak"
                    ? "bg-amber-100 text-amber-700 border-amber-300"
                    : "bg-teal-100 text-teal-700 border-teal-300"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat as FlashcardCategory | "all", levelFilter, studyMode)}
            className={cn(themeChip(FC_THEME, category === cat))}
          >
            {cat === "all" ? t("all") : tCat(cat)}
          </button>
        ))}
      </div>
    </div>
  );
}
