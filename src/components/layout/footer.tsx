"use client";

import { Github, Linkedin, Mail, Twitter, Cpu, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative w-full border-t border-border/40 bg-background overflow-hidden">
      
      {/* Dekoratif Gradient Çizgi */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-6 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Sütun 1: Marka (4 birim) */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
              <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-md text-xl">B.</span>
              BERKAY.DEV
            </div>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Dijital dünyada iz bırakan, otonom sistemler ve modern web deneyimleri tasarlıyorum. Kodun ötesinde, değer üretiyorum.
            </p>
            {/* Sistem Durumu */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border/50 bg-secondary/20 text-[10px] font-bold uppercase tracking-widest text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Sistemler: Aktif
            </div>
          </div>

          {/* Sütun 2: Linkler (2 birim) */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/80">Keşfet</h4>
            <nav className="flex flex-col gap-3 text-sm text-muted-foreground font-medium">
              {['Hakkımda', 'Projeler', 'Blog', 'İletişim'].map((item) => (
                <Link key={item} href={`/#${item === 'Hakkımda' ? 'hero' : item.toLowerCase()}`} className="hover:text-primary hover:translate-x-1 transition-all flex items-center gap-1 group">
                  {item} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Sütun 3: Bağlantı (5 birim) */}
          <div className="md:col-span-4 space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/80">İletişimde Kal</h4>
            <div className="flex gap-3">
              {[Github, Linkedin, Twitter, Mail].map((Icon, i) => (
                <Button key={i} variant="outline" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 transition-all shadow-sm">
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Yeni bir proje fikriniz mi var? <br />
              <a href="mailto:email@site.com" className="text-primary hover:underline">hello@berkay.dev</a> adresine yazın.
            </p>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          <p>© 2026 BERKAY TURKYILMAZ.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-default">
              POWERED BY <Cpu className="h-3 w-3" /> NEXT.JS 14
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}