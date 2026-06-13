"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { BRAND_NAME, LogoMark } from "@/components/brand/logo-mark";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.includes("/ayet") || pathname?.includes("/mucize")) {
    return <>{children}</>;
  }

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
         <motion.div
           initial={{ opacity: 1, scale: 0.95 }}
           animate={{ opacity: 0, scale: 1 }}
           transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
           className="flex flex-col items-center gap-4"
         >
           <div className="flex items-center gap-3">
             <LogoMark
               size={48}
               className="border-white/20 bg-white/10 text-white"
             />
             <span className="text-2xl font-black tracking-[0.16em] text-white uppercase sm:text-3xl">
               {BRAND_NAME}
             </span>
           </div>
         </motion.div>
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