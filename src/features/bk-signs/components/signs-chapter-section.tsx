"use client";

import { motion } from "framer-motion";
import type { SignsChapter } from "@/features/bk-signs/data/chapters";

export function SignsChapterSection({
  chapter,
  index,
}: {
  chapter: SignsChapter;
  index: number;
}) {
  return (
    <motion.section
      id={chapter.id}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.05 }}
      className="scroll-mt-24 rounded-2xl border border-amber-900/25 bg-[#0a0f0c]/90 p-6 shadow-lg backdrop-blur-sm sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500/80">
          {chapter.reference}
        </p>
        <span className="rounded-full border border-amber-900/30 bg-amber-950/30 px-2 py-0.5 text-[10px] font-mono text-amber-200/40">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h2 className="mt-2 text-xl font-bold text-amber-50 sm:text-2xl">{chapter.title}</h2>
      <blockquote className="mt-4 border-l-2 border-amber-700/40 pl-4 text-base leading-relaxed text-amber-100/85 italic">
        {chapter.meal}
      </blockquote>
      <div className="mt-5 rounded-xl border border-amber-800/20 bg-amber-950/15 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/60">
          Bilimsel perspektif
        </p>
        <p className="mt-2 text-sm leading-relaxed text-amber-100/70">{chapter.highlight}</p>
      </div>
      {chapter.note && (
        <p className="mt-4 rounded-lg border border-amber-900/20 bg-amber-950/20 px-3 py-2 text-xs text-amber-200/45">
          {chapter.note}
        </p>
      )}
    </motion.section>
  );
}
