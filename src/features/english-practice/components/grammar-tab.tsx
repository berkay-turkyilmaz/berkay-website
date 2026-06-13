"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Check, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { GRAMMAR_RULES } from "../data/grammar";
import { XP_REWARDS } from "../constants";
import { ep } from "../styles";

type Props = {
  completed: string[];
  onComplete: (id: string) => void;
  onXp: (amount: number) => void;
};

export function GrammarTab({ completed, onComplete, onXp }: Props) {
  const t = useTranslations("EnglishPath.grammar");
  const [expanded, setExpanded] = useState<string | null>(GRAMMAR_RULES[0]?.id ?? null);

  const handleMarkRead = (id: string) => {
    if (completed.includes(id)) return;
    onComplete(id);
    onXp(XP_REWARDS.grammarCompleted);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <p className={cn(ep.muted, "text-sm mb-6")}>{t("intro")}</p>
      {GRAMMAR_RULES.map((rule) => {
        const isOpen = expanded === rule.id;
        const isDone = completed.includes(rule.id);
        return (
          <div
            key={rule.id}
            className={cn(
              ep.card,
              "overflow-hidden transition-colors !rounded-2xl",
              isDone && "border-emerald-200 bg-emerald-50/50"
            )}
          >
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : rule.id)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen className={cn("w-5 h-5", isDone ? "text-emerald-500" : "text-teal-600")} />
                <span className="font-bold text-slate-800">{rule.title}</span>
                {isDone && <Check className="w-4 h-4 text-emerald-500" />}
              </div>
              <ChevronDown
                className={cn("w-5 h-5 text-slate-400 transition-transform", isOpen && "rotate-180")}
              />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                    <p className="text-slate-600">{rule.summary}</p>
                    <div className="bg-slate-50 rounded-xl px-4 py-3 font-mono text-sm text-teal-700 border border-slate-100">
                      {rule.formula}
                    </div>
                    <ul className="space-y-2">
                      {rule.examples.map((ex, i) => (
                        <li key={i} className="text-sm">
                          <span className="font-medium text-slate-800">{ex.en}</span>
                          <span className="text-slate-500 block">{ex.tr}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs bg-amber-50 text-amber-800 px-3 py-2 rounded-lg border border-amber-200">
                      💡 {rule.tip}
                    </p>
                    {!isDone && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(rule.id)}
                        className={cn(ep.btnPrimary, "w-full py-2.5 rounded-xl font-semibold text-sm")}
                      >
                        {t("mark_complete")}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
