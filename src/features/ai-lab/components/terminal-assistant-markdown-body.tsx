"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { TerminalCodeBlock } from "./terminal-code-block";

export type TerminalAssistantMarkdownBodyProps = {
  content: string;
  copyLabel: string;
  copiedLabel: string;
};

export default function TerminalAssistantMarkdownBody({
  content,
  copyLabel,
  copiedLabel,
}: TerminalAssistantMarkdownBodyProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const isBlock = className?.startsWith("language-");
          if (isBlock)
            return (
              <TerminalCodeBlock
                className={className}
                copyLabel={copyLabel}
                copiedLabel={copiedLabel}
              >
                {String(children).replace(/\n$/, "")}
              </TerminalCodeBlock>
            );
          return (
            <code
              className={cn(
                "px-1.5 py-0.5 rounded text-[13px] font-mono",
                "bg-ailab-glass-08 text-ailab-text/90 ring-1 ring-inset ring-ailab-border"
              )}
              {...props}
            >
              {children}
            </code>
          );
        },
        p: ({ children }) => <p className="mb-2 last:mb-0 text-ailab-text/88">{children}</p>,
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-1 mb-2 text-ailab-text/70">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1 mb-2 text-ailab-text/70">{children}</ol>
        ),
        h1: ({ children }) => (
          <h1 className="text-base font-bold mb-2 mt-3 first:mt-0 text-ailab-text/96">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-sm font-bold mb-2 mt-3 first:mt-0 text-ailab-text/94">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0 text-ailab-text/90">{children}</h3>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-ailab-text/96">{children}</strong>
        ),
        blockquote: ({ children }) => (
          <blockquote
            className="pl-3 italic my-2 border-l-2 border-ailab-border-selected text-ailab-text/65"
          >
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-3 ailab-scrollbar">
            <table className="w-full text-xs border-collapse">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="px-3 py-2 text-left font-semibold border border-ailab-border bg-ailab-glass-05 text-ailab-text/80">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 border border-ailab-border-muted text-ailab-text/70">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
