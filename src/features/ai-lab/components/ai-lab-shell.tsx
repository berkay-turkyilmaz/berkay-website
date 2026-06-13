"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { PanelLeft, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODEL_OPTIONS, SESSION_KEYS, HISTORY_KEY, DEFAULT_SETTINGS } from "../constants";
import type { BexChatMessage, ChatHistoryItem, ChatMode, SidebarItem, WorkspaceSettings } from "../types";
import {
  AILAB_ROUTES,
  AILAB_SIDEBAR_SECTIONS,
  flattenSidebarItems,
  getActiveSidebarItemId,
  getChatRouteForMode,
  isAiLabWorkspaceHome,
  pathnameSuffixMatches,
} from "../config/sidebar-navigation";
import { useWorkspaceSettings } from "../hooks/use-workspace-settings";
import { AiLabLanguageSwitcher } from "./ai-lab-language-switcher";
import { WorkspaceSettingsPanel } from "./workspace-settings-panel";
import { AiLabSidebar } from "./ai-lab-sidebar";

export type AiLabShellContextValue = {
  settings: WorkspaceSettings;
  resolvedLanguage: WorkspaceSettings["language"] | string;
  updateSettings: ReturnType<typeof useWorkspaceSettings>["updateSettings"];
  settingsLoaded: boolean;
  activeMode: ChatMode;
  enableAgentWorkflow: boolean;
  /** Changes when a history thread is restored — remounts chat panel. */
  chatSessionKey: string;
};

const AiLabShellContext = createContext<AiLabShellContextValue | null>(null);

export function useAiLabShell(): AiLabShellContextValue {
  const ctx = useContext(AiLabShellContext);
  if (!ctx) throw new Error("useAiLabShell must be used within AiLabShell");
  return ctx;
}

