"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  FileText,
  Terminal,
  Video,
  Calendar,
  Settings,
  PanelLeft,
  Plus,
  Send,
  Paperclip,
  Sparkles,
  Bot,
  User,
  GraduationCap,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ← Güncelle: smart.tsx'i koyduğun klasöre göre yolu ayarla
import BarberAppointment from "@/app/[locale]/ai-lab/appointment-system/page";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToolType = "chat" | "prompt" | "pdf" | "smart-assi";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  type: "tool" | "link";
  href?: string;
  /** beta sadece diğer araçlar için gösterilir, smart-assi'de gösterilmez */
  beta?: boolean;
}

interface SidebarSection {
  category: string;
  items: SidebarItem[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AiLabWorkspace() {
  const t = useTranslations("AiLabPage");
  const router = useRouter();

  // Varsayılan olarak kapalı → araç seçilince tam genişlik kullanılır
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolType>("chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  // Araç değiştiğinde textarea'yı temizle
  useEffect(() => {
    setInput("");
  }, [activeTool]);

  const sidebarSections: SidebarSection[] = [
    {
      category: t("sidebar.categories.tools"),
      items: [
        { id: "chat",   label: t("sidebar.items.chat"),   icon: MessageSquare, type: "tool" },
        { id: "pdf",    label: t("sidebar.items.pdf"),    icon: FileText,      type: "tool" },
        { id: "prompt", label: t("sidebar.items.prompt"), icon: Terminal,      type: "tool" },
        {
          id: "english",
          label: "English Lab",
          icon: GraduationCap,
          type: "link",
          href: "/ai-lab/english-practice",
        },
      ],
    },
    {
      category: t("sidebar.categories.apps"),
      items: [
        {
          id: "youtube",
          label: t("sidebar.items.youtube"),
          icon: Video,
          type: "link",
          href: "#",
          beta: true, // Video Analizi hâlâ beta
        },
        {
          id: "smart-assi",
          label: "Randevu Sistemi",
          icon: Calendar,
          type: "tool",
          // beta yok — artık aktif bir özellik
        },
      ],
    },
  ];

  const activeLabel =
    sidebarSections.flatMap((s) => s.items).find((i) => i.id === activeTool)?.label ?? "Chat";

  const handleToolClick = (item: SidebarItem) => {
    if (item.type === "link" && item.href) {
      router.push(item.href as any);
    } else {
      setActiveTool(item.id as ToolType);
      // Her araç seçiminde sidebar kapanır → içerik tam genişlik alır
      setIsSidebarOpen(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "Bu bir demo yanıtıdır. n8n entegrasyonu tamamlandığında burada gerçek bir LLM cevap verecek.",
        timestamp: new Date(),
      },
    ]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/20 relative">

      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 bg-black/50 z-30 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ─── SIDEBAR ─────────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className={cn(
              "flex flex-col overflow-hidden border-r border-border/50 bg-secondary/5",
              isMobile
                ? "fixed inset-y-0 left-0 z-40 bg-background/96 backdrop-blur-xl shadow-2xl"
                : "relative flex-shrink-0"
            )}
          >
            <div className="min-w-[280px] flex flex-col h-full">

              {/* Logo */}
              <div className="p-5 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-black text-sm transition-transform group-hover:rotate-6 shadow-lg shadow-primary/20">
                    B.
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-tight leading-none text-foreground">AI LAB</p>
                    <p className="text-[10px] text-muted-foreground font-mono">Workspace v1.0</p>
                  </div>
                </Link>
                {isMobile && (
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* New Chat */}
              <div className="px-4 mb-5">
                <Button
                  onClick={() => { setMessages([]); if (isMobile) setIsSidebarOpen(false); }}
                  className="w-full justify-start gap-2 h-9 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 shadow-none font-semibold text-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t("sidebar.new_chat")}
                </Button>
              </div>

              {/* Nav */}
              <div className="flex-1 overflow-y-auto px-3 space-y-6 scrollbar-hide pb-4">
                {sidebarSections.map((section, idx) => (
                  <div key={idx}>
                    <div className="px-2 mb-2 text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                      {section.category}
                    </div>
                    <div className="space-y-0.5">
                      {section.items.map((item) => {
                        const isActive = activeTool === item.id;
                        return (
                          <motion.button
                            key={item.id}
                            onClick={() => handleToolClick(item)}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group cursor-pointer relative",
                              isActive
                                ? "bg-secondary text-foreground font-medium"
                                : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-primary")} />
                              <span>{item.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* Beta badge sadece video için */}
                              {item.beta && (
                                <span className="text-[9px] bg-violet-500/10 text-violet-400 px-1.5 py-0.5 rounded border border-violet-500/20 font-mono">
                                  BETA
                                </span>
                              )}
                            </div>
                            {isActive && (
                              <motion.div
                                layoutId="activeBar"
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full"
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* User */}
              <div className="p-4 border-t border-border/40">
                <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-secondary/40 cursor-pointer transition-colors group">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 flex items-center justify-center border border-border">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-semibold text-foreground truncate">Berkay T.</span>
                    <span className="text-[10px] text-muted-foreground truncate">{t("sidebar.user_status")}</span>
                  </div>
                  <Settings className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ─── MAIN ────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col relative min-w-0 h-screen overflow-hidden">

        {/* Header */}
        <header className="h-14 flex-shrink-0 border-b border-border/40 flex items-center px-4 md:px-5 justify-between bg-background/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title={isSidebarOpen ? "Menüyü Kapat" : "Menüyü Aç"}
            >
              <PanelLeft className="w-4.5 h-4.5" />
            </motion.button>
            <div className="h-4 w-px bg-border/50 mx-1" />
            <AnimatePresence mode="wait">
              <motion.span
                key={activeTool}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="text-sm font-semibold text-foreground"
              >
                {activeLabel}
              </motion.span>
            </AnimatePresence>
          </div>
        </header>

        {/* ─── Content ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {activeTool === "smart-assi" ? (

            <motion.div
              key="smart-assi"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
            >
              <BarberAppointment />
            </motion.div>

          ) : (

            <motion.div
              key={activeTool}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex-1 flex flex-col min-h-0"
            >
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                <div className="max-w-3xl mx-auto h-full flex flex-col">
                  {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center pb-10">
                      <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.05 }}
                        className="w-14 h-14 bg-secondary/30 rounded-2xl flex items-center justify-center mb-5 border border-border/50 shadow-lg"
                      >
                        <Sparkles className="w-7 h-7 text-primary" />
                      </motion.div>
                      <h2 className="text-xl font-bold text-foreground mb-2">{t("welcome")}</h2>
                      <p className="text-muted-foreground max-w-xs text-balance leading-relaxed text-sm">
                        {t(`input.placeholders.${activeTool}`)}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7 w-full max-w-md">
                        {[1, 2].map((i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-3 rounded-xl border border-border hover:border-foreground/20 hover:bg-secondary/30 text-left transition-all group cursor-pointer"
                          >
                            <span className="text-xs font-bold text-foreground block mb-1">Örnek Soru {i}</span>
                            <span className="text-[10px] text-muted-foreground line-clamp-1 group-hover:text-primary/80">
                              Modern web mimarisinde AI nasıl kullanılır?
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5 pb-4">
                      {messages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {msg.role === "assistant" && (
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 mt-1 flex-shrink-0">
                              <Bot className="w-3.5 h-3.5 text-primary" />
                            </div>
                          )}
                          <div className={cn(
                            "p-3.5 rounded-2xl max-w-[85%] md:max-w-[75%] text-sm leading-relaxed",
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-secondary/50 border border-border/40 rounded-bl-sm text-foreground"
                          )}>
                            {msg.content}
                          </div>
                        </motion.div>
                      ))}
                      {isLoading && (
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Bot className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <div className="flex gap-1">
                            {[0, 1, 2].map((j) => (
                              <div
                                key={j}
                                className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"
                                style={{ animationDelay: `${j * 0.15}s` }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} className="h-2" />
                    </div>
                  )}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border/40 flex-shrink-0">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-end gap-2 bg-secondary/20 border border-border/40 rounded-2xl p-2 focus-within:border-foreground/20 focus-within:bg-background/50 transition-all">
                    <button className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors cursor-pointer flex-shrink-0">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={t(`input.placeholders.${activeTool}`)}
                      className="flex-1 max-h-48 bg-transparent border-none focus:ring-0 text-sm py-3 px-1 text-foreground placeholder:text-muted-foreground/40 resize-none outline-none"
                      rows={1}
                    />
                    <motion.button
                      whileHover={input.trim() ? { scale: 1.05 } : {}}
                      whileTap={input.trim() ? { scale: 0.95 } : {}}
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md flex-shrink-0 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <p className="text-center text-[10px] text-muted-foreground/35 font-medium uppercase tracking-wider mt-2.5">
                    {t("input.warning")}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}