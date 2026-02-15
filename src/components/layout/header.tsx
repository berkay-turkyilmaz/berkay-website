"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Github, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const cn = (...classes: (string | undefined | null | false)[]) => 
  classes.filter(Boolean).join(" ");

export function Header() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobil menü açıkken scroll'u engelle
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { key: "projects", href: "/projects" },
    { key: "blog", href: "/blog" },
    { key: "lab", href: "/ai-lab" },
    { key: "contact", href: "/contact" }, 
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-[100] transition-all duration-300 border-b",
          isScrolled
            ? "bg-background/90 backdrop-blur-xl border-border/50 py-3 shadow-lg shadow-black/5"
            : "bg-transparent border-transparent py-5"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
          
          {/* --- LOGO --- */}
          <Link 
            href="/" 
            className="flex items-center gap-2 sm:gap-3 group z-50 cursor-pointer relative"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl flex items-center justify-center font-black text-xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-primary/25 border border-primary/20 relative overflow-hidden">
              {/* Parıltı efekti */}
              <span className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10">B.</span>
            </div>
            <span className="text-xl font-black tracking-tighter hidden sm:block text-foreground group-hover:text-primary transition-colors duration-300">
              BERKAY
            </span>
          </Link>

          {/* --- MASAÜSTÜ NAVİGASYON --- */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-1 p-1.5 rounded-full bg-secondary/40 border border-border/50 backdrop-blur-md shadow-sm">
              {navItems.map((item) => {
                const isActive = item.href !== "/#contact" && pathname.startsWith(item.href);
                
                return (
                  <li key={item.key} className="relative">
                    <Link
                      href={item.href}
                      className={cn(
                        "relative px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all block cursor-pointer select-none overflow-hidden",
                        isActive 
                          ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md shadow-primary/30" 
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                      )}
                    >
                      {/* Hover gradient efekti */}
                      {!isActive && (
                        <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
                      )}
                      <span className="relative z-10">{t(item.key)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* --- SAĞ TARAF --- */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            
            <div className="w-px h-6 bg-border/50 mx-1" />
            
            <Link 
              href="https://github.com/berkay-turkyilmaz" 
              target="_blank"
              rel="noopener noreferrer"
              className="group p-2.5 rounded-full hover:bg-secondary/70 transition-all duration-300 text-muted-foreground hover:text-foreground cursor-pointer border border-transparent hover:border-border/50 hover:shadow-sm"
              aria-label="GitHub profili"
            >
              <Github className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            </Link>
          </div>

          {/* --- MOBİL MENÜ BUTONU --- */}
          <button
            className="md:hidden z-50 p-2 text-foreground hover:bg-secondary/50 rounded-lg transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* --- MOBİL MENÜ --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-background/98 backdrop-blur-2xl md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              className="flex flex-col items-center justify-center h-full gap-8 px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col items-center gap-6">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-4xl font-black tracking-tighter text-foreground hover:text-primary transition-colors duration-300 cursor-pointer hover:scale-105 inline-block"
                    >
                      {t(item.key)}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div 
                className="flex items-center gap-6 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <LanguageSwitcher />
                <ThemeToggle />
                <Link 
                  href="https://github.com/berkay-turkyilmaz" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-secondary/70 hover:bg-secondary rounded-full cursor-pointer transition-all hover:scale-110 border border-border/50"
                  aria-label="GitHub profili"
                >
                  <Github className="w-6 h-6" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}