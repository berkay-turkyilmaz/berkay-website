"use client";

import dynamic from "next/dynamic";
import { AiLabStaticShell } from "./ai-lab-static-shell";

const TerminalChat = dynamic(() => import("./terminal-chat"), {
  loading: () => <AiLabStaticShell variant="terminal" />,
  ssr: false,
});

export default function AiLabTerminalEntry() {
  return <TerminalChat mode="engineer" enableAgentWorkflow={false} />;
}
