import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, Share2, Eye } from "lucide-react";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AudioPlayer } from "@/components/features/blog/audio-player";
import { Suspense } from "react";
import { getBlogPostContent } from "@/lib/blog/content";
import { getBlogPostMetaBySlug } from "@/lib/blog/posts";

async function getBlogPost(slug: string, locale: string) {
  if (!getBlogPostMetaBySlug(slug)) return null;
  return getBlogPostContent(slug, locale);
}

// --- LOADING COMPONENT ---
function AudioPlayerSkeleton() {
  return (
    <div className="w-full h-48 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl animate-pulse" />
  );
}

// --- PAGE COMPONENT ---
export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  // Parallel data fetching
  const [post, t] = await Promise.all([
    getBlogPost(slug, locale),
    getTranslations({ locale, namespace: "BlogDetail" }),
  ]);

  if (!post) {
    notFound();
  }

  // Clean text for audio player
  const cleanText = post.content.replace(/<[^>]*>/g, "");

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      <main className="container mx-auto px-6 lg:px-12 pt-32 pb-24 max-w-4xl">
        {/* Navigation Bar */}
        <nav className="mb-12 flex items-center justify-between">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="p-2 rounded-full bg-secondary/50 group-hover:bg-secondary border border-transparent group-hover:border-border/50 transition-all">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </div>
            <span>{t("back_to_blog")}</span>
          </Link>

          <button
            className="p-2.5 rounded-full text-muted-foreground hover:bg-secondary hover:text-primary transition-all border border-transparent hover:border-border/50"
            title={t("share")}
            aria-label="Share article"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </nav>

        {/* Article Header */}
        <header className="space-y-8 mb-16 pb-12 border-b border-border/30">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4">
            <Badge
              variant="outline"
              className="rounded-lg px-4 py-1.5 text-[10px] uppercase tracking-widest border-primary/30 text-primary bg-primary/5 font-bold"
            >
              {post.category}
            </Badge>

            <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.date).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="opacity-50">•</span>
              <span className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime}
              </span>
              {post.views && (
                <>
                  <span className="opacity-50">•</span>
                  <span className="flex items-center gap-2">
                    <Eye className="h-3.5 w-3.5" />
                    {post.views.toLocaleString()}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] text-foreground">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg sm:text-xl text-muted-foreground font-normal leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>

          {/* Audio Player */}
          {post.hasAudio && (
            <Suspense fallback={<AudioPlayerSkeleton />}>
              <AudioPlayer title={post.title} text={cleanText} />
            </Suspense>
          )}
        </header>

        {/* Article Content */}
        <article
          className="prose prose-lg prose-zinc dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-24
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
            prose-p:leading-relaxed prose-p:text-foreground/90 prose-p:mb-6
            prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-a:transition-all
            prose-strong:text-foreground prose-strong:font-bold
            prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
            prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-2xl prose-pre:shadow-2xl
            prose-img:rounded-2xl prose-img:shadow-2xl prose-img:border prose-img:border-border/50
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
            prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6
            prose-li:mb-2
            prose-lead:text-xl prose-lead:text-muted-foreground prose-lead:font-normal prose-lead:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Article Footer / CTA (Optional) */}
        <div className="mt-20 pt-12 border-t border-border/30">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("enjoyed_article")}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:scale-105"
              >
                {t("read_more_articles")}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}