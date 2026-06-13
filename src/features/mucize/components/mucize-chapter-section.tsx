"use client";

import { motion } from "framer-motion";
import type { MucizeChapter } from "@/features/mucize/data/chapters";

export function MucizeChapterSection({ chapter, index }: { chapter: MucizeChapter; index: number }) {
  return (
    <motion.section
      id={chapter.id}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.05 }}
      className="scroll-mt-20 rounded-2xl border border-amber-900/25 bg-[#0a0f0c]/90 p-6 sm:p-8"
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500/80">
        {chapter.reference}
      </p>
      <h2 className="mt-2 text-xl font-bold text-amber-50 sm:text-2xl">{chapter.title}</h2>
      <blockquote className="mt-4 border-l-2 border-amber-700/40 pl-4 text-base leading-relaxed text-amber-100/85 italic">
        {chapter.meal}
      </blockquote>
      <p className="mt-5 text-sm leading-relaxed text-amber-100/65">{chapter.highlight}</p>
      {chapter.note && (
        <p className="mt-4 rounded-lg border border-amber-900/20 bg-amber-950/20 px-3 py-2 text-xs text-amber-200/45">
          {chapter.note}
        </p>
      )}
    </motion.section>
  );
}
