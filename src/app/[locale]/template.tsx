"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { BRAND_NAME, LogoMark } from "@/components/brand/logo-mark";

/** Client-side flag: the intro curtain plays once per full page load, not on every navigation. */
let introPlayed = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const skipIntro =
    pathname?.includes("/bk-reflect") || pathname?.includes("/bk-signs");
  const showIntro = !introPlayed && !skipIntro;

  useEffect(() => {
    introPlayed = true;
  }, []);

  return (
    <>
      {showIntro && (
        <div
          aria-hidden="true"
          className="intro-curtain pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950"
        >
          <div className="flex items-center gap-3">
            <LogoMark size={48} className="border-white/20 bg-white/10 text-white" />
            <span className="text-2xl font-black uppercase tracking-[0.16em] text-white sm:text-3xl">
              {BRAND_NAME}
            </span>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
