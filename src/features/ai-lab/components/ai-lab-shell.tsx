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
import { ArrowLeft, PanelLeft, Settings } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/hooks";
import { MODEL_OPTIONS, DEFAULT_SETTINGS } from "../constants";
import type { SidebarItem, WorkspaceSettings } from "../types";
import {
  AILAB_SIDEBAR_SECTIONS,
  chatPath,
  flattenSidebarItems,
  getActiveSidebarItemId,
  getChatIdFromPath,
  getChatKindFromPath,
} from "../config/sidebar-navigation";
import {
  deleteAllChats,
  deleteChat,
  migrateLegacyChats,
  newChatId,
  renameChat,
  type ChatKind,
  type StoredChat,
} from "../lib/chat-store";
import { useChatStore } from "../hooks/use-chat-store";
import { useWorkspaceSettings } from "../hooks/use-workspace-settings";
import { AiLabLanguageSwitcher } from "./ai-lab-language-switcher";
import { WorkspaceSettingsPanel } from "./workspace-settings-panel";
import { AiLabSidebar } from "./ai-lab-sidebar";

export type AiLabShellContextValue = {
  settings: WorkspaceSettings;
  resolvedLanguage: WorkspaceSettings["language"] | string;
  updateSettings: ReturnType<typeof useWorkspaceSettings>["updateSettings"];
  settingsLoaded: boolean;
};

const AiLabShellContext = createContext<AiLabShellContextValue | null>(null);

export function useAiLabShell(): AiLabShellContextValue {
  const ctx = useContext(AiLabShellContext);
  if (!ctx) throw new Error("useAiLabShell must be used within AiLabShell");
  return ctx;
}

const SUPPORTED_REPLY_LANGUAGES = ["tr", "de", "es", "fr", "ja"] as const;

function resolveReplyLanguage(setting: WorkspaceSettings["language"], locale: string): string {
  if (setting !== "auto") return setting;
  return SUPPORTED_REPLY_LANGUAGES.find((l) => locale.startsWith(l)) ?? "en";
}

