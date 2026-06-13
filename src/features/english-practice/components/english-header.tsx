"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  ChevronDown,
  Drama,
  Gamepad2,
  Settings,
  Smartphone,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EnglishTab } from "../types";
import { ep } from "../styles";
import { DashboardBadges } from "./dashboard-tab";

type NavItem = { id: EnglishTab; icon: typeof Activity; labelKey: string };

const LEARN_ITEMS: NavItem[] = [
  { id: "flashcards", icon: Brain, labelKey: "tabs.flashcards" },
  { id: "grammar", icon: BookOpen, labelKey: "tabs.grammar" },
  { id: "prepositions", icon: Target, labelKey: "tabs.prepositions" },
];

const GAME_ITEMS: NavItem[] = [
  { id: "games", icon: Gamepad2, labelKey: "tabs.all_games" },
  { id: "taboo", icon: Gamepad2, labelKey: "tabs.taboo" },
  { id: "heads_up", icon: Smartphone, labelKey: "tabs.heads_up" },
  { id: "charades", icon: Drama, labelKey: "tabs.charades" },
  { id: "emoji_clues", icon: Sparkles, labelKey: "tabs.emoji_clues" },
];

const PRIMARY_ITEMS: NavItem[] = [
  { id: "dashboard", icon: Activity, labelKey: "tabs.dashboard" },
  { id: "exam", icon: Trophy, labelKey: "tabs.exam" },
  { id: "results", icon: BarChart3, labelKey: "tabs.results" },
];

type Props = {
  activeTab: EnglishTab;
  onNavigate: (tab: EnglishTab) => void;
  onHome: () => void;
  onOpenSettings: () => void;
  progress: Parameters<typeof DashboardBadges>[0]["progress"];
  hiddenOnMobile?: boolean;
};

function NavDropdown({
  label,
  items,
  activeTab,
  isGroupActive,
  onNavigate,
  onClose,
}: {
  label: string;
  items: NavItem[];
  activeTab: EnglishTab;
  isGroupActive: boolean;
  onNavigate: (tab: EnglishTab) => void;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("EnglishPath");

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [activeTab]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          ep.navTab,
          (isGroupActive || open) && ep.navTabActive,
          "gap-1 pr-2.5"
        )}
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          className={cn("w-3.5 h-3.5 opacity-70 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className={ep.navDropdown}>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  setOpen(false);
                  onClose();
                }}
                className={cn(ep.navDropdownItem, isActive && ep.navDropdownItemActive)}
              >
                <Icon className="w-4 h-4 shrink-0 opacity-80" />
                {t(item.labelKey)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function EnglishHeader({
  activeTab,
  onNavigate,
  onHome,
  onOpenSettings,
  progress,
  hiddenOnMobile,
}: Props) {
  const t = useTranslations("EnglishPath");

  const learnActive = LEARN_ITEMS.some((i) => i.id === activeTab);
  const gamesActive = GAME_ITEMS.some((i) => i.id === activeTab);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur-md",
        hiddenOnMobile && "hidden md:block"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 h-14 md:h-[3.75rem]">
          {/* Marka — panele dön */}
          <button
            type="button"
            onClick={onHome}
            className={cn(
              ep.clickable,
              "flex items-center gap-3 min-w-0 shrink-0 rounded-lg hover:bg-slate-50 px-2 py-1.5 -ml-2 transition-colors"
            )}
            title={t("go_panel")}
          >
            <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
              E
            </div>
            <div className="min-w-0 text-left hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight truncate">
                {t("title")}
              </p>
              <p className="text-[11px] text-slate-400 font-medium truncate">{t("subtitle")}</p>
            </div>
          </button>

          {/* Desktop navigasyon — gruplu, taşma yok */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center max-w-2xl">
            {PRIMARY_ITEMS.slice(0, 1).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={cn(ep.navTab, isActive && ep.navTabActive)}
                >
                  <Icon className="w-4 h-4" />
                  {t(item.labelKey)}
                </button>
              );
            })}
            <NavDropdown
              label={t("tabs.learn")}
              items={LEARN_ITEMS}
              activeTab={activeTab}
              isGroupActive={learnActive}
              onNavigate={onNavigate}
              onClose={() => {}}
            />
            <NavDropdown
              label={t("tabs.games")}
              items={GAME_ITEMS}
              activeTab={activeTab}
              isGroupActive={gamesActive}
              onNavigate={onNavigate}
              onClose={() => {}}
            />
            {PRIMARY_ITEMS.slice(1).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={cn(ep.navTab, isActive && ep.navTabActive)}
                >
                  <Icon className="w-4 h-4" />
                  {t(item.labelKey)}
                </button>
              );
            })}
          </nav>

          {/* Tablet: sadece ikonlu kısa nav */}
          <nav className="hidden md:flex lg:hidden items-center gap-0.5 flex-1 justify-center">
            <button
              type="button"
              onClick={() => onNavigate("dashboard")}
              className={cn(ep.navTab, activeTab === "dashboard" && ep.navTabActive, "px-2.5")}
              title={t("tabs.dashboard")}
            >
              <Activity className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("games")}
              className={cn(
                ep.navTab,
                gamesActive && ep.navTabActive,
                "px-2.5"
              )}
              title={t("tabs.games")}
            >
              <Gamepad2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("exam")}
              className={cn(ep.navTab, activeTab === "exam" && ep.navTabActive, "px-2.5")}
              title={t("tabs.exam")}
            >
              <Trophy className="w-4 h-4" />
            </button>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <DashboardBadges progress={progress} />
            <button
              type="button"
              onClick={onOpenSettings}
              className={cn(
                ep.clickable,
                "p-2 text-slate-500 hover:text-teal-700 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-colors"
              )}
              aria-label={t("settings.title")}
            >
              <Settings className="w-[1.125rem] h-[1.125rem]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
