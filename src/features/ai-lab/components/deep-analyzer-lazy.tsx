"use client";

import dynamic from "next/dynamic";
import { DeepAnalyzerSkeleton } from "./deep-analyzer-skeleton";

const DeepAnalyzerPanel = dynamic(
  () => import("./deep-analyzer-panel"),
  {
    ssr: false,
    loading: () => <DeepAnalyzerSkeleton />,
  }
);

export function DeepAnalyzerLazy() {
  return <DeepAnalyzerPanel />;
}
