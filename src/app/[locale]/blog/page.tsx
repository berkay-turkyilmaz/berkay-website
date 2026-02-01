"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl"; // useLocale eklendi
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { Search, Calendar, Clock, ArrowRight, Filter, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogHub() {
  const t = useTranslations("BlogHub");
  const locale = useLocale(); // Mevcut dili al (tr veya en)
  const isTr = locale === "tr";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // --- MOCK BLOG DATA (Dile Göre Dinamik) ---
  const ALL_POSTS = [
    {
      id: 1,
      title: isTr ? "Next.js 15 ve Modern Portfolyo Mimarisi" : "Next.js 15 & Modern Portfolio Architecture",
      excerpt: isTr 
        ? "Tailwind v4, i18n ve Server Actions kullanarak global standartlarda bir yazılım portfolyosu nasıl hazırlanır?" 
        : "How to build a global standard software portfolio using Tailwind v4, i18n, and Server Actions?",
      date: "31 Jan 2026",
      readTime: "8 min",
      slug: "nextjs-portfolio-guide",
      category: "architecture",
      hasAudio: true
    },
    {
      id: 2,
      title: isTr ? "Yapay Zeka Destekli Otomasyonlar" : "AI-Powered Automations",
      excerpt: isTr 
        ? "n8n ve Google Gemini kullanarak iş süreçlerini nasıl otomatize edebilirsiniz?" 
        : "How to automate business processes using n8n and Google Gemini?",
      date: "28 Jan 2026",
      readTime: "5 min",
      slug: "ai-automation-guide",
      category: "ai",
      hasAudio: false
    },
  ];

  // --- FİLTRELEME MANTIĞI ---
  const filteredPosts = ALL_POSTS.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "architecture", "ai", "automation"];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 font-sans">
      {/* Header Fixed */}
      <div className="fixed top-0 left-0 w-full z-[100]">
        <Header />
      </div>
      
      <main className="container mx-auto px-6 py-32 md:py-40">
        
        {/* --- BAŞLIK ALANI --- */}
        <header className="max-w-3xl mb-16 space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.9]"
          >
            {t("title")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl"
          >
            {t("description")}
          </motion.p>
        </header>

        {/* --- KONTROL PANELİ (ARA & FİLTRELE) --- */}
        <div className="flex flex-col md:flex-row gap-6 mb-16 items-center justify-between sticky top-24 z-40 bg-background/80 backdrop-blur-xl p-4 -mx-4 rounded-3xl border border-transparent md:border-border/40 transition-all">
          
          {/* Arama Kutusu */}
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder={t("search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-secondary/30 border-border/50 rounded-xl focus-visible:ring-primary/20 transition-all hover:bg-secondary/50"
            />
          </div>

          {/* Kategori Filtreleri */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            <Filter className="w-4 h-4 text-muted-foreground mr-2 shrink-0 hidden md:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border cursor-pointer ${
                  selectedCategory === cat 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                  : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>
        </div>

        {/* --- YAZI LİSTESİ --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <article className="flex flex-col h-full p-8 rounded-[2rem] bg-card/50 border border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden cursor-pointer">
                      
                      {/* Üst Bilgi */}
                      <div className="flex justify-between items-start mb-6">
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[10px] tracking-widest uppercase px-3 font-bold">
                          {t(`categories.${post.category}`)}
                        </Badge>
                        {post.hasAudio && (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider" title="Sesli Makale">
                            <Headphones className="w-3 h-3" />
                            <span className="hidden sm:inline">Audio</span>
                          </div>
                        )}
                      </div>

                      {/* İçerik */}
                      <div className="flex-1 space-y-4">
                        <h3 className="text-2xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-3 leading-relaxed text-sm font-light">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Alt Bilgi */}
                      <footer className="mt-8 pt-6 border-t border-border/30 flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        <div className="flex gap-4 font-mono">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {post.date}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                           <ArrowRight className="w-4 h-4" />
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
                className="col-span-full py-32 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-secondary/30 rounded-full flex items-center justify-center mx-auto text-4xl">
                    🔍
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">Sonuç Bulunamadı</h3>
                    <p className="text-muted-foreground">{t("no_results")}</p>
                </div>
                <button 
                    onClick={() => {setSearchQuery(""); setSelectedCategory("all")}}
                    className="text-sm font-bold text-primary hover:underline cursor-pointer"
                >
                    Filtreleri Temizle
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