"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, SquarePen, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatHistoryItem, SidebarItem, SidebarSection, WorkspaceSettings } from "../types";
import { AI_AGENT_NAME } from "../constants";
import { AILAB_SIDEBAR_ICON_STROKE, AILAB_SIDEBAR_SECTIONS } from "../config/sidebar-navigation";
import { ChatHistoryItem as ChatHistoryRowView } from "./chat-history-item";
import { AiLabUserMenu } from "./ai-lab-user-menu";

const asideTransition = { duration: 0.38, ease: [0.4, 0, 0.2, 1] as const };

export type AiLabSidebarProps = {
  className?: string;
  sections?: readonly SidebarSection[];
  isSidebarOpen: boolean;
  isMobile: boolean;
  activeSidebarId: string;
  /** When false, hides the "New Chat" button (non-chat routes) */
  showNewChat?: boolean;
  chatHistory: ChatHistoryItem[];
  showHistory: boolean;
  onToggleHistory: () => void;
  historySearch: string;
  onHistorySearchChange: (value: string) => void;
  filteredHistory: ChatHistoryItem[];
  activeChatId: string | null;
  onHistoryItemClick: (item: ChatHistoryItem) => void;
  onHistoryItemDelete: (id: string) => void;
  onNewChat: () => void;
  onNavItemClick: (item: SidebarItem) => void;
  onExpandSidebar: () => void;
  settings: WorkspaceSettings;
  onOpenSettings: () => void;
};

