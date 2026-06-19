"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { PREPOSITION_EXERCISES } from "../data/prepositions";
import { LEARN_THEMES } from "../lib/game-themes";
import { themeBtnPrimary } from "../lib/theme-utils";
import { XP_REWARDS } from "../constants";
import { ep } from "../styles";

const PP_THEME = LEARN_THEMES.prepositions;

type Props = {
  scores: Record<string, boolean>;
  onAnswer: (id: string, correct: boolean) => void;
  onXp: (amount: number) => void;
};

export function PrepositionsTab({ scores, onAnswer, onXp }: Props) {
  const t = useTranslations("EnglishPath.prepositions");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const exercise = PREPOSITION_EXERCISES[index];
  const correctCount = Object.values(scores).filter(Boolean).length;

  const check = (option: string) => {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);
    const correct = option === exercise.answer;
    onAnswer(exercise.id, correct);
    if (correct) onXp(XP_REWARDS.prepositionCorrect);
  };

  const next = () => {
    setSelected(null);
    setRevealed(false);
    setIndex((i) => (i + 1) % PREPOSITION_EXERCISES.length);
  };

  const reset = () => {
    setIndex(0);
    setSelected(null);
    setRevealed(false);
  };

  const parts = exercise.sentence.split("___");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <p className={cn("text-sm font-mono", ep.mutedSm)}>
          {index + 1} / {PREPOSITION_EXERCISES.length} · {correctCount} {t("correct")}
        </p>
        <button
          type="button"
          onClick={reset}
          className={cn("text-sm flex items-center gap-1 text-slate-500 hover:text-slate-700")}
        >
          <RotateCcw className="w-3.5 h-3.5" /> {t("restart")}
        </button>
      </div>

      <div className={cn(ep.card, "p-8 !rounded-[2rem]")}>
        <p className="text-2xl font-medium leading-relaxed mb-8 text-center text-slate-800">
          {parts[0]}
          <span
            className={cn(
              "inline-block min-w-[4rem] px-2 border-b-2 mx-1 font-bold",
              revealed
                ? selected === exercise.answer
                  ? "border-emerald-500 text-emerald-600"
                  : "border-rose-500 text-rose-600"
                : "border-emerald-500 text-emerald-600"
            )}
          >
            {revealed ? exercise.answer : "?"}
          </span>
          {parts[1]}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {exercise.options.map((opt) => {
            const isSelected = selected === opt;
            const isAnswer = opt === exercise.answer;
            return (
              <button
                key={opt}
                type="button"
                disabled={revealed}
                onClick={() => check(opt)}
                className={cn(
                  "py-3 px-4 rounded-xl font-semibold text-sm border transition-all",
                  !revealed &&
                    cn("hover:bg-emerald-50 hover:border-emerald-200 border-slate-200 bg-white text-slate-700"),
                  revealed && isAnswer && "border-emerald-500 bg-emerald-50 text-emerald-700",
                  revealed && isSelected && !isAnswer && "border-rose-500 bg-rose-50 text-rose-700",
                  revealed && !isSelected && !isAnswer && "opacity-40 border-slate-200"
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(ep.surfaceMuted, "mt-6 p-4 rounded-xl text-sm flex gap-3")}
            >
              {selected === exercise.answer ? (
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <X className="w-5 h-5 text-rose-500 shrink-0" />
              )}
              <p className="text-slate-600">{exercise.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {revealed && (
          <button
            type="button"
            onClick={next}
            className={cn(themeBtnPrimary(PP_THEME), "mt-6 w-full py-3 rounded-xl font-bold")}
          >
            {t("next")}
          </button>
        )}
      </div>
    </div>
  );
}
