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

const linkClass = "text-muted-foreground transition-colors hover:text-foreground";

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");

  return (
    <footer className="w-full border-t border-border">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <SiteLogo />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("tagline")}</p>
        </div>

        <nav aria-label={t("pages")}>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm md:max-w-md md:justify-end">
            {PAGES.map((p) => (
              <li key={p.key}>
                <Link href={p.href} className={linkClass}>
                  {tNav(p.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <li>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-primary"
            >
              <Github className="h-4 w-4" aria-hidden /> @{GITHUB_HANDLE}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">{t("opens_new_tab")}</span>
            </a>
          </li>
          <li>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 ${linkClass}`}
            >
              <Linkedin className="h-4 w-4" aria-hidden /> LinkedIn
            </a>
          </li>
          <li>
            <a href={`mailto:${siteConfig.email}`} className={`inline-flex items-center gap-1.5 ${linkClass}`}>
              <Mail className="h-4 w-4" aria-hidden /> {t("email")}
            </a>
          </li>
        </ul>
      </div>

      <div className="mx-auto w-full max-w-[1200px] border-t border-border px-5 py-4 text-xs text-muted-foreground sm:px-8">
        © {new Date().getFullYear()} {siteConfig.fullName}
      </div>
    </footer>
  );
}
