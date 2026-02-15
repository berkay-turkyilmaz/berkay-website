"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl"; // useTranslations eklendi
import { usePathname, useRouter } from "@/i18n/routing";
import { Globe, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher"); // Çeviri kancası
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dil Listesi: Genellikle dillerin "Kendi Adı" ile yazılması UX standartıdır.
  // Örn: Türkçe (Turkish değil), English (İngilizce değil).
  // Böylece kullanıcı kendi dilini hemen tanır.
  const languages = [
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" }, 
    // { code: "es", label: "Espana", flag: "es" },
    // { code: "fr", label: "France", flag: "fr" },
    // { code: "ar", label: "Arabic", flag: "ar" },
    // { code: "ja", label: "Japonca", flag: "ja" },
  ];

  const handleSwitch = (nextLocale: string) => {
    if (locale === nextLocale) {
      setIsOpen(false);
      return;
    }
    router.replace(pathname, { locale: nextLocale });
    setIsOpen(false);
  };

  // Dışarı tıklayınca menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* --- TETİKLEYİCİ BUTON --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 border",
          isOpen 
            ? "bg-secondary border-primary/20 text-foreground" 
            : "bg-transparent border-transparent hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
        )}
        aria-label={t("label")} // Erişilebilirlik için dinamik etiket
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline-block">
          {locale}
        </span>
        <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {/* --- AÇILIR MENÜ (DROPDOWN) --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-xl bg-background/95 backdrop-blur-xl border border-border/50 shadow-xl overflow-hidden z-50 p-1"
          >
            <div className="flex flex-col gap-1">
              {/* DİNAMİK BAŞLIK: JSON'dan geliyor */}
              <span className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/30 mb-1">
                {t("label")} 
              </span>
              
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSwitch(lang.code)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors",
                    locale === lang.code
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-foreground hover:bg-secondary/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg leading-none">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </div>
                  {locale === lang.code && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}