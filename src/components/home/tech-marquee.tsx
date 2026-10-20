const ITEMS = [
  "React",
  "TypeScript",
  "Next.js",
  "JavaScript",
  "Tailwind CSS",
  "SASS",
  "Figma",
  "Accessibility",
  "n8n",
  "Groq",
  "Supabase",
  "Git",
];

/** Slow, pausable ticker of the tools I work with. Decorative: the real list lives in the Experience section. */
export function TechMarquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {ITEMS.map((item) => (
        <li key={item} className="flex items-center">
          <span className="px-6 font-display text-3xl italic tracking-[-0.01em] text-foreground/80 sm:text-4xl">{item}</span>
          <span className="h-1 w-1 rounded-full bg-primary" aria-hidden />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee overflow-hidden border-y border-border py-6" role="presentation">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
