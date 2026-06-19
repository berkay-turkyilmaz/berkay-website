"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, RotateCcw, Volume2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { FLASHCARDS, FLASHCARD_CATEGORY_LABELS } from "../data/flashcards";
import type { FlashcardCategory } from "../types";
import { LEARN_THEMES } from "../lib/game-themes";
import { themeChip } from "../lib/theme-utils";
import { useSpeech } from "../hooks/use-speech";
import { XP_REWARDS } from "../constants";
import { ep } from "../styles";

const FC_THEME = LEARN_THEMES.flashcards;

type Props = {
  mastered: string[];
  speechRate: number;
  onMaster: (id: string) => void;
  onXp: (amount: number) => void;
};

export function FlashcardsTab({ mastered, speechRate, onMaster, onXp }: Props) {
  const t = useTranslations("EnglishPath.flashcards");
  const tCat = useTranslations("EnglishPath.categories");
  const tA11y = useTranslations("EnglishPath.a11y");
  const { speak } = useSpeech(speechRate);
  const [category, setCategory] = useState<FlashcardCategory | "all">("all");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const filtered = useMemo(
    () =>
      category === "all"
        ? FLASHCARDS
        : FLASHCARDS.filter((c) => c.category === category),
    [category]
  );

  const card = filtered[index];
  const isMastered = card ? mastered.includes(card.id) : false;

  const categories = ["all", ...Object.keys(FLASHCARD_CATEGORY_LABELS)] as const;

  const goNext = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % filtered.length);
  };

  const goPrev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + filtered.length) % filtered.length);
  };

  const handleMaster = () => {
    if (!card || isMastered) return;
    onMaster(card.id);
    onXp(XP_REWARDS.flashcardMastered);
    goNext();
  };

  if (!card) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setCategory(cat as FlashcardCategory | "all");
              setIndex(0);
              setFlipped(false);
            }}
            className={cn(themeChip(FC_THEME, category === cat))}
          >
            {cat === "all" ? t("all") : tCat(cat)}
          </button>
        ))}
      </div>

      <p className={cn("text-sm font-mono", ep.mutedSm)}>
        {index + 1} / {filtered.length} · {mastered.length} {t("mastered")}
      </p>

      <div className="flex flex-col items-center gap-6 max-w-lg mx-auto">
        <div
          className="perspective-1000 w-full h-72 cursor-pointer"
          onClick={() => setFlipped((f) => !f)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setFlipped((f) => !f)}
        >
          <motion.div
            className="relative w-full h-full transform-style-3d"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <div className={cn(ep.card, "absolute inset-0 backface-hidden p-8 flex flex-col items-center justify-center text-center")}>
              {isMastered && (
                <span className="absolute top-4 right-4 text-emerald-500">
                  <Check className="w-5 h-5" />
                </span>
              )}
              <span className={cn("text-xs uppercase tracking-widest mb-2", ep.mutedSm)}>
                {tCat(card.category)}
              </span>
              <div className="text-3xl font-bold text-slate-800 mb-3">{card.front}</div>
              <div className="font-mono text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                {card.phonetic}
              </div>
              <p className={cn("text-[10px] uppercase tracking-widest mt-6", ep.mutedSm)}>
                {t("tap_flip")}
              </p>
            </div>
            <div
              className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-700 to-teal-800 text-white rounded-[2rem] p-8 flex flex-col items-center justify-center text-center shadow-xl"
              style={{ transform: "rotateY(180deg)" }}
            >
              <div className="text-3xl font-bold mb-4">{card.back}</div>
              <p className="text-sm text-white/80 italic mb-6">&ldquo;{card.example}&rdquo;</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speak(card.front);
                }}
                className="bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4" /> {t("speak")}
              </button>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={goPrev}
            className={cn(ep.btnSecondary, "p-3 rounded-xl")}
            aria-label={tA11y("nav_prev")}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setFlipped(false)}
            className={cn(ep.btnSecondary, "p-3 rounded-xl")}
            aria-label={tA11y("nav_reset")}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleMaster}
            disabled={isMastered}
            className={cn(
              "flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
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
            aria-label={tA11y("nav_next")}
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
