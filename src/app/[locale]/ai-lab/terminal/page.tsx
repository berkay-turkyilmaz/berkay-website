"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Square, Copy, CheckCheck,
  User, ChevronDown, FileText, X, AlertCircle, UploadCloud, Paperclip,
} from "lucide-react";
import type { WorkspaceSettings } from "@/app/[locale]/ai-lab/page";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChatMode = "terminal" | "pdf" | "engineer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface UploadedDoc {
  name: string;
  chunks: string[];
  totalChunks: number;
  size: number;
}

// Session keys — each mode has its own isolated history
const SESSION_KEYS: Record<ChatMode, string> = {
  terminal: "bex-chat-terminal",
  pdf:      "bex-chat-pdf",
  engineer: "bex-chat-engineer",
};

// ─── Thinking indicator ───────────────────────────────────────────────────────

function ThinkingIndicator({ label }: { label: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <span className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>B</span>
      </div>
      <div className="flex flex-col gap-2 pt-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] italic" style={{ color: "rgba(255,255,255,0.25)" }}>{label}</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div key={i} className="w-1 h-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.2)" }}
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
        <div className="w-40 h-px overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
          <motion.div className="h-full w-16"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
            animate={{ x: [-64, 160] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Code block ───────────────────────────────────────────────────────────────

function CodeBlock({ children, className, copyLabel, copiedLabel }: {
  children: string;
  className?: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const language = className?.replace("language-", "") ?? "code";

  return (
    <div className="relative my-3 rounded-lg overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center justify-between px-4 py-2"
        style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="text-[10px] font-mono uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.2)" }}>{language}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(children); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="flex items-center gap-1.5 text-[10px] transition-colors"
          style={{ color: "rgba(255,255,255,0.25)" }}
          onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}
        >
          {copied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm"
        style={{ background: "rgba(0,0,0,0.45)", color: "rgba(255,255,255,0.68)" }}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ role, content, copyLabel, copiedLabel, errorNetwork, errorStream }: {
  role: "user" | "assistant";
  content: string;
  copyLabel: string;
  copiedLabel: string;
  errorNetwork: string;
  errorStream: string;
}) {
  const [copied, setCopied] = useState(false);
  const isNetworkErr = content === "__ERR_NETWORK__";
  const isStreamErr = content === "__ERR_STREAM__";
  const isExtractErr = content.startsWith("__ERR_EXTRACT__:");
  const isError = isNetworkErr || isStreamErr || isExtractErr;

  if (role === "user") {
    return (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end gap-2.5">
        <div className="max-w-[80%] md:max-w-[70%]">
          <div className="px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.82)" }}>
            {content}
          </div>
        </div>
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <User className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.25)" }} />
        </div>
      </motion.div>
    );
  }

  if (isError) {
    const msg = isNetworkErr
      ? errorNetwork
      : isExtractErr
      ? content.replace("__ERR_EXTRACT__:", "")
      : errorStream;

    return (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <AlertCircle className="w-3.5 h-3.5" style={{ color: "rgba(255,100,100,0.7)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono mb-1.5" style={{ color: "rgba(255,255,255,0.2)" }}>BEX</div>
          <div className="text-sm px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(255,50,50,0.06)", border: "1px solid rgba(255,50,50,0.15)", color: "rgba(255,160,160,0.85)" }}>
            {msg}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5 group">
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <span className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>B</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-mono mb-1.5" style={{ color: "rgba(255,255,255,0.2)" }}>BEX</div>
        <div className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }) {
                const isBlock = className?.startsWith("language-");
                if (isBlock) return (
                  <CodeBlock
                    className={className}
                    copyLabel={copyLabel}
                    copiedLabel={copiedLabel}
                  >
                    {String(children).replace(/\n$/, "")}
                  </CodeBlock>
                );
                return (
                  <code className="px-1.5 py-0.5 rounded text-[13px] font-mono"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.58)", border: "1px solid rgba(255,255,255,0.08)" }}
                    {...props}>{children}</code>
                );
              },
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>{children}</ol>,
              h1: ({ children }) => <h1 className="text-base font-bold mb-2 mt-3 first:mt-0" style={{ color: "rgba(255,255,255,0.88)" }}>{children}</h1>,
              h2: ({ children }) => <h2 className="text-sm font-bold mb-2 mt-3 first:mt-0" style={{ color: "rgba(255,255,255,0.85)" }}>{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0" style={{ color: "rgba(255,255,255,0.75)" }}>{children}</h3>,
              strong: ({ children }) => <strong className="font-semibold" style={{ color: "rgba(255,255,255,0.88)" }}>{children}</strong>,
              blockquote: ({ children }) => (
                <blockquote className="pl-3 italic my-2"
                  style={{ borderLeft: "2px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)" }}>
                  {children}
                </blockquote>
              ),
              table: ({ children }) => <div className="overflow-x-auto my-3"><table className="w-full text-xs border-collapse">{children}</table></div>,
              th: ({ children }) => <th className="px-3 py-2 text-left font-semibold"
                style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.55)" }}>{children}</th>,
              td: ({ children }) => <td className="px-3 py-2"
                style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}>{children}</td>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        <button
          onClick={() => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="mt-2 flex items-center gap-1 text-[10px] transition-colors opacity-0 group-hover:opacity-100"
          style={{ color: "rgba(255,255,255,0.18)" }}
          onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.42)"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.18)"}
        >
          {copied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Doc chip ─────────────────────────────────────────────────────────────────

function DocChip({ doc, onRemove }: { doc: UploadedDoc; onRemove: () => void }) {
  const kb = doc.size < 1024 * 1024
    ? `${(doc.size / 1024).toFixed(0)} KB`
    : `${(doc.size / 1024 / 1024).toFixed(1)} MB`;
  const meta = `${kb} · ${doc.totalChunks}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
    >
      <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.4)" }} />
      <div className="min-w-0">
        <div className="text-[11px] font-medium truncate max-w-[200px]"
          style={{ color: "rgba(255,255,255,0.65)" }}>{doc.name}</div>
        <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.22)" }}>{meta}</div>
      </div>
      <button onClick={onRemove} className="p-0.5 rounded flex-shrink-0 transition-colors"
        style={{ color: "rgba(255,255,255,0.22)" }}
        onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.22)"}
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

// ─── Drop zone ────────────────────────────────────────────────────────────────

function PdfDropZone({ onFile, isLoading, error, dragLabel, formatLabel, readingLabel }: {
  onFile: (file: File) => void;
  isLoading: boolean;
  error: string | null;
  dragLabel: string;
  formatLabel: string;
  readingLabel: string;
}) {
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="mt-6">
      <input ref={ref} type="file" accept=".pdf,.txt,.md" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} />

      <div
        onClick={() => !isLoading && ref.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
        className="flex flex-col items-center justify-center p-10 rounded-2xl transition-all select-none"
        style={{
          border: `1px dashed ${dragging ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}`,
          background: dragging ? "rgba(255,255,255,0.03)" : "transparent",
          cursor: isLoading ? "default" : "pointer",
        }}
        onMouseEnter={e => { if (!isLoading) { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.22)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; } }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = dragging ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.background = dragging ? "rgba(255,255,255,0.03)" : "transparent"; }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <motion.div className="w-8 h-8 rounded-full"
              style={{ border: "2px solid rgba(255,255,255,0.08)", borderTopColor: "rgba(255,255,255,0.45)" }}
              animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{readingLabel}</span>
          </div>
        ) : (
          <>
            <UploadCloud className="w-10 h-10 mb-4" style={{ color: "rgba(255,255,255,0.15)" }} />
            <p className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>{dragLabel}</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>{formatLabel}</p>
          </>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(255,50,50,0.06)", border: "1px solid rgba(255,50,50,0.15)" }}>
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "rgba(255,120,120,0.7)" }} />
            <span className="text-xs leading-relaxed" style={{ color: "rgba(255,160,160,0.85)" }}>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface TerminalPageProps {
  settings?: WorkspaceSettings;
  mode: ChatMode;
}

export default function TerminalPage({ settings, mode }: TerminalPageProps) {
  const t = useTranslations("AiLabPage.chat");

  const safeMode: ChatMode = (["terminal", "pdf", "engineer"] as ChatMode[]).includes(mode)
    ? mode : "terminal";
  const sessionKey = SESSION_KEYS[safeMode];

  // i18n derived config — updates when locale changes
  const modeConfig = {
    terminal: {
      placeholder: t("placeholder_terminal"),
      emptyTitle: t("terminal_empty_title"),
      emptyDesc: t("terminal_empty_desc"),
    },
    pdf: {
      placeholder: t("placeholder_pdf_empty"),
      emptyTitle: t("pdf_empty_title"),
      emptyDesc: t("pdf_empty_desc"),
    },
    engineer: {
      placeholder: t("placeholder_engineer"),
      emptyTitle: t("engineer_empty_title"),
      emptyDesc: t("engineer_empty_desc"),
    },
  };

  const suggestedQuestions: Record<ChatMode, string[]> = {
    terminal: [
      t("suggested_terminal_1"),
      t("suggested_terminal_2"),
      t("suggested_terminal_3"),
      t("suggested_terminal_4"),
    ],
    pdf: [
      t("suggested_pdf_1"),
      t("suggested_pdf_2"),
      t("suggested_pdf_3"),
      t("suggested_pdf_4"),
    ],
    engineer: [
      t("suggested_engineer_1"),
      t("suggested_engineer_2"),
      t("suggested_engineer_3"),
      t("suggested_engineer_4"),
    ],
  };

  const config = modeConfig[safeMode];

  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState<UploadedDoc | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Mount + load persisted messages AFTER hydration
  useEffect(() => {
    setMounted(true);
    try {
      const saved = sessionStorage.getItem(sessionKey);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  }, [sessionKey]);

  useEffect(() => {
    if (!mounted) return;
    sessionStorage.setItem(sessionKey, JSON.stringify(messages));
  }, [messages, sessionKey, mounted]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const h = () => setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
    el.addEventListener("scroll", h);
    return () => el.removeEventListener("scroll", h);
  }, []);

  // Expose clear — workspace calls this for "New Chat"
  useEffect(() => {
    (window as Window & { bexClear?: () => void }).bexClear = () => {
      setMessages([]);
      setUploadedDoc(null);
      setUploadError(null);
      sessionStorage.removeItem(sessionKey);
    };
    return () => { delete (window as Window & { bexClear?: () => void }).bexClear; };
  }, [sessionKey]);

  // ── File upload ────────────────────────────────────────────────────────────

  const handleFile = useCallback(async (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      setUploadError("Dosya çok büyük. Maksimum 20 MB.");
      return;
    }
    setIsUploading(true);
    setUploadError(null);
    setUploadedDoc(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/pdf", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setUploadError(data.error ?? "Dosya işlenemedi."); return; }
      setUploadedDoc({
        name: data.fileName ?? file.name,
        chunks: data.chunks ?? [],
        totalChunks: data.totalChunks ?? 0,
        size: file.size,
      });
    } catch {
      setUploadError("Sunucuya bağlanılamadı. Tekrar dene.");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const stop = () => { abortRef.current?.abort(); setIsLoading(false); };

  const canSend = !isLoading && (
    input.trim().length > 0 ||
    (safeMode === "pdf" && uploadedDoc !== null)
  );

  // ── Send ───────────────────────────────────────────────────────────────────

  const sendMessage = useCallback(async () => {
    const text = input.trim() ||
      (safeMode === "pdf" && uploadedDoc ? t("suggested_pdf_1") : "");
    if (!text || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages(p => [...p, { id: assistantId, role: "assistant", content: "" }]);
    abortRef.current = new AbortController();

    // Language: use settings if set, otherwise auto-detect from locale
    const lang = settings?.language ?? "tr";

    try {
      const body = safeMode === "pdf"
        ? {
            messages: next.map(m => ({ role: m.role, content: m.content })),
            chunks: uploadedDoc?.chunks ?? [],
            fileName: uploadedDoc?.name ?? "document",
            model: settings?.model ?? "llama-3.1-8b-instant",
            responseLength: settings?.responseLength ?? "medium",
            temperature: settings?.temperature ?? 0.4,
            language: lang,
          }
        : {
            messages: next.map(m => ({ role: m.role, content: m.content })),
            mode: safeMode,
            model: settings?.model ?? "llama-3.1-8b-instant",
            responseLength: settings?.responseLength ?? "medium",
            temperature: settings?.temperature ?? 0.7,
            language: lang,
          };

      const res = await fetch(safeMode === "pdf" ? "/api/pdf" : "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        let errMsg = "__ERR_STREAM__";
        try { const j = await res.json(); if (j.error) errMsg = `__ERR_EXTRACT__:${j.error}`; } catch {}
        setMessages(p => p.map(m => m.id === assistantId ? { ...m, content: errMsg } : m));
        return;
      }

      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages(p => p.map(m => m.id === assistantId ? { ...m, content: acc } : m));
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMessages(p => p.map(m =>
        m.id === assistantId
          ? { ...m, content: err instanceof TypeError ? "__ERR_NETWORK__" : "__ERR_STREAM__" }
          : m
      ));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, safeMode, settings, uploadedDoc, t]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Placeholder text
  const placeholderText = safeMode === "pdf" && uploadedDoc
    ? `"${uploadedDoc.name}" ${t("placeholder_pdf_loaded")}`
    : safeMode === "pdf" && !uploadedDoc
    ? t("placeholder_pdf_empty")
    : config.placeholder;

  // Don't render message-dependent UI until client is mounted
  // This prevents hydration mismatch from sessionStorage
  if (!mounted) {
    return (
      <div className="flex flex-col h-full" style={{ background: "#000" }}>
        <div className="flex-1" />
        <div className="flex-shrink-0 px-6 pb-6 pt-3" style={{ background: "#000" }}>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end gap-2 p-2.5 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
              <div className="w-8 flex-shrink-0" />
              <div className="flex-1 py-2 px-1 text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>
                {config.placeholder}
              </div>
              <div className="p-2 rounded-xl flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.06)", width: 36, height: 36 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#000" }}
      onDragOver={safeMode === "pdf" ? e => e.preventDefault() : undefined}
      onDrop={safeMode === "pdf" ? e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); } : undefined}
    >
      {/* Hidden file input — used by paperclip in PDF mode */}
      <input ref={fileInputRef} type="file" accept=".pdf,.txt,.md" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}>
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (

              /* Empty state */
              <motion.div key="empty" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex flex-col justify-center min-h-[calc(100vh-200px)]">
                <div className="mb-10">
                  <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.05 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>B</span>
                  </motion.div>
                  <h2 className="text-xl font-semibold mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {config.emptyTitle}
                  </h2>
                  <p className="text-sm leading-relaxed max-w-md" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {config.emptyDesc}
                  </p>

                  {/* PDF drop zone */}
                  {safeMode === "pdf" && !uploadedDoc && (
                    <PdfDropZone
                      onFile={handleFile}
                      isLoading={isUploading}
                      error={uploadError}
                      dragLabel={t("upload_drag")}
                      formatLabel={t("upload_formats")}
                      readingLabel={t("upload_reading")}
                    />
                  )}
                </div>

                {/* Suggested questions — shown only when ready to chat */}
                {(safeMode !== "pdf" || uploadedDoc) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestedQuestions[safeMode].map((q, i) => (
                      <motion.button key={q} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.06 }} onClick={() => setInput(q)}
                        className="text-left p-3.5 rounded-xl transition-all"
                        style={{ border: "1px solid rgba(255,255,255,0.06)", background: "transparent" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}>
                        <span className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.28)" }}>{q}</span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>

            ) : (

              /* Message list */
              <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-7 py-2">
                {messages
                  .filter(m => !(m.role === "assistant" && m.content === ""))
                  .map(m => (
                    <MessageBubble
                      key={m.id}
                      role={m.role}
                      content={m.content}
                      copyLabel={t("copy")}
                      copiedLabel={t("copied")}
                      errorNetwork={t("error_network")}
                      errorStream={t("error_stream")}
                    />
                  ))}
                {isLoading && messages[messages.length - 1]?.content === "" && (
                  <ThinkingIndicator label={t("thinking")} />
                )}
                <div ref={messagesEndRef} className="h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Scroll-to-bottom button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="absolute bottom-28 right-8 w-8 h-8 rounded-full flex items-center justify-center z-10"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <ChevronDown className="w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Input area ── */}
      <div className="flex-shrink-0 px-6 pb-6 pt-3" style={{ background: "#000" }}>
        <div className="max-w-2xl mx-auto">

          {/* Uploaded doc chip */}
          <AnimatePresence>
            {uploadedDoc && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex items-center gap-2.5"
              >
                <DocChip doc={uploadedDoc} onRemove={() => { setUploadedDoc(null); setUploadError(null); }} />
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {t("uploaded_label")}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input box */}
          <div className="flex items-end gap-2 p-2.5 rounded-2xl transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
            onFocusCapture={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
            onBlurCapture={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}>

            {/* Paperclip — visible only in pdf mode, no spacer in other modes */}
            {safeMode === "pdf" && (
              <button
                onClick={() => !isUploading && fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-2 rounded-xl flex-shrink-0 transition-colors"
                style={{ color: uploadedDoc ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
                onMouseLeave={e => e.currentTarget.style.color = uploadedDoc ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)"}
              >
                {isUploading ? (
                  <motion.div className="w-4 h-4 rounded-full"
                    style={{ border: "1.5px solid rgba(255,255,255,0.1)", borderTopColor: "rgba(255,255,255,0.5)" }}
                    animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                ) : (
                  <Paperclip className="w-4 h-4" />
                )}
              </button>
            )}

            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholderText}
              disabled={safeMode === "pdf" && !uploadedDoc && !isUploading}
              rows={1}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1 resize-none outline-none max-h-40 disabled:opacity-40"
              style={{ color: "rgba(255,255,255,0.78)", caretColor: "rgba(255,255,255,0.6)" }}
            />

            {/* Stop / Send */}
            {isLoading ? (
              <motion.button whileTap={{ scale: 0.95 }} onClick={stop}
                className="p-2 rounded-xl flex-shrink-0 transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}>
                <Square className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={canSend ? { scale: 1.04 } : {}}
                whileTap={canSend ? { scale: 0.95 } : {}}
                onClick={sendMessage}
                disabled={!canSend}
                className="p-2 rounded-xl flex-shrink-0 transition-all"
                style={{
                  background: canSend ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.06)",
                  color: canSend ? "#000" : "rgba(255,255,255,0.2)",
                  cursor: canSend ? "pointer" : "not-allowed",
                  boxShadow: canSend ? "0 2px 16px rgba(255,255,255,0.08)" : "none",
                }}>
                <Send className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {/* Footer warning */}
          <p className="text-center text-[10px] mt-2 tracking-wider"
            style={{ color: "rgba(255,255,255,0.07)", fontVariant: "small-caps" }}>
            {t("footer_warning")}
          </p>
        </div>
      </div>
    </div>
  );
}