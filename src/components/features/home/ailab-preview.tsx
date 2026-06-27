"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import N8NCanvas from "@/components/features/home/n8n-canvas";

export function AiLabPreview() {
  const t = useTranslations("HomePage");

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/90">
            {t("sections.lab_label")}
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-[2rem] md:leading-tight">
            {t("ai_lab.title")}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px] sm:leading-relaxed">
            {t("ai_lab.description")}
          </p>
          <p className="text-xs font-medium tracking-wide text-muted-foreground/70">
            {t("ai_lab.subline")}
          </p>
        </div>
        <Link
          href="/ai-lab"
          className="group inline-flex items-center gap-2 self-start rounded-full border border-border/60 bg-background px-5 py-2.5 text-sm font-bold text-foreground shadow-sm transition-all hover:border-primary/25 hover:bg-secondary/40 md:self-auto"
        >
          {t("cta_lab")}
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-secondary/20 to-background shadow-lg shadow-black/5 ring-1 ring-border/30"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border/40 bg-secondary/20 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/70 sm:text-[11px]">
              {t("automation.system_active")}
            </span>
          </div>
          <span className="rounded-full border border-border/40 bg-background/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {t("ai_lab.tag")}
          </span>
        </div>
        <div className="relative h-[340px] w-full overflow-hidden bg-[#030712] sm:h-[420px] md:h-[480px]">
          <div
            className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,transparent_0%,transparent_85%,rgba(3,7,18,0.4)_100%)]"
            aria-hidden
          />
          <N8NCanvas />
        </div>
      </motion.div>
    </section>
  );
}
