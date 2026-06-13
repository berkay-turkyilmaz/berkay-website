"use client";

import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  value: number;
  onChange: (seconds: number) => void;
  min?: number;
  max?: number;
  step?: number;
  accentClass?: string;
  /** Özel etiket; yoksa varsayılan "Tur süresi" */
  label?: string;
};

export function GameTimerSlider({
  value,
  onChange,
  min = 30,
  max = 120,
  step = 15,
  accentClass = "accent-teal-600",
  label,
}: Props) {
  const t = useTranslations("EnglishPath.games");

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Clock className="w-4 h-4 text-teal-600 shrink-0" />
        {label ?? t("round_timer")}:{" "}
        <span className="text-teal-700 font-mono tabular-nums">{value}s</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-full ${accentClass}`}
      />
      <div className="flex justify-between text-[10px] text-slate-400 font-mono tabular-nums">
        <span>{min}s</span>
        <span>{max}s</span>
      </div>
    </div>
  );
}
