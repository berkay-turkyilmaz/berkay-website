import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SKILL_CATEGORIES } from "@/data/skills";
import { RESUME_EXPERIENCE, RESUME_PROJECTS } from "@/data/resume";
import { ResumeActions } from "@/components/features/resume/resume-actions";
import { siteConfig } from "@/data/site-config";

const label = "font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground";

export default async function ResumePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ResumePage" });
  const tSkills = await getTranslations({ locale, namespace: "AboutPage.skills" });

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 print:bg-white print:text-black">
      <div className="print:hidden">
        <Header />
      </div>

      <main id="main" className="mx-auto w-full max-w-[1100px] px-5 pb-24 pt-28 sm:px-8 md:pt-36 print:max-w-none print:p-0">
        <div className="rise flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={label}>{t("badge")}</p>
            <h1 className="mt-4 font-display text-[clamp(2.8rem,7vw,5.5rem)] leading-[1] tracking-[-0.03em]">
              {t("title")}
            </h1>
            <p className="mt-3 text-lg text-primary">{t("subtitle")}</p>
          </div>
          <ResumeActions printLabel={t("print_btn")} downloadLabel={t("download_btn")} email={siteConfig.email} />
        </div>

        <div className="mt-14 grid gap-12 border-t border-border pt-10 md:grid-cols-[260px_1fr] md:gap-16 print:mt-6 print:gap-8">
          <aside className="space-y-9">
            <div>
              <h2 className={label}>{t("contact_title")}</h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-2.5 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden /> {t("location")}
                </li>
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2.5 break-all text-foreground transition-colors hover:text-primary">
                    <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden /> {siteConfig.email}
                  </a>
                </li>
                <li>
                  <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-foreground transition-colors hover:text-primary">
                    <Github className="h-3.5 w-3.5 shrink-0" aria-hidden /> github.com/berkay-turkyilmaz
                  </a>
                </li>
                <li>
                  <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-foreground transition-colors hover:text-primary">
                    <Linkedin className="h-3.5 w-3.5 shrink-0" aria-hidden /> linkedin.com/in/berkay-turkyilmaz
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className={label}>{t("skills_title")}</h2>
              <div className="mt-4 space-y-5">
                {SKILL_CATEGORIES.map((cat) => (
                  <div key={cat.id}>
                    <p className="text-sm font-medium text-foreground">{tSkills(cat.labelKey)}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{cat.skills.join(", ")}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className={label}>{t("language_title")}</h2>
              <p className="mt-4 text-sm text-muted-foreground">{t("language_value")}</p>
            </div>

            <div>
              <h2 className={label}>{t("education_title")}</h2>
              <p className="mt-4 text-sm font-medium text-foreground">{t("edu_1_degree")}</p>
              <p className="text-sm text-muted-foreground">{t("edu_1_school")}</p>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">{t("edu_1_period")}</p>
            </div>
          </aside>

          <div className="space-y-14">
            <section aria-labelledby="cv-summary">
              <h2 id="cv-summary" className={label}>{t("summary_title")}</h2>
              <p className="mt-4 text-lg leading-[1.7] text-foreground/90">{t("summary")}</p>
            </section>

            <section aria-labelledby="cv-exp">
              <h2 id="cv-exp" className={label}>{t("experience_title")}</h2>
              <ol className="mt-6 space-y-10">
                {RESUME_EXPERIENCE.map((exp) => (
                  <li key={exp.id} className="border-t border-border pt-6">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                      <h3 className="font-display text-2xl text-foreground sm:text-3xl">{t(exp.roleKey)}</h3>
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{t(exp.periodKey)}</span>
                    </div>
                    <p className="mt-1 text-primary">{t(exp.companyKey)}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{t(exp.descKey)}</p>
                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-foreground/85 sm:text-base">
                      {exp.bulletKeys.map((key) => (
                        <li key={key} className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-3 before:bg-primary">
                          {t(key)}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="cv-projects">
              <h2 id="cv-projects" className={label}>{t("projects_title")}</h2>
              <ul className="mt-6 space-y-8">
                {RESUME_PROJECTS.map((p) => (
                  <li key={p.id} className="border-t border-border pt-6">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                      <h3 className="font-display text-2xl text-foreground sm:text-3xl">{t(p.titleKey)}</h3>
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{t(p.periodKey)}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{t(p.descKey)}</p>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary">
                        {p.url.replace("https://", "")}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
