"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { currentFocus } from "@/data/current-focus";
import { ArrowRight, Hammer, Briefcase, Search } from "lucide-react";

const STATUS_CONFIG = {
  building: {
    badgeKey: "badge" as const,
    icon: Hammer,
    dotColor: "bg-emerald-500",
    pingColor: "bg-emerald-400",
    badgeCls: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/8",
  },
  consulting: {
    badgeKey: "badge_consulting" as const,
    icon: Briefcase,
    dotColor: "bg-blue-500",
    pingColor: "bg-blue-400",
    badgeCls: "border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/8",
  },
  "open-to-work": {
    badgeKey: "badge_open" as const,
    icon: Search,
    dotColor: "bg-amber-500",
    pingColor: "bg-amber-400",
    badgeCls: "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/8",
  },
};

export function CurrentFocusWidget() {
  const t = useTranslations("CurrentFocus");
  const config = STATUS_CONFIG[currentFocus.status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-card border border-border/60 rounded-2xl p-5 sm:p-6 space-y-4"
    >
      {/* Header row */}
      <div className="flex items-center gap-3">
        {/* Animated status dot */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.pingColor} opacity-75`}
          />
          <span
            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.dotColor}`}
          />
        </span>

        {/* Badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.badgeCls}`}
        >
          <Icon className="w-3 h-3" />
          {t(config.badgeKey)}
        </span>

        {/* Since */}
        <span className="ml-auto text-[11px] text-muted-foreground/50 font-mono">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(t as any)(currentFocus.sinceKey)}
        </span>
      </div>

      {/* Project + description */}
      <div className="space-y-1.5">
        <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">
          {t("building_label")}
        </p>
        <h3 className="text-base font-bold text-foreground">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(t as any)(currentFocus.projectKey)}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(t as any)(currentFocus.descriptionKey)}
        </p>
      </div>

      {/* Available for + CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2 border-t border-border/30">
        <div className="flex-1 space-y-1.5">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
            {t("available_for_title")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {currentFocus.availableForKeys.map((key) => (
              <span
                key={key}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-secondary border border-border/50 text-muted-foreground font-medium"
              >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(t as any)(key)}
              </span>
            ))}
          </div>
        </div>

        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors shrink-0 group"
        >
          {t("cta")}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
