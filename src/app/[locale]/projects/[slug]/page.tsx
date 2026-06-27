import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProjectBySlug, getProjectSlugs } from "@/data/projects";
import { routing } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Zap,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getProjectSlugs().flatMap((slug) =>
    routing.locales.map((locale) => ({ slug, locale }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const t = await getTranslations({ locale, namespace: "ProjectsPage" });
  const title = (t as Parameters<typeof t>[0] extends string ? typeof t : never)(project.titleKey as Parameters<typeof t>[0]);

  return createPageMetadata({
    locale,
    path: `/projects/${slug}`,
    title: `${title} | BERKAY`,
    description: (t as Parameters<typeof t>[0] extends string ? typeof t : never)(project.descriptionKey as Parameters<typeof t>[0]),
  });
}

const statusConfig = {
  live: {
    icon: Zap,
    cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  completed: {
    icon: CheckCircle2,
    cls: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  "in-progress": {
    icon: Clock,
    cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
};

export default async function ProjectCaseStudy({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: "ProjectsPage" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pt = (key: string) => (t as any)(key);

  const title = pt(project.titleKey);
  const description = pt(project.descriptionKey);
  const tagline = pt(project.taglineKey);

  // Map project id to short key used in i18n
  const i18nKeyMap: Record<string, string> = {
    "bex-assistant": "bex",
    "portfolio-infra": "portfolio",
    "booking-crm": "booking",
    "saas-starter": "saas",
    "pdf-analyzer": "pdf",
  };
  const i18nKey = i18nKeyMap[project.id] ?? project.id;

  const StatusIcon = statusConfig[project.status].icon;
  const statusCls = statusConfig[project.status].cls;

  const isInternal = project.link?.startsWith("/");

  // Find adjacent projects for navigation
  const slugs = getProjectSlugs();
  const currentIndex = slugs.indexOf(slug);
  const nextSlug = slugs[(currentIndex + 1) % slugs.length];
  const nextProject = getProjectBySlug(nextSlug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* ── Hero ── */}
      <section
        className={`relative pt-32 pb-20 md:pt-44 md:pb-28 bg-gradient-to-b ${project.gradient} overflow-hidden`}
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.03),transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          {/* Back link */}
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            {pt("case_study.back_to_projects")}
          </Link>

          <div className="max-w-4xl space-y-6">
            {/* Status + year badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${statusCls}`}
              >
                <StatusIcon className="w-3 h-3" />
                {pt(`status_${project.status.replace("-", "_")}`)}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-secondary/60 text-muted-foreground border border-border/50">
                {project.year}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter leading-[1.08] text-foreground text-balance">
              {title}
            </h1>

            {/* Tagline */}
            <p className={`text-xl md:text-2xl font-semibold ${project.accentClass}`}>
              {tagline}
            </p>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl font-medium">
              {description}
            </p>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2 pt-2">
              {project.tech.map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="text-xs font-semibold px-3 py-1 border-border/60 text-muted-foreground"
                >
                  {tech}
                </Badge>
              ))}
            </div>

            {/* CTA links */}
            {project.link && (
              <div className="flex flex-wrap gap-3 pt-2">
                {isInternal ? (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  <Link href={project.link as any}>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
                    >
                      {pt("case_study.view_demo")}
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </Link>
                ) : (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
                  >
                    {pt("case_study.view_live")}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Case Study Body ── */}
      <main className="container mx-auto px-6 lg:px-12 py-20 max-w-4xl">
        <div className="grid gap-12">

          {/* Challenge */}
          <CaseStudySection
            number="01"
            label={pt("case_study.challenge_label")}
            accentClass={project.accentClass}
          >
            <p className="text-lg text-foreground/90 leading-relaxed font-medium">
              {pt(`projects.${i18nKey}.challenge`)}
            </p>
          </CaseStudySection>

          {/* Solution */}
          <CaseStudySection
            number="02"
            label={pt("case_study.solution_label")}
            accentClass={project.accentClass}
          >
            <p className="text-lg text-foreground/90 leading-relaxed font-medium">
              {pt(`projects.${i18nKey}.solution`)}
            </p>
          </CaseStudySection>

          {/* Outcome */}
          <CaseStudySection
            number="03"
            label={pt("case_study.outcome_label")}
            accentClass={project.accentClass}
          >
            <p className="text-lg text-foreground/90 leading-relaxed font-medium">
              {pt(`projects.${i18nKey}.outcome`)}
            </p>
          </CaseStudySection>

          {/* Tech decisions */}
          <CaseStudySection
            number="04"
            label={pt("case_study.tech_decision_label")}
            accentClass={project.accentClass}
          >
            <p className="text-lg text-foreground/90 leading-relaxed font-medium">
              {pt(`projects.${i18nKey}.tech_decision`)}
            </p>

            {/* Tech stack grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {project.tech.map((tech) => (
                <div
                  key={tech}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-border/60 text-sm font-semibold text-foreground/80"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${project.accentClass.replace("text-", "bg-")}`} />
                  {tech}
                </div>
              ))}
            </div>
          </CaseStudySection>
        </div>

        {/* ── Contact CTA ── */}
        <div className="mt-20 rounded-3xl bg-card border border-border p-8 md:p-12 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {pt("case_study.contact_cta_title")}
          </h2>
          <p className="text-muted-foreground font-medium max-w-lg mx-auto">
            {pt("case_study.contact_cta_desc")}
          </p>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link href={"/contact" as any}>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
            >
              {pt("case_study.contact_cta_btn")}
            </button>
          </Link>
        </div>

        {/* ── Next Project ── */}
        {nextProject && nextProject.id !== project.id && (
          <div className="mt-10">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Link href={`/projects/${nextProject.slug}` as any} className="group block">
              <div className="flex items-center justify-between p-6 rounded-2xl border border-border hover:border-primary/40 hover:bg-card transition-all duration-300">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {pt("case_study.next_project")}
                  </p>
                  <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {pt(nextProject.titleKey)}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function CaseStudySection({
  number,
  label,
  accentClass,
  children,
}: {
  number: string;
  label: string;
  accentClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid md:grid-cols-[200px_1fr] gap-6 md:gap-12">
      <div className="flex md:flex-col gap-3 md:gap-2">
        <span className={`text-4xl font-black tabular-nums opacity-20 ${accentClass}`}>
          {number}
        </span>
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mt-1">
          {label}
        </h2>
      </div>
      <div className="pt-1">{children}</div>
    </div>
  );
}
