"use client";

import { useState } from "react";
import { useTranslations } from "next-intl"; 
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { Search, Calendar, Clock, ArrowRight, Filter, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BLOG_POSTS } from "@/lib/blog/posts";

export default function Blog() {
  const t = useTranslations("BlogHub");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const title = t(`posts.${post.id}.title`).toLowerCase();
    const excerpt = t(`posts.${post.id}.excerpt`).toLowerCase();
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = title.includes(query) || excerpt.includes(query);
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "architecture", "ai", "automation"];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 font-sans">
      {/* Header Fixed Hatası Düzeltmesi (Fazladan div kaldırıldı) */}
      <Header />
      
      <main className="container mx-auto px-6 py-32 md:py-40">
        
        <header className="max-w-3xl mb-16 space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground leading-[1.05]"
          >
            {t("title")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl text-balance"
          >
            {t("description")}
          </motion.p>
        </header>

        <div className="flex flex-col md:flex-row gap-6 mb-16 items-center justify-between sticky top-24 z-40 bg-background/80 backdrop-blur-xl py-4 -mx-4 px-4 rounded-3xl border-b border-border/10">
          
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder={t("search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 bg-secondary/30 border-transparent ring-1 ring-border/10 rounded-2xl focus-visible:ring-primary/30 transition-all hover:bg-secondary/50 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar mask-fade-edges">
            <Filter className="w-4 h-4 text-muted-foreground mr-2 shrink-0 hidden md:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className={`px-5 py-2.5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap shadow-sm ring-1 ${
                  selectedCategory === cat 
                  ? "bg-primary text-primary-foreground ring-primary shadow-primary/20" 
                  : "bg-card text-muted-foreground ring-border/10 hover:ring-border/30 hover:text-foreground"
                }`}
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block h-full">
                    <article className="flex flex-col h-full p-6 sm:p-8 rounded-[2rem] bg-card shadow-sm ring-1 ring-border/10 hover:ring-primary/30 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                      
                      <div className="flex justify-between items-start mb-6">
                        <Badge variant="secondary" className="bg-secondary text-foreground ring-1 ring-border/10 text-[10px] tracking-widest uppercase px-3 py-1 font-bold">
                          {t(`categories.${post.category}`)}
                        </Badge>
                        
                        {post.hasAudio && (
                          <div 
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider ring-1 ring-green-500/20" 
                            title={t("audio_article")}
                          >
                            <Headphones className="w-3 h-3" />
                            {/* Anahtar "audio_label" olarak düzeltildi */}
                            <span className="hidden sm:inline">{t("audio_label")}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-4">
                        <h3 className="text-2xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                          {t(`posts.${post.id}.title`)}
                        </h3>
                        <p className="text-muted-foreground line-clamp-3 leading-relaxed text-sm font-medium">
                          {t(`posts.${post.id}.excerpt`)}
                        </p>
                      </div>

                      {/* uppercase sınıfı kaldırıldı, MİN/JAN hatası giderildi.
                          Tarih ve süre bilgileri JSON'dan (t('posts.X.date')) çekiliyor. */}
                      <footer className="mt-8 pt-6 border-t border-border/20 flex items-center justify-between text-[13px] font-semibold text-muted-foreground tracking-wide">
                        <div className="flex gap-4 font-mono">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {t(`posts.${post.id}.date`)}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {t(`posts.${post.id}.read_time`)}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm">
                           <ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-300" />
                        </div>
                      </footer>
                    </article>
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="col-span-full py-24 sm:py-32 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner ring-1 ring-border/10">
                  🔍
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">{t("empty_title")}</h3>
                    <p className="text-muted-foreground font-medium">{t("no_results")}</p>
                </div>
                <button 
                    onClick={() => {setSearchQuery(""); setSelectedCategory("all")}}
                    className="text-sm font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                >
                    {t("clear_filters")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}