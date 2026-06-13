"use client";

import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { MessageSquare, FileText, Terminal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { ChatHistoryItem as ChatHistoryRow, ChatMode } from "../types";
import { useTickingNow } from "../hooks/use-ticking-now";

export function ChatHistoryItem({
  item,
  isActive,
  onClick,
  onDelete,
}: {
  item: ChatHistoryRow;
  isActive: boolean;
  onClick: () => void;
  onDelete: (e: MouseEvent) => void;
}) {
  const t = useTranslations("AiLabPage.chat");
  const icons: Record<ChatMode, typeof MessageSquare> = {
    terminal: MessageSquare,
    pdf: FileText,
    engineer: Terminal,
  };
  const Icon = icons[item.mode];
  const now = useTickingNow();
  const diff = now - item.timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const timeAgo =
    mins < 1
      ? t("time_just_now")
      : mins < 60
        ? t("time_mins", { n: mins })
        : hours < 24
          ? t("time_hours", { n: hours })
          : t("time_days", { n: days });

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "group relative flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer",
        "transition-[background-color,box-shadow] duration-300 ease-out ring-1 ring-inset",
        isActive
          ? "bg-ailab-glass-09 ring-ailab-border-strong"
          : "bg-transparent ring-transparent hover:bg-ailab-glass-05 hover:ring-ailab-border-subtle"
      )}
      onClick={onClick}
    >
      <Icon className="w-3 h-3 flex-shrink-0 text-ailab-text/50" />
      <span
        className={cn(
          "flex-1 text-[11px] truncate transition-colors duration-300",
          isActive ? "text-ailab-text/88" : "text-ailab-text/65"
        )}
      >
        {item.title}
      </span>
      <span className="text-[9px] flex-shrink-0 text-ailab-text/45 group-hover:hidden">{timeAgo}</span>
      <button
        type="button"
        onClick={onDelete}
        className="hidden group-hover:flex p-0.5 rounded flex-shrink-0 text-ailab-text/50 transition-[color,background-color] duration-300 ease-out hover:text-red-300 hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/45"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </motion.div>
  );
}
