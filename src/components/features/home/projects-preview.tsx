"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowUpRight, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProjectsPreview() {
  const t = useTranslations("HomePage");

  return (
    <section id="projects" className="scroll-mt-32">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {t("sections.projects_preview_title") || "Seçilmiş Çalışmalar"}
          </h2>
          <p className="text-muted-foreground/80 leading-relaxed font-medium md:text-lg">
            {t("sections.projects_preview_desc")}
          </p>
        </div>
        <Link href="/projects" className="group inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors pb-2">
          {t("sections.view_all_work") || "Tümünü Gör"}
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Proje 1 (SaaS) - Görünür ve Şık Kart */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}>
          <Link href="/projects" className="group block relative aspect-[4/3] bg-card rounded-[2rem] shadow-md border border-border/50 overflow-hidden hover:border-primary/40 hover:shadow-xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
              <div className="w-20 h-20 bg-secondary/80 shadow-sm border border-border/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Code2 className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mb-3">Enterprise SaaS Architecture</h3>
              <p className="text-sm font-medium text-muted-foreground/80 uppercase tracking-widest">Next.js 15 • TypeScript • Supabase</p>
            </div>
          </Link>
        </motion.div>

        {/* Proje 2 (Code Snippet) - Terminal Hissiyatı */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: 0.1 }}>
          <div className="relative aspect-[4/3] bg-secondary/20 rounded-[2rem] shadow-md border border-border/50 p-8 overflow-hidden hover:border-border/80 transition-all duration-500">
             <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/40">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/80" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                   <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-muted-foreground font-mono font-medium">~/system/architecture.ts</span>
             </div>
             <div className="font-mono text-[13px] leading-relaxed space-y-1 text-muted-foreground">
                <p><span className="text-primary font-medium">export interface</span> <span className="text-blue-400">SystemConfig</span> {"{"}</p>
                <p className="pl-6"><span className="text-foreground/80">core</span>: <span className="text-amber-500">"React Server Components"</span>;</p>
                <p className="pl-6"><span className="text-foreground/80">styling</span>: <span className="text-amber-500">"TailwindCSS v4"</span>;</p>
                <p className="pl-6"><span className="text-foreground/80">automation</span>: <span className="text-amber-500">"n8n Webhooks"</span>;</p>
                <p>{"}"}</p>
             </div>
             <div className="absolute bottom-6 right-6">
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-primary bg-background shadow-sm border-border/50">Production Ready</Badge>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}