export function AiLabShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("AiLabPage");
  const tSettings = useTranslations("AiLabPage.settings");
  const locale = useLocale();
  const { settings, updateSettings, settingsLoaded } = useWorkspaceSettings();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMode, setActiveMode] = useState<ChatMode>("engineer");
  const [enableAgentWorkflow, setEnableAgentWorkflow] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [historySearch, setHistorySearch] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatSessionKey, setChatSessionKey] = useState("live");

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    setIsSidebarOpen(!mobile);
  }, []);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const history = localStorage.getItem(HISTORY_KEY);
    if (history) {
      try {
        setChatHistory(JSON.parse(history));
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    if (isAiLabWorkspaceHome(pathname)) {
      setActiveMode("engineer");
      setEnableAgentWorkflow(false);
      return;
    }
    if (pathnameSuffixMatches(pathname, AILAB_ROUTES.sandbox)) {
      setActiveMode("pdf");
      setEnableAgentWorkflow(false);
      return;
    }
    if (pathnameSuffixMatches(pathname, AILAB_ROUTES.deepAnalyzer)) {
      setActiveMode("engineer");
      setEnableAgentWorkflow(false);
    }
  }, [pathname]);

  const clearHistory = useCallback(() => {
    const w = window as Window & { bexClear?: () => void };
    if (w.bexClear) w.bexClear();
    else sessionStorage.removeItem(SESSION_KEYS[activeMode]);
    setActiveChatId(null);
    setChatSessionKey(`cleared-${Date.now()}`);
  }, [activeMode]);

  const startNewChat = useCallback(() => {
    const msgs = sessionStorage.getItem(SESSION_KEYS[activeMode]);
    if (msgs) {
      try {
        const parsed = JSON.parse(msgs) as BexChatMessage[];
        const firstUser = parsed.find((m) => m.role === "user");
        if (firstUser && parsed.length > 0) {
          const item: ChatHistoryItem = {
            id: Date.now().toString(),
            mode: activeMode,
            title:
              firstUser.content.slice(0, 45) + (firstUser.content.length > 45 ? "…" : ""),
            timestamp: Date.now(),
            messages: parsed,
          };
          setChatHistory((prev) => {
            const next = [item, ...prev].slice(0, 50);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
            return next;
          });
        }
      } catch {
        /* ignore */
      }
    }
    clearHistory();
    setActiveChatId(null);
    setChatSessionKey(`new-${Date.now()}`);
    if (pathnameSuffixMatches(pathname, AILAB_ROUTES.deepAnalyzer)) {
      router.push(AILAB_ROUTES.agentConsole as Parameters<typeof router.push>[0]);
    }
  }, [activeMode, clearHistory, pathname, router]);

  const deleteHistoryItem = useCallback((id: string) => {
    setChatHistory((prev) => {
      const next = prev.filter((h) => h.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const resolvedLanguage: WorkspaceSettings["language"] | string =
    settings.language === "auto"
      ? locale.startsWith("de")
        ? "de"
        : locale.startsWith("tr")
          ? "tr"
          : "en"
      : settings.language;

  const flatNav = flattenSidebarItems(AILAB_SIDEBAR_SECTIONS);
  const activeSidebarId = getActiveSidebarItemId(pathname);
  const activeNavItem = flatNav.find((i) => i.id === activeSidebarId);
  const activeLabel = activeNavItem?.labelKey ? t(activeNavItem.labelKey as never) : "BEX";

  const handleNavItemClick = (item: SidebarItem) => {
    if (item.type === "action") {
      setShowSettings(true);
      if (isMobile) setIsSidebarOpen(false);
      return;
    }
    if (item.type === "link" && item.href) {
      if (item.isOutbound) {
        const prefix = locale === "tr" ? "" : `/${locale}`;
        window.open(`${prefix}${item.href}`, "_blank", "noopener,noreferrer");
      } else {
        router.push(item.href as Parameters<typeof router.push>[0]);
      }
      setShowHistory(false);
      if (isMobile) setIsSidebarOpen(false);
      return;
    }
    if (item.type === "tool" && item.chatMode) {
      setShowHistory(false);
      if (isMobile) setIsSidebarOpen(false);
      router.push(getChatRouteForMode(item.chatMode) as Parameters<typeof router.push>[0]);
    }
  };

  const filteredHistory = chatHistory.filter(
    (h) => !historySearch || h.title.toLowerCase().includes(historySearch.toLowerCase())
  );

  const shellContext = useMemo<AiLabShellContextValue>(
    () => ({
      settings: settingsLoaded ? settings : DEFAULT_SETTINGS,
      resolvedLanguage,
      updateSettings,
      settingsLoaded,
      activeMode,
      enableAgentWorkflow,
      chatSessionKey,
    }),
    [
      settings,
      settingsLoaded,
      resolvedLanguage,
      updateSettings,
      activeMode,
      enableAgentWorkflow,
      chatSessionKey,
    ]
  );

  return (
    <AiLabShellContext.Provider value={shellContext}>
      <div className="flex h-screen overflow-hidden bg-ailab-canvas text-ailab-text">
        <AnimatePresence>
          {showSettings && (
            <WorkspaceSettingsPanel
              settings={settings}
              onUpdate={updateSettings}
              onClose={() => setShowSettings(false)}
              onClearHistory={clearHistory}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMobile && isSidebarOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-30 md:hidden bg-ailab-scrim-80 backdrop-blur-sm transition-opacity duration-300 ease-out"
            />
          )}
        </AnimatePresence>

        <AiLabSidebar
          className={cn(!isMobile && "relative z-30")}
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
          activeSidebarId={activeSidebarId}
          chatHistory={chatHistory}
          showHistory={showHistory}
          onToggleHistory={() => setShowHistory((v) => !v)}
          historySearch={historySearch}
          onHistorySearchChange={setHistorySearch}
          filteredHistory={filteredHistory}
          activeChatId={activeChatId}
          onHistoryItemClick={(item) => {
            const mode = item.mode === "terminal" ? "engineer" : item.mode;
            setActiveMode(mode);
            setEnableAgentWorkflow(false);
            setActiveChatId(item.id);
            if (item.messages?.length) {
              sessionStorage.setItem(
                SESSION_KEYS[item.mode],
                JSON.stringify(item.messages)
              );
              setChatSessionKey(`restore-${item.id}`);
            }
            const target = getChatRouteForMode(item.mode);
            if (!pathnameSuffixMatches(pathname, target)) {
              router.push(target as Parameters<typeof router.push>[0]);
            }
          }}
          onHistoryItemDelete={deleteHistoryItem}
          onNewChat={startNewChat}
          onNavItemClick={handleNavItemClick}
          onExpandSidebar={() => setIsSidebarOpen(true)}
          settings={settingsLoaded ? settings : DEFAULT_SETTINGS}
          onOpenSettings={() => setShowSettings(true)}
        />

        <main className="relative z-0 flex-1 flex flex-col min-w-0 h-screen min-h-0 overflow-hidden">
          <header className="relative z-[100] isolate flex h-11 flex-shrink-0 items-center justify-between border-b border-ailab-border-subtle bg-ailab-scrim-90 px-3 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1.5 rounded-lg text-ailab-text/50 transition-[color,background-color] duration-300 ease-out hover:text-ailab-text/80 hover:bg-ailab-glass-06 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/45"
              >
                <PanelLeft className="w-4 h-4" />
              </motion.button>

              <div className="h-3 w-px bg-ailab-border" />

              <AnimatePresence mode="wait">
                <motion.span
                  key={activeSidebarId}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="text-xs font-semibold text-ailab-text/65"
                >
                  {activeLabel}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-1">
              <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-ailab-glass-04 ring-1 ring-inset ring-ailab-border-muted transition-[box-shadow] duration-300 ease-out">
                <div className="w-1.5 h-1.5 rounded-full bg-ailab-accent shadow-ailab-accent-dot" />
                <span className="text-[10px] font-mono text-ailab-text/55 max-w-[120px] truncate">
                  {(() => {
                    const m = MODEL_OPTIONS.find((o) => o.value === settings.model);
                    return m ? tSettings(m.labelKey as never) : "Llama 3.1 8B";
                  })()}
                </span>
              </div>

              <AiLabLanguageSwitcher />

              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="p-1.5 rounded-lg text-ailab-text/50 transition-[color,background-color] duration-300 ease-out hover:text-ailab-text/80 hover:bg-ailab-glass-06 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/45 md:hidden"
                aria-label={t("sidebar.settings")}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-hidden min-h-0">{children}</div>
        </main>
      </div>
    </AiLabShellContext.Provider>
  );
}
