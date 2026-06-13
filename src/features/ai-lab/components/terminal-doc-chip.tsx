"use client";

import { motion } from "framer-motion";
import { FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UploadedDoc } from "../types";

export function TerminalDocChip({ doc, onRemove }: { doc: UploadedDoc; onRemove: () => void }) {
  const kb =
    doc.size < 1024 * 1024
      ? `${(doc.size / 1024).toFixed(0)} KB`
      : `${(doc.size / 1024 / 1024).toFixed(1)} MB`;
  const meta = `${kb} · ${doc.totalChunks}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-ailab-glass-07 ring-1 ring-inset ring-ailab-border transition-[box-shadow] duration-300 ease-out hover:ring-ailab-border-emphasis"
    >
      <FileText className="w-3.5 h-3.5 flex-shrink-0 text-ailab-text/55" />

      <div className="min-w-0">
        <div className="text-[11px] font-medium truncate max-w-[200px] text-ailab-text/80">{doc.name}</div>
        <div className="text-[9px] text-ailab-text/50">{meta}</div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className={cn(
          "p-0.5 rounded flex-shrink-0 text-ailab-text/50",
          "transition-[color,background-color] duration-300 ease-out",
          "hover:text-red-300 hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/45"
        )}
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
