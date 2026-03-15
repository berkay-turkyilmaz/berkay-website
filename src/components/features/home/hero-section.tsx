"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion, Variants } from "framer-motion"; 
import { ArrowRight, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const t = useTranslations("HomePage");

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    })
  };

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-16 px-6">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        
        <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUpVariant} className="mb-8">
          {/* Border silindi, shadow-sm ve ring-1 ring-border/10 eklendi */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-secondary/50 backdrop-blur-md shadow-sm ring-1 ring-border/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-semibold tracking-widest uppercase text-foreground/80">
              {t("badge") || "Available for New Opportunities"}
            </span>
          </div>
        </motion.div>

        <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUpVariant} className="space-y-6 mb-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter text-foreground leading-[1.05] text-balance">
            {t("title") || "Mühendislik Odaklı Dijital Deneyimler"}
          </h1>
        </motion.div>

        <motion.p custom={3} initial="hidden" animate="visible" variants={fadeUpVariant} className="text-lg md:text-xl text-muted-foreground/80 font-medium max-w-2xl mx-auto leading-relaxed text-balance mb-12">
          {t("description") || "Ölçeklenebilir frontend mimarileri, modern web standartları ve yapay zeka destekli otomasyon sistemleri inşa ediyorum."}
        </motion.p>

        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/projects" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-12 px-8 rounded-full font-bold shadow-[0_0_20px_rgba(var(--primary),0.2)] hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] transition-all active:scale-[0.98]">
              {t("cta_projects") || "Projeleri İncele"} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/ai-lab" className="w-full sm:w-auto">
            {/* Outline butondaki sert border yumuşatıldı */}
            <Button variant="outline" size="lg" className="w-full h-12 px-8 rounded-full font-semibold border-border/30 bg-background/50 backdrop-blur-sm hover:bg-secondary/50 text-foreground transition-all shadow-sm">
              <Cpu className="w-4 h-4 mr-2 text-muted-foreground" /> {t("cta_lab") || "AI Lab"}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}