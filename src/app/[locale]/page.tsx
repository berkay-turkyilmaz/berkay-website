import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/features/home/hero-section";
import { ProjectsPreview } from "@/components/features/home/projects-preview";
import { AiLabPreview } from "@/components/features/home/ailab-preview";
import { BlogPreview } from "@/components/features/home/blog-preview";
import ContactForm from "@/components/forms/contact";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      <Header />

      <main className="flex flex-col items-center w-full overflow-hidden">
        
        <HeroSection />

        <div className="container mx-auto px-6 lg:px-12 xl:px-16 w-full space-y-32 mb-32">
          {/* Çizgiler artık çok daha soft (border/20) */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border/20 to-transparent" />

          <ProjectsPreview />

          <AiLabPreview />

          <BlogPreview />

          <section id="contact" className="scroll-mt-32 max-w-3xl mx-auto w-full">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-border/20 to-transparent mb-20" />
            <ContactForm />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}