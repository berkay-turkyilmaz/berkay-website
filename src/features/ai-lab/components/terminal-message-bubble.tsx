"use client";

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { User, AlertCircle, Copy, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentWorkflowUiState } from "../types";
import { AI_AGENT_NAME } from "../constants";
import { TerminalAssistantMarkdownBlock } from "./terminal-assistant-markdown-block";
import { AgentStateFlow } from "./agent-state-flow";

export type TerminalMessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
  userLabel: string;
  assistantLabel: string;
  copyLabel: string;
  copiedLabel: string;
  errorNetwork: string;
  errorStream: string;
  workflow?: AgentWorkflowUiState | null;
  onWorkflowExitComplete?: () => void;
};

export const TerminalMessageBubble = memo(function TerminalMessageBubble({
  role,
  content,
  userLabel,
  assistantLabel,
  copyLabel,
  copiedLabel,
  errorNetwork,
  errorStream,
  workflow,
  onWorkflowExitComplete,
}: TerminalMessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isNetworkErr = content === "__ERR_NETWORK__";
  const isStreamErr = content === "__ERR_STREAM__";
  const isExtractErr = content.startsWith("__ERR_EXTRACT__:");
  const isError = isNetworkErr || isStreamErr || isExtractErr;

  if (role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="flex justify-end gap-3 pt-1"
      >
        <div className="max-w-[82%] md:max-w-[72%] space-y-1">
          <div
            className={cn(
              "px-4 py-3.5 rounded-2xl rounded-tr-md text-sm leading-relaxed",
              "text-ailab-text bg-ailab-glass-06 ring-1 ring-inset ring-ailab-border-muted",
              "transition-[box-shadow,background-color] duration-300 ease-out"
            )}
          >
            {content}
          </div>
          <p className="text-[10px] text-right pr-1 text-ailab-muted font-mono tracking-wide">{userLabel}</p>
        </div>
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
            "bg-ailab-glass-07 ring-1 ring-inset ring-ailab-border-muted text-ailab-muted"
          )}
        >
          <User className="w-3.5 h-3.5" strokeWidth={1.5} />
        </div>
      </motion.div>
    );
  }

  if (isError) {
    const msg = isNetworkErr
      ? errorNetwork
      : isExtractErr
        ? content.replace("__ERR_EXTRACT__:", "")
        : errorStream;

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="flex gap-3 pt-2"
      >
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
            "bg-ailab-danger-bg ring-1 ring-inset ring-ailab-danger-border/50"
          )}
        >
          <AlertCircle className="w-3.5 h-3.5 text-red-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono mb-1.5 text-ailab-muted">
            {AI_AGENT_NAME} · {assistantLabel}
          </div>
          <div
            className={cn(
              "text-sm px-3 py-2.5 rounded-xl",
              "bg-ailab-danger-bg text-ailab-danger-fg",
              "ring-1 ring-inset ring-ailab-danger-border"
            )}
          >
            {msg}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="group flex gap-3 pt-3 pb-1"
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
          "bg-ailab-glass-07 ring-1 ring-inset ring-ailab-border-muted"
        )}
      >
        <span className="text-[10px] font-bold text-ailab-muted">{AI_AGENT_NAME.slice(0, 1)}</span>
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="text-[10px] font-mono tracking-wide text-ailab-muted">
          {AI_AGENT_NAME} · {assistantLabel}
        </div>

        {workflow && onWorkflowExitComplete ? (
          <AgentStateFlow state={workflow} onExitAnimationComplete={onWorkflowExitComplete} />
        ) : (
          <div
            className={cn(
              "border-l-2 border-ailab-border-emphasis pl-4 pr-4 py-3.5 rounded-r-xl",
              "bg-ailab-glass-03 ring-1 ring-inset ring-ailab-border-subtle",
              "transition-[box-shadow] duration-300 ease-out"
            )}
          >
            <div className="text-sm leading-relaxed text-ailab-text">
              <TerminalAssistantMarkdownBlock
                content={content}
                copyLabel={copyLabel}
                copiedLabel={copiedLabel}
              />
            </div>
          </div>
        )}

        {content.length > 0 && !workflow && (
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(content);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className={cn(
              "flex items-center gap-1 text-[10px] opacity-0 group-hover:opacity-100",
              "text-ailab-muted transition-[opacity,color] duration-300 ease-out",
              "hover:text-ailab-accent focus-visible:opacity-100 focus-visible:outline-none focus-visible:text-ailab-accent"
            )}
          >
            {copied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? copiedLabel : copyLabel}
          </button>
        )}
      </div>
    </motion.article>
  );
});
