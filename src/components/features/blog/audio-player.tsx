"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface AudioPlayerProps {
  title: string;
  text: string;
}

export function AudioPlayer({ title, text }: AudioPlayerProps) {
  const t = useTranslations("BlogDetail");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  
  // State
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Metni birleştir
  const cleanText = `${title}. ${text}`;

  // 1. Süre Hesaplama (Ortalama 145 kelime/dakika)
  useEffect(() => {
    const wordCount = cleanText.split(/\s+/).length;
    const estimatedSeconds = Math.ceil((wordCount / 145) * 60);
    setDuration(estimatedSeconds);
  }, [cleanText]);

  // 2. Player Hazırlığı
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Önceki okumaları temizle (Sayfa değişince konuşmaya devam etmemesi için)
      window.speechSynthesis.cancel();

      const u = new SpeechSynthesisUtterance(cleanText);
      u.rate = 1; 
      u.pitch = 1;
      u.volume = 1; // Varsayılan ses seviyesi
      
      let timer: NodeJS.Timeout;

      u.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        
        // Progress Timer
        const startTime = Date.now() - (currentTime * 1000);
        timer = setInterval(() => {
            const now = Date.now();
            const elapsed = (now - startTime) / 1000;
            if (elapsed <= duration) {
                setCurrentTime(elapsed);
                setProgress((elapsed / duration) * 100);
            } else {
                // Tahmini süre bitti ama ses bitmediyse %99'da beklet
                setProgress(99);
            }
        }, 100);
      };

      u.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(100);
        setTimeout(() => { // Kullanıcı %100'ü görsün sonra sıfırla
            setProgress(0);
            setCurrentTime(0);
        }, 500);
        clearInterval(timer);
      };

      u.onpause = () => clearInterval(timer);
      
      setUtterance(u);
      
      // Cleanup: Bileşen ekrandan gidince sesi kapat
      return () => {
          clearInterval(timer);
          window.speechSynthesis.cancel();
      };
    }
  }, [cleanText, duration]); // currentTime dependency removed to prevent restart loop

  // --- KONTROLLER ---

  const handlePlay = () => {
    if (!utterance) return;
    
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      // Sıfırdan başlat
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleReset = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    setCurrentTime(0);
  };

  // Saniye formatlayıcı (03:45 gibi)
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="w-full bg-secondary/20 backdrop-blur-md border border-border/40 rounded-2xl p-6 relative overflow-hidden">
      
      <div className="relative z-10 flex flex-col gap-5">
        
        {/* Üst Kısım: Başlık ve Zamanlayıcı */}
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPlaying ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {isPlaying ? (
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                    ) : (
                        <Play size={12} fill="currentColor" />
                    )}
                </div>
                <div>
                    <h3 className="text-sm font-bold text-foreground line-clamp-1">{t("audio_title")}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                        {isPlaying ? t("audio_playing") : t("audio_idle")}
                    </p>
                </div>
            </div>
            
            <div className="text-xs font-mono font-medium text-muted-foreground tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
            </div>
        </div>

        {/* Progress Bar (İnteraktif Değil - Sadece Gösterge) */}
        <div className="relative w-full h-1 bg-border/40 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                style={{ width: `${progress}%` }}
                layoutId="progress" // Framer motion smooth transition
            />
        </div>

        {/* Alt Kısım: Sade Kontroller */}
        <div className="flex items-center justify-center gap-6">
            
             {/* Reset Button */}
             <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                className="text-muted-foreground hover:text-foreground hover:bg-transparent transition-transform hover:scale-110"
                title="Restart"
             >
                <RotateCcw size={18} />
             </Button>

             {/* Main Play Button */}
             <Button
                onClick={isPlaying ? handlePause : handlePlay}
                className="h-14 w-14 rounded-full bg-foreground text-background hover:bg-foreground/90 hover:scale-105 transition-all shadow-xl"
             >
                {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} className="ml-1" />}
             </Button>

             {/* Placeholder for Future Features (Fast Forward vb. buraya gelecek) */}
             <div className="w-10" /> 
        </div>
      </div>

      {/* Gelecek Notu: Piper TTS entegrasyonu için buraya 'onSeek' ve 'Volume' eklenecek */}
    </div>
  );
}