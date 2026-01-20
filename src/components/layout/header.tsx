"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Github, Menu, Boxes } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  // Scroll takibi
  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Hakkımda", href: "/#about" },
    { name: "Projeler", href: "/#projects" },
    { name: "Blog", href: "/#blog" },
    { name: "İletişim", href: "/#contact" },
  ];

  // LOGO BİLEŞENİ
  const BrandLogo = ({ onClick }: { onClick?: () => void }) => (
    <Link 
      href="/" 
      className="flex items-center gap-2 group select-none z-50" 
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground group-hover:scale-105 transition-transform duration-300 shadow-sm">
        <Boxes className="w-5 h-5" strokeWidth={2.5} />
      </div>
      <span className="text-xl font-black tracking-tighter text-foreground">
        BERKAY
      </span>
    </Link>
  );

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm py-2"
          : "bg-transparent border-transparent py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 h-12">
        
        {/* --- SOL: LOGO --- */}
        <BrandLogo />

        {/* --- ORTA: MASAÜSTÜ MENÜ (Mobilde Gizli) --- */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* --- SAĞ: AKSİYONLAR (Git, DarkMode, Menu) --- */}
        <div className="flex items-center gap-1 md:gap-2">
          
          {/* GitHub (Her zaman görünür, mobilde de) */}
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" asChild>
             <Link href="https://github.com/kullaniciadin" target="_blank">
                <Github className="h-[1.2rem] w-[1.2rem]" />
             </Link>
          </Button>

          {/* Dark Mode (Her zaman görünür) */}
          <ModeToggle />

          {/* --- HAMBURGER MENÜ (Sadece Mobilde) --- */}
          <div className="md:hidden ml-1">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menüyü aç</span>
                </Button>
              </SheetTrigger>

              {/* SHEET CONTENT: Tam ekran, sağdan kayan */}
              <SheetContent 
                side="right" 
                className="w-full h-full border-none bg-background p-0 sm:max-w-none flex flex-col"
              >
                {/* Sheet Header: Logo ve Kapat Butonu için alan */}
                <SheetHeader className="flex flex-row items-center justify-between p-4 px-6 border-b">
                   <SheetTitle className="sr-only">Navigasyon Menüsü</SheetTitle> {/* Erişim için gerekli */}
                   <BrandLogo onClick={() => setIsOpen(false)} />
                   {/* Kapat butonu SheetContent içinde otomatik gelir, biz sadece hizaladık */}
                </SheetHeader>

                {/* Menü Linkleri */}
                <div className="flex flex-col px-6 py-8 gap-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-2xl font-bold tracking-tight hover:text-primary hover:pl-2 transition-all duration-300 border-b pb-4 border-border/40"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Alt Kısım (Opsiyonel Footer) */}
                <div className="mt-auto p-6 pb-10">
                   <p className="text-sm text-muted-foreground">
                      © 2024 Berkay. Tüm hakları saklıdır.
                   </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}