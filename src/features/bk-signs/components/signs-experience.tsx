"use client";

import { CosmicScrollStage } from "@/features/bk-signs/components/cosmic-scroll-stage";
import { ChapterNav } from "@/features/bk-signs/components/chapter-nav";
import { SignsChapterSection } from "@/features/bk-signs/components/signs-chapter-section";
import { SIGNS_CHAPTERS } from "@/features/bk-signs/data/chapters";

export function SignsExperience() {
  return (
    <div className="relative min-h-dvh bg-[#040608] text-amber-50">
      <CosmicScrollStage />

      <div className="relative z-10 mx-auto max-w-2xl space-y-8 px-5 pb-24 pt-8 sm:px-6">
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500/70">
            BK · İşaretler
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-amber-50 sm:text-3xl">
            Kozmik Yansımalar
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-amber-100/50">
            Ayetler ve modern bilgi arasındaki ilişkiyi keşfetmek için kişisel bir sayfa.
            Resmi fetva veya akademik hüküm niteliği taşımaz.
          </p>
        </header>

        <ChapterNav chapters={SIGNS_CHAPTERS} />

        {SIGNS_CHAPTERS.map((chapter, index) => (
          <SignsChapterSection key={chapter.id} chapter={chapter} index={index} />
        ))}

        <footer className="border-t border-amber-900/20 pt-8 text-center text-xs leading-relaxed text-amber-100/35">
          <p>
            Bu sayfa yalnızca kişisel tefekkür amaçlıdır. Dinî ve bilimsel konularda
            yetkili kaynaklara başvurunuz.
          </p>
        </footer>
      </div>
    </div>
  );
}
