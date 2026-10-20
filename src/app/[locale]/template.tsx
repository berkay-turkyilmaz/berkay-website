"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site-config";

/** Client-side flag: the intro curtain plays once per full page load, not on every navigation. */
let introPlayed = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [gone, setGone] = useState(false);
  const skipIntro =
    pathname?.includes("/bk-reflect") ||
    pathname?.includes("/bk-signs") ||
    pathname?.includes("/ai-lab");
  const showIntro = !introPlayed && !skipIntro && !gone;

  useEffect(() => {
    introPlayed = true;
    // Safety net: never leave the curtain up if the CSS animation does not run.
    const id = setTimeout(() => setGone(true), 1600);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      {showIntro && (
        <div
          aria-hidden="true"
          className="intro-curtain pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-[hsl(40_14%_10%)]"
        >
          <span className="font-display text-4xl tracking-[-0.02em] text-[hsl(40_30%_95%)] sm:text-6xl">
            {siteConfig.fullName}
            <span className="text-[hsl(16_82%_52%)]">.</span>
          </span>
        </div>
      )}
      {children}
    </>
  );
}