export function AiLabShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("AiLabPage");
  const tSettings = useTranslations("AiLabPage.settings");
  const locale = useLocale();
  const { settings, updateSettings, settingsLoaded } = useWorkspaceSettings();

  const isMobile = useMediaQuery("(max-width: 767px)");
  // The user's explicit choice only counts for the viewport size it was made in.
  const [sidebarPref, setSidebarPref] = useState<{ mobile: boolean; open: boolean } | null>(null);
  const isSidebarOpen =
    sidebarPref && sidebarPref.mobile === isMobile ? sidebarPref.open : !isMobile;
  const setIsSidebarOpen = useCallback(
    (open: boolean) => setSidebarPref({ mobile: isMobile, open }),
    [isMobile]
  );

  const [showSettings, setShowSettings] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [showHistory, setShowHistory] = useState(true);

  const chats = useChatStore();

  useEffect(() => {
    migrateLegacyChats();
  }, []);

  const chatKind = getChatKindFromPath(pathname);
  const activeChatId = getChatIdFromPath(pathname);

  const openNewChat = useCallback(
    (kind: ChatKind) => {
      router.push(chatPath(kind, newChatId()) as Parameters<typeof router.push>[0]);
      if (isMobile) setIsSidebarOpen(false);
    },
    [router, isMobile, setIsSidebarOpen]
  );

  const openChat = useCallback(
    (chat: StoredChat) => {
      router.push(chatPath(chat.kind, chat.id) as Parameters<typeof router.push>[0]);
      if (isMobile) setIsSidebarOpen(false);
    },
    [router, isMobile, setIsSidebarOpen]
  );

  const removeChat = useCallback(
    (chat: StoredChat) => {
      deleteChat(chat.id);
      if (chat.id === activeChatId) openNewChat(chat.kind);
    },
    [activeChatId, openNewChat]
  );

  const clearAllChats = useCallback(() => {
    deleteAllChats();
    if (chatKind) openNewChat(chatKind);
  }, [chatKind, openNewChat]);

  const resolvedLanguage = resolveReplyLanguage(settings.language, locale);

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
    if (item.type !== "link" || !item.href) return;

    if (item.href.startsWith("http://") || item.href.startsWith("https://")) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else if (item.isOutbound) {
      const prefix = locale === "tr" ? "" : `/${locale}`;
      window.open(`${prefix}${item.href}`, "_blank", "noopener,noreferrer");
    } else if (item.id === "chat" || item.id === "documents") {
      // Sidebar rows for chat surfaces always start a fresh, addressable chat.
      openNewChat(item.id === "chat" ? "chat" : "document");
      return;
    } else {
      router.push(item.href as Parameters<typeof router.push>[0]);
    }
    if (isMobile) setIsSidebarOpen(false);
  };

  const filteredHistory = useMemo(() => {
    const q = historySearch.trim().toLowerCase();
    return q ? chats.filter((c) => c.title.toLowerCase().includes(q)) : chats;
  }, [chats, historySearch]);

  const shellContext = useMemo<AiLabShellContextValue>(
    () => ({
      settings: settingsLoaded ? settings : DEFAULT_SETTINGS,
      resolvedLanguage,
      updateSettings,
      settingsLoaded,
    }),
    [settings, settingsLoaded, resolvedLanguage, updateSettings]
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
              onClearHistory={clearAllChats}
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
          showNewChat={chatKind !== null}
          chatHistory={chats}
          showHistory={showHistory}
          onToggleHistory={() => setShowHistory((v) => !v)}
          historySearch={historySearch}
          onHistorySearchChange={setHistorySearch}
          filteredHistory={filteredHistory}
          activeChatId={activeChatId}
          onHistoryItemClick={openChat}
          onHistoryItemDelete={removeChat}
          onHistoryItemRename={(chat, title) => renameChat(chat.id, title)}
          onNewChat={() => openNewChat(chatKind ?? "chat")}
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
                aria-label={isSidebarOpen ? t("sidebar.collapse") : t("sidebar.expand")}
                aria-expanded={isSidebarOpen}
                className="p-1.5 rounded-lg text-ailab-text/50 transition-[color,background-color] duration-300 ease-out hover:text-ailab-text/80 hover:bg-ailab-glass-06 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/45"
              >
                <PanelLeft className="w-4 h-4" />
              </motion.button>
              <div className="h-3 w-px bg-ailab-border" />
              {/* Back to portfolio — visible on mobile, hidden on md+ (sidebar user menu handles it) */}
              <Link
                href="/"
                className={cn(
                  "md:hidden flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium",
                  "text-ailab-text/50 transition-[color,background-color] duration-200",
                  "hover:text-ailab-text/80 hover:bg-ailab-glass-06",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/45"
                )}
              >
                <ArrowLeft className="w-3 h-3" />
                <span>{t("sidebar.back_home_short")}</span>
              </Link>
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeSidebarId}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="hidden md:block text-xs font-semibold text-ailab-text/65"
                >
                  {activeLabel}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-1">
              {/* Back to portfolio — visible on desktop */}
              <Link
                href="/"
                className={cn(
                  "hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium",
                  "text-ailab-text/45 transition-[color,background-color] duration-200",
                  "hover:text-ailab-text/75 hover:bg-ailab-glass-06",
                  "ring-1 ring-inset ring-ailab-border-muted/50",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/45"
                )}
              >
                <ArrowLeft className="w-3 h-3" />
                <span>{t("sidebar.back_home")}</span>
              </Link>
              <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-ailab-glass-04 ring-1 ring-inset ring-ailab-border-muted transition-[box-shadow] duration-300 ease-out">
                <div className="w-1.5 h-1.5 rounded-full bg-ailab-accent shadow-ailab-accent-dot" />
                <span className="text-[11px] font-mono text-ailab-text/55 max-w-[120px] truncate">
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
