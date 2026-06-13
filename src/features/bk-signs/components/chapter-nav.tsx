"use client";

import type { SignsChapter } from "@/features/bk-signs/data/chapters";

export function ChapterNav({ chapters }: { chapters: SignsChapter[] }) {
  return (
    <nav
      aria-label="Bölümler"
      className="sticky top-4 z-20 -mx-1 flex gap-2 overflow-x-auto pb-2 scrollbar-none"
    >
      {chapters.map((chapter, index) => (
        <a
          key={chapter.id}
          href={`#${chapter.id}`}
          className="shrink-0 rounded-full border border-amber-900/30 bg-[#0a0f0c]/80 px-3 py-1.5 text-xs text-amber-200/65 backdrop-blur-sm transition-colors hover:border-amber-700/40 hover:text-amber-100"
        >
          <span className="mr-1.5 font-mono text-amber-500/50">{String(index + 1).padStart(2, "0")}</span>
          {chapter.reference}
        </a>
      ))}
    </nav>
  );
}
