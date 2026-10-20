"use client";

import { useCallback, useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Github, Menu, X } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SiteLogo } from "@/components/layout/site-logo";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { key: "projects", href: "/projects" },
  { key: "about", href: "/about" },
  { key: "blog", href: "/blog" },
  { key: "lab", href: "/ai-lab/chat" },
  { key: "contact", href: "/contact" },
] as const;

export function Header() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const isActive = (href: string) => {
    const base = "/" + href.split("/")[1];
    return pathname === href || pathname.startsWith(base);
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[200] rounded-md bg-foreground px-4 py-2 text-sm text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t("skip")}
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] border-b transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled || open
            ? "border-border bg-background/85 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <SiteLogo />

          <nav aria-label={t("main")} className="hidden md:block">
            <ul className="flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "relative text-sm transition-colors duration-300 after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100",
                      isActive(item.href) ? "text-foreground after:scale-x-100" : "text-muted-foreground"
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-1.5 md:flex">
            <LanguageSwitcher />
            <ThemeToggle />
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
            >
              <Github className="h-3.5 w-3.5" aria-hidden />
              GitHub
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">{t("opens_new_tab")}</span>
            </a>
          </div>

          <button
            type="button"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("menu_close") : t("menu_open")}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t("main")}
          className="fixed inset-0 z-[90] flex flex-col bg-background px-5 pb-10 pt-24 md:hidden"
        >
          <nav aria-label={t("main")} className="flex-1">
            <ul className="divide-y divide-border border-y border-border">
              {NAV_ITEMS.map((item, i) => (
                <li key={item.key} className="rise" style={{ "--d": i } as React.CSSProperties}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="flex items-baseline justify-between py-5 font-display text-4xl tracking-[-0.02em] text-foreground"
                  >
                    {t(item.key)}
                    <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-1.5 rounded-full bg-foreground px-5 text-sm font-medium text-background"
            >
              <Github className="h-4 w-4" aria-hidden />
              GitHub
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
