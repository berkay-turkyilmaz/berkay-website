"use client";

import { motion } from "framer-motion";
import { X, RotateCcw, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { EnglishProgress } from "../types";
import { ep } from "../styles";
import { GameTimerSlider } from "./game-timer-slider";

type Props = {
  settings: EnglishProgress["settings"];
  onUpdate: (patch: Partial<EnglishProgress["settings"]>) => void;
  onReset: () => void;
  onClose: () => void;
};

export function SettingsPanel({ settings, onUpdate, onReset, onClose }: Props) {
  const t = useTranslations("EnglishPath.settings");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm cursor-pointer"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-2xl p-6 max-w-md w-full shadow-2xl cursor-default max-h-[90dvh] overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6"
      >
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">{t("title")}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className={cn(ep.clickable, "p-2 hover:bg-slate-100 rounded-lg text-slate-600")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              {t("speech_rate")}: {settings.speechRate.toFixed(2)}
            </label>
            <input
              type="range"
              min={0.7}
              max={1.2}
              step={0.05}
              value={settings.speechRate}
              onChange={(e) => onUpdate({ speechRate: Number(e.target.value) })}
              className="w-full mt-2 accent-teal-600"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              {t("exam_count")}: {settings.examQuestionCount}
            </label>
            <input
              type="range"
              min={5}
              max={25}
              value={settings.examQuestionCount}
              onChange={(e) => onUpdate({ examQuestionCount: Number(e.target.value) })}
              className="w-full mt-2 accent-teal-600"
            />
          </div>

          <div className="border-t border-slate-100 pt-5 space-y-5">
            <p className={cn(ep.sectionLabel)}>{t("game_timers")}</p>
            <GameTimerSlider
              label={t("taboo_timer")}
              value={settings.tabooRoundDuration}
              onChange={(tabooRoundDuration) => onUpdate({ tabooRoundDuration })}
            />
            <GameTimerSlider
              label={t("heads_up_timer")}
              value={settings.headsUpRoundDuration}
              onChange={(headsUpRoundDuration) => onUpdate({ headsUpRoundDuration })}
            />
            <GameTimerSlider
              label={t("charades_timer")}
              value={settings.charadesRoundDuration}
              onChange={(charadesRoundDuration) => onUpdate({ charadesRoundDuration })}
            />
            <GameTimerSlider
              label={t("category_blitz_timer")}
              value={settings.categoryBlitzRoundDuration}
              onChange={(categoryBlitzRoundDuration) => onUpdate({ categoryBlitzRoundDuration })}
              min={15}
              max={60}
              step={5}
            />
            <p className="text-xs text-slate-400 leading-relaxed">{t("game_timers_hint")}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (confirm(t("reset_confirm"))) onReset();
            }}
            className={cn(
              ep.clickable,
              "w-full py-3 rounded-xl border border-rose-200 text-rose-600 font-semibold flex items-center justify-center gap-2 hover:bg-rose-50"
            )}
          >
            <RotateCcw className="w-4 h-4" /> {t("reset_progress")}
          </button>

          <Link
            href="/ai-lab"
            onClick={onClose}
            className={cn(
              ep.clickable,
              "w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50"
            )}
          >
            <LogOut className="w-4 h-4 text-slate-500" /> {t("exit_lab")}
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
