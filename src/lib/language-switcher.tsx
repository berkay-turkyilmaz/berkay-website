"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { motion } from 'framer-motion';

export function LanguageSwitcher() {
  const locale = useLocale(); // Şu anki dil: 'tr' veya 'en'
  const router = useRouter(); // i18n destekli router
  const pathname = usePathname(); // i18n destekli pathname

  const languages = [
    { code: 'tr', label: 'TR' },
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' },
    { code: 'ar', label: 'AR' },
    { code: 'ja', label: 'JA' }
  ];

  const handleLanguageChange = (newLocale: string) => {
    // Sayfa yenilenmeden dili değiştirir ve URL'i günceller (/tr -> /en)
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-white/5 backdrop-blur-md rounded-full border border-border">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`relative px-3 py-1 text-[10px] font-bold tracking-widest rounded-full transition-all duration-300 ${
            locale === lang.code ? "text-black" : "text-zinc-500 hover:text-foreground"
          }`}
        >
          {/* Seçili olan dilin arkasındaki hareketli beyaz kapsül (Apple tarzı) */}
          {locale === lang.code && (
            <motion.div
              layoutId="activeLang"
              className="absolute inset-0 bg-white rounded-full -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {lang.label}
        </button>
      ))}
    </div>
  );
}