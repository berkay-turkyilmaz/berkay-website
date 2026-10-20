import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactBand } from "@/components/home/contact-band";
import { ScopedIntl } from "@/lib/i18n/scoped-intl";
import { ShareArticleButton } from "@/components/features/blog/share-article-button";
import { AudioPlayer } from "@/components/features/blog/audio-player";
import { Link, routing } from "@/i18n/routing";
import { JsonLd, blogPostingJsonLd } from "@/lib/seo/json-ld";
import { createPageMetadata, localePath } from "@/lib/seo/page-metadata";
import { getBlogPostContent } from "@/lib/blog/content";
import { BLOG_POSTS, getBlogPostMetaBySlug, getBlogPostSlugs } from "@/lib/blog/posts";

export function generateStaticParams() {
  return getBlogPostSlugs().flatMap((slug) => routing.locales.map((locale) => ({ slug, locale })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const meta = getBlogPostMetaBySlug(slug);
  if (!meta) return {};
  const content = getBlogPostContent(slug, locale);
  return createPageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: content?.title ?? "",
    description: content?.excerpt ?? "",
  });
}

export default async function BlogDetail({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const meta = getBlogPostMetaBySlug(slug);
  const post = meta ? getBlogPostContent(slug, locale) : null;
  if (!post || !meta) notFound();

  const t = await getTranslations("BlogDetail");
  const tHub = await getTranslations("BlogHub");
  const cleanText = post.content.replace(/<[^>]*>/g, "");

  const index = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const next = BLOG_POSTS[(index + 1) % BLOG_POSTS.length];

  const date = new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(post.date));

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20">
      <JsonLd
        data={blogPostingJsonLd({
          title: post.title,
          description: post.excerpt,
          url: localePath(locale, `/blog/${slug}`),
          datePublished: post.date,
        })}
      />
      <Header />
      <main id="main">
        <article>
          <header className="mx-auto w-full max-w-[860px] px-5 pb-12 pt-28 sm:px-8 md:pt-36">
            <div className="rise flex items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                {t("back_to_blog")}
              </Link>
              <ShareArticleButton title={post.title} label={t("share")} copiedLabel={t("share_copied")} />
            </div>

            <p
              className="rise mt-10 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
              style={{ "--d": 1 } as React.CSSProperties}
            >
              <span className="text-primary">{tHub(`categories.${meta.category}`)}</span>
              <span className="mx-2" aria-hidden>
                /
              </span>
              <time dateTime={post.date}>{date}</time>
              <span className="mx-2" aria-hidden>
                /
              </span>
              {post.readTime}
            </p>

            <h1
              className="rise mt-6 font-display text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.04] tracking-[-0.025em] text-foreground text-balance"
              style={{ "--d": 2 } as React.CSSProperties}
            >
              {post.title}
            </h1>
            <p
              className="rise mt-7 text-lg leading-relaxed text-muted-foreground sm:text-xl"
              style={{ "--d": 3 } as React.CSSProperties}
            >
              {post.excerpt}
            </p>

            {post.hasAudio && (
              <div className="rise mt-10" style={{ "--d": 4 } as React.CSSProperties}>
                <Suspense fallback={<div className="h-40 animate-pulse rounded-[6px] bg-secondary" />}>
                  <ScopedIntl namespaces={["BlogDetail"]}>
                    <AudioPlayer title={post.title} text={cleanText} />
                  </ScopedIntl>
                </Suspense>
              </div>
            )}
          </header>

          <div className="mx-auto w-full max-w-[860px] px-5 pb-24 sm:px-8">
            <div className="article" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </article>

        <section className="border-t border-border">
          <Link
            href={`/blog/${next.slug}` as "/blog"}
            className="group mx-auto block w-full max-w-[1200px] px-5 py-16 sm:px-8 md:py-24"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{t("next_post")}</p>
            <p className="mt-4 flex items-baseline justify-between gap-6 font-display text-[clamp(2rem,5vw,4rem)] leading-tight tracking-[-0.02em] text-foreground transition-transform duration-500 group-hover:translate-x-2">
              {getBlogPostContent(next.slug, locale)?.title}
              <ArrowUpRight
                className="h-8 w-8 shrink-0 text-muted-foreground transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary sm:h-10 sm:w-10"
                aria-hidden
              />
            </p>
          </Link>
        </section>

        <ContactBand />
      </main>
      <Footer />
    </div>
  );
}
