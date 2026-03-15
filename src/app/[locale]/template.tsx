"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Siyah/Karanlık Perde Katmanı 
        Not: z-[9999] kullandık ki header dahil her şeyin üstünü tam kapatsın.
      */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
        className="fixed inset-0 z-[9999] bg-zinc-950 flex items-center justify-center pointer-events-none"
      >
         {/* Ortadaki İsim/Logo Animasyonu */}
         <motion.span 
           initial={{ opacity: 1, scale: 0.95 }}
           animate={{ opacity: 0, scale: 1 }}
           transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
           className="text-white text-3xl font-extrabold tracking-[0.2em] uppercase"
         >
           BERKAY
         </motion.span>
      </motion.div>

      {/* Sayfa İçeriği Katmanı
        Sayfayı saran gereksiz <div> yerine <> (Fragment) kullandık ki
        CSS Flex/Grid yapıların bozulmasın.
      */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </>
  );
}