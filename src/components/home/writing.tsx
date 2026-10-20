import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { getBlogPostContent } from "@/lib/blog/content";
import { SectionHeading } from "./section-heading";

export async function Writing() {
  const t = await getTranslations("Home.writing");
  const locale = await getLocale();

  const posts = BLOG_POSTS.slice(0, 4).map((post) => {
    const content = getBlogPostContent(post.slug, locale);
    return { ...post, title: content?.title ?? "", excerpt: content?.excerpt ?? "", date: content?.date, readTime: content?.readTime };
  });

  const formatDate = (iso?: string) =>
    iso
      ? new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", { month: "short", year: "numeric" }).format(
          new Date(iso)
        )
      : "";

  return (
    <section id="writing" aria-labelledby="writing-title" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 md:py-32">
        <SectionHeading id="writing-title" eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

        <ul className="mt-14 border-b border-border md:mt-20">
          {posts.map((post) => (
            <li key={post.id} className="reveal">
              <Link
                href={`/blog/${post.slug}` as "/blog"}
                className="group grid gap-3 border-t border-border py-7 transition-colors hover:bg-secondary/40 md:grid-cols-12 md:items-baseline md:gap-8 md:py-8"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground md:col-span-2">
                  {formatDate(post.date)}
                </p>
                <div className="md:col-span-8">
                  <h3 className="font-display text-2xl leading-snug text-foreground transition-transform duration-500 group-hover:translate-x-1 sm:text-3xl">
                    {post.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 md:col-span-2 md:justify-end">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {post.readTime}
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 text-muted-foreground transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-end">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:decoration-primary"
          >
            {t("all")}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
