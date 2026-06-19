"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Brain,
  Drama,
  Flame,
  Gamepad2,
  Library,
  Smartphone,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { EnglishProgress, EnglishTab } from "../types";
import { FLASHCARDS } from "../data/flashcards";
import { GRAMMAR_RULES } from "../data/grammar";
import { PREPOSITION_EXERCISES } from "../data/prepositions";
import { GAME_DECK_STATS, TOTAL_LIBRARY_WORDS } from "../data/deck-info";
import { XP_PER_LEVEL } from "../constants";
import { GAME_THEMES, LEARN_THEMES, type LearnThemeId, type GameThemeId } from "../lib/game-themes";
import { ep } from "../styles";
import { FadeUp, Pressable } from "./motion-primitives";

type Props = {
  progress: EnglishProgress;
  onNavigate: (tab: EnglishTab) => void;
};

type ModuleDef = {
  id: EnglishTab;
  icon: typeof Gamepad2;
  title: string;
  desc: string;
  stat: string;
  themeId?: GameThemeId | LearnThemeId;
};

function getContinueTab(progress: EnglishProgress): EnglishTab {
  if (progress.masteredFlashcards.length < FLASHCARDS.length) return "flashcards";
  if (progress.completedGrammar.length < GRAMMAR_RULES.length) return "grammar";
  if (
    Object.values(progress.prepositionScores).filter(Boolean).length <
    PREPOSITION_EXERCISES.length
  ) {
    return "prepositions";
  }
  return "exam";
}

function getContinueLabel(
  tab: EnglishTab,
  t: (key: string) => string,
  tTabs: (key: string) => string
): { title: string; desc: string } {
  if (tab === "exam") {
    return { title: tTabs("exam"), desc: t("exam_cta_desc") };
  }
  return { title: t(`modules.${tab}.title`), desc: t(`modules.${tab}.desc`) };
}

function getGradeKey(pct: number): "excellent" | "good" | "fair" | "needs_work" {
  if (pct >= 90) return "excellent";
  if (pct >= 75) return "good";
  if (pct >= 60) return "fair";
  return "needs_work";
}

