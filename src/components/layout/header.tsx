"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle"; // Dark mode geri geldi
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Github, Menu, Boxes, ArrowRight, Twitter, Linkedin, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Giriş", href: "/#hero" },
    { name: "Projeler", href: "/#projects" },
    { name: "Lab", href: "/#ai-lab" },
    { name: "Blog", href: "/#blog" }, // Geri eklendi
    { name: "İletişim", href: "/#contact" },
  ];

  const BrandLogo = () => (
    <Link href="/" className="group flex items-center gap-2 select-none" onClick={() => setIsOpen(false)}>
      <motion.div 
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)]"
      >
        <Boxes className="w-5 h-5" strokeWidth={2.5} />
      </motion.div>
      <span className="text-lg font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">
        BERKAY<span className="text-primary animate-pulse">.</span>
      </span>
    </Link>
  );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 pointer-events-none ${isScrolled ? 'py-4' : 'py-6'}`}
    >
      <div className={`
        pointer-events-auto flex items-center justify-between 
        w-full max-w-6xl mx-4 px-4 py-2 rounded-full 
        transition-all duration-300
        ${isScrolled 
          ? "bg-background/70 backdrop-blur-xl border border-border/40 shadow-xl" 
          : "bg-transparent border border-transparent"
        }
      `}>
        
        {/* SOL: Logo */}
        <BrandLogo />

        {/* ORTA: Masaüstü Menü */}
        <nav className="hidden md:flex items-center gap-1 bg-secondary/30 p-1 rounded-full border border-border/10 backdrop-blur-sm">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-background transition-all duration-300"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* SAĞ: Aksiyonlar */}
        <div className="flex items-center gap-2">
          {/* Masaüstünde Dark Mode ve Github */}
          <div className="hidden md:flex items-center gap-2">
             <Link href="https://github.com/kullaniciadin" target="_blank">
                <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                   <Github className="w-4 h-4" />
                </Button>
             </Link>
             <ModeToggle />
          </div>

          {/* Mobil Menü Tetikleyici */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle /> {/* Mobilde dışarıda da olsun, erişim kolaylığı */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full bg-background/50 border-border/40 w-10 h-10">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md bg-background/95 backdrop-blur-2xl border-l border-border/10 p-0 flex flex-col">
                
                {/* Mobil Header */}
                <SheetHeader className="p-6 border-b border-border/10 flex flex-row items-center justify-between">
                   <SheetTitle className="sr-only">Navigasyon</SheetTitle>
                   <BrandLogo />
                   {/* Kapat butonu otomatik geliyor */}
                </SheetHeader>

                {/* Mobil Body (Linkler) */}
                <div className="flex-1 flex flex-col justify-center px-8 gap-6">
                  {navItems.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center justify-between text-3xl font-black tracking-tighter text-muted-foreground hover:text-foreground transition-all"
                      >
                        <span>{item.name}</span>
                        <ArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobil Footer (Sosyal & Info) */}
                <div className="p-8 bg-secondary/10 border-t border-border/10">
                   <div className="flex gap-4 mb-6">
                      <Button variant="outline" size="icon" className="rounded-full"><Github className="w-4 h-4" /></Button>
                      <Button variant="outline" size="icon" className="rounded-full"><Twitter className="w-4 h-4" /></Button>
                      <Button variant="outline" size="icon" className="rounded-full"><Linkedin className="w-4 h-4" /></Button>
                      <Button variant="outline" size="icon" className="rounded-full"><Mail className="w-4 h-4" /></Button>
                   </div>
                   <p className="text-xs text-muted-foreground font-mono tracking-widest uppercase">
                      © 2026 Berkay.dev
                   </p>
                </div>

              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}