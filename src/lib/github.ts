import { siteConfig } from "@/data/site-config";

export const GITHUB_USER = "berkay-turkyilmaz";

export type GitHubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  homepage: string | null;
};

export type GitHubProfile = {
  public_repos: number;
  followers: number;
  html_url: string;
};

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(6_000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getGitHubProfile(): Promise<GitHubProfile | null> {
  return getJson<GitHubProfile>(`https://api.github.com/users/${GITHUB_USER}`);
}

/** Public, non-fork repositories, most recently pushed first (this site pinned first). */
export async function getGitHubRepos(limit = 6): Promise<GitHubRepo[]> {
  const repos = await getJson<GitHubRepo[]>(
    `https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=30`
  );
  if (!repos) return [];
  const own = repos.filter((r) => !r.fork);
  own.sort((a, b) => {
    if (a.name === "berkay-website") return -1;
    if (b.name === "berkay-website") return 1;
    return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
  });
  return own.slice(0, limit);
}

/** Last-12-months contribution calendar from a public mirror; null when unavailable. */
export async function getContributions(): Promise<{ total: number; days: ContributionDay[] } | null> {
  const data = await getJson<{ total: { lastYear: number }; contributions: ContributionDay[] }>(
    `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`
  );
  if (!data) return null;
  return { total: data.total.lastYear, days: data.contributions };
}

export const GITHUB_URL = siteConfig.github;
