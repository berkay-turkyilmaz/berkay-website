"use client";

import { CosmicScrollStage } from "@/features/mucize/components/cosmic-scroll-stage";
import { MucizeChapterSection } from "@/features/mucize/components/mucize-chapter-section";
import { MUCIZE_CHAPTERS } from "@/features/mucize/data/chapters";

export function MucizeExperience() {
  return (
    <div className="relative min-h-dvh bg-[#040608] text-amber-50">
      <CosmicScrollStage />

      <div className="relative z-10 mx-auto max-w-2xl space-y-8 px-5 pb-24 pt-8 sm:px-6">
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500/70">
            Tefekkür
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-amber-50 sm:text-3xl">
            Az Bilinen İşaretler
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-amber-100/50">
            Kur&apos;an ayetleri ve modern bilgi arasındaki ilişkiyi keşfetmek için kişisel bir
            sayfa. Resmi fetva veya akademik hüküm niteliği taşımaz.
          </p>
        </header>

        {MUCIZE_CHAPTERS.map((chapter, index) => (
          <MucizeChapterSection key={chapter.id} chapter={chapter} index={index} />
        ))}

        <footer className="border-t border-amber-900/20 pt-8 text-center text-xs leading-relaxed text-amber-100/35">
          Videolar hazır olduğunda{" "}
          <code className="text-amber-200/50">public/mucize/videos/</code> klasörüne eklenecek.
        </footer>
      </div>
    </div>
  );
}
