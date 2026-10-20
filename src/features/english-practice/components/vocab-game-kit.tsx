"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { ThemeTokens } from "../lib/game-themes";
import { themeBtnPrimary, themeChip, themeIconBox, themeStatBadge } from "../lib/theme-utils";
import { levelCounts } from "../lib/vocab";
import { ep } from "../styles";
import { CEFR_LEVELS, type VocabLevelFilter } from "../types";
import { FadeUp } from "./motion-primitives";

const COUNTS = levelCounts();

/** CEFR level selector (A1–C1 plus "all") shared by every vocabulary game. */
export function LevelPicker({
  value,
  onChange,
  theme,
  counts = COUNTS,
}: {
  value: VocabLevelFilter;
  onChange: (level: VocabLevelFilter) => void;
  theme: ThemeTokens;
  /** Items per level shown on each pill (defaults to vocabulary size). */
  counts?: Record<string, number>;
}) {
  const t = useTranslations("EnglishPath.vocab_games");
  const options: VocabLevelFilter[] = [...CEFR_LEVELS, "all"];

  return (
    <div role="radiogroup" aria-label={t("level_label")} className="flex flex-wrap gap-2">
      {options.map((level) => {
        const count = level === "all" ? Object.values(counts).reduce((a, b) => a + b, 0) : (counts[level] ?? 0);
        const disabled = count === 0;
        return (
          <button
            key={level}
            type="button"
            role="radio"
            aria-checked={value === level}
            disabled={disabled}
            onClick={() => onChange(level)}
            className={cn(
              themeChip(theme, value === level),
              "min-h-[40px] px-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            )}
          >
            {level === "all" ? t("all_levels") : level}
            <span className="ml-1.5 text-[11px] font-normal opacity-70 tabular-nums">{count}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Setup screen: title, description, level, optional extra options and the start button. */
export function VocabSetup({
  theme,
  icon: Icon,
  title,
  description,
  level,
  onLevelChange,
  poolSize,
  minWords,
  onStart,
  best,
  gamesPlayed,
  children,
}: {
  theme: ThemeTokens;
  icon: typeof Play;
  title: string;
  description: string;
  level: VocabLevelFilter;
  onLevelChange: (level: VocabLevelFilter) => void;
  /** Playable words for the current level (disables start when too small). */
  poolSize: number;
  minWords: number;
  onStart: () => void;
  best?: number;
  gamesPlayed?: number;
  children?: ReactNode;
}) {
  const t = useTranslations("EnglishPath.vocab_games");
  const canStart = poolSize >= minWords;

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-4">
      <FadeUp>
        <div className="text-center space-y-3 py-2">
          <div className={cn("w-14 h-14 mx-auto", themeIconBox(theme))}>
            <Icon className="w-7 h-7" aria-hidden />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">{description}</p>
          {(best ?? 0) > 0 && (
            <div className="flex justify-center gap-2">
              <span className={themeStatBadge(theme)}>{t("best", { n: best ?? 0 })}</span>
              <span className={themeStatBadge(theme)}>{t("played", { n: gamesPlayed ?? 0 })}</span>
            </div>
          )}
        </div>
      </FadeUp>

      <FadeUp delay={0.05}>
        <div className={cn(ep.card, "p-4 space-y-4")}>
          <div className="space-y-2">
            <p className={ep.sectionLabel}>{t("level_label")}</p>
            <LevelPicker value={level} onChange={onLevelChange} theme={theme} />
            <p className="text-xs text-slate-400">{t("level_hint")}</p>
          </div>
          {children}
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <button
          type="button"
          onClick={onStart}
          disabled={!canStart}
          className={cn(
            themeBtnPrimary(theme),
            "w-full min-h-[52px] rounded-xl text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Play className="w-5 h-5" aria-hidden />
          {canStart ? t("start") : t("not_enough_words", { n: minWords })}
        </button>
      </FadeUp>
    </div>
  );
}

/** Result screen with score, accuracy and replay / change-level actions. */
export function VocabResult({
  theme,
  score,
  total,
  correct,
  xp,
  isNewBest,
  onReplay,
  onSetup,
  extra,
}: {
  theme: ThemeTokens;
  score: number;
  total: number;
  correct: number;
  xp: number;
  isNewBest: boolean;
  onReplay: () => void;
  onSetup: () => void;
  extra?: ReactNode;
}) {
  const t = useTranslations("EnglishPath.vocab_games");
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto space-y-5 text-center py-6"
      role="status"
      aria-live="polite"
    >
      <div className={cn("w-16 h-16 mx-auto", themeIconBox(theme))}>
        <Trophy className="w-8 h-8" aria-hidden />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{t("finished")}</h2>
        {isNewBest && <p className="text-sm font-semibold text-emerald-600 mt-1">{t("new_best")}</p>}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className={cn(ep.card, "p-3")}>
          <p className="text-2xl font-bold tabular-nums text-slate-900">{score}</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-400">{t("score")}</p>
        </div>
        <div className={cn(ep.card, "p-3")}>
          <p className="text-2xl font-bold tabular-nums text-slate-900">
            {correct}/{total}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-slate-400">{t("correct")}</p>
        </div>
        <div className={cn(ep.card, "p-3")}>
          <p className="text-2xl font-bold tabular-nums text-slate-900">{accuracy}%</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-400">{t("accuracy")}</p>
        </div>
      </div>
      <p className="text-sm text-slate-500">{t("xp_earned", { n: xp })}</p>
      {extra}
      <div className="flex gap-3">
        <button type="button" onClick={onSetup} className={cn(ep.btnSecondary, "flex-1 min-h-[48px] rounded-xl")}>
          {t("change_level")}
        </button>
        <button
          type="button"
          onClick={onReplay}
          className={cn(themeBtnPrimary(theme), "flex-1 min-h-[48px] rounded-xl flex items-center justify-center gap-2")}
        >
          <RotateCcw className="w-4 h-4" aria-hidden />
          {t("play_again")}
        </button>
      </div>
    </motion.div>
  );
}

/** Thin progress bar used in game HUDs. */
export function ProgressBar({ value, max, theme }: { value: number; max: number; theme: ThemeTokens }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      className="h-2 rounded-full bg-slate-100 overflow-hidden"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div className={cn("h-full rounded-full transition-[width] duration-300", theme.progress)} style={{ width: `${pct}%` }} />
    </div>
  );
}
