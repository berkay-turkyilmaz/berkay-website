"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowUpRight, Bot, Globe, Layers } from "lucide-react";

const CARD_KEYS = ["1", "2", "3"] as const;
const ICONS = [Globe, Layers, Bot] as const;
const HREFS = ["/projects", "/projects", "/ai-lab"] as const;
const SPANS = [
  "lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
] as const;

export function ProjectsPreview() {
  const t = useTranslations("HomePage");
  const tFeat = useTranslations("HomePage.featured");

  return (
    <section id="projects" className="scroll-mt-28">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {t("sections.projects_label")}
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {t("sections.projects_preview_title")}
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("sections.projects_preview_desc")}
          </p>
        </div>
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 self-start rounded-lg border border-border/50 bg-secondary/30 px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-secondary/60 md:self-auto"
        >
          {t("sections.view_all_work")}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:auto-rows-[minmax(140px,auto)]">
        {CARD_KEYS.map((key, index) => {
          const Icon = ICONS[index];
          const isLarge = index === 0;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className={SPANS[index]}
            >
              <Link
                href={HREFS[index]}
                className="group relative flex h-full min-h-[200px] flex-col justify-between overflow-hidden rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 sm:p-7 lg:min-h-[240px]"
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:opacity-100 opacity-60"
                  aria-hidden
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary/80 text-foreground ring-1 ring-border/50 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="relative mt-6 space-y-2">
                  <h3
                    className={`font-bold tracking-tight text-foreground ${isLarge ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}
                  >
                    {tFeat(`${key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {tFeat(`${key}.description`)}
                  </p>
                  <p className="pt-1 text-[11px] font-semibold uppercase tracking-widest text-primary/80">
                    {tFeat(`${key}.stack`)}
                  </p>
                </div>
                <div className="relative mt-4 flex items-center gap-1 text-xs font-bold text-muted-foreground transition-colors group-hover:text-foreground">
                  {tFeat("explore")}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
