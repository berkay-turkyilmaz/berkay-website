"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight, Container, Code2, Download, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Permanent_Marker } from 'next/font/google';

// 1. İSTEDİĞİN EL YAZISI FONTU
const markerFont = Permanent_Marker({ 
  weight: '400',
  subsets: ['latin'],
});

export function AboutSection() {

  // --- ANİMASYON BİLEŞENLERİ (SENİN KODUNUN AYNISI - SADECE STİL EKLENDİ) ---
  
  const TechCard = ({ icon: Icon, label, colorClass, className, delay }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      // Değişiklik: Kartlara "sert gölge" ve "el yazısı" ekledim
      className={`absolute flex flex-col items-center justify-center w-28 h-28 p-3 bg-card border-2 border-primary/20 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] z-20 ${className} ${colorClass}`}
    >
      <div className="mb-2 p-2 rounded-lg bg-background border-2 border-current">
        <Icon className="w-7 h-7" />
      </div>
      {/* Etiketler el yazısı fontunda */}
      <span className={`font-bold text-xs text-center ${markerFont.className}`}>{label}</span>
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
    </motion.div>
  );

  const DataPacket = ({ path, delay, color }: { path: string, delay: number, color: string }) => (
    <motion.div
      className={`absolute w-3 h-3 rounded-full border-2 border-background z-10 ${color}`}
      initial={{ offsetDistance: "0%" }}
      animate={{ offsetDistance: "100%" }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      }}
      style={{ offsetPath: `path('${path}')`, boxShadow: "0 0 10px currentColor" }}
    />
  );

  // SENİN VERDİĞİN KOORDİNATLAR (ASLA DOKUNULMADI)
  const path1 = "M 100 80 Q 150 320 300 320"; 
  const path2 = "M 300 320 Q 450 320 500 80"; 

  return (
    <section id="about" className="py-12 md:py-24 relative bg-background flex justify-center items-center overflow-hidden">
      
      {/* Arka Plan Süsü (Hafif Kirli Efekt) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="w-full max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* --- SOL TARAF: VURUCU METİN & STİL --- */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 text-center lg:text-left"
          >
            {/* Üst Rozet */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-primary bg-primary/10 text-primary font-black text-[10px] tracking-widest uppercase transform -rotate-2">
              <Terminal className="w-3 h-3" /> System Architect
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] text-foreground">
              İŞLERİ <br />
              {/* Marker Fontu ve Highlighter Efekti */}
              <span className="relative inline-block mx-2">
                 <span className="absolute inset-0 bg-yellow-400/80 -skew-y-3 transform scale-110 rounded-sm" />
                 <span className={`relative z-10 text-black ${markerFont.className} text-5xl md:text-6xl`}>OTONOM</span>
              </span> <br />
              YAPIYORUM.
            </h1>

            <p className="text-lg text-muted-foreground font-medium max-w-md mx-auto lg:mx-0">
              Kod hammallığı bitti. <br />
              <span className="text-foreground font-bold">Next.js + n8n + Docker</span> ile kendi kendine çalışan dijital fabrikalar kuruyorum.
            </p>

            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button className="h-12 px-8 font-bold border-2 border-primary bg-primary text-primary-foreground hover:translate-y-1 hover:shadow-none transition-all shadow-[4px_4px_0px_0px_currentColor]">
                Sistemi İncele <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <a href="/Berkay_Turk_CV.pdf" target="_blank" className="group">
                <Button variant="outline" className="h-12 px-8 font-bold border-2 border-foreground hover:bg-accent hover:translate-y-1 hover:shadow-none transition-all shadow-[4px_4px_0px_0px_currentColor]">
                  <Download className="mr-2 w-4 h-4" /> CV İndir
                </Button>
              </a>
            </div>
          </motion.div>

          {/* --- SAĞ TARAF: ANİMASYON (SENİN YAPIN + SCALE FIX) --- */}
          <div className="relative flex justify-center items-center w-full h-[350px] md:h-[400px]">
            
            {/* KRİTİK MOBİL ÇÖZÜM:
                Kapsayıcıyı 'scale' ile küçültüyoruz.
                - Mobilde: scale-[0.55] (600px -> 330px'e iner, ekrana sığar)
                - Tablette: scale-[0.8]
                - Masaüstünde: scale-100 (Orijinal boyut)
            */}
            <div className="relative w-[600px] h-[400px] select-none transform scale-[0.55] sm:scale-[0.8] xl:scale-100 origin-center transition-transform duration-500">

              <svg className="absolute inset-0 w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#eab308" />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>

                <path d={path1} stroke="url(#grad1)" strokeWidth="5" fill="none" strokeDasharray="12 12" className="opacity-40" />
                <path d={path2} stroke="url(#grad2)" strokeWidth="5" fill="none" strokeDasharray="12 12" className="opacity-40" />
              </svg>

              <DataPacket path={path1} delay={0} color="bg-blue-500 shadow-blue-500" />
              <DataPacket path={path2} delay={1.5} color="bg-green-500 shadow-green-500" />

              {/* Koordinatlar senin kodundaki ile BİREBİR AYNI */}
              <TechCard
                icon={Container}
                label="Docker"
                colorClass="text-blue-500"
                className="top-[30px] left-[50px]"
                delay={0}
              />

              <TechCard
                icon={Zap}
                label="n8n"
                colorClass="text-yellow-500"
                className="bottom-[30px] left-[250px]"
                delay={0.2}
              />

              <TechCard
                icon={Code2}
                label="Next.js"
                colorClass="text-green-500"
                className="top-[30px] right-[50px]"
                delay={0.4}
              />

              {/* Arka plan glow efekti */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -z-10" />

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}