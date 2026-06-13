"use client";

import { useSyncExternalStore } from "react";

/** Avoids SSR/client branch flash without setState-in-effect (mounted guards). */
export function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
