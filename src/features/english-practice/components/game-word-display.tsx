import { cn } from "@/lib/utils";

type Props = {
  word: string;
  className?: string;
};

/** Scales headline size so long words stay on one line when possible. */
export function GameWordDisplay({ word, className }: Props) {
  const len = word.length;
  const hasSpace = word.includes(" ");

  const sizeClass =
    len > 18
      ? "text-xl sm:text-2xl"
      : len > 14
        ? "text-2xl sm:text-3xl"
        : len > 10
          ? "text-3xl sm:text-4xl"
          : len > 7
            ? "text-4xl sm:text-5xl"
            : "text-4xl sm:text-5xl md:text-6xl";

  return (
    <h2
      className={cn(
        "font-black text-slate-800 leading-[1.1] tracking-tight hyphens-none text-center w-full",
        hasSpace
          ? cn(sizeClass, "text-balance break-words")
          : "text-[clamp(1.35rem,4.5vw+0.75rem,3.5rem)]",
        className
      )}
      title={word}
    >
      {word}
    </h2>
  );
}
