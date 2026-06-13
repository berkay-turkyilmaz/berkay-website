"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { TerminalAssistantMarkdownBodyProps } from "./terminal-assistant-markdown-body";

/**
 * Streams plain text until the markdown chunk loads — avoids blocking initial JS with remark/react-markdown.
 */
export function TerminalAssistantMarkdownBlock(props: TerminalAssistantMarkdownBodyProps) {
  const [Body, setBody] = useState<ComponentType<TerminalAssistantMarkdownBodyProps> | null>(null);

  useEffect(() => {
    let alive = true;
    void import("./terminal-assistant-markdown-body").then((mod) => {
      if (alive) setBody(() => mod.default);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!Body) {
    return (
      <div className="text-sm leading-relaxed whitespace-pre-wrap break-words text-ailab-text/88">
        {props.content}
      </div>
    );
  }

  return <Body {...props} />;
}
