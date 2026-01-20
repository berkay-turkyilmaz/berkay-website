"use client";

import { useEffect, useState, useCallback } from 'react';
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Loader2, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProjectsSection() {
  // State tanımlamaları
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(true);

  // Veri çekme fonksiyonu
  const getProjects = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5678/webhook/projects-bring');
      const data = await response.json();
      
      const processedData = Array.isArray(data) ? data : (data.items || []);
      setAllProjects(processedData);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const loadMore = () => setVisibleCount((prev) => prev + 3);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-20 w-full min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const visibleProjects = allProjects.slice(0, visibleCount);

  return (
    <section id="projects" className="flex flex-col lg:flex-row gap-12 py-12 border-t border-white/10">
      {/* Sol Panel: Sabit Bilgi */}
      <div className="lg:w-1/3 lg:sticky lg:top-24 h-fit space-y-6">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Projelerim</h2>
          <p className="text-muted-foreground leading-relaxed">
            Google Sheets ve n8n altyapısıyla dinamik olarak yönetilen çalışmalarım.
          </p>
        </div>
        
        <div className="p-5 bg-foreground text-background rounded-2xl shadow-lg">
          <p className="text-sm font-semibold mb-3 opacity-80 uppercase tracking-wider">Kullandığım Teknolojiler</p>
          <div className="flex flex-wrap gap-2">
            {["Next.js", "n8n", "Docker", "PostgreSQL"].map((t) => (
              <Badge key={t} variant="secondary" className="bg-background/20 text-background border-none hover:bg-background/30">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Sağ Panel: Proje Kartları */}
      <div className="lg:w-2/3 w-full flex flex-col gap-6">
        {visibleProjects.length === 0 ? (
          <div className="p-10 border border-dashed border-white/20 rounded-2xl text-center text-muted-foreground">
            Henüz görüntülenecek proje bulunamadı.
          </div>
        ) : (
          visibleProjects.map((project, idx) => (
            <div 
              key={project.id || idx} 
              // DÜZELTME: 'text-card-foreground' eklendi ve border rengi ayarlandı
              className="group flex flex-col md:flex-row gap-6 p-5 rounded-3xl border border-white/10 bg-card/50 text-card-foreground hover:bg-accent/40 transition-all duration-300"
            >
              {/* Görsel Kutusu */}
              <div className="w-full md:w-48 h-32 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-muted">
                <img 
                  src={project.gorsel_url || "https://via.placeholder.com/400x300?text=Proje"} 
                  alt={project.baslik}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-110"
                />
              </div>

              {/* İçerik */}
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    {/* DÜZELTME: Başlık için 'text-foreground' ve dark modda 'dark:text-white' garantisi */}
                    <h3 className="text-xl font-bold text-foreground dark:text-white group-hover:text-primary transition-colors">
                      {project.baslik}
                    </h3>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-primary/10 rounded-full transition-colors text-foreground">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  {/* DÜZELTME: Açıklama metni için 'dark:text-gray-300' fallback eklendi */}
                  <p className="text-sm text-muted-foreground dark:text-gray-300 line-clamp-2 mb-4 leading-relaxed">
                    {project.aciklama}
                  </p>
                </div>

                {/* Dinamik Teknolojiler */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {Array.isArray(project.teknolojiler) && project.teknolojiler.map((tech: string, index: number) => (
                    <Badge 
                      key={`${project.id}-${index}`} 
                      variant="secondary" 
                      className="text-[10px] font-medium uppercase px-2 py-0 border-none bg-primary/10 text-primary"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Load More */}
        {visibleCount < allProjects.length && (
          <Button 
            onClick={loadMore} 
            variant="ghost" 
            className="w-full py-8 border-2 border-dashed border-white/10 rounded-3xl hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
          >
            Daha Fazla Proje <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </section>
  );
}