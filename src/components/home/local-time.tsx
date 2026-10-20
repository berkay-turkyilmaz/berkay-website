"use client";

import { useEffect, useState } from "react";
import { useMounted } from "@/lib/hooks";

function istanbulTime(locale: string): string {
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Istanbul",
  }).format(new Date());
}

/** Live Istanbul clock. Renders a stable placeholder until hydrated to avoid a mismatch. */
export function LocalTime({ locale }: { locale: string }) {
  const mounted = useMounted();
  const [time, setTime] = useState(() => istanbulTime(locale));

  useEffect(() => {
    const id = setInterval(() => setTime(istanbulTime(locale)), 15_000);
    return () => clearInterval(id);
  }, [locale]);

  return (
    <time className="tabular-nums" suppressHydrationWarning>
      {mounted ? time : "--:--"}
    </time>
  );
}
