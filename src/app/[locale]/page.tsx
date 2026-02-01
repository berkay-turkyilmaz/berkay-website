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
  Tag
} from "lucide-react";

// --- COMPONENTS ---
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import ContactForm from "@/components/forms/contact";
import N8NCanvas from "@/components/features/home/n8n-canvas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- MOCK DATA ---
const LATEST_POSTS = [
  {
    id: 1,
    title: "Next.js 15 Mimarisi",
    excerpt: "Server Actions ve Tailwind v4 ile modern portfolyo rehberi.",
    date: "31 Jan 2026",
    readTime: "8 min",
    slug: "nextjs-portfolio-guide",
    category: "Architecture"
  },
  {
    id: 2,
    title: "AI & n8n Otomasyonu",
    excerpt: "İş süreçlerini yerel LLM modelleriyle otomatize edin.",
    date: "28 Jan 2026",
    readTime: "5 min",
    slug: "ai-automation-guide",
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
  
  // Hydration safe mounting state
  const [mounted, setMounted] = useState(false);

  // Ensure scroll position is reset on mount
  useEffect(() => {
    setMounted(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Parallax scroll tracking - ONLY after mount
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
   //  layoutEffect: false, // Prevent SSR issues
  });

  // Subtle hero animations - professional and refined
  const heroScale = useTransform(
    scrollYProgress, 
    [0, 0.15], 
    [1, 0.98]
  );
  const heroOpacity = useTransform(
    scrollYProgress, 
    [0, 0.12], 
    [1, 0]
  );
  const heroY = useTransform(
    scrollYProgress, 
    [0, 0.15], 
    [0, -40]
  );

  // Disable animations if user prefers reduced motion OR not mounted
  const shouldAnimate = mounted && !prefersReducedMotion;
  const animationProps = shouldAnimate
    ? { style: { scale: heroScale, opacity: heroOpacity, y: heroY } }
    : {};

  return (
    <div 
      ref={containerRef} 
      className="relative bg-background min-h-screen selection:bg-primary/20"
    >
      
      {/* ============================================
          HEADER NAVIGATION
          ============================================ */}
      <Header />

      {/* ============================================
          HERO SECTION - FIXED VIEWPORT
          Clean, corporate aesthetic inspired by Linear/Apple
          ============================================ */}
      <motion.section
        {...animationProps}
        className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center px-6 z-0 overflow-hidden bg-background"
      >
        {/* Ambient Background Glow - Subtle and Professional */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/[0.03] dark:bg-primary/[0.08] rounded-full blur-[120px] pointer-events-none" 
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto text-center space-y-8">
          
          {/* Status Badge - Minimalist Design */}
          {mounted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/40 bg-secondary/30 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-xs font-medium tracking-wide text-muted-foreground">
                  {t("badge")}
                </span>
              </div>
            </motion.div>
          )}

          {/* Main Headline - Bold, Clean Typography */}
          {mounted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1]">
                {t("title")}
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-primary/0 via-primary to-primary/0 mx-auto" />
            </motion.div>
          )}

          {/* Fallback for non-mounted state */}
          {!mounted && (
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1]">
                {t("title")}
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-primary/0 via-primary to-primary/0 mx-auto" />
            </div>
          )}

          {/* Subheadline - Clear Value Proposition */}
          {mounted && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground font-normal max-w-2xl mx-auto leading-relaxed"
            >
              {t("description")}
            </motion.p>
          )}

          {!mounted && (
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-normal max-w-2xl mx-auto leading-relaxed">
              {t("description")}
            </p>
          )}

          {/* Call-to-Action Buttons - Clear Hierarchy */}
          {mounted && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-6"
            >
              <Link href="/projects">
                <Button 
                  size="lg" 
                  className="h-12 px-8 rounded-full font-semibold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all hover:scale-[1.02]"
                >
                  {t("cta_projects")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <Link href="/ai-lab">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="h-12 px-8 rounded-full font-medium text-muted-foreground hover:text-foreground"
                >
                  {t("cta_lab")}
                </Button>
              </Link>
            </motion.div>
          )}

          {!mounted && (
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
              <Link href="/projects">
                <Button 
                  size="lg" 
                  className="h-12 px-8 rounded-full font-semibold shadow-lg shadow-primary/10"
                >
                  {t("cta_projects")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <Link href="/ai-lab">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="h-12 px-8 rounded-full font-medium text-muted-foreground"
                >
                  {t("cta_lab")}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Scroll Indicator - Subtle Visual Cue */}
        {mounted && (
          <motion.div 
            animate={{ y: [0, 8, 0] }} 
            transition={{ 
              repeat: Infinity, 
              duration: 2, 
              ease: "easeInOut" 
            }}
            className="absolute bottom-12 opacity-30 hover:opacity-60 transition-opacity"
            aria-hidden="true"
          >
            <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-foreground/40 rounded-full" />
            </div>
          </motion.div>
        )}
      </motion.section>

      {/* ============================================
          MAIN CONTENT AREA
          Scrollable content with refined spacing
          ============================================ */}
      <div className="relative z-10 mt-[100vh] bg-background">
        
        {/* Content Container - Consistent Spacing System */}
        <div className="container mx-auto px-6 lg:px-12 xl:px-16">
          
          {/* Visual Separator */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-24" />

          {/* ============================================
              PROJECTS SHOWCASE
              Clean grid layout with interactive cards
              ============================================ */}
          <section id="projects" className="scroll-mt-24 mb-32">
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div className="space-y-3 max-w-xl">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  {t("sections.projects_preview_title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("sections.projects_preview_desc")}
                </p>
              </div>
              
              <Link href="/projects" className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                {t("sections.view_all_work")}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* Project Cards Grid */}
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
                  className="group block relative aspect-[4/3] bg-secondary/30 rounded-2xl border border-border/50 overflow-hidden hover:border-border transition-all hover:shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-2xl font-bold text-primary">S</span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      SaaS Starter Kit
                    </h3>
                    <p className="text-sm text-muted-foreground">
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
                <div className="relative aspect-[4/3] bg-[#0a0a0a] dark:bg-[#0a0a0a] rounded-2xl border border-border/30 p-6 overflow-hidden">
                  
                  {/* Terminal Header */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-xs text-zinc-600 ml-2 font-mono">
                      ~/projects
                    </span>
                  </div>

                  {/* Code Content */}
                  <div className="font-mono text-xs space-y-2 text-zinc-400">
                    <p>
                      <span className="text-purple-400">const</span>{" "}
                      <span className="text-blue-400">stack</span> = {"{"}
                    </p>
                    <p className="pl-4">
                      <span className="text-green-400">framework</span>: 
                      <span className="text-amber-300"> "Next.js 15"</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-green-400">automation</span>: 
                      <span className="text-amber-300"> "n8n"</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-green-400">ai</span>: 
                      <span className="text-amber-300"> "Local LLM"</span>
                    </p>
                    <p>{"}"}</p>
                    <p className="pt-4 text-zinc-600">
                      <span className="text-zinc-500">//</span> Building scalable solutions...
                    </p>
                    {mounted && (
                      <motion.span 
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className="inline-block w-2 h-4 bg-primary align-middle ml-1"
                      />
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="absolute bottom-6 right-6">
                    <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider bg-zinc-900 text-zinc-500 border-zinc-800">
                      In Development
                    </Badge>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ============================================
              AUTOMATION & AI LABORATORY
              Showcase of technical capabilities
              ============================================ */}
          <section className="mb-32 space-y-8">
            
            {/* n8n Canvas Container - Preserved Dimensions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="relative rounded-3xl border border-border/50 bg-secondary/20 p-6 overflow-hidden"
            >
              {/* Status Indicator */}
              <div className="absolute top-6 left-6 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                  System Active
                </span>
              </div>
              
              {/* Canvas Wrapper - DO NOT MODIFY INTERNAL COMPONENT */}
              <div className="h-[500px] w-full bg-background rounded-2xl overflow-hidden">
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
                className="group block relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 dark:from-zinc-900 dark:to-zinc-950 p-12 border border-zinc-800/50 hover:border-zinc-700 transition-all"
              >
                {/* Ambient Glow Effect */}
                <div 
                  className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none opacity-50 group-hover:opacity-70 transition-opacity" 
                  aria-hidden="true"
                />
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                  
                  {/* Content */}
                  <div className="space-y-4 max-w-lg">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className="text-[10px] uppercase tracking-widest font-semibold bg-zinc-950 text-zinc-400 border-zinc-800"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Experimental
                      </Badge>
                    </div>
                    
                    <h3 className="text-3xl font-bold tracking-tight text-white">
                      AI Innovation Lab
                    </h3>
                    
                    <p className="text-zinc-400 leading-relaxed">
                      Yerel yapay zeka modelleriyle çalışan deneysel projeler.
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    <div className="h-14 w-14 rounded-full bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-all group-hover:scale-110">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </section>

          {/* ============================================
              BLOG / INSIGHTS
              Minimal interactive list design
              ============================================ */}
          <section id="blog" className="scroll-mt-24 mb-32">
            
            {/* Section Header */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-border/30">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
                  {t("blog_preview.title")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("blog_preview.description")}
                </p>
              </div>
              
              <Link 
                href="/blog" 
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
              >
                {t("blog_preview.view_all")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Interactive Blog List */}
            <div className="space-y-2">
              {LATEST_POSTS.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="group block"
                  >
                    <article className="flex items-center justify-between gap-6 p-5 -mx-5 rounded-2xl hover:bg-secondary/40 transition-all">
                      
                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <h3 className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                          {post.title}
                        </h3>
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Tag className="w-3 h-3" />
                            {post.category}
                          </span>
                          <span className="opacity-50">•</span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                          <span className="opacity-50">•</span>
                          <span>{post.date}</span>
                        </div>
                      </div>

                      {/* Arrow Indicator */}
                      <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile "View All" Link */}
            <div className="mt-8 sm:hidden text-center">
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                {t("blog_preview.view_all")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* ============================================
              CONTACT FORM
              n8n-integrated with validation
              ============================================ */}
          <section id="contact" className="scroll-mt-24 mb-24">
            
            {/* Visual Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-20" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
                            
              <ContactForm />
            </motion.div>
          </section>

        </div>

        {/* FOOTER */}
        <Footer />
      </div>

    </div>
  );
}