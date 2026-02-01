"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ProjectsSection } from "@/components/sections/projects-section";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { LayoutGrid, ArrowUpRight } from "lucide-react";

export default function ProjectsPage() {
  const t = useTranslations("ProjectsPage");

  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-blue-500/30">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          
          {/* Sayfa Başlığı (Global Standart) */}
          <header className="max-w-3xl mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-blue-400 font-mono text-sm mb-4"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="tracking-[0.3em] uppercase">{t("badge")}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-black tracking-tighter mb-6"
            >
              {t("title")}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 text-lg md:text-xl leading-relaxed"
            >
              {t("description")}
            </motion.p>
          </header>

          {/* Orijinal Projeler Bileşenin */}
          <section className="mt-12">
            <ProjectsSection />
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}