"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Tag, ChevronRight } from "lucide-react";

const LATEST_POSTS = [
  { id: 1, title: "Next.js 15 ve Mikro-Frontend Mimarisi", excerpt: "Server Actions, React Server Components ve Edge computing ile ölçeklenebilir kurumsal web mimarisi tasarımı.", date: "31 Oca 2026", readTime: "8 dk", slug: "nextjs-enterprise-architecture", category: "Architecture" },
  { id: 2, title: "İş Süreçlerinde LLM ve n8n Otomasyonu", excerpt: "Yerel yapay zeka modelleri ve webhook'lar kullanarak manuel veri akışlarını otonom sistemlere dönüştürme rehberi.", date: "28 Oca 2026", readTime: "6 dk", slug: "autonomous-workflows-n8n", category: "Automation" }
];

export function BlogPreview() {
  const t = useTranslations("HomePage");

  return (
    <section id="blog" className="scroll-mt-32">
      <div className="flex items-end justify-between mb-10 pb-6 border-b border-border/40">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">{t("blog_preview.title") || "Teknik Makaleler"}</h2>
          <p className="text-muted-foreground/80 font-medium">{t("blog_preview.description")}</p>
        </div>
        <Link href="/blog" className="hidden sm:flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group pb-1">
          {t("blog_preview.view_all") || "Tümünü Oku"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="space-y-3">
        {LATEST_POSTS.map((post, index) => (
          <motion.div key={post.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.4, delay: index * 0.1 }}>
            <Link href={`/blog/${post.slug}`} className="group block">
              <article className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-5 sm:p-6 -mx-5 sm:-mx-6 rounded-2xl hover:bg-secondary/50 border border-transparent hover:border-border transition-all duration-300">
                <div className="flex-1 space-y-2.5">
                  <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">{post.title}</h3>
                  <p className="text-sm text-muted-foreground/80 line-clamp-1 sm:line-clamp-none max-w-2xl">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground pt-1">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary"><Tag className="w-3 h-3 text-primary" />{post.category}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                    <span className="opacity-40">•</span><span>{post.date}</span>
                  </div>
                </div>
                <ChevronRight className="hidden sm:block w-5 h-5 text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0" />
              </article>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}