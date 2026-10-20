import { getLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/site-config";

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload?: {
    commits?: Array<{ message: string }>;
    ref_type?: string;
  };
}

const GITHUB_USER = "berkay-turkyilmaz";
const SHOWN_TYPES = ["PushEvent", "CreateEvent", "WatchEvent"];

async function fetchGitHubActivity(): Promise<GitHubEvent[]> {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=20`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return [];
    const data: GitHubEvent[] = await res.json();
    return data.filter((e) => SHOWN_TYPES.includes(e.type)).slice(0, 5);
  } catch {
    return [];
  }
}

function shorten(text: string, max = 64): string {
  const firstLine = text.split("\n")[0];
  return firstLine.length > max ? `${firstLine.slice(0, max - 1)}…` : firstLine;
}

/** Relative time ("3 hours ago"); falls back to a short date after a month. */
function relativeTime(iso: string, locale: string): string {
  const rtf = new Intl.RelativeTimeFormat(locale === "tr" ? "tr" : "en", { numeric: "auto" });
  const hours = Math.round((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (hours < 1) return rtf.format(0, "hour");
  if (hours < 24) return rtf.format(-hours, "hour");
  const days = Math.round(hours / 24);
  if (days < 31) return rtf.format(-days, "day");
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", { day: "numeric", month: "short" }).format(new Date(iso));
}

/** Recent public GitHub activity as a quiet editorial list. Hides itself when there is nothing to show. */
export async function GitHubActivity() {
  const events = await fetchGitHubActivity();
  if (events.length === 0) return null;

  const t = await getTranslations("Home.github");
  const locale = await getLocale();
  const ago = (iso: string) => relativeTime(iso, locale);

  const describe = (event: GitHubEvent) => {
    const repo = event.repo.name.split("/")[1] ?? event.repo.name;
    if (event.type === "PushEvent") {
      const msg = event.payload?.commits?.[0]?.message;
      return { repo, text: msg ? shorten(msg) : t("pushed") };
    }
    if (event.type === "CreateEvent") return { repo, text: t("created", { kind: event.payload?.ref_type ?? "repo" }) };
    return { repo, text: t("starred") };
  };

  return (
    <section aria-labelledby="github-title" className="border-t border-border">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 md:py-24">
        <div className="reveal grid gap-8 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-3">
            <h2
              id="github-title"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
            >
              {t("title")}
            </h2>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
            >
              @{GITHUB_USER}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">{t("opens_new_tab")}</span>
            </a>
          </div>
          <ul className="divide-y divide-border border-y border-border md:col-span-9">
            {events.map((event) => {
              const { repo, text } = describe(event);
              return (
                <li key={event.id} className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-4">
                  <p className="min-w-0 truncate text-sm text-foreground sm:text-base">
                    <span className="font-mono text-[13px] text-primary">{repo}</span>
                    <span className="mx-2 text-border" aria-hidden>
                      /
                    </span>
                    <span className="text-muted-foreground">{text}</span>
                  </p>
                  <time dateTime={event.created_at} className="font-mono text-[11px] text-muted-foreground">
                    {ago(event.created_at)}
                  </time>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
