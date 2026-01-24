"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Terminal, ArrowRight, MousePointer2 } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Permanent_Marker } from 'next/font/google';

// Fontu burada da çağırıyoruz ki component içinde kullanabilelim
const markerFont = Permanent_Marker({ weight: '400', subsets: ['latin'] });

export function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isListening, setIsListening] = useState(false);
  const [logs, setLogs] = useState([
    " [SYSTEM]: Kernel v2.4 başlatıldı.",
    " [AI]: Neural Engine aktif.",
    " [USER]: Bekleniyor..."
  ]);
  const [themeColor, setThemeColor] = useState<"blue" | "purple" | "emerald">("blue");

  // Temalar (Renk yönetimi)
  const themes = {
    blue: { primary: "text-blue-500", bg: "bg-blue-500", border: "border-blue-500", shadow: "shadow-blue-500/20", glow: "rgba(59, 130, 246, 0.4)" },
    purple: { primary: "text-purple-500", bg: "bg-purple-500", border: "border-purple-500", shadow: "shadow-purple-500/20", glow: "rgba(168, 85, 247, 0.4)" },
    emerald: { primary: "text-emerald-500", bg: "bg-emerald-500", border: "border-emerald-500", shadow: "shadow-emerald-500/20", glow: "rgba(16, 185, 129, 0.4)" },
  };

  // Mouse Takibi (Spotlight için)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Ses Tanıma (Basitleştirilmiş)
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Tarayıcınız ses özelliğini desteklemiyor (Chrome kullanın).");

    const recognition = new SpeechRecognition();
    recognition.lang = "tr-TR";
    recognition.start();
    setIsListening(true);
    setLogs(prev => [...prev.slice(-3), " [MIC]: Dinleniyor..."]);

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript;
      setLogs(prev => [...prev.slice(-3), ` [VOICE]: "${command}" algılandı.`]);
      setIsListening(false);
      
      // Basit bir renk değiştirme komutu örneği
      if (command.toLowerCase().includes("mavi")) setThemeColor("blue");
      if (command.toLowerCase().includes("mor")) setThemeColor("purple");
      if (command.toLowerCase().includes("yeşil")) setThemeColor("emerald");
    };

    recognition.onerror = () => {
      setIsListening(false);
      setLogs(prev => [...prev.slice(-3), " [ERROR]: Ses algılanamadı."]);
    };
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      
      {/* 1. SPOTLIGHT EFFECT (Arka Plan) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 opacity-20"
        style={{ 
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, ${themes[themeColor].glow}, transparent 80%)` 
        }}
      />

      <div className="container px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* --- SOL: TYPOGRAPHY & HERO TEXT --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left space-y-8"
        >
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-white/5 backdrop-blur-md ${themes[themeColor].border}/30 text-[10px] font-bold uppercase tracking-[0.2em] ${themes[themeColor].primary}`}>
            <span className="relative flex h-2 w-2">
               <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${themes[themeColor].bg}`}></span>
               <span className={`relative inline-flex rounded-full h-2 w-2 ${themes[themeColor].bg}`}></span>
            </span>
            System Online: v2.5
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] text-white">
            BERKAY <br />
            {/* Gradient Text */}
            <span className={`text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-600`}>
              TÜRKYILMAZ
            </span>
          </h1>

          <p className="text-xl text-slate-400 font-light max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Sıradan kod yazmıyorum. <br />
            <span className={`font-bold ${themes[themeColor].primary}`}>Next.js</span>, <span className={`font-bold ${themes[themeColor].primary}`}>Docker</span> ve <span className={`font-bold ${themes[themeColor].primary}`}>n8n</span> ile 
            <span className={`block mt-2 text-2xl ${markerFont.className} text-white transform -rotate-1`}>
              sistemler otonomlaşıyor.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <MagneticButton className={`px-8 py-4 rounded-2xl font-bold text-black ${themes[themeColor].bg} hover:brightness-110 transition-all shadow-xl`}>
               <span className="flex items-center gap-2">Projeleri Keşfet <ArrowRight size={18} /></span>
            </MagneticButton>
            
            {/* Renk Değiştirici (Easter Egg) */}
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
               {(Object.keys(themes) as Array<keyof typeof themes>).map(c => (
                 <button 
                    key={c} 
                    onClick={() => setThemeColor(c)}
                    className={`w-6 h-6 rounded-full ${themes[c].bg} ${themeColor === c ? 'ring-2 ring-white scale-110' : 'opacity-40 hover:opacity-100'} transition-all`}
                 />
               ))}
            </div>
          </div>
        </motion.div>


        {/* --- SAĞ: INTERACTIVE TERMINAL & VOICE --- */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2, duration: 0.8 }}
           className="relative"
        >
          {/* Terminal Window */}
          <div className="rounded-[2rem] bg-[#0c0c0c] border border-white/10 shadow-2xl overflow-hidden relative group">
             {/* Header */}
             <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/50" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                   <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                   <Terminal size={12} />
                   <span>Voice_Command.exe</span>
                </div>
             </div>

             {/* Logs */}
             <div className="p-8 font-mono text-xs md:text-sm h-[200px] flex flex-col justify-end">
                {logs.map((log, i) => (
                  <div key={i} className="mb-2 text-slate-300">
                    <span className={`${themes[themeColor].primary} opacity-50 mr-2`}>➜</span>
                    {log}
                  </div>
                ))}
                <div className={`w-2 h-4 ${themes[themeColor].bg} animate-pulse`} />
             </div>

             {/* Mic Button Overlay */}
             <div className="absolute bottom-6 right-6">
               <button 
                 onClick={startListening}
                 className={`p-4 rounded-full transition-all duration-300 ${isListening ? 'bg-red-500 animate-pulse shadow-red-500/50 shadow-lg' : `bg-white/10 hover:${themes[themeColor].bg} hover:text-black text-white`}`}
               >
                  {isListening ? <MicOff size={24} /> : <Mic size={24} />}
               </button>
             </div>
          </div>

          {/* Decorative Elements */}
          <div className={`absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] ${themes[themeColor].bg} opacity-10 blur-[100px] rounded-full`} />
        </motion.div>

      </div>
    </section>
  );
}