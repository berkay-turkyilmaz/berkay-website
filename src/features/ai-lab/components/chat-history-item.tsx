"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { MessageSquare, FileText, Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { StoredChat } from "../lib/chat-store";
import { useTickingNow } from "../hooks/use-ticking-now";

export function ChatHistoryItem({
  item,
  isActive,
  onClick,
  onDelete,
  onRename,
}: {
  item: StoredChat;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
}) {
  const t = useTranslations("AiLabPage.chat");
  const tSidebar = useTranslations("AiLabPage.sidebar");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const Icon = item.kind === "document" ? FileText : MessageSquare;

  const now = useTickingNow();
  const diff = now - item.updatedAt;
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

  const startEditing = () => {
    setDraft(item.title);
    setEditing(true);
    requestAnimationFrame(() => inputRef.current?.select());
  };

  const commit = () => {
    setEditing(false);
    if (draft.trim() && draft.trim() !== item.title) onRename(draft);
  };

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") setEditing(false);
  };

  const iconButton =
    "hidden group-hover:flex group-focus-within:flex p-1 rounded flex-shrink-0 text-ailab-text/50 transition-[color,background-color] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/45";

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "group relative flex items-center gap-2 px-2 py-1.5 rounded-lg",
        "transition-[background-color,box-shadow] duration-300 ease-out ring-1 ring-inset",
        isActive
          ? "bg-ailab-glass-09 ring-ailab-border-strong"
          : "bg-transparent ring-transparent hover:bg-ailab-glass-05 hover:ring-ailab-border-subtle"
      )}
    >
      <Icon className="w-3 h-3 flex-shrink-0 text-ailab-text/50" aria-hidden />
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={onInputKey}
          maxLength={80}
          aria-label={tSidebar("rename_chat")}
          className="flex-1 min-w-0 bg-transparent text-[11px] text-ailab-text outline-none ring-1 ring-ailab-accent/40 rounded px-1"
        />
      ) : (
        <button
          type="button"
          onClick={onClick}
          onDoubleClick={startEditing}
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "flex-1 min-w-0 text-left text-[11px] truncate transition-colors duration-300",
            "focus-visible:outline-none focus-visible:underline",
            isActive ? "text-ailab-text/90" : "text-ailab-text/70"
          )}
        >
          {item.title}
        </button>
      )}
      {!editing && (
        <>
          <span className="text-[11px] flex-shrink-0 text-ailab-text/55 group-hover:hidden group-focus-within:hidden">
            {timeAgo}
          </span>
          <button
            type="button"
            onClick={startEditing}
            aria-label={tSidebar("rename_chat")}
            title={tSidebar("rename_chat")}
            className={cn(iconButton, "hover:text-ailab-accent hover:bg-ailab-glass-08")}
          >
            <Pencil className="w-2.5 h-2.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={tSidebar("delete_chat")}
            title={tSidebar("delete_chat")}
            className={cn(iconButton, "hover:text-red-300 hover:bg-red-500/10")}
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </>
      )}
    </motion.div>
  );
}
