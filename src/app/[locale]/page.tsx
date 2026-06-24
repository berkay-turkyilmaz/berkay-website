import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/features/home/hero-section";
import { ProjectsPreview } from "@/components/features/home/projects-preview";
import { AiLabPreview } from "@/components/features/home/ailab-preview";
import { BlogPreview } from "@/components/features/home/blog-preview";
import { CurrentFocusWidget } from "@/components/features/home/current-focus-widget";
import { GitHubActivity } from "@/components/github-activity";
import ContactForm from "@/components/forms/contact";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      <Header />

      <main className="flex w-full flex-col items-center">
        <HeroSection />

        <div
          id="home-content"
          className="container mx-auto w-full scroll-mt-20 space-y-20 px-5 pb-20 sm:space-y-24 sm:px-6 sm:pb-24 lg:space-y-28 lg:px-12 xl:px-16"
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border/20 to-transparent" />

          {/* Current status + GitHub activity strip */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CurrentFocusWidget />
            <GitHubActivity />
          </div>

          <ProjectsPreview />

          <AiLabPreview />

          <BlogPreview />

          <section id="contact" className="mx-auto w-full max-w-3xl scroll-mt-32">
            <div className="mb-16 h-px w-full bg-gradient-to-r from-transparent via-border/20 to-transparent" />
            <ContactForm />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}