/** Shared heading block for home sections: mono eyebrow, serif title, optional intro. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
}) {
  return (
    <header className="reveal grid gap-6 md:grid-cols-12 md:gap-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:col-span-3 md:pt-3">
        {eyebrow}
      </p>
      <div className="md:col-span-9">
        <h2
          id={id}
          className="font-display text-[clamp(2.1rem,4.6vw,3.75rem)] leading-[1.05] tracking-[-0.02em] text-foreground text-balance"
        >
          {title}
        </h2>
        {intro ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{intro}</p>
        ) : null}
      </div>
    </header>
  );
}
