"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { 
  ArrowRight, 
  ArrowUpRight, 
  Sparkles, 
  ChevronRight, 
  Clock,
  Tag,
  Code2,
  Cpu
} from "lucide-react";

// --- COMPONENTS ---
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import ContactForm from "@/components/forms/contact";
import N8NCanvas from "@/components/features/home/n8n-canvas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- MOCK DATA (Corporate & Senior Tone) ---
const LATEST_POSTS = [
  {
    id: 1,
    title: "Next.js 15 ve Mikro-Frontend Mimarisi",
    excerpt: "Server Actions, React Server Components ve Edge computing ile ölçeklenebilir kurumsal web mimarisi tasarımı.",
    date: "31 Oca 2026",
    readTime: "8 dk",
    slug: "nextjs-enterprise-architecture",
    category: "Architecture"
  },
  {
    id: 2,
    title: "İş Süreçlerinde LLM ve n8n Otomasyonu",
    excerpt: "Yerel yapay zeka modelleri ve webhook'lar kullanarak manuel veri akışlarını otonom sistemlere dönüştürme rehberi.",
    date: "28 Oca 2026",
    readTime: "6 dk",
    slug: "autonomous-workflows-n8n",
    category: "Automation"
  }
];

/**
 * Home Page Component
 * Enterprise-grade portfolio homepage with sophisticated animations and UX
 */
