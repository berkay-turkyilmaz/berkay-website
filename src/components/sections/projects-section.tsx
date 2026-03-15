"use client";

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, ChevronDown, Layers, AlertCircle, Code2, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Tip Tanımlaması
interface Project {
  id: string | number;
  baslik: string;
  aciklama: string;
  gorsel_url: string;
  link: string;
  teknolojiler: string[];
}

export function ProjectsSection() {
  const t = useTranslations("ProjectsSection");
  
  // 🛠️ MOCK DATA (Yedek Veri - Artık i18n dil dosyasına bağlı!)
  const MOCK_PROJECTS: Project[] = [
    {
      id: 1,
      baslik: t("mock_projects.1.title"),
      aciklama: t("mock_projects.1.description"),
      gorsel_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      link: "https://github.com/berkay-turkyilmaz",
      teknolojiler: ["n8n", "Webhook", "Next.js 15", "Automation"]
    },
    {
      id: 2,
      baslik: t("mock_projects.2.title"),
      aciklama: t("mock_projects.2.description"),
      gorsel_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
      link: "https://github.com/berkay-turkyilmaz",
      teknolojiler: ["Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion"]
    },
    {
      id: 3,
      baslik: t("mock_projects.3.title"),
      aciklama: t("mock_projects.3.description"),
      gorsel_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop",
      link: "https://github.com/berkay-turkyilmaz",
      teknolojiler: ["n8n", "REST API", "Data Automation", "Financial Data"]
    }
  ];
  
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getProjects = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch('https://n8n.ipadresim.sslip.io/webhook-test/projects-bring', {
        method: 'GET',
        signal: AbortSignal.timeout(3000) 
      });
      
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      const processedData = Array.isArray(data) ? data : (data.items || []);
      setAllProjects(processedData);

    } catch (err) {
      console.warn("API bağlantısı sağlanamadı, lokal sistem (Mock Data) devreye alınıyor:", err);
      setAllProjects(MOCK_PROJECTS);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // t referansını bağımlılıklara eklemiyoruz ki sonsuz döngü olmasın

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const visibleProjects = allProjects.slice(0, visibleCount);

  return (
    // bg-background class'ını doğrudan ekledik ki ana kapsayıcıda beyaz bozulmasın
    <section id="projects" className="flex flex-col lg:flex-row gap-12 lg:gap-16 py-24 border-t border-border/30 scroll-mt-24 relative overflow-hidden bg-background">
      
      {/* Arka plan dekoratif ışık - Çok hafif tutuldu */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* --- SOL PANEL (Sticky Info) --- */}
      <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit space-y-8 z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-primary font-mono text-[10px] font-bold tracking-widest uppercase">
            <Layers className="w-3.5 h-3.5" />
            <span>{t("badge")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground text-balance">
            {t("title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed font-medium text-lg text-balance">
            {t("description")}
          </p>
        </div>
        
        {/* Şeffaflık (bg-card/X) KALDIRILDI. Doğrudan bg-card kullanıldı. */}
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
          <p className="text-[11px] font-bold text-muted-foreground mb-4 uppercase tracking-widest flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            {t("tech_stack_title")}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {["Next.js 15", "n8n", "Supabase", "Tailwind CSS", "Docker", "TypeScript"].map((tech) => (
              <Badge 
                key={tech} 
                variant="secondary" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent transition-colors px-3 py-1.5 shadow-sm"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* --- SAĞ PANEL (Projects List) --- */}
      <div className="lg:w-2/3 w-full flex flex-col gap-6 z-10">
        
        {/* Loading Skeleton - Solid Renkler */}
        {loading && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 rounded-[2rem] bg-secondary border border-border overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              </div>
            ))}
          </div>
        )}

        {/* Hata Durumu */}
        {!loading && error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 border border-destructive/20 bg-destructive/10 rounded-[2rem] text-center"
          >
            <div className="inline-flex p-3 rounded-full bg-destructive/20 mb-4 ring-4 ring-destructive/10">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{t("states.error_title")}</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">{t("states.error_desc")}</p>
            <Button onClick={getProjects} variant="outline" className="gap-2 border-destructive/30 hover:bg-destructive text-foreground hover:text-destructive-foreground">
              <RefreshCw className="w-4 h-4" />
              {t("buttons.retry")}
            </Button>
          </motion.div>
        )}

        {/* Proje Listesi */}
        {!loading && !error && visibleProjects.length === 0 ? (
          <div className="p-12 border border-dashed border-border rounded-[2rem] text-center text-muted-foreground bg-secondary/50">
            {t("states.empty")}
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-6">
              {visibleProjects.map((project, idx) => (
                <motion.div
                  key={project.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1, ease: "easeOut" }}
                  // Şeffaflık (bg-card/X) KALDIRILDI. Doğrudan bg-card kullanıldı.
                  className="group relative flex flex-col md:flex-row gap-6 p-5 sm:p-6 rounded-[2rem] border border-border bg-card hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 overflow-hidden"
                >
                  
                  {/* Görsel Alanı */}
                  <div className="w-full md:w-64 h-48 md:h-auto shrink-0 overflow-hidden rounded-2xl border border-border bg-muted relative">
                    <img 
                      src={project.gorsel_url} 
                      alt={project.baslik}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"; 
                      }}
                      className="w-full h-full object-cover grayscale-[0.5] opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* İçerik Alanı */}
                  <div className="flex flex-col justify-between flex-grow py-2 z-10">
                    <div>
                      <div className="flex justify-between items-start mb-2 gap-4">
                        <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                          {project.baslik}
                        </h3>
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2.5 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-xl transition-all duration-300 text-muted-foreground flex-shrink-0 group/link shadow-sm"
                          aria-label={t("buttons.view_project")}
                        >
                          <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </a>
                      </div>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 group-hover:text-foreground/90 transition-colors">
                        {project.aciklama}
                      </p>
                    </div>

                    {/* Teknolojiler */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {Array.isArray(project.teknolojiler) && project.teknolojiler.map((tech: string, index: number) => (
                        <Badge 
                          key={`${project.id}-${index}`} 
                          variant="outline" 
                          className="text-[10px] font-semibold tracking-wide px-2.5 py-1 border-border bg-background text-muted-foreground group-hover:border-primary/30 group-hover:text-primary transition-colors"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Load More Button */}
        {!loading && !error && visibleCount < allProjects.length && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.3 }}
            className="pt-4"
          >
            <Button 
              onClick={() => setVisibleCount(prev => prev + 3)} 
              variant="outline" 
              className="w-full py-6 sm:py-7 border-border rounded-[1.5rem] bg-secondary hover:bg-secondary/80 text-foreground transition-all duration-300 font-semibold text-sm group shadow-sm"
            >
              {t("buttons.load_more")} 
              <ChevronDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}