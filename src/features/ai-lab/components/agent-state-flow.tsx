"use client";

import { memo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { AgentWorkflowUiState } from "../types";

export type AgentStateFlowProps = {
  state: AgentWorkflowUiState;
  onExitAnimationComplete: () => void;
};

export const AgentStateFlow = memo(function AgentStateFlow({
  state,
  onExitAnimationComplete,
}: AgentStateFlowProps) {
  const t = useTranslations("AiLabPage.chat");
  const isExiting = state.phase === "exit";
  const exitReported = useRef(false);

  useEffect(() => {
    exitReported.current = false;
  }, [state.messageId]);

  const handleAnimationComplete = () => {
    if (!isExiting || exitReported.current) return;
    exitReported.current = true;
    onExitAnimationComplete();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={
        isExiting
          ? { opacity: 0, y: -12, scale: 0.97 }
          : { opacity: 1, y: 0, scale: 1 }
      }
      transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={handleAnimationComplete}
      className={cn(
        "rounded-r-xl rounded-l-sm border-l-2 border-ailab-border-emphasis",
        "bg-ailab-glass-04 ring-1 ring-inset ring-ailab-border-muted",
        "px-3 py-3 space-y-2.5"
      )}
    >
      <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-ailab-muted">{t("workflow_panel_title")}</p>
      <ul className="space-y-2">
        {state.steps.map((step) => (
          <li key={step.id} className="flex items-start gap-2.5 min-h-[22px]">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
              {step.status === "done" && (
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 24 }}
                  className="flex h-4 w-4 items-center justify-center rounded-full bg-ailab-accent/15 ring-1 ring-ailab-accent/35 shadow-ailab-accent-sm"
                >
                  <Check className="w-2.5 h-2.5 text-ailab-accent" strokeWidth={2.5} />
                </motion.span>
              )}
              {step.status === "active" && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-ailab-accent" strokeWidth={2} />
              )}
              {step.status === "pending" && (
                <span className="block h-1.5 w-1.5 rounded-full bg-ailab-border-muted mt-1.5 ml-1" />
              )}
            </span>
            <span
              className={cn(
                "text-[13px] leading-snug transition-colors duration-300 ease-out",
                step.status === "pending" && "text-ailab-muted",
                step.status === "active" && "text-ailab-text font-medium",
                step.status === "done" && "text-ailab-text/75"
              )}
            >
              {t(step.labelKey as never)}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
});
