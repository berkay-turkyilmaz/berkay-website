"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function TerminalPdfDropZone({
  onFile,
  isLoading,
  error,
  dragLabel,
  formatLabel,
  readingLabel,
}: {
  onFile: (file: File) => void;
  isLoading: boolean;
  error: string | null;
  dragLabel: string;
  formatLabel: string;
  readingLabel: string;
}) {
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="mt-6">
      <input
        ref={ref}
        type="file"
        accept=".pdf,.txt,.md"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />

      <div
        onClick={() => !isLoading && ref.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) onFile(f);
        }}
        className={cn(
          "flex flex-col items-center justify-center p-10 rounded-2xl select-none",
          "border border-dashed transition-[background-color,border-color,box-shadow] duration-300 ease-out",
          dragging
            ? "bg-ailab-glass-04 border-ailab-accent/55 cursor-pointer shadow-ailab-accent-drop"
            : "bg-transparent border-ailab-border-dashed hover:bg-ailab-glass-03 hover:border-ailab-border-dashed-hover",
          isLoading ? "cursor-default" : "cursor-pointer"
        )}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <motion.div
              className="w-8 h-8 rounded-full border-2 border-ailab-border border-t-ailab-accent/80"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-xs text-ailab-text/55">{readingLabel}</span>
          </div>
        ) : (
          <>
            <UploadCloud className="w-10 h-10 mb-4 text-ailab-text/40 transition-colors duration-300 group-hover:text-ailab-text/55" />
            <p className="text-sm font-medium mb-1 text-ailab-text/70">{dragLabel}</p>
            <p className="text-xs text-ailab-text/50">{formatLabel}</p>
          </>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-xl bg-ailab-danger-bg ring-1 ring-inset ring-ailab-danger-border"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-red-300" />
            <span className="text-xs leading-relaxed text-ailab-danger-fg">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
