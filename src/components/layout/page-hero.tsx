/** Shared hero for inner pages: mono eyebrow, serif title, lead, optional side content. */
export function PageHero({
  eyebrow,
  title,
  lead,
  side,
  id = "page-title",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  side?: React.ReactNode;
  id?: string;
}) {
  return (
    <section aria-labelledby={id} className="mx-auto w-full max-w-[1200px] px-5 pb-14 pt-28 sm:px-8 md:pb-20 md:pt-36">
      <div className={side ? "grid gap-12 md:grid-cols-12 md:items-end md:gap-8" : ""}>
        <div className={side ? "md:col-span-7" : "max-w-4xl"}>
          <p
            className="rise font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
            style={{ "--d": 0 } as React.CSSProperties}
          >
            {eyebrow}
          </p>
          <h1
            id={id}
            className="rise mt-6 font-display text-[clamp(2.6rem,6vw,5.2rem)] leading-[1.03] tracking-[-0.025em] text-foreground text-balance"
            style={{ "--d": 1 } as React.CSSProperties}
          >
            {title}
          </h1>
          {lead ? (
            <p
              className="rise mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ "--d": 2 } as React.CSSProperties}
            >
              {lead}
            </p>
          ) : null}
        </div>
        {side ? <div className="md:col-span-5">{side}</div> : null}
      </div>
    </section>
  );
}
