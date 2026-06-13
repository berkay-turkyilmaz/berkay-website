"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeepAnalyzerSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-ailab-canvas">
      <div className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-ailab-border-subtle bg-ailab-glass-04 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ailab-glass-06 ring-1 ring-inset ring-ailab-border-muted">
            <Brain className="h-4 w-4 text-ailab-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-3.5 w-36 rounded-md bg-ailab-glass-08" />
            <div className="h-2.5 w-28 rounded bg-ailab-glass-06" />
          </div>
        </div>
        <div className="hidden h-9 w-48 rounded-lg bg-ailab-glass-06 ring-1 ring-inset ring-ailab-border-muted sm:block" />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-3 lg:col-span-2">
              <div
                className={cn(
                  "h-28 rounded-2xl border border-dashed border-ailab-border-subtle",
                  "bg-ailab-glass-04 ring-1 ring-inset ring-ailab-border-muted"
                )}
              />
              <div className="h-40 rounded-2xl bg-ailab-glass-06 ring-1 ring-inset ring-ailab-border-subtle" />
            </div>
            <div className="h-44 rounded-2xl bg-ailab-glass-06 ring-1 ring-inset ring-ailab-border-subtle" />
          </div>
          <motion.div
            className="h-2 w-full max-w-md rounded-full bg-ailab-glass-08"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}