export function DashboardTab({ progress, onNavigate }: Props) {
  const t = useTranslations("EnglishPath.dashboard");
  const tTabs = useTranslations("EnglishPath.tabs");
  const xpInLevel = progress.xp % XP_PER_LEVEL;
  const xpPercent = (xpInLevel / XP_PER_LEVEL) * 100;
  const continueTab = getContinueTab(progress);
  const continueInfo = getContinueLabel(continueTab, t, tTabs);
  const latestExam = progress.examResults[0];
  const latestPct = latestExam?.percentage ?? 0;

  const games: ModuleDef[] = [
    {
      id: "taboo",
      icon: Gamepad2,
      title: t("modules.taboo.title"),
      desc: t("modules.taboo.desc"),
      stat: `${GAME_DECK_STATS.taboo.count}`,
      themeId: "taboo",
    },
    {
      id: "heads_up",
      icon: Smartphone,
      title: t("modules.heads_up.title"),
      desc: t("modules.heads_up.desc"),
      stat: `${GAME_DECK_STATS.heads_up.count}`,
      themeId: "heads_up",
    },
    {
      id: "charades",
      icon: Drama,
      title: t("modules.charades.title"),
      desc: t("modules.charades.desc"),
      stat: `${GAME_DECK_STATS.charades.count}`,
      themeId: "charades",
    },
    {
      id: "category_blitz",
      icon: Zap,
      title: t("modules.category_blitz.title"),
      desc: t("modules.category_blitz.desc"),
      stat: `${GAME_DECK_STATS.category_blitz.count}`,
      themeId: "category_blitz",
    },
  ];

  const learn: ModuleDef[] = [
    {
      id: "flashcards",
      icon: Brain,
      title: t("modules.flashcards.title"),
      desc: t("modules.flashcards.desc"),
      stat: `${progress.masteredFlashcards.length}/${FLASHCARDS.length}`,
      themeId: "flashcards",
    },
    {
      id: "grammar",
      icon: BookOpen,
      title: t("modules.grammar.title"),
      desc: t("modules.grammar.desc"),
      stat: `${progress.completedGrammar.length}/${GRAMMAR_RULES.length}`,
      themeId: "grammar",
    },
    {
      id: "prepositions",
      icon: Target,
      title: t("modules.prepositions.title"),
      desc: t("modules.prepositions.desc"),
      stat: `${Object.values(progress.prepositionScores).filter(Boolean).length}/${PREPOSITION_EXERCISES.length}`,
      themeId: "prepositions",
    },
  ];

  const masteryPct =
    FLASHCARDS.length > 0
      ? Math.round((progress.masteredFlashcards.length / FLASHCARDS.length) * 100)
      : 0;

  return (
    <div className="space-y-8 pb-8">
      <FadeUp>
        <div
          className={cn(
            ep.heroGradient,
            "relative overflow-hidden rounded-2xl border border-slate-700/30 shadow-xl shadow-slate-900/10"
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(13,148,136,0.28),transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_90%,rgba(99,102,241,0.15),transparent_40%)]" />
          <div className="relative p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-teal-300" aria-hidden />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                    {t("welcome")}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("hero_title")}</h1>
                <p className="text-slate-300 text-sm mt-1.5 max-w-md leading-relaxed">
                  {t("hero_subtitle")}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
                  <Star className="w-4 h-4 text-amber-300" aria-hidden />
                  <span className="font-bold tabular-nums">{progress.level}</span>
                  <span className="text-xs text-slate-300">{t("level_label")}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
                  <Flame className="w-4 h-4 text-orange-300" aria-hidden />
                  <span className="font-bold tabular-nums">{progress.streak}</span>
                  <span className="text-xs text-slate-300">{t("streak_days")}</span>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span>{t("xp_progress")}</span>
                <span className="font-mono tabular-nums">
                  {xpInLevel} / {XP_PER_LEVEL} XP
                </span>
              </div>
              <div className="h-2.5 bg-white/12 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <HeroStat label={t("taboo_games")} value={progress.tabooStats.gamesPlayed} />
              <HeroStat label={t("heads_up_games")} value={progress.headsUpStats.gamesPlayed} />
              <HeroStat label={t("words_guessed")} value={progress.tabooStats.wordsGuessed} />
              <HeroStat label={t("total_exams")} value={progress.examResults.length} />
            </div>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FadeUp delay={0.04} className="lg:col-span-2">
          <div className={cn(ep.card, "p-5 sm:p-6 h-full")}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className={cn(ep.sectionLabel, "mb-2 flex items-center gap-2")}>
                  <TrendingUp className="w-3.5 h-3.5" aria-hidden />
                  {t("continue_learning")}
                </p>
                <p className="text-lg font-semibold text-slate-900">{continueInfo.title}</p>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{continueInfo.desc}</p>
              </div>
              <Pressable
                type="button"
                onClick={() => onNavigate(continueTab)}
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold shadow-sm shadow-teal-600/20 hover:bg-teal-700 transition-colors"
              >
                {t("open_module")}
                <ArrowRight className="w-4 h-4" />
              </Pressable>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.06}>
          <div className={cn(ep.card, "p-5 sm:p-6 h-full flex flex-col")}>
            <p className={cn(ep.sectionLabel, "mb-3 flex items-center gap-2")}>
              <Library className="w-3.5 h-3.5" aria-hidden />
              {t("word_library")}
            </p>
            <p className="text-3xl font-bold text-slate-900 tabular-nums">{TOTAL_LIBRARY_WORDS}</p>
            <p className="text-sm text-slate-500 mt-1">{t("total_words")}</p>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>{t("modules.flashcards.title")}</span>
                <span className="font-medium text-slate-700 tabular-nums">{FLASHCARDS.length}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("mastery")}</span>
                <span className="font-medium text-teal-700 tabular-nums">%{masteryPct}</span>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>

      <section>
        <FadeUp delay={0.08}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <p className={cn(ep.sectionLabel, "flex items-center gap-2 mb-0")}>
              <Gamepad2 className="w-3.5 h-3.5" aria-hidden />
              {t("play_together")}
            </p>
            <button
              type="button"
              onClick={() => onNavigate("games")}
              className="text-xs font-medium text-teal-700 hover:text-teal-800 transition-colors"
            >
              {t("view_all_games")}
            </button>
          </div>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 [&>*]:min-w-0">
          {games.map((mod, i) => (
            <ModuleCard
              key={mod.id}
              mod={mod}
              index={i}
              cardsLabel={t("cards")}
              openLabel={t("open_module")}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      <section>
        <FadeUp delay={0.1}>
          <p className={cn(ep.sectionLabel, "mb-4 flex items-center gap-2")}>
            <Activity className="w-3.5 h-3.5" aria-hidden />
            {t("learn_section")}
          </p>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 [&>*]:min-w-0">
          {learn.map((mod, i) => (
            <ModuleCard
              key={mod.id}
              mod={mod}
              index={i + 4}
              openLabel={t("open_module")}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      <FadeUp delay={0.12}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={cn(
              ep.card,
              "relative overflow-hidden p-6 border-teal-200/80 bg-gradient-to-br from-white to-teal-50/40"
            )}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <Trophy className="w-8 h-8 text-amber-500 mb-3" aria-hidden />
              <h3 className="text-lg font-semibold text-slate-900">{t("start_exam")}</h3>
              <p className="text-sm text-slate-500 mt-1 mb-4 leading-relaxed">{t("exam_cta_desc")}</p>
              <Pressable
                type="button"
                onClick={() => onNavigate("exam")}
                className={cn(ep.btnPrimary, "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm")}
              >
                <Zap className="w-4 h-4" />
                {t("start_exam")}
                <ArrowRight className="w-4 h-4" />
              </Pressable>
            </div>
          </div>

          {latestExam && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.99 }}
              onClick={() => onNavigate("results")}
              className={cn(ep.card, ep.clickable, ep.cardHover, "p-6 text-left h-full")}
            >
              <p className={cn(ep.sectionLabel, "mb-3")}>{t("recent_exam")}</p>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-4xl font-black text-teal-700 tabular-nums">%{latestPct}</p>
                  <p className="text-sm font-medium text-slate-600 mt-1">
                    {t(`grades.${getGradeKey(latestPct)}`)}
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(latestExam.date).toLocaleDateString()}
                </span>
              </div>
            </motion.button>
          )}
        </div>
      </FadeUp>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/10 rounded-xl px-3 py-2.5 text-center border border-white/10 backdrop-blur-[2px]">
      <p className="text-lg font-bold tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-slate-300 leading-tight mt-0.5 line-clamp-2">
        {label}
      </p>
    </div>
  );
}

