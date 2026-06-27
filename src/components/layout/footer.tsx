"use client";

import { Github, Linkedin, Mail, Cpu } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { SiteLogo } from "@/components/layout/site-logo";
import { siteConfig } from "@/data/site-config";

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");

  const siteLinks = [
    { label: tNav("home"),     href: "/" },
    { label: tNav("about"),    href: "/about" },
    { label: tNav("projects"), href: "/projects" },
    { label: tNav("blog"),     href: "/blog" },
    { label: tNav("lab"),      href: "/ai-lab" },
    { label: tNav("resume"),   href: "/resume" },
    { label: tNav("contact"),  href: "/contact" },
  ];

  const socialLinks = [
    { icon: Github,   href: siteConfig.github,               label: "GitHub" },
    { icon: Linkedin, href: siteConfig.linkedin,             label: "LinkedIn" },
    { icon: Mail,     href: `mailto:${siteConfig.email}`,    label: "Email" },
  ];

  return (
    <footer className="w-full border-t border-border/40 bg-background">
      {/* Dekoratif üst çizgi */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-16">
        {/* ── Ana Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">

          {/* Sütun 1: Marka */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <SiteLogo />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t("description")}
            </p>
            {/* Sosyal ikonlar */}
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-border/50 bg-secondary/30 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Sütun 2: Sistem Haritası */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/60">
              {t("explore")}
            </h4>
            <nav className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {siteLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground font-medium hover:text-primary transition-colors duration-150 truncate"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Sütun 3: İletişim */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/60">
              {t("stay_connected")}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("project_idea")}{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-primary font-semibold hover:underline underline-offset-2 break-all"
              >
                {siteConfig.email}
              </a>
            </p>
          </div>
        </div>

        {/* ── Alt Bar ── */}
        <div className="mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
            <Cpu className="h-3 w-3 text-primary/70 shrink-0" />
            <span>{t("powered_by")}</span>
            <span className="text-primary/70">{t("stack_label")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
