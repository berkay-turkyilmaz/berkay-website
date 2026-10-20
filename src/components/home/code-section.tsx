import { ArrowUpRight, Github, Star } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { getContributions, getGitHubProfile, getGitHubRepos, GITHUB_URL, GITHUB_USER, type ContributionDay } from "@/lib/github";
import { SectionHeading } from "./section-heading";
import { SpotlightCard } from "./spotlight-card";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  "C#": "#178600",
  ASP: "#6a40fd",
  "ASP.NET": "#6a40fd",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572a5",
};

const MIN_CONTRIBUTIONS_FOR_HEATMAP = 60;

function weeksOf(days: ContributionDay[]): ContributionDay[][] {
  const weeks: ContributionDay[][] = [];
  let current: ContributionDay[] = [];
  days.forEach((d, i) => {
    const dow = new Date(d.date).getUTCDay();
    if (i === 0 && dow !== 0) current = Array.from({ length: dow }, () => ({ date: "", count: 0, level: 0 }) as ContributionDay);
    current.push(d);
    if (current.length === 7) {
      weeks.push(current);
      current = [];
    }
  });
  if (current.length) weeks.push(current);
  return weeks;
}

function relative(iso: string, locale: string): string {
  const rtf = new Intl.RelativeTimeFormat(locale === "tr" ? "tr" : "en", { numeric: "auto" });
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return rtf.format(0, "day");
  if (days < 31) return rtf.format(-days, "day");
  const months = Math.round(days / 30);
  if (months < 12) return rtf.format(-months, "month");
  return rtf.format(-Math.round(months / 12), "year");
}

const LEVEL_CLASS = [
  "bg-secondary",
  "bg-primary/25",
  "bg-primary/45",
  "bg-primary/70",
  "bg-primary",
] as const;

/** Public GitHub work: repositories as the main content, a contribution calendar only when there is something to show. */
export async function CodeSection() {
  const t = await getTranslations("Home.code");
  const locale = await getLocale();
  const [profile, repos, contributions] = await Promise.all([getGitHubProfile(), getGitHubRepos(6), getContributions()]);

  const showHeatmap = contributions !== null && contributions.total >= MIN_CONTRIBUTIONS_FOR_HEATMAP;
  const weeks = showHeatmap && contributions ? weeksOf(contributions.days) : [];

  return (
    <section id="code" aria-labelledby="code-title" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 md:py-32">
        <SectionHeading
          id="code-title"
          eyebrow={t("eyebrow")}
          title={t.rich("title", { em: (c) => <em className="italic text-primary">{c}</em> })}
          intro={t("intro")}
        />

        <div className="reveal mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 md:mt-16">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 text-lg text-foreground"
          >
            <Github className="h-5 w-5" aria-hidden />
            <span className="link-draw">@{GITHUB_USER}</span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            <span className="sr-only">{t("opens_new_tab")}</span>
          </a>
          {profile && (
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {t("repo_count", { n: profile.public_repos })}
            </p>
          )}
        </div>

        {repos.length > 0 && (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
              <li key={repo.name} className="reveal">
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="block h-full rounded-[6px] outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background">
                  <SpotlightCard className="group flex h-full min-h-[200px] flex-col justify-between rounded-[6px] border border-border bg-card p-6 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-foreground/40">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="break-words font-mono text-[15px] font-medium text-foreground">{repo.name}</h3>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {repo.description ?? t("fallback_description")}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      {repo.language && (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: LANGUAGE_COLORS[repo.language] ?? "hsl(var(--muted-foreground))" }} aria-hidden />
                          {repo.language}
                        </span>
                      )}
                      {repo.stargazers_count > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3 w-3" aria-hidden />
                          {repo.stargazers_count}
                        </span>
                      )}
                      <span className="ml-auto normal-case tracking-normal">{relative(repo.pushed_at, locale)}</span>
                    </div>
                  </SpotlightCard>
                </a>
              </li>
            ))}
          </ul>
        )}

        {showHeatmap && contributions && (
          <div className="reveal mt-14 overflow-x-auto pb-2">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {t("contributions", { n: contributions.total })}
            </p>
            <div className="flex w-max gap-[3px]" role="img" aria-label={t("contributions", { n: contributions.total })}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => (
                    <span
                      key={di}
                      title={day.date ? `${day.date}: ${day.count}` : undefined}
                      className={`cell-in h-[11px] w-[11px] rounded-[2px] ${day.date ? LEVEL_CLASS[day.level] : "bg-transparent"}`}
                      style={{ "--c": wi } as React.CSSProperties}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
