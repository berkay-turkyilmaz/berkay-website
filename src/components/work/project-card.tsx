import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { WorkItem } from "@/data/work";
import { SpotlightCard } from "@/components/home/spotlight-card";

/** Project card used on the home page and the projects index. Links to the case page. */
export async function ProjectCard({
  item,
  index,
  headingLevel = "h3",
}: {
  item: WorkItem;
  index: number;
  headingLevel?: "h2" | "h3";
}) {
  const t = await getTranslations("Work");
  const Heading = headingLevel;

  return (
    <Link
      href={`/projects/${item.slug}` as "/projects"}
      className="reveal block h-full rounded-[6px] outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <SpotlightCard className="group flex h-full flex-col overflow-hidden rounded-[6px] border border-border bg-card transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-foreground/40">
        <div className="relative aspect-[2/1] overflow-hidden border-b border-border bg-secondary">
          {item.image ? (
            <>
              <div
                className="absolute inset-x-0 top-0 z-10 flex h-7 items-center gap-1.5 border-b border-border bg-card/90 px-3 backdrop-blur"
                aria-hidden
              >
                <span className="h-2 w-2 rounded-full bg-border" />
                <span className="h-2 w-2 rounded-full bg-border" />
                <span className="h-2 w-2 rounded-full bg-border" />
              </div>
              <Image
                src={item.image}
                alt={t(`items.${item.id}.image_alt`)}
                fill
                sizes="(min-width: 768px) 560px, 100vw"
                className="parallax object-cover object-top pt-7 transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </>
          ) : (
            <div className="flex h-full flex-col items-start justify-end p-6" aria-hidden>
              <span className="font-display text-5xl italic leading-none text-primary/40 transition-colors duration-500 group-hover:text-primary sm:text-6xl">
                {t(`items.${item.id}.title`)}
              </span>
              <span className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {item.tags.join(" · ")}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {String(index + 1).padStart(2, "0")} · {item.year} · {t(`kinds.${item.kind}`)}
              </p>
              <Heading className="mt-3 font-display text-3xl leading-tight tracking-[-0.01em] text-foreground sm:text-4xl">
                {t(`items.${item.id}.title`)}
              </Heading>
            </div>
            <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" aria-hidden />
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t(`items.${item.id}.summary`)}
          </p>
          <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {item.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      </SpotlightCard>
    </Link>
  );
}
