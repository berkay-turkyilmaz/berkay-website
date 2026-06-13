"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { SESSION_KEYS } from "../constants";
import type { BexChatMessage, ChatMode, UploadedDoc, WorkspaceSettings } from "../types";
import { useAgentWorkflow } from "./use-agent-workflow";

export interface UseBexTerminalChatOptions {
  mode: ChatMode;
  settings?: WorkspaceSettings;
  /** When false (default), stream starts immediately — no AgentStateFlow. */
  enableAgentWorkflow?: boolean;
}

export function useBexTerminalChat({
  mode,
  settings,
  enableAgentWorkflow = false,
}: UseBexTerminalChatOptions) {
  const t = useTranslations("AiLabPage.chat");

  const safeMode: ChatMode = (["terminal", "pdf", "engineer"] as ChatMode[]).includes(mode)
    ? mode
    : "terminal";
  const sessionKey = SESSION_KEYS[safeMode];

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
  const [messages, setMessages] = useState<BexChatMessage[]>([]);
  const [activeSessionKey, setActiveSessionKey] = useState<string>("");
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
  const { workflowUi, runWorkflow, completeExitAnimation } = useAgentWorkflow();

  useEffect(() => {
    setMounted(true);
    try {
      const saved = sessionStorage.getItem(sessionKey);
      setMessages(saved ? JSON.parse(saved) : []);
    } catch {
      setMessages([]);
    }

    setActiveSessionKey(sessionKey);

    if (safeMode !== "pdf") {
      setUploadedDoc(null);
      setUploadError(null);
    }
  }, [sessionKey, safeMode]);

  useEffect(() => {
    if (!mounted) return;
    if (activeSessionKey === sessionKey) {
      sessionStorage.setItem(sessionKey, JSON.stringify(messages));
    }
  }, [messages, activeSessionKey, sessionKey, mounted]);

  const displayMessages = useMemo(
    () => (activeSessionKey === sessionKey ? messages : []),
    [activeSessionKey, sessionKey, messages]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages, isLoading]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const h = () =>
      setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
    el.addEventListener("scroll", h);
    return () => el.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    (window as Window & { bexClear?: () => void }).bexClear = () => {
      setMessages([]);
      setUploadedDoc(null);
      setUploadError(null);
      sessionStorage.removeItem(sessionKey);
    };
    return () => {
      delete (window as Window & { bexClear?: () => void }).bexClear;
    };
  }, [sessionKey]);

  const handleFile = useCallback(async (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      setUploadError(t("error_file_too_large"));
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
      if (!res.ok) {
        setUploadError(data.error ?? t("error_file_process"));
        return;
      }
      setUploadedDoc({
        name: data.fileName ?? file.name,
        chunks: data.chunks ?? [],
        totalChunks: data.totalChunks ?? 0,
        size: file.size,
      });
    } catch {
      setUploadError(t("error_server_connect"));
    } finally {
      setIsUploading(false);
    }
  }, [t]);

  const stop = () => {
    abortRef.current?.abort();
    setIsLoading(false);
  };

  const canSend =
    !isLoading &&
    (input.trim().length > 0 ||
      (safeMode === "pdf" && uploadedDoc !== null));

  const sendMessage = useCallback(async () => {
    const text =
      input.trim() ||
      (safeMode === "pdf" && uploadedDoc ? t("suggested_pdf_1") : "");
    if (!text || isLoading) return;

    const userMsg: BexChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages((p) => [
      ...p,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    const lang = settings?.language ?? "tr";

    try {
      if (enableAgentWorkflow) {
        await runWorkflow(assistantId, signal);
      }

      const body =
        safeMode === "pdf"
          ? {
              messages: next.map((m) => ({ role: m.role, content: m.content })),
              chunks: uploadedDoc?.chunks ?? [],
              fileName: uploadedDoc?.name ?? "document",
              model: settings?.model ?? "llama-3.1-8b-instant",
              responseLength: settings?.responseLength ?? "medium",
              temperature: settings?.temperature ?? 0.4,
              language: lang,
            }
          : {
              messages: next.map((m) => ({ role: m.role, content: m.content })),
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
        signal,
      });

      if (!res.ok) {
        let errMsg = "__ERR_STREAM__";
        try {
          const j = await res.json();
          if (res.status === 503) {
            errMsg = `__ERR_EXTRACT__:${t("error_api_key")}`;
          } else if (j.error) {
            errMsg = `__ERR_EXTRACT__:${j.error}`;
          }
        } catch {
          /* ignore */
        }
        setMessages((p) =>
          p.map((m) =>
            m.id === assistantId ? { ...m, content: errMsg } : m
          )
        );
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
        setMessages((p) =>
          p.map((m) =>
            m.id === assistantId ? { ...m, content: acc } : m
          )
        );
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (err instanceof Error && err.name === "AbortError") return;
      setMessages((p) =>
        p.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  err instanceof TypeError
                    ? "__ERR_NETWORK__"
                    : "__ERR_STREAM__",
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    input,
    isLoading,
    messages,
    safeMode,
    settings,
    uploadedDoc,
    t,
    runWorkflow,
    enableAgentWorkflow,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const placeholderText =
    safeMode === "pdf" && uploadedDoc
      ? `"${uploadedDoc.name}" ${t("placeholder_pdf_loaded")}`
      : safeMode === "pdf" && !uploadedDoc
        ? t("placeholder_pdf_empty")
        : config.placeholder;

  const scrollToEnd = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  return {
    t,
    mounted,
    safeMode,
    config,
    suggestedQuestions,
    displayMessages,
    input,
    setInput,
    isLoading,
    sendMessage,
    stop,
    handleKeyDown,
    canSend,
    scrollRef,
    messagesEndRef,
    textareaRef,
    fileInputRef,
    showScrollBtn,
    uploadedDoc,
    setUploadedDoc,
    isUploading,
    uploadError,
    setUploadError,
    handleFile,
    placeholderText,
    scrollToEnd,
    workflowUi,
    completeExitAnimation,
  };
}