export default function Home() {
  const t = useTranslations("HomePage");
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.96]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -60]);

  const shouldAnimate = mounted && !prefersReducedMotion;
  const animationProps = shouldAnimate
    ? { style: { scale: heroScale, opacity: heroOpacity, y: heroY } }
    : {};

  return (
    <div 
      ref={containerRef} 
      className="relative bg-background min-h-screen selection:bg-primary/20 selection:text-primary font-sans"
    >
      <Header />

      {/* ============================================
          HERO SECTION - FIXED VIEWPORT
          Linear/Vercel inspired enterprise aesthetic
          ============================================ */}
      <motion.section
        {...animationProps}
        className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center px-6 z-0 overflow-hidden bg-background"
      >
        {/* Ambient Background Glow - High-end subtle lighting */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-primary/[0.04] dark:bg-primary/[0.08] rounded-full blur-[140px] pointer-events-none" 
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto text-center space-y-8">
          
          {/* Status Badge */}
          {mounted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-border/40 bg-secondary/20 backdrop-blur-xl shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-xs font-semibold tracking-widest uppercase text-foreground/80">
                  {t("badge") || "Available for New Opportunities"}
                </span>
              </div>
            </motion.div>
          )}

          {/* Main Headline - Text Balance & Tight Tracking for Premium Look */}
          {mounted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter text-foreground leading-[1.05] text-balance">
                {t("title") || "Mühendislik Odaklı Dijital Deneyimler"}
              </h1>
              <div className="h-[2px] w-16 bg-primary mx-auto rounded-full" />
            </motion.div>
          ) : (
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter text-foreground leading-[1.05] text-balance">
                {t("title")}
              </h1>
              <div className="h-[2px] w-16 bg-primary mx-auto rounded-full" />
            </div>
          )}

          {/* Subheadline - Technical & Precise */}
          {mounted ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground/90 font-medium max-w-2xl mx-auto leading-relaxed text-balance"
            >
              {t("description") || "Ölçeklenebilir frontend mimarileri, modern web standartları ve yapay zeka destekli otomasyon sistemleri inşa ediyorum."}
            </motion.p>
          ) : (
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground/90 font-medium max-w-2xl mx-auto leading-relaxed text-balance">
              {t("description")}
            </p>
          )}

          {/* Call-to-Action Buttons */}
          {mounted && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4"
            >
              <Link href="/projects">
                <Button 
                  size="lg" 
                  className="h-12 px-8 rounded-full font-bold shadow-[0_0_20px_rgba(var(--primary),0.2)] hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] transition-all active:scale-[0.98]"
                >
                  {t("cta_projects") || "Projeleri İncele"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <Link href="/ai-lab">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-12 px-8 rounded-full font-semibold bg-background/50 backdrop-blur-md border-border/50 hover:bg-secondary/50 text-foreground transition-all"
                >
                  <Cpu className="w-4 h-4 mr-2 text-muted-foreground" />
                  {t("cta_lab") || "AI Lab"}
                </Button>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Scroll Indicator */}
        {mounted && (
          <motion.div 
            animate={{ y: [0, 8, 0] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute bottom-12 opacity-40 hover:opacity-100 transition-opacity"
            aria-hidden="true"
          >
            <div className="w-6 h-10 rounded-full border-2 border-border/80 flex items-start justify-center p-1.5 backdrop-blur-sm">
              <div className="w-1.5 h-2.5 bg-foreground/60 rounded-full" />
            </div>
          </motion.div>
        )}
      </motion.section>

      {/* ============================================
          MAIN CONTENT AREA
          ============================================ */}
      <div className="relative z-10 mt-[100vh] bg-background">
        <div className="container mx-auto px-6 lg:px-12 xl:px-16">
          <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mb-24" />

          {/* ============================================
              PROJECTS SHOWCASE
              ============================================ */}
          <section id="projects" className="scroll-mt-32 mb-32">
            
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div className="space-y-4 max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                  {t("sections.projects_preview_title") || "Seçilmiş Çalışmalar"}
                </h2>
                <p className="text-muted-foreground/80 leading-relaxed font-medium md:text-lg">
                  {t("sections.projects_preview_desc") || "Modern iş gereksinimlerini karşılayan, performans odaklı ve ölçeklenebilir dijital ürün mimarileri."}
                </p>
              </div>
              
              <Link href="/projects" className="group inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors pb-2">
                {t("sections.view_all_work") || "Tümünü Gör"}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Featured Project Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <Link 
                  href="/projects" 
                  className="group block relative aspect-[4/3] bg-secondary/20 rounded-[2rem] border border-border/40 overflow-hidden hover:border-border/80 transition-all duration-500 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                    <div className="w-20 h-20 bg-background/50 backdrop-blur-xl border border-border/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                      <Code2 className="w-8 h-8 text-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground mb-3">
                      Enterprise SaaS Architecture
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground/80 uppercase tracking-widest">
                      Next.js 15 • TypeScript • Supabase
                    </p>
                  </div>
                </Link>
              </motion.div>

              {/* Code Preview Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="relative aspect-[4/3] bg-[#09090b] rounded-[2rem] border border-zinc-800/50 p-8 overflow-hidden shadow-2xl">
                  
                  {/* Terminal Header */}
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-zinc-800/50">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-zinc-500 font-mono font-medium">
                      ~/system/architecture.ts
                    </span>
                  </div>

                  {/* Code Content */}
                  <div className="font-mono text-[13px] leading-relaxed space-y-1 text-zinc-400">
                    <p><span className="text-purple-400 font-medium">export interface</span> <span className="text-blue-400">SystemConfig</span> {"{"}</p>
                    <p className="pl-6"><span className="text-zinc-300">core</span>: <span className="text-amber-300/90">"React Server Components"</span>;</p>
                    <p className="pl-6"><span className="text-zinc-300">styling</span>: <span className="text-amber-300/90">"TailwindCSS v4"</span>;</p>
                    <p className="pl-6"><span className="text-zinc-300">automation</span>: <span className="text-amber-300/90">"n8n Webhooks"</span>;</p>
                    <p className="pl-6"><span className="text-zinc-300">ai_integration</span>: <span className="text-amber-300/90">"Local LLM"</span>;</p>
                    <p>{"}"}</p>
                    <br/>
                    <p className="text-zinc-500">
                      <span className="text-zinc-600">//</span> İnovasyon ve ölçeklenebilirlik başlatılıyor...
                    </p>
                    {mounted && (
                      <motion.span 
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="inline-block w-2 h-4 bg-primary align-middle mt-2"
                      />
                    )}
                  </div>

                  <div className="absolute bottom-6 right-6">
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest bg-zinc-900/80 text-primary border-zinc-800 backdrop-blur-md">
                      Production Ready
                    </Badge>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ============================================
              AUTOMATION & AI LABORATORY
              ============================================ */}
          <section className="mb-32 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="relative rounded-[2rem] border border-border/40 bg-secondary/10 p-4 sm:p-6 overflow-hidden"
            >
              <div className="absolute top-8 left-8 z-10 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-xl border border-border/50 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-[10px] font-mono font-bold text-foreground/80 uppercase tracking-widest">
                  System Operational
                </span>
              </div>
              
              <div className="h-[450px] sm:h-[500px] w-full bg-background rounded-2xl overflow-hidden border border-border/30">
                <N8NCanvas />
              </div>
            </motion.div>

            {/* AI Lab CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link 
                href="/ai-lab" 
                className="group block relative overflow-hidden rounded-[2rem] bg-[#09090b] p-8 sm:p-12 border border-zinc-800/60 hover:border-zinc-700/80 transition-all duration-500"
              >
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity duration-700" aria-hidden="true" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                  <div className="space-y-5 max-w-xl">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-bold bg-zinc-900/80 text-zinc-400 border-zinc-800">
                      <Sparkles className="w-3 h-3 mr-1.5 text-primary" />
                      R&D Phase
                    </Badge>
                    
                    <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                      AI & Automation Lab
                    </h3>
                    
                    <p className="text-zinc-400 font-medium leading-relaxed text-balance">
                      Yerel LLM modelleri ve n8n ile kurgulanmış akıllı iş akışları, veri işleme botları ve otonom asistanların test ortamı.
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="h-14 w-14 rounded-full bg-zinc-800/80 border border-zinc-700/50 group-hover:bg-primary group-hover:border-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-xl">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </section>

          {/* ============================================
              BLOG / INSIGHTS
              ============================================ */}
          <section id="blog" className="scroll-mt-32 mb-32">
            
            <div className="flex items-end justify-between mb-10 pb-6 border-b border-border/40">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                  {t("blog_preview.title") || "Teknik Makaleler"}
                </h2>
                <p className="text-muted-foreground/80 font-medium">
                  {t("blog_preview.description") || "Yazılım mimarisi ve modern web teknolojileri üzerine derinlemesine analizler."}
                </p>
              </div>
              
              <Link 
                href="/blog" 
                className="hidden sm:flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group pb-1"
              >
                {t("blog_preview.view_all") || "Tümünü Oku"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-3">
              {LATEST_POSTS.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <article className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-5 sm:p-6 -mx-5 sm:-mx-6 rounded-2xl hover:bg-secondary/30 border border-transparent hover:border-border/50 transition-all duration-300">
                      
                      <div className="flex-1 space-y-2.5">
                        <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground/80 line-clamp-1 sm:line-clamp-none max-w-2xl">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground pt-1">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/50">
                            <Tag className="w-3 h-3 text-primary/70" />
                            {post.category}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTime}
                          </span>
                          <span className="opacity-40">•</span>
                          <span>{post.date}</span>
                        </div>
                      </div>

                      <ChevronRight className="hidden sm:block w-5 h-5 text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 sm:hidden text-center">
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 text-sm font-bold text-primary"
              >
                {t("blog_preview.view_all") || "Tümünü Oku"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* ============================================
              CONTACT FORM
              ============================================ */}
          <section id="contact" className="scroll-mt-32 mb-24">
            <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mb-20" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <ContactForm />
            </motion.div>
          </section>

        </div>
        <Footer />
      </div>
    </div>
  );
}