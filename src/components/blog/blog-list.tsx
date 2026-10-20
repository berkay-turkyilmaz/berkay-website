"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export type BlogListPost = {
  id: string;
  slug: string;
  category: string;
  categoryLabel: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  readTime: string;
};

/** Filterable editorial post list. Data is prepared on the server; this only filters. */
export function BlogList({
  posts,
  categories,
  labels,
}: {
  posts: BlogListPost[];
  categories: { id: string; label: string }[];
  labels: { all: string; search: string; empty: string };
}) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (!q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q))
    );
  }, [posts, category, query]);

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label={labels.all}>
          {[{ id: "all", label: labels.all }, ...categories].map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={category === c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors duration-300",
                category === c.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <label className="relative block md:w-72">
          <span className="sr-only">{labels.search}</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.search}
            className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground" role="status">
          {labels.empty}
        </p>
      ) : (
        <ul>
          {visible.map((post) => (
            <li key={post.id}>
              <Link
                href={`/blog/${post.slug}` as "/blog"}
                className="group grid gap-3 border-b border-border py-8 transition-colors hover:bg-secondary/40 md:grid-cols-12 md:items-baseline md:gap-8"
              >
                <div className="md:col-span-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{post.dateLabel}</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-primary">{post.categoryLabel}</p>
                </div>
                <div className="md:col-span-8">
                  <h2 className="font-display text-3xl leading-snug text-foreground transition-transform duration-500 group-hover:translate-x-1 sm:text-4xl">
                    {post.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{post.excerpt}</p>
                </div>
                <div className="flex items-center justify-between gap-4 md:col-span-2 md:justify-end">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{post.readTime}</span>
                  <ArrowUpRight
                    className="h-5 w-5 text-muted-foreground transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
