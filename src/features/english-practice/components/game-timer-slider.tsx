"use client";

import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { ThemeTokens } from "../lib/game-themes";
import { themeClockIcon, themeTimerAccent } from "../lib/theme-utils";

type Props = {
  value: number;
  onChange: (seconds: number) => void;
  min?: number;
  max?: number;
  step?: number;
  accentClass?: string;
  theme?: ThemeTokens;
  label?: string;
};

export function GameTimerSlider({
  value,
  onChange,
  min = 30,
  max = 120,
  step = 15,
  accentClass,
  theme,
  label,
}: Props) {
  const t = useTranslations("EnglishPath.games");
  const sliderAccent = accentClass ?? (theme ? themeTimerAccent(theme) : "accent-teal-600");
  const clockClass = theme ? themeClockIcon(theme) : "text-teal-600";
  const valueClass = theme ? theme.accentFg : "text-teal-700";

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Clock className={cn("w-4 h-4 shrink-0", clockClass)} aria-hidden />
        {label ?? t("round_timer")}:{" "}
        <span className={cn("font-mono tabular-nums", valueClass)}>{value}s</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn("w-full h-2 rounded-full", sliderAccent)}
      />
      <div className="flex justify-between text-xs text-slate-400 font-mono tabular-nums">
        <span>{min}s</span>
        <span>{max}s</span>
      </div>
    </div>
  );
}
