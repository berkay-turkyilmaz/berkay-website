"use client";

import { useTranslations } from "next-intl";
import { LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

// Az önce yazdığımız component (Yolu kendi projene göre ayarla)
import { ProjectsSection } from "@/components/sections/projects-section"; 
import { Header } from "@/components/layout/header"; // Header componentin
import { Footer } from "@/components/layout/footer"; // Footer componentin

export default function ProjectsPage() {
  const t = useTranslations("ProjectsPage");

  return (
    // EN KRİTİK NOKTA: bg-background ve text-foreground. Statik siyahlar kaldırıldı.
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      
      <Header />

      {/* SAYFA ÜSTÜ (HERO) ALANI */}
      <main className="pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden relative">
        
        {/* Dekoratif Arka Plan Işığı (İsteğe bağlı, derinlik katar) */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-6"
          >
            {/* Rozet Alanı */}
            <div className="inline-flex items-center gap-2.5 text-primary font-mono text-[11px] font-bold tracking-[0.2em] uppercase">
              <LayoutGrid className="w-4 h-4" />
              {t("badge") || "PORTFOLYO & MİMARİ"}
            </div>

            {/* Başlık */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-foreground text-balance leading-[1.1]">
              {t("title") || "Sistemler ve Ürünler"}
            </h1>

            {/* Açıklama */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium text-balance max-w-2xl">
              {t("description") || "Full-stack geliştirmeden veri otomasyon çözümlerine kadar uçtan uca mimarisini kurduğum dijital ürünler."}
            </p>
          </motion.div>
        </div>
      </main>

      {/* PROJELER LİSTESİ BİLEŞENİ */}
      <div className="container mx-auto px-6 lg:px-12 pb-24">
         <ProjectsSection />
      </div>

      <Footer />
    </div>
  );
}