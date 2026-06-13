"use client";

import { motion } from "framer-motion";
import { ArrowRight, Drama, Gamepad2, Info, Smartphone, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { EnglishTab } from "../types";
import { GAME_DECK_STATS } from "../data/deck-info";
import { ep } from "../styles";
import { FadeUp } from "./motion-primitives";

type Props = {
  onNavigate: (tab: EnglishTab) => void;
};

export function GamesHubTab({ onNavigate }: Props) {
  const t = useTranslations("EnglishPath.games_hub");

  const games = [
    {
      id: "taboo" as const,
      icon: Gamepad2,
      title: t("taboo.title"),
      desc: t("taboo.desc"),
      deckNote: t("deck_notes.taboo"),
      stat: GAME_DECK_STATS.taboo.count,
    },
    {
      id: "heads_up" as const,
      icon: Smartphone,
      title: t("heads_up.title"),
      desc: t("heads_up.desc"),
      deckNote: t("deck_notes.heads_up"),
      stat: GAME_DECK_STATS.heads_up.count,
    },
    {
      id: "charades" as const,
      icon: Drama,
      title: t("charades.title"),
      desc: t("charades.desc"),
      deckNote: t("deck_notes.charades"),
      stat: GAME_DECK_STATS.charades.count,
    },
    {
      id: "emoji_clues" as const,
      icon: Sparkles,
      title: t("emoji_clues.title"),
      desc: t("emoji_clues.desc"),
      deckNote: t("deck_notes.emoji_clues"),
      stat: GAME_DECK_STATS.emoji_clues.count,
    },
  ];

  return (
    <div className="space-y-5 pb-4 max-w-2xl mx-auto">
      <FadeUp>
        <div className="text-center space-y-2 py-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t("title")}</h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">{t("subtitle")}</p>
        </div>
      </FadeUp>

      <FadeUp delay={0.05}>
        <div className={cn(ep.surfaceMuted, "p-4 flex gap-3 text-sm text-slate-600")}>
          <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{t("deck_why")}</p>
        </div>
      </FadeUp>

      <div className="space-y-3">
        {games.map((game, i) => {
          const Icon = game.icon;
          return (
            <FadeUp key={game.id} delay={0.08 + i * 0.05}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.99 }}
                onClick={() => onNavigate(game.id)}
                className={cn(
                  ep.card,
                  ep.clickable,
                  ep.cardHover,
                  "w-full text-left p-5"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-lg flex items-center justify-center shrink-0",
                      ep.iconBox
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="text-base font-semibold text-slate-900">{game.title}</h3>
                      <span className={cn("text-xs font-medium px-2 py-1 rounded-md shrink-0 tabular-nums", ep.stat)}>
                        {game.stat} {t("cards")}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed mb-2">{game.desc}</p>
                    <p className="text-xs text-slate-400 leading-snug mb-3">{game.deckNote}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-teal-700">
                      {t("play")} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.button>
            </FadeUp>
          );
        })}
      </div>
    </div>
  );
}
