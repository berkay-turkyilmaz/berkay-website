"use client";

import { motion } from "framer-motion";
import { AI_AGENT_NAME } from "../constants";

export function TerminalThinkingIndicator({ label }: { label: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-ailab-glass-07 ring-1 ring-inset ring-ailab-border-strong">
        <span className="text-[9px] font-bold leading-none text-ailab-text/55">
          {AI_AGENT_NAME.slice(0, 1)}
        </span>
      </div>
      <div className="flex min-w-0 flex-col gap-2 pt-0.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-[10px] font-semibold tracking-wide text-ailab-text/45">
            {AI_AGENT_NAME}
          </span>
          <span className="text-[11px] italic text-ailab-text/50">{label}</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-1 w-1 rounded-full bg-ailab-accent/60"
                animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1.15, 0.85] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>
        <div className="h-px w-40 overflow-hidden bg-ailab-border-muted">
          <motion.div
            className="h-full w-16 bg-gradient-to-r from-transparent via-ailab-accent/40 to-transparent"
            animate={{ x: [-64, 160] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}
