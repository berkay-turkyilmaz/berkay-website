  // src/app/blog/[slug]/page.tsx

  import { Header } from "@/components/layout/header";
  import { Footer } from "@/components/layout/footer";
  import { Badge } from "@/components/ui/badge";
  import { Calendar, Clock, ArrowLeft } from "lucide-react";
  import Link from "next/link";

  export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const title = slug.replace(/-/g, ' ').toUpperCase();

    return (
      <div className="min-h-screen bg-background selection:bg-primary/10">
        <Header />
        
        <main className="container mx-auto px-4 py-16 max-w-3xl">
          {/* --- GERİ DÖNÜŞ --- */}
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-10 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Yazılara Geri Dön
          </Link>

          {/* --- MAKALE ÜST BİLGİSİ --- */}
          <header className="space-y-6 mb-12">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="rounded-sm uppercase tracking-widest text-[10px]">
                Rehber
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground gap-4 italic">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> 18 Ocak 2026</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 6 Dakika Okuma</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
              {title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed italic">
              Bu makalede {title.toLowerCase()} konusunun neden önemli olduğunu ve modern mimarilerde nasıl uygulandığını adım adım inceleyeceğiz.
            </p>
          </header>

          {/* --- İÇERİK ALANI (PROSE) --- */}
          {/* 'prose' sınıfı yazıların (p, h2, li) otomatik güzel görünmesini sağlar */}
          <article className="prose prose-neutral dark:prose-invert max-w-none border-t pt-10">
            <h2>Giriş</h2>
            <p>
              Modern web geliştirme süreçlerinde hız ve otomasyon artık bir seçenek değil, zorunluluktur. 
              Bu noktada kullandığımız araçların birbiriyle uyumu, projenin başarısını belirler.
            </p>
            
            <div className="bg-muted p-6 rounded-xl border-l-4 border-primary my-8">
              "Teknoloji, karmaşıklığı ortadan kaldırdığı sürece değerlidir."
            </div>

            <h3>Neden {title.toLowerCase()}?</h3>
            <p>
              Buraya projenle ilgili detaylı teknik açıklamaları ekleyebilirsin. Örneğin, Next.js ve Tailwind v4 ikilisinin 
              neden bu kadar performanslı çalıştığından bahsedebilirsin.
            </p>
            
            <ul>
              <li>Hızlı yükleme süreleri</li>
              <li>Dinamik içerik yönetimi</li>
              <li>Modern CSS motoru (V4)</li>
            </ul>
          </article>

          {/* --- YAZAR KARTI --- */}
          <div className="mt-20 p-8 rounded-2xl border bg-card/50 flex items-center gap-6">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              BT
            </div>
            <div>
                <p className="font-bold text-lg text-foreground">Berkay Türkyılmaz</p>
                <p className="text-sm text-muted-foreground leading-snug">
                  Full Stack Developer. Kod yazmayı, sistemleri otomatize etmeyi ve yeni teknolojileri keşfetmeyi sever.
                </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }