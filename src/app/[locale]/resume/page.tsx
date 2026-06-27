import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Link } from "@/i18n/routing";
import { SKILL_CATEGORIES } from "@/data/skills";
import { RESUME_EXPERIENCE, RESUME_PROJECTS } from "@/data/resume";
import { ResumeActions } from "@/components/features/resume/resume-actions";
import { siteConfig } from "@/data/site-config";
import {
  MapPin,
  Github,
  Mail,
  Linkedin,
  ExternalLink,
  Globe,
} from "lucide-react";

export default async function ResumePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ResumePage" });
  const tAbout = await getTranslations({ locale, namespace: "AboutPage" });

  const skillCategoryLabels: Record<string, string> = {
    languages: tAbout("skills.languages"),
    libraries: tAbout("skills.libraries"),
    tools: tAbout("skills.tools"),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container mx-auto px-6 lg:px-12 pt-36 pb-24 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary font-mono">
            {t("badge")}
          </p>
          <ResumeActions
            printLabel={t("print_btn")}
            downloadLabel={t("download_btn")}
            email={siteConfig.email}
          />
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-16">
          {/* ── Left Column ── */}
          <aside className="space-y-8">
            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold tracking-tighter text-foreground">
                {t("title")}
              </h1>
              <p className="text-sm font-semibold text-primary leading-relaxed">
                {t("subtitle")}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {t("location")}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                {t("contact_title")}
              </h3>
              <div className="space-y-2">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Mail className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
                  {siteConfig.email}
                </a>
                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Github className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
                  github.com/berkay-turkyilmaz
                  <ExternalLink className="w-3 h-3 opacity-40" />
                </a>
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Linkedin className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
                  linkedin.com/in/berkay-turkyilmaz
                  <ExternalLink className="w-3 h-3 opacity-40" />
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                {t("language_title")}
              </h3>
              <p className="text-sm text-muted-foreground">{t("language_value")}</p>
            </div>
          </aside>

          {/* ── Right Column ── */}
          <div className="space-y-12">
            {/* Summary */}
            <section className="space-y-3">
              <h2 className="text-lg font-extrabold text-foreground tracking-tight border-b border-border pb-3">
                {t("summary_title")}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("summary")}
              </p>
            </section>

            {/* Experience */}
            <section className="space-y-8">
              <h2 className="text-lg font-extrabold text-foreground tracking-tight border-b border-border pb-3">
                {t("experience_title")}
              </h2>

              {RESUME_EXPERIENCE.map((exp) => (
                <div key={exp.id} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="font-bold text-foreground">{t(exp.roleKey)}</h3>
                    <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                      {t(exp.periodKey)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-primary">{t(exp.companyKey)}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    {t(exp.descKey)}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {exp.bulletKeys.map((bulletKey) => (
                      <li
                        key={bulletKey}
                        className="flex items-start gap-2.5 text-sm text-foreground/80"
                      >
                        <span className="text-primary mt-0.5 shrink-0 font-bold">→</span>
                        {t(bulletKey)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {/* Skills */}
            <section className="space-y-5">
              <h2 className="text-lg font-extrabold text-foreground tracking-tight border-b border-border pb-3">
                {t("skills_title")}
              </h2>
              <div className="space-y-4">
                {SKILL_CATEGORIES.map((cat) => (
                  <div key={cat.id} className="space-y-2">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      {skillCategoryLabels[cat.id] ?? cat.labelKey}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 text-[12px] font-semibold bg-secondary/60 text-foreground/80 rounded-lg border border-border/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="space-y-4">
              <h2 className="text-lg font-extrabold text-foreground tracking-tight border-b border-border pb-3">
                {t("education_title")}
              </h2>
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h3 className="font-bold text-foreground">{t("edu_1_degree")}</h3>
                  <span className="text-xs font-mono text-muted-foreground">
                    {t("edu_1_period")}
                  </span>
                </div>
                <p className="text-sm font-semibold text-primary">{t("edu_1_school")}</p>
              </div>
            </section>

            {/* Software Projects */}
            <section className="space-y-6">
              <h2 className="text-lg font-extrabold text-foreground tracking-tight border-b border-border pb-3">
                {t("projects_title")}
              </h2>
              <div className="space-y-6">
                {RESUME_PROJECTS.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="font-bold text-foreground flex items-center gap-2 flex-wrap">
                        {t(project.titleKey)}
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                          >
                            <Globe className="w-3 h-3" />
                            {project.url.replace("https://", "")}
                          </a>
                        )}
                      </h3>
                      <span className="text-xs font-mono text-muted-foreground">
                        {t(project.periodKey)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(project.descKey)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="mt-16 rounded-3xl bg-primary/5 border border-primary/20 p-8 text-center space-y-4 print:hidden">
          <p className="font-semibold text-foreground">{t("cta_text")}</p>
          <Link href="/contact">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-primary/90 transition-all hover:scale-105"
            >
              {t("cta_btn")}
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
