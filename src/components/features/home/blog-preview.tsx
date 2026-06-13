"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog/posts";

export function BlogPreview() {
  const t = useTranslations("HomePage");
  const tHub = useTranslations("BlogHub");

  return (
    <section id="blog" className="scroll-mt-28">
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {t("sections.blog_label")}
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {t("blog_preview.title")}
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            {t("blog_preview.description")}
          </p>
        </div>
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 self-start text-sm font-bold text-muted-foreground transition-colors hover:text-foreground sm:self-auto"
        >
          {t("blog_preview.view_all")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {BLOG_POSTS.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Link href={`/blog/${post.slug}`} className="group block h-full">
              <article className="flex h-full flex-col rounded-xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-md sm:p-6">
                <span className="mb-3 inline-flex w-fit rounded-md bg-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                  {tHub(`categories.${post.category}`)}
                </span>
                <h3 className="text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {tHub(`posts.${post.id}.title`)}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {tHub(`posts.${post.id}.excerpt`)}
                </p>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/40 pt-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {tHub(`posts.${post.id}.read_time`)}
                  </span>
                  <span>{tHub(`posts.${post.id}.date`)}</span>
                </div>
              </article>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
