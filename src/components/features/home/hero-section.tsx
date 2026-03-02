"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Terminal, ArrowRight, Code2, GitBranch, Cpu } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("Hero");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [terminalStep, setTerminalStep] = useState(0);

  // Spotlight (Mouse Takibi)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Sadece ana ekranda çalışması için window nesnesini dinliyoruz
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Terminal Animasyonu (Boot Sequence)
  useEffect(() => {
    const timer = setInterval(() => {
      setTerminalStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Terminalde gösterilecek teknik loglar (İngilizce olması global/teknik algıyı artırır)
  const bootLogs = [
    { text: "initializing core environment...", icon: <Cpu size={14} className="text-zinc-500" /> },
    { text: "fetching translations (tr, en, de)...", icon: <Code2 size={14} className="text-blue-400" /> },
    { text: "mounting React Server Components...", icon: <Code2 size={14} className="text-cyan-400" /> },
    { text: "establishing n8n webhook nodes...", icon: <GitBranch size={14} className="text-green-400" /> },
    { text: "system architecture deployed successfully.", icon: <Terminal size={14} className="text-primary" /> },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 bg-background font-sans selection:bg-primary/20">
      
      {/* 1. SPOTLIGHT EFFECT (Temaya Duyarlı) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 opacity-[0.15] dark:opacity-20"
        style={{ 
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(var(--primary), 0.15), transparent 80%)` 
        }}
      />

      <div className="container px-6 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        
        {/* --- SOL: TYPOGRAPHY & HERO TEXT --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center lg:text-left space-y-8"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-border/50 bg-secondary/30 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-semibold tracking-widest uppercase text-foreground/80">
              {t("badge")}
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter leading-[1.05] text-foreground text-balance">
              BERKAY <br />
              {/* Gradient Text - Kurumsal ve Temiz */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                TÜRKYILMAZ
              </span>
            </h1>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground/90 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed text-balance">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <Link href="/projects">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(var(--primary),0.2)] hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] flex items-center justify-center gap-2">
                {t("cta_primary")} <ArrowRight size={18} />
              </button>
            </Link>
            
            <Link href="/contact">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-foreground bg-secondary/50 hover:bg-secondary border border-border/50 transition-all active:scale-[0.98] flex items-center justify-center">
                {t("cta_secondary")}
              </button>
            </Link>
          </div>
        </motion.div>


        {/* --- SAĞ: ENGINEERING TERMINAL --- */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          {/* Terminal Window */}
          <div className="rounded-2xl bg-[#09090b] border border-zinc-800/80 shadow-2xl overflow-hidden relative group backdrop-blur-3xl">
             
             {/* Header */}
             <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border-b border-zinc-800/80">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/80" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                   <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                   <Terminal size={12} />
                   <span>system_boot.sh</span>
                </div>
             </div>

             {/* Logs / Boot Sequence */}
             <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm h-[260px] flex flex-col justify-start space-y-3 overflow-hidden">
                <div className="text-zinc-500 mb-2">
                  <span className="text-primary mr-2">➜</span> ~/portfolio/core run build
                </div>
                
                {bootLogs.map((log, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: i <= terminalStep ? 1 : 0, x: i <= terminalStep ? 0 : -10 }}
                    className="flex items-center gap-3 text-zinc-300"
                  >
                    {log.icon}
                    <span>{log.text}</span>
                  </motion.div>
                ))}

                {/* Blinking Cursor */}
                {terminalStep >= 4 && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="flex items-center gap-2 mt-4 text-green-400 font-semibold"
                  >
                    <span className="text-primary mr-2">➜</span> {t("terminal_ready")}
                    <motion.div 
                      animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}
                      className="w-2.5 h-4 bg-primary align-middle" 
                    />
                  </motion.div>
                )}
             </div>

             {/* Refined Glow */}
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
          </div>

          {/* Decorative Elements */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[100px] rounded-full" aria-hidden="true" />
        </motion.div>

      </div>
    </section>
  );
}