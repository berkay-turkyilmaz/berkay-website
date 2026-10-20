"use client";

import { Link } from "@/i18n/routing";
import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
};

/** Typographic wordmark: serif name with a single accent dot. */
export function SiteLogo({ className }: SiteLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group relative z-50 inline-flex items-baseline gap-0.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-4 focus-visible:ring-offset-background",
        className
      )}
      aria-label={siteConfig.fullName}
    >
      <span className="font-display text-[1.45rem] leading-none tracking-[-0.01em] text-foreground">
        {siteConfig.fullName}
      </span>
      <span
        className="font-display text-[1.45rem] leading-none text-primary transition-transform duration-300 group-hover:translate-y-[-2px]"
        aria-hidden
      >
        .
      </span>
    </Link>
  );
}
