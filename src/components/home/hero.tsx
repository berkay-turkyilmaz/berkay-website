import Image from "next/image";
import { ArrowDown, ArrowUpRight, Github } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getGitHubProfile, GITHUB_URL } from "@/lib/github";
import { LocalTime } from "./local-time";

const LIVE_PROJECTS = [
  { label: "Meetora", href: "https://getmeetora.com/", external: true },
  { label: "AI Lab", href: "/ai-lab/chat", external: false },
  { label: "EnglishPath", href: "/ai-lab/english-path", external: false },
] as const;

/**
 * The first screen. One idea: a specific person, a specific city, real work.
 * Pure server component; only the clock hydrates.
 */
export async function Hero() {
  const t = await getTranslations("Home.hero");
  const locale = await getLocale();
  const profile = await getGitHubProfile();

  return (
    <section
      aria-labelledby="hero-title"
      className="relative mx-auto w-full max-w-[1200px] px-5 pb-16 pt-28 sm:px-8 md:pb-24 md:pt-36"
    >
      <div className="grid gap-12 md:grid-cols-12 md:gap-8 lg:gap-14">
        <div className="md:col-span-7 lg:col-span-7">
          <p
            className="rise flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
            style={{ "--d": 0 } as React.CSSProperties}
          >
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              {t("eyebrow")}
            </span>
            <span className="text-border" aria-hidden>
              /
            </span>
            <span>
              {t("local_time")} <LocalTime locale={locale} />
            </span>
          </p>

          <h1
            id="hero-title"
            className="mt-6 font-display text-[clamp(2.6rem,6.4vw,5.5rem)] leading-[1.02] tracking-[-0.025em] text-foreground text-balance"
          >
            {t.rich("title", {
              em: (chunks) => <em className="italic text-primary">{chunks}</em>,
            })}
          </h1>

          <p
            className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {t("lead")}
          </p>

          <div
            className="rise mt-9 flex flex-wrap items-center gap-3"
            style={{ "--d": 3 } as React.CSSProperties}
          >
            <a
              href="#work"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
            >
              {t("cta_work")}
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-12 items-center gap-2 rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors duration-300 hover:border-foreground"
            >
              <Github className="h-4 w-4" aria-hidden />
              {t("cta_contact")}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </a>
            <Link
              href="/resume"
              className="inline-flex h-12 items-center px-3 text-sm font-medium text-muted-foreground underline decoration-border underline-offset-[6px] transition-colors hover:text-foreground hover:decoration-foreground"
            >
              {t("cta_cv")}
            </Link>
          </div>

          <dl
            className="rise mt-14 grid gap-6 border-t border-border pt-6 sm:grid-cols-3"
            style={{ "--d": 4 } as React.CSSProperties}
          >
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {t("fact_now_label")}
              </dt>
              <dd className="mt-2 text-sm leading-snug text-foreground">{t("fact_now_value")}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {t("fact_live_label")}
              </dt>
              <dd className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-foreground">
                {LIVE_PROJECTS.map((p) =>
                  p.external ? (
                    <a
                      key={p.label}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
                    >
                      {p.label}
                      <ArrowUpRight className="h-3 w-3" aria-hidden />
                    </a>
                  ) : (
                    <Link
                      key={p.label}
                      href={p.href}
                      className="underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
                    >
                      {p.label}
                    </Link>
                  )
                )}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {t("fact_code_label")}
              </dt>
              <dd className="mt-2 text-sm leading-snug text-foreground">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
                >
                  {profile ? t("fact_code_value", { n: profile.public_repos }) : "GitHub"}
                  <ArrowUpRight className="h-3 w-3" aria-hidden />
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <figure className="relative md:col-span-5 md:col-start-8 lg:col-span-5">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-secondary md:sticky md:top-28 md:aspect-[4/5.4]">
            <div className="parallax absolute inset-0">
            <Image
              src="/images/bosphorus-fog.jpg"
              alt={t("photo_alt")}
              fill
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
              className="photo-drift object-cover object-[50%_62%]"
            />
            </div>
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
              aria-hidden
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
