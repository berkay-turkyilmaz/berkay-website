"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  Gamepad2,
  MoreHorizontal,
  Target,
  Trophy,
} from "lucide-react";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type {
  EnglishTab,
  TabooGameMode,
  TabooRoundStats,
  HeadsUpRoundStats,
  CharadesRoundStats,
  CategoryBlitzRoundStats,
  ExamMode,
} from "../types";
import { useEnglishProgress } from "../hooks/use-english-progress";
import { englishPathHref, parseEnglishPathTab } from "../lib/english-path-routes";
import { getThemeForTab } from "../lib/game-themes";
import { themeNavActive } from "../lib/theme-utils";
import { ep, isGameTab } from "../styles";
import { DashboardTab } from "./dashboard-tab";
import { EnglishHeader } from "./english-header";
import { FlashcardsTab } from "./flashcards-tab";
import { GrammarTab } from "./grammar-tab";
import { PrepositionsTab } from "./prepositions-tab";
import { ExamTab } from "./exam-tab";
import { ResultsTab } from "./results-tab";
import { TabooGameTab } from "./taboo-game-tab";
import { HeadsUpGameTab } from "./heads-up-game-tab";
import { CharadesGameTab } from "./charades-game-tab";
import { CategoryBlitzGameTab } from "./category-blitz-game-tab";
import { GamesHubTab } from "./games-hub-tab";
import { SettingsPanel } from "./settings-panel";

const MOBILE_PRIMARY_TABS: { id: EnglishTab; icon: typeof Activity; labelKey: string }[] = [
  { id: "dashboard", icon: Activity, labelKey: "tabs.dashboard" },
  { id: "flashcards", icon: Brain, labelKey: "tabs.flashcards" },
  { id: "games", icon: Gamepad2, labelKey: "tabs.games" },
  { id: "exam", icon: Trophy, labelKey: "tabs.exam" },
];

const MORE_TABS: { id: EnglishTab; icon: typeof Activity; labelKey: string }[] = [
  { id: "grammar", icon: BookOpen, labelKey: "tabs.grammar" },
  { id: "prepositions", icon: Target, labelKey: "tabs.prepositions" },
  { id: "results", icon: BarChart3, labelKey: "tabs.results" },
];

