"use client";

import { Link } from "@/i18n/routing";
import { BRAND_NAME, LogoMark } from "@/components/brand/logo-mark";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
};

export function SiteLogo({ className }: SiteLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group relative z-50 flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg",
        className
      )}
      aria-label={BRAND_NAME}
    >
      <LogoMark
        size={34}
        className="transition-transform duration-300 group-hover:scale-[1.05] group-active:scale-[0.98]"
      />
      <span className="font-black text-sm tracking-[0.18em] text-foreground transition-colors duration-300 group-hover:text-foreground/90 sm:text-[15px]">
        {BRAND_NAME}
      </span>
    </Link>
  );
}
