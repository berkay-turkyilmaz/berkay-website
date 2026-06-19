"use client";

import { Trophy, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { ExamResult } from "../types";
import { ep } from "../styles";

type Props = {
  results: ExamResult[];
  onClear: () => void;
  onStartExam: () => void;
};

export function ResultsTab({ results, onClear, onStartExam }: Props) {
  const t = useTranslations("EnglishPath.results");
  const locale = useLocale();

  if (results.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <Trophy className={cn("w-12 h-12 mx-auto opacity-40", ep.mutedSm)} />
        <p className={ep.muted}>{t("empty")}</p>
        <button type="button" onClick={onStartExam} className={cn(ep.btnPrimary, "px-6 py-3 rounded-xl font-semibold")}>
          {t("take_exam")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">{t("title")}</h2>
        <button
          type="button"
          onClick={onClear}
          className="text-sm text-slate-500 hover:text-rose-500 flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" /> {t("clear")}
        </button>
      </div>
      {results.map((r) => (
        <div key={r.id} className={cn(ep.card, "flex items-center justify-between p-5 !rounded-2xl")}>
          <div>
            <p className={cn("font-mono text-sm", ep.mutedSm)}>
              {new Date(r.date).toLocaleString(locale)}
            </p>
            <p className={cn("text-sm mt-1", ep.muted)}>
              {r.mode && (
                <span className="text-teal-600 font-medium">{t(`exam_modes.${r.mode}`)} · </span>
              )}
              {Math.floor(r.durationSec / 60)}:{String(r.durationSec % 60).padStart(2, "0")} · {r.score}/{r.total}
            </p>
          </div>
          <span
            className={`text-3xl font-black ${
              r.percentage >= 70 ? "text-emerald-500" : r.percentage >= 50 ? "text-amber-500" : "text-rose-500"
            }`}
          >
            %{r.percentage}
          </span>
        </div>
      ))}
    </div>
  );
}
