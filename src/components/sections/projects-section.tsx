"use client";

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw, ChevronDown, Layers, AlertCircle } from "lucide-react";
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

// 🛠️ MOCK DATA (Yedek Veri)
// n8n sunucusu kapalıyken bu veriler görünecek
const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    baslik: "Barber Automation System",
    aciklama: "Tally Forms ve n8n kullanarak oluşturduğum, randevuları otomatik olarak Google Calendar'a işleyen ve SMS bildirimi gönderen sistem.",
    gorsel_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop",
    link: "https://github.com/berkayturkyilmaz",
    teknolojiler: ["n8n", "Tally", "Google Sheets"]
  },
  {
    id: 2,
    baslik: "AI Portfolio V1",
    aciklama: "Next.js 14, Tailwind CSS ve Framer Motion kullanılarak geliştirilmiş, çok dilli (i18n) kişisel portfolyo web sitesi.",
    gorsel_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
    link: "https://github.com/berkayturkyilmaz",
    teknolojiler: ["Next.js", "React", "TypeScript"]
  }
];

export function ProjectsSection() {
  const t = useTranslations("ProjectsSection");
  
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getProjects = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      // Önce n8n'e bağlanmayı dene
      const response = await fetch('http://localhost:5678/webhook/projects-bring', {
        method: 'GET',
        // 2 saniye içinde cevap gelmezse hata ver (Timeout)
        signal: AbortSignal.timeout(2000) 
      });
      
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      const processedData = Array.isArray(data) ? data : (data.items || []);
      setAllProjects(processedData);

    } catch (err) {
      console.warn("n8n bağlantısı başarısız, Mock Data kullanılıyor:", err);
      // Hata durumunda MOCK DATA'yı yükle (Sitenin boş görünmemesi için)
      setAllProjects(MOCK_PROJECTS);
      // İsteğe bağlı: Kullanıcıya hata olduğunu göstermek istersen setError(true) yapabilirsin.
      // Ama portfolyo olduğu için dolu görünmesi daha iyi.
      // setError(true); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const visibleProjects = allProjects.slice(0, visibleCount);

  return (
    <section id="projects" className="flex flex-col lg:flex-row gap-12 py-20 border-t border-white/5 scroll-mt-24">
      
      {/* --- SOL PANEL --- */}
      <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit space-y-8">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs mb-4">
            <Layers className="w-4 h-4" />
            <span className="tracking-widest uppercase">Portfolio v1.0</span>
          </div>
          <h2 className="text-2xl md:text-3 xl font-black tracking-tight mb-6 text-foreground">
            {t("title")}
          </h2>
          <p className="text-zinc-400 leading-relaxed text-lg">
            {t("description")}
          </p>
        </div>
        
        <div className="p-6 bg-background/50 border border-white/5 rounded-2xl backdrop-blur-sm">
          <p className="text-xs font-bold text-zinc-500 mb-4 uppercase tracking-widest">
            {t("tech_stack_title")}
          </p>
          <div className="flex flex-wrap gap-2">
            {["Next.js 15", "n8n", "Supabase", "Tailwind", "Docker", "TypeScript"].map((tech) => (
              <Badge 
                key={tech} 
                variant="outline" 
                className="bg-zinc-950/50 border-border text-zinc-300 hover:text-foreground hover:border-purple-500/50 transition-colors px-3 py-1"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* --- SAĞ PANEL --- */}
      <div className="lg:w-2/3 w-full flex flex-col gap-6">
        
        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 rounded-3xl bg-background/50 border border-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {/* Hata Durumu (Mock Data kullandığımız için burası nadiren görünür) */}
        {!loading && error && (
          <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-3xl text-center">
            <div className="inline-flex p-3 rounded-full bg-red-500/10 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{t("states.error_title")}</h3>
            <p className="text-zinc-400 mb-6">{t("states.error_desc")}</p>
            <Button onClick={getProjects} variant="outline" className="gap-2 border-red-500/20 hover:bg-red-500/10 hover:text-red-400">
              <RefreshCw className="w-4 h-4" />
              {t("buttons.retry")}
            </Button>
          </div>
        )}

        {/* Liste */}
        {!loading && !error && visibleProjects.length === 0 ? (
          <div className="p-12 border border-dashed border-border rounded-3xl text-center text-zinc-500">
            {t("states.empty")}
          </div>
        ) : (
          <AnimatePresence>
            {visibleProjects.map((project, idx) => (
              <motion.div
                key={project.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="group relative flex flex-col md:flex-row gap-6 p-6 rounded-3xl border border-white/5 bg-background/30 hover:bg-background/60 hover:border-purple-500/20 transition-all duration-300"
              >
                <div className="w-full md:w-56 h-40 shrink-0 overflow-hidden rounded-xl border border-white/5 bg-black relative">
                  <img 
                    src={project.gorsel_url || "https://placehold.co/600x400/18181b/FFF?text=Project"} 
                    alt={project.baslik}
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400/18181b/FFF?text=No+Image";
                    }}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-colors duration-300" />
                </div>

                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-purple-400 transition-colors">
                        {project.baslik}
                      </h3>
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 bg-white/5 hover:bg-white/10 hover:text-foreground rounded-full transition-colors text-zinc-400"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed mb-4 group-hover:text-zinc-300 transition-colors">
                      {project.aciklama}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(project.teknolojiler) && project.teknolojiler.map((tech: string, index: number) => (
                      <Badge 
                        key={`${project.id}-${index}`} 
                        variant="secondary" 
                        className="text-[10px] font-medium px-2.5 py-0.5 border border-white/5 bg-white/5 text-zinc-300 group-hover:border-purple-500/30 group-hover:text-purple-300 transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Load More */}
        {!loading && !error && visibleCount < allProjects.length && (
          <Button 
            onClick={() => setVisibleCount(prev => prev + 3)} 
            variant="ghost" 
            className="w-full py-6 border border-white/5 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-foreground transition-all group"
          >
            {t("buttons.load_more")} 
            <ChevronDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
          </Button>
        )}
      </div>
    </section>
  );
}