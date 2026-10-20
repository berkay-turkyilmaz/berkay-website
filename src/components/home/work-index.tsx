import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { WORK } from "@/data/work";
import { ProjectCard } from "@/components/work/project-card";
import { SectionHeading } from "./section-heading";

export async function WorkIndex() {
  const t = await getTranslations("Home.work");
  const tw = await getTranslations("Work");
  const featured = WORK.filter((w) => w.featured);
  const minor = WORK.filter((w) => !w.featured);

  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 md:py-32">
        <SectionHeading id="work-title" eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2 md:gap-6">
          {featured.map((item, i) => (
            <ProjectCard key={item.id} item={item} index={i} />
          ))}
        </div>

        <div className="mt-16">
          <h3 className="reveal font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{t("more")}</h3>
          <ul className="mt-5 border-b border-border">
            {minor.map((item) => (
              <li key={item.id} className="reveal">
                <Link href={`/projects/${item.slug}` as "/projects"} className="block">
                  <div className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-t border-border py-6 transition-colors hover:bg-secondary/40 sm:grid-cols-[1fr_2fr_auto] sm:gap-8">
                    <h4 className="font-display text-2xl text-foreground sm:text-3xl">{tw(`items.${item.id}.title`)}</h4>
                    <p className="order-3 col-span-2 text-sm leading-relaxed text-muted-foreground sm:order-none sm:col-span-1 sm:text-base">
                      {tw(`items.${item.id}.summary`)}
                    </p>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      {item.tags.join(" · ")}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex justify-end">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-sm font-medium text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:decoration-primary"
            >
              {t("all")}
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
