"use client";

import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";
import { Send, Square, ChevronDown, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMode, WorkspaceSettings } from "../types";
import { AI_AGENT_NAME } from "../constants";
import { useBexTerminalChat } from "../hooks/use-bex-terminal-chat";
import { TerminalThinkingIndicator } from "./terminal-thinking-indicator";
import { TerminalMessageBubble } from "./terminal-message-bubble";
import { TerminalPdfDropZone } from "./terminal-pdf-drop-zone";
import { TerminalDocChip } from "./terminal-doc-chip";

interface TerminalChatProps {
  settings?: WorkspaceSettings;
  mode: ChatMode;
  enableAgentWorkflow?: boolean;
}

export default function TerminalChat({
  settings,
  mode,
  enableAgentWorkflow = false,
}: TerminalChatProps) {
  const {
    t,
    mounted,
    safeMode,
    config,
    suggestedQuestions,
    displayMessages,
    input,
    setInput,
    isLoading,
    sendMessage,
    stop,
    handleKeyDown,
    canSend,
    scrollRef,
    messagesEndRef,
    textareaRef,
    fileInputRef,
    showScrollBtn,
    uploadedDoc,
    setUploadedDoc,
    isUploading,
    uploadError,
    setUploadError,
    handleFile,
    placeholderText,
    scrollToEnd,
    workflowUi,
    completeExitAnimation,
  } = useBexTerminalChat({ mode, settings, enableAgentWorkflow });

  const visibleMessages = displayMessages.filter((m) => {
    if (m.role === "assistant" && m.content === "") {
      return workflowUi?.messageId === m.id;
    }
    return true;
  });

  const lastMsg = displayMessages[displayMessages.length - 1];
  const showThinking =
    isLoading &&
    lastMsg?.role === "assistant" &&
    lastMsg.content === "" &&
    !workflowUi;

  if (!mounted) {
    return (
      <div className="flex flex-col h-full bg-ailab-canvas relative">
        <div className="flex-1" />
        <div className="flex-shrink-0 z-10 px-4 pb-6 pt-2 pointer-events-none">
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <div
              className={cn(
                "flex items-end gap-2 p-3 rounded-2xl",
                "bg-ailab-glass-14 ring-1 ring-inset ring-ailab-border-subtle shadow-lg"
              )}
            >
              <div className="flex w-8 flex-shrink-0 items-center justify-center">
                <span className="text-[10px] font-bold text-ailab-muted">{AI_AGENT_NAME.slice(0, 1)}</span>
              </div>
              <div className="flex-1 py-2 px-1 text-sm text-ailab-muted">{config.placeholder}</div>
              <div className="p-2 rounded-xl flex-shrink-0 w-9 h-9 bg-ailab-glass-08" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col h-full min-h-0 bg-ailab-canvas"
      onDragOver={safeMode === "pdf" ? (e) => e.preventDefault() : undefined}
      onDrop={
        safeMode === "pdf"
          ? (e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) void handleFile(f);
            }
          : undefined
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.md"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = "";
        }}
      />

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto ailab-scrollbar px-4 sm:px-8 py-4 sm:py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {displayMessages.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col justify-center min-h-[min(100%,calc(100dvh-200px))] sm:min-h-[calc(100vh-220px)] py-8"
              >
                {/* BEX Hero */}
                <div className="mb-8 md:mb-10">
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 220, delay: 0.05 }}
                    className="mb-5 flex items-center gap-3.5"
                  >
                    {/* Avatar with glow */}
                    <div className="relative flex-shrink-0">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                        "bg-gradient-to-br from-ailab-accent/25 to-ailab-accent/5",
                        "ring-1 ring-inset ring-ailab-accent/35",
                        "shadow-[0_0_24px_var(--color-ailab-accent-soft),inset_0_1px_0_rgba(255,255,255,0.06)]"
                      )}>
                        <span className="text-base font-black text-ailab-accent tracking-tighter">
                          {AI_AGENT_NAME.slice(0, 1)}
                        </span>
                      </div>
                      {/* Online indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-ailab-canvas flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-ailab-accent/90 shadow-[0_0_6px_var(--color-ailab-accent)]" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold tracking-[0.1em] text-ailab-text">{AI_AGENT_NAME}</p>
                      <p className="text-[10px] text-ailab-muted font-mono uppercase tracking-widest mt-0.5">
                        {t("engineer_status")}
                      </p>
                    </div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl md:text-3xl font-bold mb-2.5 text-ailab-text tracking-tight"
                  >
                    {config.emptyTitle}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-sm leading-relaxed max-w-md text-ailab-muted"
                  >
                    {config.emptyDesc}
                  </motion.p>

                  {safeMode === "pdf" && !uploadedDoc && (
                    <div className="mt-6">
                      <TerminalPdfDropZone
                        onFile={(f) => void handleFile(f)}
                        isLoading={isUploading}
                        error={uploadError}
                        dragLabel={t("upload_drag")}
                        formatLabel={t("upload_formats")}
                        readingLabel={t("upload_reading")}
                      />
                    </div>
                  )}
                </div>

                {/* Suggestion cards — shown for all modes */}
                {(safeMode !== "pdf" || uploadedDoc) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {suggestedQuestions[safeMode].map((q, i) => (
                      <motion.button
                        key={q}
                        type="button"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 + i * 0.06 }}
                        onClick={() => setInput(q)}
                        className={cn(
                          "group text-left p-4 rounded-xl transition-all duration-200",
                          "bg-ailab-glass-04 ring-1 ring-inset ring-ailab-border-subtle",
                          "hover:bg-ailab-glass-07 hover:ring-ailab-accent/25",
                          "active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/50"
                        )}
                      >
                        <span className="text-[13px] leading-relaxed text-ailab-text/80 group-hover:text-ailab-text transition-colors duration-200">
                          {q}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-10 md:gap-12 pb-4"
              >
                {visibleMessages.map((m) => (
                  <TerminalMessageBubble
                    key={m.id}
                    role={m.role}
                    content={m.content}
                    userLabel={t("role_user")}
                    assistantLabel={t("role_assistant")}
                    copyLabel={t("copy")}
                    copiedLabel={t("copied")}
                    errorNetwork={t("error_network")}
                    errorStream={t("error_stream")}
                    workflow={workflowUi?.messageId === m.id ? workflowUi : null}
                    onWorkflowExitComplete={
                      workflowUi?.messageId === m.id ? completeExitAnimation : undefined
                    }
                  />
                ))}
                {showThinking && <TerminalThinkingIndicator label={t("thinking")} />}
                <div ref={messagesEndRef} className="h-2 shrink-0" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToEnd}
            className={cn(
              "absolute bottom-[7.5rem] sm:bottom-[7rem] right-6 sm:right-8 w-9 h-9 rounded-full flex items-center justify-center z-20",
              "bg-ailab-glass-08 ring-1 ring-inset ring-ailab-border-strong",
              "text-ailab-muted transition-all duration-300 ease-in-out",
              "hover:bg-ailab-glass-12 hover:text-ailab-accent hover:shadow-ailab-accent-hover hover:scale-105",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/45"
            )}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="pointer-events-none z-20 flex-shrink-0 bg-gradient-to-t from-ailab-canvas via-ailab-canvas to-transparent px-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 sm:px-6 sm:pb-5 sm:pt-3">
        <div className="mx-auto max-w-2xl pointer-events-auto">
          <AnimatePresence>
            {uploadedDoc && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 10 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex items-center gap-2.5"
              >
                <TerminalDocChip
                  doc={uploadedDoc}
                  onRemove={() => {
                    setUploadedDoc(null);
                    setUploadError(null);
                  }}
                />
                <span className="text-[10px] text-ailab-muted">{t("uploaded_label")}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={cn(
              "rounded-2xl p-2 sm:p-2.5",
              "bg-ailab-glass-14 backdrop-blur-xl backdrop-saturate-150",
              "ring-1 ring-inset ring-ailab-border-subtle",
              "shadow-[0_-8px_40px_var(--color-ailab-scrim-40)]",
              "transition-[box-shadow,ring-color] duration-300 ease-in-out",
              "focus-within:shadow-ailab-accent-sm focus-within:ring-ailab-accent/35"
            )}
          >
            <div className="flex items-end gap-2">
              {safeMode === "pdf" && (
                <button
                  type="button"
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  disabled={isUploading}
                  className={cn(
                    "p-2.5 rounded-xl flex-shrink-0 transition-all duration-300 ease-in-out",
                    "text-ailab-muted hover:text-ailab-accent disabled:opacity-50",
                    "hover:bg-ailab-glass-06 hover:scale-105",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/45"
                  )}
                >
                  {isUploading ? (
                    <motion.div
                      className="w-4 h-4 rounded-full border-[1.5px] border-ailab-border-spinner border-t-ailab-border-spinner-top"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <Paperclip className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </button>
              )}

              <TextareaAutosize
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholderText}
                disabled={safeMode === "pdf" && !uploadedDoc && !isUploading}
                minRows={1}
                maxRows={8}
                className={cn(
                  "flex-1 w-full min-w-0 bg-transparent border-none py-2.5 px-2 resize-none outline-none",
                  "text-sm text-ailab-text placeholder:text-ailab-muted caret-ailab-accent",
                  "transition-opacity duration-300 ease-out disabled:opacity-45"
                )}
              />

              {isLoading ? (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={stop}
                  className={cn(
                    "p-2.5 rounded-xl flex-shrink-0",
                    "bg-ailab-glass-08 text-ailab-muted ring-1 ring-inset ring-ailab-border-muted",
                    "transition-all duration-300 ease-in-out",
                    "hover:bg-ailab-glass-10 hover:text-ailab-text",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/45"
                  )}
                >
                  <Square className="w-4 h-4" strokeWidth={1.75} />
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  whileHover={canSend ? { scale: 1.06 } : undefined}
                  whileTap={canSend ? { scale: 0.94 } : undefined}
                  onClick={() => void sendMessage()}
                  disabled={!canSend}
                  className={cn(
                    "group/send p-2.5 rounded-xl flex-shrink-0 transition-all duration-300 ease-in-out",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-ailab-accent/55",
                    canSend
                      ? "bg-ailab-accent text-ailab-canvas shadow-ailab-accent-send hover:brightness-110 hover:shadow-ailab-accent-focus"
                      : "bg-ailab-glass-08 text-ailab-muted ring-1 ring-inset ring-ailab-border-muted cursor-not-allowed"
                  )}
                >
                  <Send
                    className={cn(
                      "w-4 h-4 transition-transform duration-300 ease-out",
                      canSend && "group-hover/send:scale-110 group-hover/send:-translate-y-0.5 group-hover/send:drop-shadow-[0_0_10px_var(--color-ailab-accent)]"
                    )}
                    strokeWidth={canSend ? 2 : 1.5}
                  />
                </motion.button>
              )}
            </div>
          </div>

          <div className="hidden sm:flex items-center justify-between mt-2.5 px-1">
            <p className="text-[10px] tracking-wider text-ailab-muted font-medium [font-variant:small-caps]">
              {t("footer_warning")}
            </p>
            <p className="text-[10px] text-ailab-muted/60 font-mono">
              {t("keyboard_hint")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
