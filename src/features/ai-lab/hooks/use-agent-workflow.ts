"use client";

import { useCallback, useRef, useState } from "react";
import type { AgentWorkflowUiState } from "../types";

export const AGENT_WORKFLOW_STEPS = [
  { id: "context", labelKey: "workflow_step_context", delayMs: 1500 },
  { id: "scan", labelKey: "workflow_step_scan", delayMs: 2000 },
  { id: "synthesize", labelKey: "workflow_step_synthesize", delayMs: 1000 },
] as const;

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const t = window.setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      window.clearTimeout(t);
      signal.removeEventListener("abort", onAbort);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort);
  });
}

function buildInitialSteps(): AgentWorkflowUiState["steps"] {
  return AGENT_WORKFLOW_STEPS.map((c, i) => ({
    id: c.id,
    labelKey: c.labelKey,
    status: i === 0 ? ("active" as const) : ("pending" as const),
  }));
}

/**
 * Simulated “chain of thought” pre-stream UI. Resolves after exit animation calls {@link completeExitAnimation}.
 */
export function useAgentWorkflow() {
  const [workflowUi, setWorkflowUi] = useState<AgentWorkflowUiState | null>(null);
  const exitResolverRef = useRef<(() => void) | null>(null);

  const completeExitAnimation = useCallback(() => {
    exitResolverRef.current?.();
    exitResolverRef.current = null;
  }, []);

  const runWorkflow = useCallback(
    async (messageId: string, signal: AbortSignal) => {
      setWorkflowUi({
        messageId,
        steps: buildInitialSteps(),
        phase: "steps",
      });

      try {
        for (let i = 0; i < AGENT_WORKFLOW_STEPS.length; i++) {
          await sleep(AGENT_WORKFLOW_STEPS[i].delayMs, signal);
          setWorkflowUi((prev) => {
            if (!prev || prev.messageId !== messageId) return prev;
            const nextSteps = prev.steps.map((s, j) => {
              if (j < i) return { ...s, status: "done" as const };
              if (j === i) return { ...s, status: "done" as const };
              if (j === i + 1) return { ...s, status: "active" as const };
              return { ...s, status: "pending" as const };
            });
            return { ...prev, steps: nextSteps };
          });
        }

        setWorkflowUi((prev) => {
          if (!prev || prev.messageId !== messageId) return prev;
          return {
            ...prev,
            steps: prev.steps.map((s) => ({ ...s, status: "done" as const })),
            phase: "exit",
          };
        });

        await new Promise<void>((resolve) => {
          exitResolverRef.current = resolve;
          window.setTimeout(() => {
            if (exitResolverRef.current === resolve) {
              exitResolverRef.current = null;
              resolve();
            }
          }, 900);
        });

        setWorkflowUi(null);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") {
          setWorkflowUi(null);
          exitResolverRef.current = null;
          return;
        }
        throw e;
      }
    },
    []
  );

  return { workflowUi, runWorkflow, completeExitAnimation };
}
