"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, FileText, Terminal, Video, Calendar,
  Settings, PanelLeft, Plus, Send, Paperclip,
  Sparkles, Bot, User, Command
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ToolType = 'chat' | 'prompt' | 'pdf';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AiLabWorkspace() {
  const t = useTranslations("AiLabPage");
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTool, setActiveTool] = useState<ToolType>('chat');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Otomatik Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Textarea otomatik yükseklik
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const sidebarItems = [
    {
      category: t("sidebar.categories.tools"),
      items: [
        { id: 'chat', label: t("sidebar.items.chat"), icon: MessageSquare, type: 'tool', beta: false },
        { id: 'pdf', label: t("sidebar.items.pdf"), icon: FileText, type: 'tool', beta: false },
        { id: 'prompt', label: t("sidebar.items.prompt"), icon: Terminal, type: 'tool', beta: false },
      ]
    },
    {
      category: t("sidebar.categories.apps"),
      items: [
        { id: 'youtube', label: t("sidebar.items.youtube"), icon: Video, type: 'link', href: '#', beta: true },
        { id: 'scheduler', label: t("sidebar.items.scheduler"), icon: Calendar, type: 'link', href: '#', beta: true },
      ]
    }
  ];

  const handleToolClick = (item: any) => {
    if (item.type === 'link') {
       // Link mantığı
    } else {
       setActiveTool(item.id as ToolType);
       if (window.innerWidth < 768) setIsSidebarOpen(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiMsg: Message = {
        role: 'assistant',
        content: "Bu bir demo yanıtıdır. n8n entegrasyonu tamamlandığında burada gerçek bir LLM cevap verecek.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/20">

      {/* --- SIDEBAR --- */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="flex-shrink-0 bg-secondary/10 border-r border-border flex flex-col overflow-hidden relative"
      >
        <div className="p-6 flex items-center gap-3 mb-2">
           <Link href="/" className="flex items-center gap-3 group w-full cursor-pointer">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-black transition-transform group-hover:rotate-6 shadow-lg shadow-primary/20">
                 B.
              </div>
              <div className="flex flex-col overflow-hidden">
                 <span className="font-bold text-sm tracking-tight leading-none text-foreground whitespace-nowrap">AI LAB</span>
                 <span className="text-[10px] text-muted-foreground font-mono truncate">Workspace v1.0</span>
              </div>
           </Link>
        </div>

        <div className="px-4 mb-6">
           <Button 
             onClick={() => setMessages([])}
             className="w-full justify-start gap-2 h-10 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 shadow-none font-semibold cursor-pointer"
           >
              <Plus className="w-4 h-4" />
              {t("sidebar.new_chat")}
           </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-8 scrollbar-hide">
           {sidebarItems.map((section, idx) => (
              <div key={idx}>
                 <div className="px-2 mb-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                    {section.category}
                 </div>
                 <div className="space-y-1">
                    {section.items.map((item) => (
                       <button
                          key={item.id}
                          onClick={() => handleToolClick(item)}
                          className={cn(
                             "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 group relative overflow-hidden cursor-pointer",
                             activeTool === item.id 
                                ? "bg-secondary text-foreground font-medium shadow-sm" 
                                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                          )}
                       >
                          <div className="flex items-center gap-3 relative z-10">
                             <item.icon className={cn("w-4 h-4", activeTool === item.id ? "text-primary" : "text-muted-foreground group-hover:text-primary transition-colors")} />
                             <span>{item.label}</span>
                          </div>
                          {item.beta && (
                             <span className="text-[9px] bg-purple-500/10 text-purple-500 px-1.5 py-0.5 rounded border border-purple-500/20 font-mono">BETA</span>
                          )}
                       </button>
                    ))}
                 </div>
              </div>
           ))}
        </div>

        <div className="p-4 border-t border-border mt-auto">
           <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 flex items-center justify-center border border-border shadow-inner">
                 <User className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="flex flex-col min-w-0">
                 <span className="text-sm font-medium text-foreground truncate">Berkay T.</span>
                 <span className="text-[10px] text-muted-foreground truncate">{t("sidebar.user_status")}</span>
              </div>
              <Settings className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-foreground transition-colors" />
           </div>
        </div>
      </motion.aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col relative min-w-0 bg-background h-screen">
        
        {/* HEADER */}
        <header className="h-16 flex-shrink-0 border-b border-border flex items-center px-4 md:px-6 justify-between bg-background/80 backdrop-blur-md sticky top-0 z-20">
           <div className="flex items-center gap-3">
              <button
                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                 className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                 <PanelLeft className="w-5 h-5" />
              </button>
              <div className="h-4 w-px bg-border mx-2" />
              <div className="flex items-center gap-2">
                 <span className="text-sm font-semibold text-foreground">
                    {sidebarItems.flatMap(g => g.items).find(t => t.id === activeTool)?.label}
                 </span>
              </div>
           </div>
        </header>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
           <div className="max-w-3xl mx-auto h-full flex flex-col">
              
              {/* WELCOME SCREEN (Centered) */}
              {messages.length === 0 ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500 pb-10">
                    <div className="w-16 h-16 bg-secondary/30 rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-border/50 backdrop-blur-sm">
                       <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-3">{t('welcome')}</h2>
                    <p className="text-muted-foreground max-w-sm text-balance leading-relaxed text-sm">
                       {t(`input.placeholders.${activeTool}`)}
                    </p>
                    
                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-lg">
                       {[1, 2].map((i) => (
                          <button key={i} className="p-3 rounded-xl border border-border hover:border-foreground/20 hover:bg-secondary/30 text-left transition-all group cursor-pointer">
                             <span className="text-xs font-bold text-foreground block mb-1">Örnek Soru {i}</span>
                             <span className="text-[10px] text-muted-foreground line-clamp-1 group-hover:text-primary/80">
                                Modern web mimarisinde AI nasıl kullanılır?
                             </span>
                          </button>
                       ))}
                    </div>
                 </div>
              ) : (
                 // MESSAGES LIST
                 <div className="space-y-6 pb-4">
                    {messages.map((msg, i) => (
                        <motion.div 
                           key={i} 
                           initial={{ opacity: 0, y: 10 }} 
                           animate={{ opacity: 1, y: 0 }} 
                           className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                           {msg.role === 'assistant' && (
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 mt-1 flex-shrink-0">
                                 <Bot className="w-4 h-4 text-primary" />
                              </div>
                           )}

                           <div className={cn(
                              "p-3.5 rounded-2xl max-w-[85%] md:max-w-[75%] text-sm leading-relaxed shadow-sm",
                              msg.role === 'user' 
                                 ? "bg-primary text-primary-foreground rounded-br-sm" 
                                 : "bg-secondary/50 border border-border rounded-bl-sm text-foreground"
                           )}>
                              {msg.content}
                           </div>
                        </motion.div>
                     ))}

                    {isLoading && (
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                             <Bot className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex gap-1">
                             <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                             <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                             <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                          </div>
                       </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                 </div>
              )}
           </div>
        </div>

        {/* INPUT AREA (Fixed Bottom) */}
        <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border z-20">
           <div className="max-w-3xl mx-auto">
              <div className="relative flex items-end gap-2 bg-secondary/20 border border-border rounded-2xl p-2 transition-all focus-within:border-foreground/20 focus-within:bg-background focus-within:shadow-sm">
                 
                 <button className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors cursor-pointer" title="Attach file">
                    <Paperclip className="w-5 h-5" />
                 </button>

                 <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t(`input.placeholders.${activeTool}`)}
                    className="flex-1 max-h-48 bg-transparent border-none focus:ring-0 text-sm py-3 px-2 text-foreground placeholder:text-muted-foreground/50 resize-none outline-none"
                    rows={1}
                 />

                 <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md cursor-pointer"
                 >
                    <Send className="w-4 h-4" />
                 </button>
              </div>

              <div className="flex items-center justify-center gap-2 mt-3 opacity-60">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                     {t("input.warning")}
                  </span>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
}