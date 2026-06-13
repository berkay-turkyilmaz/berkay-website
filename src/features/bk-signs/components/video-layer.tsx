"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type VideoLayerProps = {
  src: string;
  className?: string;
  loop?: boolean;
  active?: boolean;
};

export function VideoLayer({ src, className, loop = true, active = true }: VideoLayerProps) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(src, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setAvailable(res.ok);
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!available) return null;

  return (
    <video
      src={src}
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
      autoPlay={active}
      muted
      playsInline
      loop={loop}
      preload="metadata"
    />
  );
}
