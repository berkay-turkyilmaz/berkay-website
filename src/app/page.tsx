"use client";

import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/sections/hero-section"; // Yeni Hero
import { ProjectsSection } from "@/components/sections/projects-section";
import { BlogSection } from "@/components/sections/blog-section";
import { Footer } from "@/components/layout/footer";
import ContactForm from "@/components/forms/contact";
// Default importlara dikkat ediyoruz
import AiLab from "@/components/sections/AiLab"; 
import N8NCanvas from "@/components/sections/n8nCanvas";

export default function Home() {
  return (
    // selection:bg-primary/20 ile tüm seçili metinler tema renginde olur
    <div className="min-h-screen bg-black text-slate-200 selection:bg-blue-500/30 font-sans">
      
      {/* 1. Yeni Glass Header */}
      <Header />

      <main className="space-y-0">
        
        {/* 2. Yeni Interactive Hero (Eski AboutSection yerine) */}
        <HeroSection />

        {/* 3. Global Container (Diğer içerikler için) */}
        <div className="container mx-auto px-4 space-y-32 pb-20">
          
          {/* Projeler */}
          <div id="projects" className="pt-20">
            <ProjectsSection />
          </div>

          {/* Mimari & Lab */}
          <div className="space-y-20">
             <N8NCanvas />
             <div id="ai-lab">
                <AiLab />
             </div>
          </div>

          {/* Blog & İletişim */}
          <div id="blog">
             <BlogSection />
          </div>

          <div id="contact" className="max-w-4xl mx-auto border-t border-white/10 pt-20">
             <ContactForm />
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}