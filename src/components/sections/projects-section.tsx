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
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS, type ProjectStatus } from "@/data/projects";

// ─── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProjectStatus }) {
  const t = useTranslations("ProjectsPage");

  const config = {
    live: {
      icon: (
        <span className="relative flex h-2 w-2 mr-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      ),
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
  index: number;
  size?: "large" | "normal";
}

function ProjectCard({ project, index, size = "normal" }: ProjectCardProps) {
  const t = useTranslations("ProjectsPage");

  const isInternal =
    project.link && (project.link.startsWith("/") || project.link.startsWith("#"));

  const cardContent = (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 h-full flex flex-col cursor-pointer"
    >
      {/* Visual gradient header */}
      <div
        className={`relative bg-gradient-to-br ${project.gradient} overflow-hidden flex-shrink-0`}
        style={{ height: size === "large" ? "200px" : "160px" }}
      >
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Tech chips floated on gradient */}
        <div className="absolute inset-0 flex items-center justify-center p-5">
          <div className="flex flex-wrap gap-2 justify-center">
            {project.tech.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/30 text-white/80 backdrop-blur-sm border border-white/10"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/30 text-white/60 backdrop-blur-sm border border-white/10">
                +{project.tech.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Year badge */}
        <div className="absolute top-3 left-4">
          <span className="text-[10px] font-bold tabular-nums text-white/50">
            {project.year}
          </span>
        </div>

        {/* Arrow icon on hover */}
        <div className="absolute top-3 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
          {isInternal ? (
            <ArrowUpRight className={`w-4 h-4 ${project.accentClass}`} />
          ) : (
            <ExternalLink className={`w-4 h-4 ${project.accentClass}`} />
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 gap-4">
        {/* Status */}
        <StatusBadge status={project.status} />

        {/* Title + description */}
        <div className="flex-1 space-y-2">
          <h3
            className={`font-bold text-foreground group-hover:text-primary transition-colors leading-tight ${
              size === "large" ? "text-xl sm:text-2xl" : "text-lg"
            }`}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(t as any)(project.titleKey)}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(t as any)(project.descriptionKey)}
          </p>
        </div>

        {/* Case study link */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link href={`/projects/${project.slug}` as any}>
            <span className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group/cs">
              Case study
              <ArrowRight className="w-3 h-3 group-hover/cs:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {project.link && (
            <>
              {isInternal ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <Link href={project.link as any}>
                  <button
                    type="button"
                    className={`p-2 hover:bg-primary/10 rounded-xl transition-all duration-200 ${project.accentClass} shrink-0`}
                    aria-label={t("view_project")}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              ) : (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 hover:bg-primary/10 rounded-xl transition-all duration-200 ${project.accentClass} shrink-0`}
                  aria-label={t("view_project")}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </motion.article>
  );

  return cardContent;
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

  const featuredFiltered = filtered.filter((p) => p.featured);
  const nonFeaturedFiltered = filtered.filter((p) => !p.featured);

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
        <div className="space-y-5">
          {/* Featured: first one large, rest normal in a row */}
          {featuredFiltered.length > 0 && (
            <motion.div
              key={`featured-${filter}`}
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {featuredFiltered.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  size={i === 0 ? "large" : "normal"}
                  index={i}
                />
              ))}
            </motion.div>
          )}

          {/* Non-featured: smaller grid */}
          {nonFeaturedFiltered.length > 0 && (
            <motion.div
              key={`regular-${filter}`}
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {nonFeaturedFiltered.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={featuredFiltered.length + i}
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
