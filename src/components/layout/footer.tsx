"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { SiteLogo } from "@/components/layout/site-logo";
import { siteConfig } from "@/data/site-config";

const PAGES = [
  { key: "projects", href: "/projects" },
  { key: "about", href: "/about" },
  { key: "blog", href: "/blog" },
  { key: "lab", href: "/ai-lab/chat" },
  { key: "resume", href: "/resume" },
  { key: "contact", href: "/contact" },
] as const;

const PHOTO_CREDITS = [
  { name: "Zeynep Şahin", href: "https://www.pexels.com/photo/foggy-panorama-of-bosporus-and-15-july-martyrs-bridge-istanbul-turkey-19770635/" },
  { name: "hkubrakisa", href: "https://www.pexels.com/photo/skyline-of-istanbul-viewed-from-the-bosphorus-strait-on-a-foggy-day-24863575/" },
  { name: "dkomov", href: "https://www.pexels.com/photo/home-office-laptop-with-coffee-and-notebook-34803970/" },
] as const;

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");

  return (
    <footer className="w-full border-t border-border">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-14 sm:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <SiteLogo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">{t("tagline")}</p>
          </div>

          <nav aria-label={t("pages")} className="md:col-span-3 md:col-start-7">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{t("pages")}</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {PAGES.map((p) => (
                <li key={p.key}>
                  <Link href={p.href} className="text-foreground transition-colors hover:text-primary">
                    {tNav(p.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{t("elsewhere")}</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                { label: "GitHub", href: siteConfig.github },
                { label: "LinkedIn", href: siteConfig.linkedin },
                { label: siteConfig.email, href: `mailto:${siteConfig.email}` },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-foreground transition-colors hover:text-primary"
                  >
                    {l.label}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.fullName}. {t("built_with")}
          </p>
          <p>
            {t("photos")}{" "}
            {PHOTO_CREDITS.map((c, i) => (
              <span key={c.name}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-border underline-offset-2 transition-colors hover:text-foreground"
                >
                  {c.name}
                </a>
                {i < PHOTO_CREDITS.length - 1 ? ", " : ""}
              </span>
            ))}{" "}
            · Pexels
          </p>
        </div>
      </div>
    </footer>
  );
}