function ModuleCard({
  mod,
  index,
  cardsLabel,
  openLabel,
  onNavigate,
}: {
  mod: ModuleDef;
  index: number;
  cardsLabel?: string;
  openLabel: string;
  onNavigate: (tab: EnglishTab) => void;
}) {
  const Icon = mod.icon;
  const gameTheme = mod.themeId && mod.themeId in GAME_THEMES ? GAME_THEMES[mod.themeId as GameThemeId] : null;
  const learnTheme =
    mod.themeId && mod.themeId in LEARN_THEMES ? LEARN_THEMES[mod.themeId as LearnThemeId] : null;
  const theme = gameTheme ?? learnTheme;

  return (
    <FadeUp delay={0.06 + index * 0.04} className="h-full min-w-0">
      <motion.button
        type="button"
        whileTap={{ scale: 0.99 }}
        onClick={() => onNavigate(mod.id)}
        className={cn(
          ep.card,
          ep.clickable,
          "group w-full h-full min-h-[12rem] text-left p-5 flex flex-col border transition-all duration-200",
          theme
            ? `${theme.border} hover:shadow-lg hover:-translate-y-0.5`
            : cn(ep.cardHover)
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center transition-colors",
              theme ? `${theme.surface} ${theme.icon}` : ep.iconBox
            )}
          >
            <Icon className="w-5 h-5" aria-hidden />
          </div>
          <span
            className={cn(
              "text-[10px] font-semibold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity",
              theme?.accentFg ?? "text-teal-700"
            )}
          >
            {openLabel} →
          </span>
        </div>
        <h3 className="text-[15px] font-semibold text-slate-900 mb-1.5">{mod.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1">{mod.desc}</p>
        <span
          className={cn(
            "text-xs font-semibold px-2.5 py-1 rounded-lg w-fit mt-4 tabular-nums",
            theme ? `${theme.surface} ${theme.accentFg}` : ep.stat
          )}
        >
          {mod.stat}
          {cardsLabel ? ` ${cardsLabel}` : ""}
        </span>
      </motion.button>
    </FadeUp>
  );
}

export function DashboardBadges({ progress }: { progress: EnglishProgress }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn("flex items-center gap-1 px-2 py-1 rounded-md font-semibold text-xs", ep.badge)}>
        <Star className="w-3.5 h-3.5" aria-hidden />
        <span className="tabular-nums">{progress.level}</span>
      </div>
      <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-semibold text-xs">
        <Flame className="w-3.5 h-3.5 text-teal-600" aria-hidden />
        <span className="tabular-nums">{progress.streak}</span>
      </div>
    </div>
  );
}
