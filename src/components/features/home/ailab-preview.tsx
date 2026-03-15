"use client";

import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import N8NCanvas from "@/components/features/home/n8n-canvas";

export function AiLabPreview() {
  return (
    <section className="space-y-6">
      
      {/* N8N Canvas Area - Görünür Kutu */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="relative rounded-[2rem] bg-secondary/10 shadow-sm border border-border/50 p-4 sm:p-6 overflow-hidden">
        <div className="absolute top-8 left-8 z-10 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-md shadow-sm border border-border/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-[10px] font-mono font-bold text-foreground/80 uppercase tracking-widest">System Operational</span>
        </div>
        <div className="h-[450px] sm:h-[500px] w-full bg-card rounded-2xl overflow-hidden border border-border/40 shadow-inner">
          <N8NCanvas />
        </div>
      </motion.div>

      {/* AI Lab CTA - Görünür ve Estetik Kart */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: 0.1 }}>
        <Link href="/ai-lab" className="group block relative overflow-hidden rounded-[2rem] bg-card p-8 sm:p-12 shadow-md border border-border/50 hover:border-primary/40 hover:shadow-xl transition-all duration-500">
          
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-5 max-w-xl">
              <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-bold bg-secondary/50 border-border/50 shadow-sm">
                <Sparkles className="w-3 h-3 mr-1.5 text-primary" /> R&D Phase
              </Badge>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">AI & Automation Lab</h3>
              <p className="text-muted-foreground font-medium leading-relaxed text-balance">Yerel LLM modelleri ve n8n ile kurgulanmış akıllı iş akışları, veri işleme botları ve otonom asistanların test ortamı.</p>
            </div>
            <div className="flex-shrink-0">
              <div className="h-14 w-14 rounded-full bg-secondary border border-border/50 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}