"use client";

import { motion } from "framer-motion";
import { 
  Code2, Cpu, Sparkles, Database, Share2, Globe, 
  CheckCircle2, Zap, ArrowDown
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

// --- SABİTLER & VERİLER ---
const NODE_WIDTH = 180;
const NODE_WIDTH_MAIN = 220;
const NODE_HEIGHT = 70;

const workflowNodes = [
  { id: 'trigger', x: 60, y: 250, label: 'Form Submission', icon: Code2, type: 'start', order: 0, width: NODE_WIDTH },
  { id: 'agent', x: 320, y: 250, label: 'AI Agent (Tools)', icon: Cpu, type: 'main', order: 1, width: NODE_WIDTH_MAIN },
  { id: 'model', x: 240, y: 420, label: 'Anthropic LLM', icon: Sparkles, type: 'sub', order: 2, width: NODE_WIDTH },
  { id: 'memory', x: 480, y: 420, label: 'Postgres Memory', icon: Database, type: 'sub', order: 2, width: NODE_WIDTH },
  { id: 'router', x: 630, y: 250, label: 'Is Manager?', icon: Share2, type: 'logic', order: 3, width: NODE_WIDTH },
  { id: 'slack1', x: 880, y: 170, label: 'Slack: Add Channel', icon: Globe, type: 'end', order: 4, width: NODE_WIDTH },
  { id: 'slack2', x: 880, y: 335, label: 'Slack: Update Profile', icon: Globe, type: 'end', order: 5, width: NODE_WIDTH },
];

const mobileNodes = [
  { id: 'trigger', label: 'Form Submission', icon: Code2, type: 'start', order: 0 },
  { id: 'agent', label: 'AI Agent (Tools)', icon: Cpu, type: 'main', order: 1 },
  { id: 'model', label: 'Anthropic LLM', icon: Sparkles, type: 'sub', order: 2 },
  { id: 'memory', label: 'Postgres Memory', icon: Database, type: 'sub', order: 3 },
  { id: 'router', label: 'Is Manager?', icon: Share2, type: 'logic', order: 4 },
  { id: 'slack1', label: 'Slack: Add Channel', icon: Globe, type: 'end', order: 5 },
  { id: 'slack2', label: 'Slack: Update Profile', icon: Globe, type: 'end', order: 6 },
];

const connectionPaths = [
  { from: 'trigger', to: 'agent', path: `M 240 250 L 320 250`, order: 0 },
  { from: 'agent', to: 'model', path: `M 375 285 L 330 385`, order: 1 },
  { from: 'agent', to: 'memory', path: `M 485 285 L 570 385`, order: 1 },
  { from: 'agent', to: 'router', path: `M 540 250 L 630 250`, order: 2 },
  { from: 'router', to: 'slack1', path: `M 810 250 Q 845 190 880 165`, order: 3 },
  { from: 'router', to: 'slack2', path: `M 810 250 Q 845 310 880 335`, order: 4 },
];

export default function N8NCanvas() {
  const t = useTranslations("HomePage.automation");
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const primaryColor = "#22d3ee";

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);
  
  if (!mounted) return <div className="w-full h-full bg-slate-950 animate-pulse" />;

  // --- MOBILE VIEW (YENİ VERTICAL PIPELINE TASARIMI) ---
  if (isMobile) {
    return (
      <div className="w-full h-full bg-slate-950 px-6 py-8 relative overflow-y-auto no-scrollbar">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-slate-950 to-slate-950 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center space-y-8 pb-10">
          
          {/* Header */}
          <div className="text-center space-y-2 mb-2 sticky top-0 bg-slate-950/80 backdrop-blur-md py-2 z-20 w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-400">
               <Zap size={10} />
               <span>{t("mobile_pipeline")}</span>
            </div>
          </div>

          <div className="relative w-full max-w-xs pl-4">
            {/* 1. THE PIPELINE (Dikey Bağlantı Çizgisi) */}
            <div className="absolute left-6 top-4 bottom-4 w-px bg-slate-800/80 rounded-full overflow-hidden">
              {!reduceMotion && (
                <motion.div
                  className="w-full h-1/4 bg-gradient-to-b from-transparent via-cyan-400/80 to-transparent"
                  animate={{ top: ["-30%", "130%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>

            {/* 2. NODES (Kartlar) */}
            <div className="space-y-6">
              {mobileNodes.map((node, idx) => {
                const IconComponent = node.icon;
                
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      delay: idx * 0.07,
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative pl-12"
                  >
                    {/* Bağlantı Noktası */}
                    <div className="absolute left-[20px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-950 border-2 border-slate-700 z-10 flex items-center justify-center">
                      {node.type === 'main' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </div>
                    
                    {/* Yatay Bağlantı */}
                    <div className="absolute left-6 top-1/2 w-8 h-px bg-slate-800" />

                    {/* KART */}
                    <div className={`
                      p-3 rounded-xl border backdrop-blur-md transition-all active:scale-95
                      ${node.type === 'main' 
                        ? 'bg-slate-900/90 border-cyan-500/40 shadow-[0_4px_20px_-5px_rgba(34,211,238,0.15)]' 
                        : 'bg-slate-950/60 border-ailab-border-faint'
                      }
                    `}>
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: 'rgba(34, 211, 238, 0.08)', color: primaryColor }}
                        >
                          <IconComponent size={16} />
                        </div>
                        
                        <div className="min-w-0">
                          <div className={`text-xs font-bold truncate ${node.type === 'main' ? 'text-cyan-50' : 'text-slate-300'}`}>
                            {node.label}
                          </div>
                          <div className="text-[8px] text-slate-500 font-mono uppercase tracking-wider mt-0.5">
                            {node.type}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- DESKTOP VIEW (YATAY CANVAS) ---
  return (
    <div className="w-full h-full bg-slate-950 relative overflow-hidden flex items-center justify-center">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-slate-950 to-slate-950" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} 
      />

      <div className="relative w-full max-w-[1000px] aspect-[2/1] scale-90 md:scale-100 origin-center">
        <svg 
          className="w-full h-full drop-shadow-2xl" 
          viewBox="0 0 1120 560" 
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0" />
              <stop offset="50%" stopColor={primaryColor} stopOpacity="1" />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
            </linearGradient>
            
            <radialGradient id="particleGradient">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* CONNECTIONS */}
          {connectionPaths.map((conn, i) => (
            <g key={i}>
              <motion.path
                d={conn.path}
                stroke={primaryColor}
                strokeOpacity="0.08"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  pathLength: { duration: 0.9, delay: conn.order * 0.15, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.4, delay: conn.order * 0.15 },
                }}
              />

              {!reduceMotion && (
                <motion.path
                  d={conn.path}
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="40 120"
                  initial={{ strokeDashoffset: 160, opacity: 0 }}
                  animate={{ strokeDashoffset: 0, opacity: [0.4, 0.9, 0.4] }}
                  transition={{
                    strokeDashoffset: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "linear",
                      delay: conn.order * 0.35,
                    },
                    opacity: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: conn.order * 0.35,
                    },
                  }}
                  style={{ filter: "url(#glow)" }}
                />
              )}
            </g>
          ))}
        </svg>

        {/* DOM NODES LAYER */}
        <div className="absolute inset-0 w-full h-full">
          {workflowNodes.map((node) => {
            const IconComponent = node.icon;
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: node.order * 0.12,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ 
                  left: `${(node.x / 1120) * 100}%`,
                  top: `${((node.y - NODE_HEIGHT/2) / 560) * 100}%`,
                  width: `${(node.width / 1120) * 100}%`,
                }}
                className={`
                  absolute p-3 rounded-xl border backdrop-blur-md transition-all duration-300 group
                  ${node.type === 'main' 
                    ? 'bg-slate-900/95 border-cyan-500/50 shadow-[0_0_20px_-5px_rgba(34,211,238,0.3)]' 
                    : 'bg-slate-950/80 border-ailab-border-muted hover:border-ailab-border-selected'
                  }
                `}
              >
                {node.type === 'main' && (
                   <motion.div
                     className="absolute inset-0 rounded-xl bg-cyan-500/5"
                     animate={reduceMotion ? undefined : { opacity: [0.3, 0.6, 0.3] }}
                     transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                   />
                )}

                <div className="flex items-center gap-3 relative z-10">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: 'rgba(34, 211, 238, 0.1)', color: primaryColor }}
                  >
                    <IconComponent size={node.type === 'main' ? 20 : 16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold text-slate-200 truncate leading-tight">
                      {node.label}
                    </div>
                    <div className="text-[8px] text-slate-500 font-mono uppercase tracking-wider mt-0.5">
                      {node.type}
                    </div>
                  </div>
                  
                  <div className={`w-1.5 h-1.5 rounded-full ${node.type === 'main' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]' : 'bg-slate-700'}`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 flex items-center gap-3 rounded-full border border-white/[0.06] bg-black/40 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500 backdrop-blur-md sm:right-6">
         <div className="flex items-center gap-1.5 text-cyan-400/90">
           <Zap size={10} />
           <span>Live</span>
         </div>
         <div className="h-3 w-px bg-white/10" />
         <div className="flex items-center gap-1.5">
           <span className="relative flex h-1.5 w-1.5">
             {!reduceMotion && (
               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 opacity-75 motion-reduce:animate-none" />
             )}
             <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
           </span>
           <span>Ready</span>
         </div>
      </div>

    </div>
  );
}