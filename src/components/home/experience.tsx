import { getTranslations } from "next-intl/server";
import { RESUME_EXPERIENCE } from "@/data/resume";
import { SKILL_CATEGORIES } from "@/data/skills";
import { SectionHeading } from "./section-heading";

const SIDE_STACK = ["Next.js", "TypeScript", "Tailwind CSS", "n8n", "Groq", "Supabase", "Vercel"];

export async function Experience() {
  const t = await getTranslations("Home.experience");
  const tr = await getTranslations("ResumePage");
  const tSkills = await getTranslations("AboutPage.skills");

  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 md:py-32">
        <SectionHeading id="experience-title" eyebrow={t("eyebrow")} title={t("title")} />

        <div className="mt-14 grid gap-16 md:mt-20 md:grid-cols-12 md:gap-8">
          <ol className="md:col-span-7">
            {RESUME_EXPERIENCE.map((job) => (
              <li key={job.id} className="reveal border-t border-border py-8 first:border-t-0 first:pt-0">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {tr(job.periodKey)}
                </p>
                <h3 className="mt-3 font-display text-3xl leading-tight text-foreground sm:text-4xl">
                  {tr(job.roleKey)}
                </h3>
                <p className="mt-1 text-base text-primary">{tr(job.companyKey)}</p>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {tr(job.descKey)}
                </p>
                <ul className="mt-4 max-w-xl space-y-2 text-sm leading-relaxed text-foreground/85 sm:text-base">
                  {job.bulletKeys.map((key) => (
                    <li key={key} className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-3 before:bg-primary">
                      {tr(key)}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <div className="reveal md:col-span-4 md:col-start-9">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {t("toolbox")}
            </h3>
            <div className="mt-6 space-y-8">
              {SKILL_CATEGORIES.map((cat) => (
                <div key={cat.id}>
                  <p className="text-sm font-medium text-foreground">{tSkills(cat.labelKey)}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <li key={skill} className="rounded-full border border-border px-3 py-1 text-[13px] text-foreground/85">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div>
                <p className="text-sm font-medium text-foreground">{t("side_stack")}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {SIDE_STACK.map((skill) => (
                    <li key={skill} className="rounded-full bg-secondary px-3 py-1 text-[13px] text-foreground/85">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
