"use client";
import { motion } from "framer-motion";
import { 
  Code2, Cpu, Sparkles, Database, Share2, Globe, 
  CheckCircle2, Zap, ArrowDown
} from "lucide-react";
import { useState, useEffect } from "react";

// Node dimensions
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

// Mobile workflow (vertical layout)
const mobileNodes = [
  { id: 'trigger', label: 'Form Submission', icon: Code2, type: 'start', order: 0 },
  { id: 'agent', label: 'AI Agent (Tools)', icon: Cpu, type: 'main', order: 1 },
  { id: 'model', label: 'Anthropic LLM', icon: Sparkles, type: 'sub', order: 2, indent: false },
  { id: 'memory', label: 'Postgres Memory', icon: Database, type: 'sub', order: 3, indent: false },
  { id: 'router', label: 'Is Manager?', icon: Share2, type: 'logic', order: 4 },
  { id: 'slack1', label: 'Slack: Add Channel', icon: Globe, type: 'end', order: 5, indent: false },
  { id: 'slack2', label: 'Slack: Update Profile', icon: Globe, type: 'end', order: 6, indent: false },
];

// Calculate connection paths - çizgiler node kenarlarından başlıyor
const connectionPaths = [
  { 
    from: 'trigger', 
    to: 'agent',
    path: `M 240 250 L 320 250`,
    order: 0 
  },
  { 
    from: 'agent', 
    to: 'model',
    path: `M 375 285 L 330 385`,
    order: 1 
  },
  { 
    from: 'agent', 
    to: 'memory',
    path: `M 485 285 L 570 385`,
    order: 1 
  },
  { 
    from: 'agent', 
    to: 'router',
    path: `M 540 250 L 630 250`,
    order: 2 
  },
  { 
    from: 'router', 
    to: 'slack1',
    path: `M 810 250 Q 845 190 880 165`,
    order: 3 
  },
  { 
    from: 'router', 
    to: 'slack2',
    path: `M 810 250 Q 845 310 880 335`,
    order: 4 
  },
];

