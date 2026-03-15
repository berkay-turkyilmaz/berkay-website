"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Brain, Target, Activity, Settings, 
  Volume2, Play, ArrowRight, Flame, Trophy, Star
} from 'lucide-react';

// === SENİN VERİLERİNİ BURAYA KOYACAKSIN (FLASHCARDS, QUESTIONS, vb.) ===
const FLASHCARDS = {
  daily: [{ f: "Wake up", b: "Uyanmak", p: "/weɪk ʌp/" }, { f: "Get up", b: "Kalkmak", p: "/ɡet ʌp/" }],
  jobs: [{ f: "Teacher", b: "Öğretmen", p: "/ˈtiːtʃə/" }, { f: "Engineer", b: "Mühendis", p: "/ˌendʒɪˈnɪə/" }]
};

export default function EnglishPathPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'grammar' | 'flashcards' | 'prepositions' | 'exam' | 'results'>('dashboard');
  
  // Örnek Kullanıcı Verisi
  const [userData] = useState({
    level: 3, xp: 450, xpTarget: 1000, streak: 12, totalExams: 5, correctAnswers: 42
  });

  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  useEffect(() => { setMounted(true); }, []);

  const flipCard = (index: number) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const speakText = useCallback((text: string) => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  if (!mounted) return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center"><Activity className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans pb-20 transition-colors duration-300">
      
      {/* HEADER - Glassmorphism & Soft Colors */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-[#0B0F19]/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/60 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-xl">
              E
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                EnglishPath
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">Adaptive Learning</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Canlı ama premium rozetler */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-amber-100/50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-500/20 font-bold text-sm">
                <Star className="w-4 h-4 fill-current" /> Lvl {userData.level}
              </div>
              <div className="flex items-center gap-1.5 bg-rose-100/50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-500/20 font-bold text-sm">
                <Flame className="w-4 h-4 fill-current" /> {userData.streak} Gün
              </div>
            </div>
            <button className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        
        {/* TABS - Soft Segmented Control */}
        <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl border border-slate-300/50 dark:border-slate-700 w-fit">
          {[
            { id: 'dashboard', icon: Activity, label: 'Panel' },
            { id: 'grammar', icon: BookOpen, label: 'Kurallar' },
            { id: 'flashcards', icon: Brain, label: 'Kelimeler' },
            { id: 'prepositions', icon: Target, label: 'Edatlar' },
            { id: 'exam', icon: Trophy, label: 'Sınav' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-500 dark:text-indigo-400' : ''}`} /> {tab.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* Sol İstatistik Kartı */}
                <div className="bg-white dark:bg-[#131A2B] rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-800 dark:text-white">
                       <Activity className="w-5 h-5 text-indigo-500" /> İlerleme
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800/80">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Toplam Sınav</span>
                        <span className="font-bold text-xl">{userData.totalExams}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800/80">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Doğru Cevap</span>
                        <span className="font-bold text-emerald-500 text-xl">{userData.correctAnswers}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('exam')} className="mt-8 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20">
                    Kendini Dene <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Sağ Büyük Kart (Modüller) */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div onClick={() => setActiveTab('flashcards')} className="cursor-pointer group bg-white dark:bg-[#131A2B] border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 hover:border-purple-500/50 transition-colors shadow-sm relative overflow-hidden">
                     <div className="absolute -right-4 -top-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
                     <Brain className="w-10 h-10 text-purple-500 mb-4" />
                     <h3 className="text-xl font-bold mb-2">Kelime Kartları</h3>
                     <p className="text-slate-500 dark:text-slate-400 text-sm">Görsel ve işitsel hafızanı kullanarak yeni kelimeler öğren.</p>
                  </div>
                  
                  <div onClick={() => setActiveTab('grammar')} className="cursor-pointer group bg-white dark:bg-[#131A2B] border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 hover:border-blue-500/50 transition-colors shadow-sm relative overflow-hidden">
                     <div className="absolute -right-4 -top-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                     <BookOpen className="w-10 h-10 text-blue-500 mb-4" />
                     <h3 className="text-xl font-bold mb-2">Dilbilgisi</h3>
                     <p className="text-slate-500 dark:text-slate-400 text-sm">Headway Beginner kurallarını temiz özetlerle tekrar et.</p>
                  </div>
                </div>
              </div>
            )}

            {/* FLASHCARDS TAB - Çok daha şık 3D Kartlar */}
            {activeTab === 'flashcards' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.values(FLASHCARDS).flat().map((card, i) => (
                  <div key={i} className="perspective-1000 w-full h-56 cursor-pointer" onClick={() => flipCard(i)}>
                    <motion.div
                      className="relative w-full h-full transform-style-3d transition-all duration-500"
                      animate={{ rotateY: flippedCards[i] ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      {/* Ön Yüz (İngilizce - Sade) */}
                      <div className="absolute inset-0 backface-hidden bg-white dark:bg-[#131A2B] border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-3xl font-bold mb-3 text-slate-800 dark:text-white">{card.f}</div>
                        <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-lg font-mono text-xs border border-slate-200 dark:border-slate-700">{card.p}</div>
                        <div className="absolute bottom-4 text-[10px] uppercase tracking-widest text-slate-400">Çevir</div>
                      </div>
                      
                      {/* Arka Yüz (Türkçe - Renkli ve Canlı) */}
                      <div 
                        className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-xl"
                        style={{ transform: "rotateY(180deg)" }}
                      >
                        <div className="text-3xl font-bold mb-6">{card.b}</div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); speakText(card.f); }}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-colors border border-white/10"
                        >
                          <Volume2 className="w-4 h-4" /> Seslendir
                        </button>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global CSS for 3D Cards */}
      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>

    </div>
  );
}