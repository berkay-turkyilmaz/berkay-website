import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactBand } from "@/components/home/contact-band";
import { Link, routing } from "@/i18n/routing";
import { WORK, getWorkBySlug, getWorkSlugs } from "@/data/work";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export function generateStaticParams() {
  return getWorkSlugs().flatMap((slug) => routing.locales.map((locale) => ({ slug, locale })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const item = getWorkBySlug(slug);
  if (!item) return {};
  const t = await getTranslations({ locale, namespace: "Work" });
  return createPageMetadata({
    locale,
    path: `/projects/${slug}`,
    title: t(`items.${item.id}.title`),
    description: t(`items.${item.id}.summary`),
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const item = getWorkBySlug(slug);
  if (!item) notFound();

  const t = await getTranslations("Work");
  const highlights = t.raw(`items.${item.id}.highlights`) as string[];
  const notes = t.raw(`items.${item.id}.notes`) as string[];
  const highlightsTitle = item.id === "meetora" ? t("items.meetora.highlights_title") : t("labels.highlights");

  const index = WORK.findIndex((w) => w.id === item.id);
  const next = WORK[(index + 1) % WORK.length];

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Header />
      <main id="main">
        <section aria-labelledby="project-title" className="mx-auto w-full max-w-[1200px] px-5 pb-12 pt-28 sm:px-8 md:pb-16 md:pt-36">
          <Link
            href="/projects"
            className="rise inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            {t("labels.back")}
          </Link>

          <p className="rise mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground" style={{ "--d": 1 } as React.CSSProperties}>
            {item.year} · {t(`kinds.${item.kind}`)}
          </p>
          <h1
            id="project-title"
            className="rise mt-5 font-display text-[clamp(3rem,8vw,6.5rem)] leading-[1] tracking-[-0.03em] text-foreground text-balance"
            style={{ "--d": 2 } as React.CSSProperties}
          >
            {t(`items.${item.id}.title`)}
          </h1>
          <p className="rise mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl" style={{ "--d": 3 } as React.CSSProperties}>
            {t(`items.${item.id}.summary`)}
          </p>

          <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ "--d": 4 } as React.CSSProperties}>
            {item.href ? (
              item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {t("labels.visit_external")}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  <span className="sr-only">{t("labels.opens_new_tab")}</span>
                </a>
              ) : (
                <Link
                  href={item.href as "/"}
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {t("labels.visit")}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </Link>
              )
            ) : (
              <p className="text-sm text-muted-foreground">{t("labels.no_public")}</p>
            )}
          </div>
        </section>

        {item.image && (
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <div className="reveal relative aspect-[2/1] overflow-hidden rounded-[6px] border border-border bg-secondary">
              <div className="absolute inset-x-0 top-0 z-10 flex h-8 items-center gap-1.5 border-b border-border bg-card/90 px-4 backdrop-blur" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
              </div>
              <Image
                src={item.image}
                alt={t(`items.${item.id}.image_alt`)}
                fill
                priority
                sizes="(min-width: 1200px) 1136px, 100vw"
                className="object-cover object-top pt-8"
              />
            </div>
          </div>
        )}

        <section className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 md:py-28">
          <div className="grid gap-14 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-8">
              <div className="reveal">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{t("labels.what")}</h2>
                <p className="mt-5 max-w-2xl font-display text-3xl leading-snug text-foreground sm:text-4xl">
                  {t(`items.${item.id}.what`)}
                </p>
              </div>

              <div className="reveal mt-16">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{highlightsTitle}</h2>
                <ul className="mt-5 divide-y divide-border border-y border-border">
                  {highlights.map((line, i) => (
                    <li key={line} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5">
                      <span className="font-display text-2xl italic text-primary">{i + 1}</span>
                      <p className="text-base leading-relaxed text-foreground/90 sm:text-lg">{line}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {notes.length > 0 && (
                <div className="reveal mt-16">
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{t("labels.notes")}</h2>
                  <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {notes.map((n) => (
                      <li key={n} className="relative pl-5 before:absolute before:left-0 before:top-[0.75em] before:h-px before:w-3 before:bg-primary">
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside className="reveal md:col-span-3 md:col-start-10">
              <dl className="space-y-6 border-t border-border pt-6 text-sm md:sticky md:top-28">
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{t("labels.type")}</dt>
                  <dd className="mt-2 text-foreground">{t(`kinds.${item.kind}`)}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{t("labels.year")}</dt>
                  <dd className="mt-2 text-foreground">{item.year}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{t("labels.stack")}</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-border px-3 py-1 text-[13px] text-foreground/85">
                        {tag}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section className="border-t border-border">
          <Link
            href={`/projects/${next.slug}` as "/projects"}
            className="group mx-auto block w-full max-w-[1200px] px-5 py-16 sm:px-8 md:py-24"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{t("labels.next")}</p>
            <p className="mt-4 flex items-baseline justify-between gap-6 font-display text-[clamp(2.4rem,6vw,5rem)] leading-none tracking-[-0.02em] text-foreground transition-transform duration-500 group-hover:translate-x-2">
              {t(`items.${next.id}.title`)}
              <ArrowUpRight className="h-8 w-8 shrink-0 text-muted-foreground transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary sm:h-12 sm:w-12" aria-hidden />
            </p>
          </Link>
        </section>

        <ContactBand />
      </main>
      <Footer />
    </div>
  );
}
