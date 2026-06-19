import { cn } from "@/lib/utils";
import type { ThemeTokens } from "./game-themes";

const CHIP_BASE =
  "cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 transition-colors";

const BTN_PRIMARY: Record<string, string> = {
  rose: "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20",
  violet: "bg-violet-600 hover:bg-violet-700 shadow-violet-600/20",
  amber: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20",
  teal: "bg-teal-600 hover:bg-teal-700 shadow-teal-600/20",
  indigo: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20",
  sky: "bg-sky-600 hover:bg-sky-700 shadow-sky-600/20",
  emerald: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20",
};

export function themeChip(theme: ThemeTokens, active: boolean, extra?: string) {
  return cn(CHIP_BASE, theme.chip, active && theme.chipActive, extra);
}

export function themeIconBox(theme: ThemeTokens) {
  return cn("rounded-lg flex items-center justify-center", theme.surface, theme.icon);
}

export function themeStatBadge(theme: ThemeTokens) {
  return cn("text-xs font-semibold px-2.5 py-1 rounded-lg tabular-nums", theme.surface, theme.accentFg);
}

export function themeAccentText(theme: ThemeTokens) {
  return theme.accentFg;
}

export function themeProgressBar(theme: ThemeTokens) {
  return theme.progress;
}

export function themeBtnPrimary(theme: ThemeTokens) {
  const colors = BTN_PRIMARY[theme.accent] ?? BTN_PRIMARY.teal;
  return cn(
    "cursor-pointer text-white font-semibold shadow-sm active:scale-[0.98] transition-all duration-150",
    colors
  );
}

export function themeSurfaceBanner(theme: ThemeTokens) {
  return cn("text-sm font-semibold py-2 rounded-xl border", theme.surface, theme.accentFg, theme.border);
}

export function themeNavActive(theme: ThemeTokens) {
  return { text: theme.accentFg, bg: theme.surface };
}

export function themeCardBorder(theme: ThemeTokens) {
  return theme.border;
}

export function themeTimerAccent(theme: ThemeTokens) {
  const map: Record<string, string> = {
    rose: "accent-rose-600",
    violet: "accent-violet-600",
    amber: "accent-amber-500",
    teal: "accent-teal-600",
    indigo: "accent-indigo-600",
    sky: "accent-sky-600",
    emerald: "accent-emerald-600",
  };
  return map[theme.accent] ?? "accent-teal-600";
}

export function themeClockIcon(theme: ThemeTokens) {
  return theme.icon;
}