export function EnglishShell() {
  const t = useTranslations("EnglishPath");
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = parseEnglishPathTab(pathname);

  const [showSettings, setShowSettings] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [gamePlaying, setGamePlaying] = useState(false);

  useEffect(() => {
    if (!showMore) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showMore]);

  const {
    progress,
    loaded,
    addXp,
    updateSettings,
    markFlashcardMastered,
    markGrammarComplete,
    savePrepositionAnswer,
    addExamResult,
    updateTabooStats,
    updateHeadsUpStats,
    updateCharadesStats,
    updateCategoryBlitzStats,
    updateProgress,
    resetProgress,
  } = useEnglishProgress();

  const handleTabooRoundComplete = (
    stats: TabooRoundStats,
    mode: TabooGameMode,
    partyScores?: { A: number; B: number }
  ) => {
    const prev = progress.tabooStats;
    const partyWins = { ...prev.partyWins };
    if (mode === "party" && partyScores) {
      if (partyScores.A > partyScores.B) partyWins.teamA += 1;
      else if (partyScores.B > partyScores.A) partyWins.teamB += 1;
    }
    updateTabooStats({
      gamesPlayed: prev.gamesPlayed + 1,
      wordsGuessed: prev.wordsGuessed + stats.correct,
      bestTimedScore:
        mode === "timed" ? Math.max(prev.bestTimedScore, stats.correct) : prev.bestTimedScore,
      partyWins,
    });
  };

  const handleHeadsUpRoundComplete = (stats: HeadsUpRoundStats) => {
    const prev = progress.headsUpStats;
    updateHeadsUpStats({
      gamesPlayed: prev.gamesPlayed + 1,
      wordsGuessed: prev.wordsGuessed + stats.correct,
      bestRound: Math.max(prev.bestRound, stats.correct),
    });
  };

  const handleCharadesRoundComplete = (stats: CharadesRoundStats) => {
    const prev = progress.charadesStats;
    updateCharadesStats({
      gamesPlayed: prev.gamesPlayed + 1,
      wordsGuessed: prev.wordsGuessed + stats.correct,
      bestRound: Math.max(prev.bestRound, stats.correct),
    });
  };

  const handleExamFinish = (
    score: number,
    total: number,
    durationSec: number,
    mode: ExamMode
  ) => {
    addExamResult({
      date: new Date().toISOString(),
      score,
      total,
      percentage: Math.round((score / total) * 100),
      durationSec,
      mode,
    });
  };

  const handleCategoryBlitzRoundComplete = (stats: CategoryBlitzRoundStats) => {
    const prev = progress.categoryBlitzStats;
    updateCategoryBlitzStats({
      gamesPlayed: prev.gamesPlayed + 1,
      wordsNamed: prev.wordsNamed + stats.wordsNamed,
      bestRound: Math.max(prev.bestRound, stats.wordsNamed),
      bestStreak: Math.max(prev.bestStreak, stats.wordsNamed),
    });
  };

  const navigate = useCallback(
    (tab: EnglishTab) => {
      setShowMore(false);
      router.push(englishPathHref(tab) as Parameters<typeof router.push>[0]);
    },
    [router]
  );

  const goHome = () => navigate("dashboard");

  const inGameRoute = isGameTab(activeTab);
  const hideMobileChrome = inGameRoute && gamePlaying;
  const mobileGamesActive = inGameRoute || activeTab === "games";

  useEffect(() => {
    if (hideMobileChrome) setShowMore(false);
  }, [hideMobileChrome]);

  useEffect(() => {
    if (!inGameRoute) setGamePlaying(false);
  }, [inGameRoute]);

  const updateTabooDuration = (tabooRoundDuration: number) =>
    updateSettings({ tabooRoundDuration });
  const updateHeadsUpDuration = (headsUpRoundDuration: number) =>
    updateSettings({ headsUpRoundDuration });
  const updateCharadesDuration = (charadesRoundDuration: number) =>
    updateSettings({ charadesRoundDuration });
  const updateCategoryBlitzDuration = (categoryBlitzRoundDuration: number) =>
    updateSettings({ categoryBlitzRoundDuration });

  if (!loaded) {
    return (
      <div
        className={cn(ep.page, "english-path flex items-center justify-center")}
        role="status"
        aria-live="polite"
        aria-label={t("a11y.loading")}
      >
        <div className={ep.pageMesh} />
        <Activity className="w-8 h-8 animate-spin text-teal-600" aria-hidden />
      </div>
    );
  }

  return (
    <div
      className={cn(
        ep.page,
        "english-path relative",
        hideMobileChrome ? "pb-0 md:pb-8" : "pb-[4.75rem] md:pb-8"
      )}
    >
      <div className={ep.pageMesh} aria-hidden />

      <EnglishHeader
        activeTab={activeTab}
        onNavigate={navigate}
        onHome={goHome}
        onOpenSettings={() => setShowSettings(true)}
        progress={progress}
        hiddenOnMobile={hideMobileChrome}
      />

      <main
        className={cn(
          "max-w-6xl mx-auto px-4 sm:px-6",
          hideMobileChrome ? "pt-3 md:pt-5" : "pt-5 md:pt-6"
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "dashboard" && (
              <DashboardTab progress={progress} onNavigate={navigate} />
            )}
            {activeTab === "games" && <GamesHubTab onNavigate={navigate} />}
            {activeTab === "flashcards" && (
              <FlashcardsTab
                mastered={progress.masteredFlashcards}
                speechRate={progress.settings.speechRate}
                onMaster={markFlashcardMastered}
                onXp={addXp}
              />
            )}
            {activeTab === "grammar" && (
              <GrammarTab
                completed={progress.completedGrammar}
                onComplete={markGrammarComplete}
                onXp={addXp}
              />
            )}
            {activeTab === "prepositions" && (
              <PrepositionsTab
                scores={progress.prepositionScores}
                onAnswer={savePrepositionAnswer}
                onXp={addXp}
              />
            )}
            {activeTab === "exam" && (
              <ExamTab
                questionCount={progress.settings.examQuestionCount}
                examMode={progress.settings.examMode}
                onExamModeChange={(examMode) => updateSettings({ examMode })}
                onFinish={handleExamFinish}
                onXp={addXp}
                onViewResults={() => navigate("results")}
              />
            )}
            {activeTab === "results" && (
              <ResultsTab
                results={progress.examResults}
                onClear={() => updateProgress({ examResults: [] })}
                onStartExam={() => navigate("exam")}
              />
            )}
            {activeTab === "taboo" && (
              <TabooGameTab
                speechRate={progress.settings.speechRate}
                roundDuration={progress.settings.tabooRoundDuration}
                onRoundDurationChange={updateTabooDuration}
                tabooStats={progress.tabooStats}
                onRoundComplete={handleTabooRoundComplete}
                onXp={addXp}
                onPlayingChange={setGamePlaying}
              />
            )}
            {activeTab === "heads_up" && (
              <HeadsUpGameTab
                roundDuration={progress.settings.headsUpRoundDuration}
                onRoundDurationChange={updateHeadsUpDuration}
                stats={progress.headsUpStats}
                onRoundComplete={handleHeadsUpRoundComplete}
                onXp={addXp}
                onPlayingChange={setGamePlaying}
              />
            )}
            {activeTab === "charades" && (
              <CharadesGameTab
                roundDuration={progress.settings.charadesRoundDuration}
                onRoundDurationChange={updateCharadesDuration}
                stats={progress.charadesStats}
                onRoundComplete={handleCharadesRoundComplete}
                onXp={addXp}
                onPlayingChange={setGamePlaying}
              />
            )}
            {activeTab === "category_blitz" && (
              <CategoryBlitzGameTab
                roundDuration={progress.settings.categoryBlitzRoundDuration}
                onRoundDurationChange={updateCategoryBlitzDuration}
                stats={progress.categoryBlitzStats}
                onRoundComplete={handleCategoryBlitzRoundComplete}
                onXp={addXp}
                onPlayingChange={setGamePlaying}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {!hideMobileChrome && (
        <nav
          className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-[env(safe-area-inset-bottom)]"
          aria-label={t("a11y.nav_main")}
        >
          <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
            {MOBILE_PRIMARY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === "games" ? mobileGamesActive : activeTab === tab.id;
              const highlightTheme =
                isActive && tab.id === "games" && isGameTab(activeTab)
                  ? getThemeForTab(activeTab)
                  : isActive
                    ? getThemeForTab(tab.id)
                    : null;
              const navStyle = highlightTheme ? themeNavActive(highlightTheme) : null;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigate(tab.id)}
                  className={cn(
                    ep.clickable,
                    "flex flex-col items-center justify-center gap-0.5 transition-colors min-w-0 px-0.5",
                    isActive ? (navStyle?.text ?? "text-teal-700") : "text-slate-400"
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center justify-center w-9 h-7 rounded-lg transition-colors",
                      isActive && (navStyle?.bg ?? "bg-teal-50")
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                  </span>
                  <span className="text-[10px] font-semibold leading-tight truncate max-w-full">
                    {t(tab.labelKey)}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setShowMore(true)}
              className={cn(
                ep.clickable,
                "flex flex-col items-center justify-center gap-0.5 transition-colors min-w-0 px-0.5",
                (() => {
                  const moreActive = MORE_TABS.some((m) => m.id === activeTab);
                  if (!moreActive) return "text-slate-400";
                  const theme = getThemeForTab(activeTab);
                  return theme ? themeNavActive(theme).text : "text-teal-700";
                })()
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center w-9 h-7 rounded-lg",
                  MORE_TABS.some((m) => m.id === activeTab) &&
                    (getThemeForTab(activeTab)
                      ? themeNavActive(getThemeForTab(activeTab)!).bg
                      : "bg-teal-50")
                )}
              >
                <MoreHorizontal className="w-5 h-5 shrink-0" />
              </span>
              <span className="text-[10px] font-semibold leading-tight">{t("tabs.more")}</span>
            </button>
          </div>
        </nav>
      )}

      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm cursor-pointer"
            onClick={() => setShowMore(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl"
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
              <p className={cn(ep.sectionLabel, "mb-4")}>{t("tabs.more")}</p>
              <div className="grid grid-cols-3 gap-3">
                {MORE_TABS.map((tab, i) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      type="button"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => navigate(tab.id)}
                      className={cn(
                        ep.card,
                        ep.clickable,
                        "flex flex-col items-center gap-2 p-4 text-center font-semibold text-slate-700 text-sm min-h-[5.5rem] justify-center"
                      )}
                    >
                      <Icon className="w-5 h-5 text-teal-600" />
                      {t(tab.labelKey)}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <SettingsPanel
            settings={progress.settings}
            onUpdate={updateSettings}
            onReset={resetProgress}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
