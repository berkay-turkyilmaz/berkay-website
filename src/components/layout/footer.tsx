import { Github, Linkedin, Mail, Twitter, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* Sütun 1: Marka ve Motto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter italic">
              <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-sm NOT-italic">BT</span>
              BERKAY.DEV
            </div>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Modern web teknolojileri ve akıllı otomasyon sistemleri ile geleceğin dijital deneyimlerini inşa ediyorum.
            </p>
            {/* Sistem Durumu Göstergesi (Modern bir dokunuş) */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-muted/50 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Tüm Sistemler Operasyonel
            </div>
          </div>

          {/* Sütun 2: Navigasyon */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Navigasyon</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground font-medium">
              <a href="/#about" className="hover:text-primary transition-colors italic">Hakkımda</a>
              <a href="/#projects" className="hover:text-primary transition-colors italic">Projeler</a>
              <a href="/#blog" className="hover:text-primary transition-colors italic">Blog</a>
              <a href="/#contact" className="hover:text-primary transition-colors italic">İletişim</a>
            </nav>
          </div>

          {/* Sütun 3: Sosyal ve Bağlantı */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Bağlanalım</h4>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-md hover:bg-primary hover:text-primary-foreground transition-all">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-md hover:bg-primary hover:text-primary-foreground transition-all">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-md hover:bg-primary hover:text-primary-foreground transition-all">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Bana her zaman e-posta üzerinden ulaşabilirsiniz.
            </p>
          </div>
        </div>
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
          <p>© 2026 BERKAY TURKYILMAZ. TÜM HAKLARI SAKLIDIR.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              BUILT WITH <Cpu className="h-3 w-3" /> NEXT.JS & TAILWIND V4
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}