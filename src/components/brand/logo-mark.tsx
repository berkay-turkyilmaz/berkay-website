import { cn } from "@/lib/utils";

export const BRAND_NAME = "BERKAY";

/** SVG path — favicon export (Geist-style B) */
export const LOGO_B_PATH =
  "M11.2 7.2h6.8c3.4 0 5.6 1.7 5.6 4.2c0 1.7-0.9 3-2.4 3.6c1.7 0.6 2.8 2 2.8 3.9c0 2.9-2.4 5.1-6 5.1h-6.8V7.2zm3.6 10.4h2.8c1.5 0 2.4-0.8 2.4-1.9c0-1.2-0.9-1.9-2.4-1.9h-2.8v3.8zm0-7.6h2.4c1.2 0 2-0.65 2-1.6c0-0.95-0.8-1.55-2-1.55h-2.4v3.15z";

export const LOGO_VIEWBOX = "0 0 32 32";

type LogoMarkProps = {
  className?: string;
  size?: number;
  /** Subtle idle pulse — disable for static contexts */
  animated?: boolean;
};

export function LogoMark({ className, size = 34, animated = true }: LogoMarkProps) {
  const fontSize = Math.round(size * 0.5);
  const radius = Math.round(size * 0.22);

  return (
    <div
      className={cn(
        "logo-mark relative flex shrink-0 items-center justify-center overflow-hidden font-black leading-none text-foreground",
        "border border-border/50 bg-secondary/40",
        animated && "logo-mark-idle",
        className
      )}
      style={{ width: size, height: size, fontSize, borderRadius: radius }}
      aria-hidden
    >
      <span className="logo-mark-letter relative z-10">B</span>
      {animated && (
        <span
          className="logo-mark-shine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
      )}
    </div>
  );
}