export function AiLabSidebar({
  className,
  sections = AILAB_SIDEBAR_SECTIONS,
  isSidebarOpen,
  isMobile,
  activeSidebarId,
  showNewChat = true,
  chatHistory,
  showHistory,
  onToggleHistory,
  historySearch,
  onHistorySearchChange,
  filteredHistory,
  activeChatId,
  onHistoryItemClick,
  onHistoryItemDelete,
  onNewChat,
  onNavItemClick,
  onExpandSidebar,
  settings,
  onOpenSettings,
}: AiLabSidebarProps) {
  const t = useTranslations("AiLabPage");

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarOpen ? (isMobile ? 288 : 260) : isMobile ? 0 : 52 }}
      transition={asideTransition}
      className={cn(
        "flex flex-col overflow-hidden flex-shrink-0 h-full",
        "backdrop-blur-xl backdrop-saturate-150",
        "bg-ailab-glass-03",
        "border-r border-ailab-border-subtle",
        "ring-1 ring-inset ring-ailab-border-muted",
        isMobile && isSidebarOpen && "fixed inset-y-0 left-0 z-40 shadow-2xl",
        isMobile && !isSidebarOpen && "border-r-0",
        !isMobile && "relative",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center overflow-hidden flex-shrink-0 min-h-[52px] border-b border-ailab-border-muted",
          isSidebarOpen ? "px-3" : "px-2.5"
        )}
      >
        {isSidebarOpen ? (
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
                "bg-gradient-to-br from-ailab-accent/20 to-ailab-accent/5",
                "ring-1 ring-inset ring-ailab-accent/30",
                "shadow-[0_0_12px_var(--color-ailab-accent-soft)]"
              )}
            >
              <span className="text-xs font-black text-ailab-accent">
                {AI_AGENT_NAME.slice(0, 1)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[11px] tracking-widest text-ailab-text [letter-spacing:0.14em] truncate">
                {AI_AGENT_NAME}
              </p>
              <p className="text-[10px] font-mono text-ailab-muted truncate">AI Lab · R&D</p>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onExpandSidebar}
            title={t("sidebar.expand")}
            className={cn(
              "mx-auto flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0",
              "bg-gradient-to-br from-ailab-accent/20 to-ailab-accent/5",
              "ring-1 ring-inset ring-ailab-accent/30",
              "shadow-[0_0_12px_var(--color-ailab-accent-soft)]",
              "transition-all duration-300 ease-in-out",
              "hover:from-ailab-accent/30 hover:ring-ailab-accent/50 hover:shadow-[0_0_20px_var(--color-ailab-accent-soft)]"
            )}
          >
            <span className="text-xs font-black text-ailab-accent">{AI_AGENT_NAME.slice(0, 1)}</span>
          </button>
        )}
      </div>

      {showNewChat && (
        <div className="flex-shrink-0 px-2 py-2">
          {isSidebarOpen ? (
            <button
              type="button"
              onClick={onNewChat}
              className={cn(
                "w-full flex items-center gap-2 h-9 px-3 rounded-xl text-xs font-medium",
                "text-ailab-muted ring-1 ring-inset ring-ailab-border-muted bg-ailab-glass-04",
                "transition-all duration-300 ease-in-out",
                "hover:bg-ailab-glass-08 hover:text-ailab-text hover:ring-ailab-accent-soft hover:shadow-ailab-accent-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/45"
              )}
            >
              <SquarePen strokeWidth={AILAB_SIDEBAR_ICON_STROKE} className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{t("sidebar.new_chat")}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onNewChat}
              title={t("sidebar.new_chat")}
              className={cn(
                "w-full flex items-center justify-center h-9 rounded-xl text-ailab-muted",
                "transition-all duration-300 ease-in-out",
                "hover:bg-ailab-glass-06 hover:text-ailab-text hover:shadow-ailab-accent-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/45"
              )}
            >
              <SquarePen strokeWidth={AILAB_SIDEBAR_ICON_STROKE} className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-2 pb-2 overflow-x-hidden ailab-scrollbar min-h-0">
        {sections.map((section) => (
          <div key={section.categoryKey} className="mb-4 last:mb-2">
            {isSidebarOpen && (
              <div className="px-2 mb-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-ailab-muted">
                {t(section.categoryKey as never)}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = item.id === activeSidebarId;
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    layout
                    onClick={() => onNavItemClick(item)}
                    title={!isSidebarOpen ? t(item.labelKey as never) : undefined}
                    className={cn(
                      "w-full flex items-center rounded-xl relative",
                      "transition-all duration-300 ease-in-out",
                      "ring-1 ring-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/45",
                      isSidebarOpen
                        ? "px-2.5 py-2.5 min-h-[44px] justify-start gap-2.5"
                        : "p-2 min-h-[40px] justify-center gap-0",
                      isActive
                        ? "bg-ailab-glass-08 text-ailab-text ring-ailab-border-emphasis shadow-ailab-accent-sm"
                        : cn(
                            "text-ailab-muted ring-transparent",
                            "hover:bg-ailab-glass-06 hover:text-ailab-text hover:ring-ailab-border-muted hover:shadow-ailab-accent-sm"
                          )
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="ailabSidebarActiveBar"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-ailab-accent shadow-ailab-accent-bar"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon
                      strokeWidth={AILAB_SIDEBAR_ICON_STROKE}
                      className="w-[15px] h-[15px] shrink-0"
                      aria-hidden
                    />
                    {isSidebarOpen && (
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-xs font-medium">{t(item.labelKey as never)}</span>
                          {item.isOutbound && (
                            <ExternalLink
                              strokeWidth={AILAB_SIDEBAR_ICON_STROKE}
                              className="w-2.5 h-2.5 opacity-45 shrink-0 text-ailab-muted"
                              aria-hidden
                            />
                          )}
                        </div>
                        <div className="text-[9px] truncate mt-0.5 text-ailab-muted leading-snug">
                          {t(item.descKey as never)}
                        </div>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}

        {isSidebarOpen && chatHistory.length > 0 && (
          <div className="pt-1">
            <div className="border-t border-ailab-border-muted mb-2 mx-0.5" />
            <button
              type="button"
              onClick={onToggleHistory}
              className={cn(
                "w-full flex items-center justify-between px-2 py-1.5 rounded-xl mb-1 text-ailab-muted",
                "transition-all duration-300 ease-in-out",
                "hover:text-ailab-text hover:bg-ailab-glass-05"
              )}
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.14em]">{t("sidebar.history")}</span>
              <motion.div animate={{ rotate: showHistory ? 90 : 0 }} transition={{ duration: 0.2, ease: asideTransition.ease }}>
                <ChevronRight strokeWidth={AILAB_SIDEBAR_ICON_STROKE} className="w-3 h-3" />
              </motion.div>
            </button>

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: asideTransition.ease }}
                  className="overflow-hidden"
                >
                  {chatHistory.length > 5 && (
                    <div className="relative mb-1.5">
                      <Search
                        strokeWidth={AILAB_SIDEBAR_ICON_STROKE}
                        className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-ailab-muted"
                      />
                      <input
                        value={historySearch}
                        onChange={(e) => onHistorySearchChange(e.target.value)}
                        placeholder={t("sidebar.history_search")}
                        className={cn(
                          "w-full pl-7 pr-2 py-1.5 rounded-xl text-[11px] bg-ailab-glass-04 text-ailab-text placeholder:text-ailab-muted",
                          "outline-none ring-1 ring-inset ring-ailab-border-muted",
                          "transition-all duration-300 ease-in-out focus:ring-ailab-accent/40 focus:shadow-ailab-accent-sm"
                        )}
                      />
                    </div>
                  )}
                  <div className="space-y-0.5 max-h-44 overflow-y-auto ailab-scrollbar pr-0.5">
                    {filteredHistory.map((item) => (
                      <ChatHistoryRowView
                        key={item.id}
                        item={item}
                        isActive={item.id === activeChatId}
                        onClick={() => onHistoryItemClick(item)}
                        onDelete={(e) => {
                          e.stopPropagation();
                          onHistoryItemDelete(item.id);
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 p-2 border-t border-ailab-border-muted bg-ailab-glass-04">
        <AiLabUserMenu settings={settings} onOpenSettings={onOpenSettings} isSidebarOpen={isSidebarOpen} />
      </div>
    </motion.aside>
  );
}
