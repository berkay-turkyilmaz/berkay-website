import type { ReactNode } from "react";
import { AiLabShell } from "@/features/ai-lab/components/ai-lab-shell";

export default function AiLabWorkspaceLayout({ children }: { children: ReactNode }) {
  return <AiLabShell>{children}</AiLabShell>;
}
