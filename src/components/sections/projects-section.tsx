"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import {
  ArrowUpRight,
  Layers,
  CheckCircle2,
  Clock,
  Zap,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS, type ProjectStatus } from "@/data/projects";

// ─── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProjectStatus }) {
  const t = useTranslations("ProjectsPage");

  const config = {
    live: {
      icon: <span className="relative flex h-2 w-2 mr-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>,
      label: t("status_live"),
      cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    completed: {
      icon: <CheckCircle2 className="w-3 h-3 mr-1.5" />,
      label: t("status_completed"),
      cls: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    "in-progress": {
      icon: <Clock className="w-3 h-3 mr-1.5" />,
      label: t("status_in_progress"),
      cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
  };

  const { icon, label, cls } = config[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cls}`}
    >
      {icon}
      {label}
    </span>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: (typeof PROJECTS)[0];
  featured?: boolean;
  index: number;
}

function ProjectCard({ project, featured = false, index }: ProjectCardProps) {
  const t = useTranslations("ProjectsPage");

  const isInternal =
    project.link && (project.link.startsWith("/") || project.link.startsWith("#"));

  const LinkWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!project.link) return <>{children}</>;
    if (isInternal) {
      return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Link href={project.link as any}>
          {children}
        </Link>
      );
    }
    return (
      <a href={project.link} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 bg-primary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className={`p-6 sm:p-7 flex flex-col h-full ${featured ? "gap-5" : "gap-4"}`}>
        {/* Top row: status + link */}
        <div className="flex items-start justify-between gap-3">
          <StatusBadge status={project.status} />
          {project.link && (
            <LinkWrapper>
              <button
                type="button"
                className="p-2 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-xl transition-all duration-200 text-muted-foreground shrink-0 group/icon"
                aria-label={t("view_project")}
              >
                {isInternal ? (
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/icon:translate-x-0.5 group-hover/icon:-translate-y-0.5 transition-transform" />
                ) : (
                  <ExternalLink className="w-3.5 h-3.5 group-hover/icon:translate-x-0.5 group-hover/icon:-translate-y-0.5 transition-transform" />
                )}
              </button>
            </LinkWrapper>
          )}
        </div>

        {/* Title + description */}
        <div className="flex-1 space-y-2.5">
          <h3
            className={`font-bold text-foreground group-hover:text-primary transition-colors leading-tight ${
              featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
            }`}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(t as any)(project.titleKey)}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(t as any)(project.descriptionKey)}
          </p>
        </div>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {project.tech.map((tech) => (
            <Badge
              key={tech}
              variant="outline"
              className="text-[10px] font-semibold px-2 py-0.5 border-border/60 text-muted-foreground group-hover:border-primary/30 group-hover:text-primary/80 transition-colors"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

type FilterValue = "all" | ProjectStatus;

function FilterTabs({
  active,
  onChange,
  counts,
}: {
  active: FilterValue;
  onChange: (v: FilterValue) => void;
  counts: Record<FilterValue, number>;
}) {
  const t = useTranslations("ProjectsPage");

  const tabs: { value: FilterValue; label: string }[] = [
    { value: "all", label: t("filter_all") },
    { value: "live", label: t("filter_live") },
    { value: "completed", label: t("filter_completed") },
    { value: "in-progress", label: t("filter_in_progress") },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          aria-pressed={active === value}
          className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all duration-200 border ${
            active === value
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-card text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
          }`}
        >
          {label}
          <span
            className={`ml-1.5 text-[10px] tabular-nums ${
              active === value ? "opacity-70" : "opacity-40"
            }`}
          >
            {counts[value]}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProjectsSection() {
  const t = useTranslations("ProjectsPage");
  const [filter, setFilter] = useState<FilterValue>("all");

  const counts: Record<FilterValue, number> = {
    all: PROJECTS.length,
    live: PROJECTS.filter((p) => p.status === "live").length,
    completed: PROJECTS.filter((p) => p.status === "completed").length,
    "in-progress": PROJECTS.filter((p) => p.status === "in-progress").length,
  };

  const filtered =
    filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.status === filter);

  const featuredVisible = filtered.filter((p) => p.featured);
  const nonFeaturedVisible = filtered.filter((p) => !p.featured);

  return (
    <section className="space-y-8">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
          <Layers className="w-4 h-4 text-primary" />
          {t("badge")}
        </div>
        <FilterTabs active={filter} onChange={setFilter} counts={counts} />
      </div>

      <AnimatePresence mode="popLayout">
        <div className="space-y-4">
          {/* Featured row (2-column on md+) */}
          {featuredVisible.length > 0 && (
            <motion.div
              key={`featured-${filter}`}
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {featuredVisible.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  featured={false}
                  index={i}
                />
              ))}
            </motion.div>
          )}

          {/* Non-featured row (3-column on lg+) */}
          {nonFeaturedVisible.length > 0 && (
            <motion.div
              key={`regular-${filter}`}
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {nonFeaturedVisible.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={featuredVisible.length + i}
                />
              ))}
            </motion.div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center text-muted-foreground"
            >
              <Zap className="w-8 h-8 mx-auto mb-4 opacity-20" />
              <p className="font-medium">{t("empty")}</p>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </section>
  );
}
