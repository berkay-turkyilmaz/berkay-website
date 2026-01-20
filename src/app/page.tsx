import { Header } from "@/components/layout/header";
import { AboutSection } from "@/components/sections/entrance-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { BlogSection } from "@/components/sections/blog-section";
import { Footer } from "@/components/layout/footer";
import ContactForm from "@/components/forms/contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <Header />
      <main className="container mx-auto space-y-24 pb-20">
        {/* Sadece Component Adını Yazıyoruz */}
        <AboutSection />

        <div className="px-4 space-y-32">
          <ProjectsSection />
          <BlogSection />
          <div className="max-w-2xl mx-auto border-t pt-20">
             <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}