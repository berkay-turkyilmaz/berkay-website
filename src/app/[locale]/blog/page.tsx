import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/layout/page-hero";
import { ContactBand } from "@/components/home/contact-band";
import { BlogList, type BlogListPost } from "@/components/blog/blog-list";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { getBlogPostContent } from "@/lib/blog/content";

const CATEGORY_IDS = ["architecture", "ai", "automation"] as const;

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("BlogIndex");
  const tHub = await getTranslations("BlogHub");

  const fmt = new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", { month: "short", year: "numeric" });

  const posts: BlogListPost[] = BLOG_POSTS.map((p) => {
    const content = getBlogPostContent(p.slug, locale);
    return {
      id: p.id,
      slug: p.slug,
      category: p.category,
      categoryLabel: tHub(`categories.${p.category}`),
      title: content?.title ?? "",
      excerpt: content?.excerpt ?? "",
      dateLabel: content?.date ? fmt.format(new Date(content.date)) : "",
      readTime: content?.readTime ?? "",
    };
  });

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Header />
      <main id="main">
        <PageHero
          eyebrow={t("eyebrow")}
          title={t.rich("title", { em: (c) => <em className="italic text-primary">{c}</em> })}
          lead={t("lead")}
          side={
            <div className="photo-reveal relative hidden aspect-[4/3] overflow-hidden rounded-[4px] bg-secondary md:block">
              <Image
                src="/images/journal-window.jpg"
                alt={t("photo_alt")}
                fill
                priority
                sizes="(min-width: 768px) 40vw, 100vw"
                className="photo-drift object-cover object-[50%_72%]"
              />
            </div>
          }
        />

        <section className="mx-auto w-full max-w-[1200px] px-5 pb-24 sm:px-8 md:pb-32">
          <BlogList
            posts={posts}
            categories={CATEGORY_IDS.map((id) => ({ id, label: tHub(`categories.${id}`) }))}
            labels={{ all: t("all"), search: tHub("search_placeholder"), empty: tHub("no_results") }}
          />
        </section>

        <ContactBand />
      </main>
      <Footer />
    </div>
  );
}
