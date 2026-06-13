"use client";

import { useEffect, useState } from "react";

/** Current time for relative labels; updates on an interval (not during render). */
export function useTickingNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
