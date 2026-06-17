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
  Smartphone,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { EnglishProgress, EnglishTab } from "../types";
import { FLASHCARDS } from "../data/flashcards";
import { GRAMMAR_RULES } from "../data/grammar";
import { PREPOSITION_EXERCISES } from "../data/prepositions";
import { GAME_DECK_STATS } from "../data/deck-info";
import { XP_PER_LEVEL } from "../constants";
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
};

export function DashboardTab({ progress, onNavigate }: Props) {
  const t = useTranslations("EnglishPath.dashboard");
  const xpInLevel = progress.xp % XP_PER_LEVEL;
  const xpPercent = (xpInLevel / XP_PER_LEVEL) * 100;

  const games: ModuleDef[] = [
    {
      id: "taboo",
      icon: Gamepad2,
      title: t("modules.taboo.title"),
      desc: t("modules.taboo.desc"),
      stat: `${GAME_DECK_STATS.taboo.count}`,
    },
    {
      id: "heads_up",
      icon: Smartphone,
      title: t("modules.heads_up.title"),
      desc: t("modules.heads_up.desc"),
      stat: `${GAME_DECK_STATS.heads_up.count}`,
    },
    {
      id: "charades",
      icon: Drama,
      title: t("modules.charades.title"),
      desc: t("modules.charades.desc"),
      stat: `${GAME_DECK_STATS.charades.count}`,
    },
    {
      id: "category_blitz",
      icon: Zap,
      title: t("modules.category_blitz.title"),
      desc: t("modules.category_blitz.desc"),
      stat: `${GAME_DECK_STATS.category_blitz.count}`,
    },
  ];

  const learn: ModuleDef[] = [
    {
      id: "flashcards",
      icon: Brain,
      title: t("modules.flashcards.title"),
      desc: t("modules.flashcards.desc"),
      stat: `${progress.masteredFlashcards.length}/${FLASHCARDS.length}`,
    },
    {
      id: "grammar",
      icon: BookOpen,
      title: t("modules.grammar.title"),
      desc: t("modules.grammar.desc"),
      stat: `${progress.completedGrammar.length}/${GRAMMAR_RULES.length}`,
    },
    {
      id: "prepositions",
      icon: Target,
      title: t("modules.prepositions.title"),
      desc: t("modules.prepositions.desc"),
      stat: `${Object.values(progress.prepositionScores).filter(Boolean).length}/${PREPOSITION_EXERCISES.length}`,
    },
  ];

  return (
    <div className="space-y-8 pb-6">
      <FadeUp>
        <div
          className={cn(
            ep.heroGradient,
            "relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-slate-900/10"
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(13,148,136,0.25),transparent_50%)]" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-300">
                {t("progress_title")}
              </span>
            </div>
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <p className="text-4xl sm:text-5xl font-bold tabular-nums tracking-tight">
                  {progress.level}
                </p>
                <p className="text-slate-300 text-sm">{t("level_label")}</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-semibold text-lg tabular-nums">
                  {xpInLevel} / {XP_PER_LEVEL}
                </p>
                <p className="text-slate-400 text-xs">XP</p>
              </div>
            </div>
            <div className="h-2 bg-white/15 rounded-full overflow-hidden mb-5">
              <motion.div
                className="h-full bg-teal-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
              <HeroStat label={t("taboo_games")} value={progress.tabooStats.gamesPlayed} />
              <HeroStat label={t("heads_up_games")} value={progress.headsUpStats.gamesPlayed} />
              <HeroStat label={t("words_guessed")} value={progress.tabooStats.wordsGuessed} />
              <HeroStat label={t("total_exams")} value={progress.examResults.length} />
            </div>
            <Pressable
              type="button"
              onClick={() => onNavigate("exam")}
              className="w-full py-3 rounded-xl bg-white text-slate-800 font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-slate-50"
            >
              <Zap className="w-4 h-4 text-teal-600" />
              {t("start_exam")} <ArrowRight className="w-4 h-4" />
            </Pressable>
          </div>
        </div>
      </FadeUp>

      <section>
        <FadeUp delay={0.05}>
          <p className={cn(ep.sectionLabel, "mb-3 flex items-center gap-2")}>
            <Gamepad2 className="w-3.5 h-3.5" /> {t("play_together")}
          </p>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 [&>*]:min-w-0">
          {games.map((mod, i) => (
            <ModuleCard
              key={mod.id}
              mod={mod}
              index={i}
              cardsLabel={t("cards")}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      <section>
        <FadeUp delay={0.1}>
          <p className={cn(ep.sectionLabel, "mb-3 flex items-center gap-2")}>
            <Activity className="w-3.5 h-3.5" /> {t("learn_section")}
          </p>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 [&>*]:min-w-0">
          {learn.map((mod, i) => (
            <ModuleCard key={mod.id} mod={mod} index={i + 3} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {progress.examResults.length > 0 && (
        <FadeUp delay={0.15}>
          <motion.button
            type="button"
            whileTap={{ scale: 0.99 }}
            onClick={() => onNavigate("results")}
            className={cn(
              ep.card,
              ep.clickable,
              ep.cardHover,
              "w-full p-5 flex items-center justify-between"
            )}
          >
            <div className="flex items-center gap-3 font-semibold text-slate-700">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", ep.iconBox)}>
                <Trophy className="w-5 h-5" />
              </div>
              {t("recent_exam")}
            </div>
            <span className="text-2xl font-bold text-teal-700 tabular-nums">
              %{progress.examResults[0].percentage}
            </span>
          </motion.button>
        </FadeUp>
      )}
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/10 rounded-lg px-3 py-2 text-center border border-white/10">
      <p className="text-lg font-bold tabular-nums">{value}</p>
      <p className="text-[9px] uppercase tracking-wide text-slate-300 leading-tight mt-0.5">{label}</p>
    </div>
  );
}

function ModuleCard({
  mod,
  index,
  cardsLabel,
  onNavigate,
}: {
  mod: ModuleDef;
  index: number;
  cardsLabel?: string;
  onNavigate: (tab: EnglishTab) => void;
}) {
  const Icon = mod.icon;
  return (
    <FadeUp delay={0.06 + index * 0.04} className="h-full min-w-0">
      <motion.button
        type="button"
        whileTap={{ scale: 0.99 }}
        onClick={() => onNavigate(mod.id)}
        className={cn(
          ep.card,
          ep.clickable,
          ep.cardHover,
          "group w-full h-full min-h-[11rem] text-left p-5 flex flex-col"
        )}
      >
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-teal-100 transition-colors",
            ep.iconBox
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-[15px] font-semibold text-slate-900 mb-1.5">{mod.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1">{mod.desc}</p>
        <span className={cn("text-xs font-medium px-2 py-1 rounded-md w-fit mt-4", ep.stat)}>
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
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-md font-semibold text-xs",
          ep.badge
        )}
      >
        <Star className="w-3.5 h-3.5" /> {progress.level}
      </div>
      <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-semibold text-xs">
        <Flame className="w-3.5 h-3.5 text-teal-600" /> {progress.streak}
      </div>
    </div>
  );
}
