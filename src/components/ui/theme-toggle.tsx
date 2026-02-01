"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 rounded-full bg-gradient-to-br from-secondary/30 to-secondary/10 hover:from-secondary/50 hover:to-secondary/30 border border-border/20 hover:border-border/40 transition-all duration-300 cursor-pointer overflow-hidden group hover:shadow-lg hover:scale-105"
      aria-label={isDark ? "Light moda geç" : "Dark moda geç"}
    >
      {/* GÜNEŞ İKONU - Dark Mode'dayken göster */}
      <Sun 
        className={`absolute h-[1.3rem] w-[1.3rem] transition-all duration-500 ease-in-out text-amber-500 group-hover:text-amber-400 drop-shadow-sm ${
          isDark 
            ? "rotate-0 scale-100 opacity-100" 
            : "rotate-90 scale-0 opacity-0"
        }`}
        strokeWidth={2.5}
      />
      
      {/* AY İKONU - Light Mode'dayken göster */}
      <Moon 
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out text-indigo-500 group-hover:text-indigo-400 drop-shadow-sm ${
          isDark 
            ? "rotate-90 scale-0 opacity-0" 
            : "rotate-0 scale-100 opacity-100"
        }`}
        strokeWidth={2.5}
      />
      
      {/* Hover efekti için arka plan parıltısı */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <span className="sr-only">
        {isDark ? "Light moda geç" : "Dark moda geç"}
      </span>
    </Button>
  );
}