export default function N8NCanvas() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const primaryColor = '#22d3ee';
  const shadowColor = 'rgba(34, 211, 238, 0.25)';

  // Mobile View
  if (isMobile) {
    return (
      <section className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 relative z-10"
        >
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">
            Otonom Akış Mimarisi
          </h2>
          <p className="text-slate-400 font-light italic text-sm">
            Sistemler arası veri akışı
          </p>
        </motion.div>

        <div className="max-w-sm mx-auto space-y-3 relative z-10">
          {mobileNodes.map((node, idx) => {
            const IconComponent = node.icon;
            const showArrow = idx < mobileNodes.length - 1;
            
            return (
              <div key={node.id}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`
                    p-4 rounded-xl border backdrop-blur-xl
                    ${node.type === 'main' 
                      ? 'bg-slate-900/90 border-cyan-400' 
                      : 'bg-slate-950/80 border-white/10'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-3 rounded-xl flex-shrink-0"
                      style={{ backgroundColor: 'rgba(34, 211, 238, 0.1)', color: primaryColor }}
                    >
                      <IconComponent size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-100 truncate">
                        {node.label}
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono uppercase">
                        {node.type}
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                  </div>
                </motion.div>
                
                {showArrow && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 + 0.05 }}
                    className="flex justify-center py-1"
                  >
                    <ArrowDown size={20} className="text-cyan-400/50" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center justify-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[9px] font-mono text-slate-400 max-w-sm mx-auto"
        >
          <div className="flex items-center gap-1.5">
            <Zap size={10} className="text-cyan-400" />
            <span>ONLINE</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={10} className="text-emerald-500" />
            <span>CONNECTED</span>
          </div>
        </motion.div>
      </section>
    );
  }

  // Desktop View
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-16 md:py-32 relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12 md:mb-20 relative z-10 max-w-4xl mx-auto"
      >
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white italic uppercase tracking-tighter mb-4">
          Otonom Akış Mimarisi
        </h2>
        <p className="text-slate-400 font-light italic text-base md:text-lg max-w-2xl mx-auto">
          Tetikleyiciden sonuca: Sistemler arası veri iletimini ve karar mekanizmalarını görselleştirin.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <div className="relative w-full bg-slate-950/80 border border-white/5 rounded-3xl backdrop-blur-md overflow-hidden shadow-2xl">
          
          <div 
            className="absolute inset-0 opacity-10" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
              backgroundSize: '40px 40px' 
            }} 
          />

          <div className="relative w-full" style={{ paddingBottom: '50%' }}>
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none z-0" 
              viewBox="0 0 1120 560" 
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
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
                
                {/* Particle gradient for flowing effect */}
                <radialGradient id="particleGradient">
                  <stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
                  <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Connection paths */}
              {connectionPaths.map((conn, i) => (
                <g key={i}>
                  {/* Background static line */}
                  <motion.path
                    d={conn.path}
                    stroke={primaryColor}
                    strokeOpacity="0.15"
                    strokeWidth="2.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: conn.order * 0.35, ease: "easeOut" }}
                  />

                  {/* Animated flowing gradient line */}
                  <motion.path
                    d={conn.path}
                    stroke="url(#lineGradient)"
                    strokeWidth="3.5"
                    fill="none"
                    strokeDasharray="60 140"
                    initial={{ strokeDashoffset: 200, opacity: 0 }}
                    whileInView={{ strokeDashoffset: -200, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      strokeDashoffset: {
                        duration: 1.8,
                        delay: conn.order * 0.35 + 0.3,
                        repeat: Infinity,
                        ease: "linear"
                      },
                      opacity: {
                        duration: 0.2,
                        delay: conn.order * 0.35 + 0.3
                      }
                    }}
                    style={{ filter: "url(#glow)" }}
                  />
                  
                  {/* Flowing particle effect - main current animation */}
                  <motion.circle
                    r="6"
                    fill="url(#particleGradient)"
                    filter="url(#glow)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: conn.order * 0.35 + 0.4 }}
                  >
                    <animateMotion
                      dur="2s"
                      repeatCount="indefinite"
                      begin={`${conn.order * 0.35 + 0.4}s`}
                      path={conn.path}
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.1;0.9;1"
                      dur="2s"
                      repeatCount="indefinite"
                      begin={`${conn.order * 0.35 + 0.4}s`}
                    />
                  </motion.circle>
                </g>
              ))}

              {/* Port circles */}
              {workflowNodes.map((node) => (
                <g key={`svg-${node.id}`}>
                  {/* Input port */}
                  {node.type !== 'start' && (
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r="6"
                      fill="#0B1120"
                      stroke={primaryColor}
                      strokeWidth="2.5"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: node.order * 0.35 + 0.15, type: "spring", stiffness: 300 }}
                    >
                      <animate
                        attributeName="opacity"
                        values="0.4;1;0.4"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </motion.circle>
                  )}
                  
                  {/* Output port */}
                  {node.type !== 'end' && (
                    <motion.circle
                      cx={node.x + node.width}
                      cy={node.y}
                      r="6"
                      fill="#0B1120"
                      stroke={primaryColor}
                      strokeWidth="2.5"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: node.order * 0.35 + 0.15, type: "spring", stiffness: 300 }}
                    />
                  )}
                  
                  {/* Agent bottom ports */}
                  {node.type === 'main' && (
                    <>
                      <motion.circle
                        cx={375}
                        cy={285}
                        r="6"
                        fill="#0B1120"
                        stroke={primaryColor}
                        strokeWidth="2.5"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: node.order * 0.35 + 0.25, type: "spring", stiffness: 300 }}
                      />
                      <motion.circle
                        cx={485}
                        cy={285}
                        r="6"
                        fill="#0B1120"
                        stroke={primaryColor}
                        strokeWidth="2.5"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: node.order * 0.35 + 0.25, type: "spring", stiffness: 300 }}
                      />
                    </>
                  )}
                </g>
              ))}
            </svg>

            {/* Nodes layer */}
            <div className="absolute inset-0 w-full h-full">
              {workflowNodes.map((node) => {
                const IconComponent = node.icon;
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ 
                      opacity: 1, 
                      scale: 1,
                    }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: node.order * 0.35, 
                      duration: 0.4, 
                      type: "spring", 
                      stiffness: 200 
                    }}
                    style={{ 
                      left: `${(node.x / 1120) * 100}%`,
                      top: `${((node.y - NODE_HEIGHT/2) / 560) * 100}%`,
                      width: `${(node.width / 1120) * 100}%`,
                    }}
                    className={`
                      absolute z-10 p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 group cursor-pointer
                      ${node.type === 'main' 
                        ? 'bg-slate-900/90 border-cyan-400' 
                        : 'bg-slate-950/80 border-white/10 hover:border-white/30'
                      }
                    `}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: `0 0 30px -5px ${shadowColor}`
                    }}
                  >
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity bg-cyan-400" />

                    <div className="flex items-center gap-3 relative z-20">
                      <div 
                        className="p-3 rounded-xl transition-transform group-hover:scale-110 duration-300 flex-shrink-0"
                        style={{ backgroundColor: 'rgba(34, 211, 238, 0.1)', color: primaryColor }}
                      >
                        <IconComponent size={node.type === 'main' ? 24 : 18} />
                      </div>

                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-100 tracking-tight leading-tight truncate">
                          {node.label}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">
                          {node.type}
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-2 right-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Status bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 2.5 }}
            className="relative z-20 m-6 flex items-center gap-4 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-slate-400"
          >
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-cyan-400" />
              <span>SYSTEM_ONLINE</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span>ALL NODES CONNECTED</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}