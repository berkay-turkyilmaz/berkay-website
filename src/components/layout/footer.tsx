"use client";

import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
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

const GITHUB_HANDLE = "berkay-turkyilmaz";

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");

  return (
    <footer className="w-full border-t border-border">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-14 sm:px-8 md:py-20">
        {/* GitHub first: the code is the strongest proof of work. */}
        <a
          href={siteConfig.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-4 border-b border-border pb-12 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{t("github_label")}</p>
            <p className="mt-4 inline-flex items-center gap-3 font-display text-[clamp(2.4rem,6vw,4.75rem)] leading-none tracking-[-0.025em] text-foreground transition-transform duration-500 group-hover:translate-x-2">
              <Github className="h-[0.8em] w-[0.8em]" aria-hidden />
              @{GITHUB_HANDLE}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors group-hover:text-primary">
            {t("github_cta")}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </span>
          <span className="sr-only">{t("opens_new_tab")}</span>
        </a>

        <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-8">
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
              <li>
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary"
                >
                  <Linkedin className="h-4 w-4" aria-hidden /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 break-all text-foreground transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden /> {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-16 border-t border-border pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.fullName}
        </p>
      </div>
    </footer>
  );
}
