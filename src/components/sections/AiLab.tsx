"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, FileText, Terminal, MessageSquare, Upload, 
  Loader2, Cpu, Cloud, Sparkles, Zap, Brain,
  CheckCircle2, X, Copy, Download, AlertCircle, TrendingUp
} from 'lucide-react';

type TabType = 'chat' | 'prompt' | 'pdf';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  provider?: string;
}

export default function AiLab() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCopied, setShowCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleProcess = async () => {
    if ((activeTab !== 'pdf' && !input.trim()) || (activeTab === 'pdf' && !file)) return;

    const userMessage: Message = {
      role: 'user',
      content: activeTab === 'pdf' ? `📄 ${file!.name}` : input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    // Simulate API call
    setTimeout(() => {
      let aiResponse = '';
      let provider = '';

      if (activeTab === 'pdf') {
        aiResponse = "📊 Analiz Özeti:\n\n✓ Kuantum fiziğine giriş niteliğinde akademik materyal\n✓ 3 ana bölüm: Schrödinger deneyleri, dalga-parçacık dualitesi, belirsizlik prensibi\n✓ Matematiksel formülasyonlar ve pratik uygulamalar içeriyor\n\n💡 Önerilen çalışma sırası: Önce temel kavramları öğrenin, ardından matematiksel detaylara geçin.";
        provider = 'Ollama Llama-3';
      } else if (activeTab === 'prompt') {
        aiResponse = `🎯 Optimize Edilmiş Prompt:\n\n"Sen uzman bir siber güvenlik analisti ve penetrasyon testi uzmanısın. Aşağıdaki kod bloğunu incele:\n\n${input.substring(0, 50)}...\n\n1. Tüm SQL injection açıklarını tespit et\n2. Her açık için risk seviyesi belirle (Kritik/Yüksek/Orta)\n3. Düzeltme kodu örnekleri sun\n4. OWASP standartlarına göre raporla\n\nÇıktı formatı: JSON"`;
        provider = 'Ollama Llama-3';
      } else {
        aiResponse = "Modern full-stack geliştirme için harika bir yol izliyorsunuz! 🚀\n\nPortföyünüzde dikkat çeken noktalar:\n• Next.js 14 App Router kullanımı\n• TypeScript ile tip güvenliği\n• Tailwind CSS ile modern UI\n• API route'ları ile backend entegrasyonu\n\n💡 Öneri: Şimdi authentication (NextAuth.js) ve database (Prisma + PostgreSQL) ekleyerek tam bir production app yapabilirsiniz.";
        provider = 'Google Gemini';
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        provider: provider
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      setFile(null);
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.size <= 5 * 1024 * 1024) {
      setFile(selectedFile);
    } else {
      // Better error handling with toast would be ideal
      alert("Lütfen 5MB'dan küçük bir PDF dosyası seçin.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleProcess();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const clearConversation = () => {
    setMessages([]);
    setInput('');
    setFile(null);
  };

  const tabs = [
    { 
      id: 'chat', 
      label: 'Chat', 
      fullLabel: 'General Chat',
      icon: MessageSquare, 
      color: 'blue',
      description: 'Real-time responses powered by Google Gemini',
      provider: 'Gemini',
      providerColor: 'blue'
    },
    { 
      id: 'prompt', 
      label: 'Prompt', 
      fullLabel: 'Prompt Engineering',
      icon: Terminal, 
      color: 'purple',
      description: 'Transform ideas into professional prompts locally',
      provider: 'Ollama',
      providerColor: 'emerald'
    },
    { 
      id: 'pdf', 
      label: 'PDF', 
      fullLabel: 'PDF Analysis',
      icon: FileText, 
      color: 'emerald',
      description: 'Private document analysis on your machine',
      provider: 'Ollama',
      providerColor: 'emerald'
    }
  ];

  const currentTab = tabs.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative">
      
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Fixed Header */}
        <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              
              {/* Logo & Title */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50" />
                  <div className="relative p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                    <Brain className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-bold text-foreground">AI Lab</h1>
                  <p className="text-xs text-slate-500 hidden sm:block">Hybrid Intelligence Platform</p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800/50">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs text-slate-400">2 Models Online</span>
                  </div>
                </div>
                {messages.length > 0 && (
                  <button
                    onClick={clearConversation}
                    className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-foreground transition-colors"
                    title="Clear conversation"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
          
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 p-1 rounded-xl bg-slate-900/50 border border-slate-800/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { 
                  setActiveTab(tab.id as TabType); 
                  clearConversation();
                }}
                className={`relative flex-1 group py-3 px-4 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-slate-800 shadow-lg' 
                    : 'hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <tab.icon className={`w-4 h-4 transition-colors ${
                    activeTab === tab.id ? `text-${tab.color}-400` : 'text-slate-500'
                  }`} />
                  <span className={`text-sm font-medium transition-colors hidden sm:inline ${
                    activeTab === tab.id ? 'text-foreground' : 'text-slate-500'
                  }`}>
                    {tab.fullLabel}
                  </span>
                  <span className={`text-sm font-medium transition-colors sm:hidden ${
                    activeTab === tab.id ? 'text-foreground' : 'text-slate-500'
                  }`}>
                    {tab.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="mb-4">
            {messages.length === 0 ? (
              // Empty State
              <div className="text-center py-12 md:py-20">
                <div className="inline-flex p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50 mb-6">
                  <currentTab.icon className={`w-8 h-8 md:w-12 md:h-12 text-${currentTab.color}-400`} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                  {currentTab.fullLabel}
                </h2>
                <p className="text-sm md:text-base text-slate-400 max-w-md mx-auto mb-6">
                  {currentTab.description}
                </p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${currentTab.color}-500/10 border border-${currentTab.color}-500/20`}>
                  {currentTab.provider === 'Gemini' ? (
                    <Cloud className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Cpu className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className={`text-xs font-medium text-${currentTab.providerColor}-400`}>
                    Powered by {currentTab.provider}
                  </span>
                </div>
              </div>
            ) : (
              // Messages
              <div className="space-y-6 mb-4">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 md:gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-${currentTab.color}-500 to-${currentTab.color}-600 flex items-center justify-center`}>
                        <Sparkles className="w-4 h-4 text-foreground" />
                      </div>
                    )}
                    
                    <div className={`flex-1 max-w-[85%] md:max-w-[75%] ${message.role === 'user' ? 'order-1' : ''}`}>
                      <div className={`rounded-2xl p-4 ${
                        message.role === 'user' 
                          ? 'bg-blue-600 text-foreground' 
                          : 'bg-slate-900/50 border border-slate-800/50 text-slate-100'
                      }`}>
                        <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                          {message.content}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 px-2">
                        <span className="text-xs text-slate-500">
                          {message.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.provider && (
                          <>
                            <span className="text-slate-700">•</span>
                            <span className="text-xs text-slate-500">{message.provider}</span>
                          </>
                        )}
                        {message.role === 'assistant' && (
                          <>
                            <span className="text-slate-700">•</span>
                            <button
                              onClick={() => copyToClipboard(message.content)}
                              className="text-slate-500 hover:text-slate-300 transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-foreground text-sm font-semibold">
                        U
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-${currentTab.color}-500 to-${currentTab.color}-600 flex items-center justify-center`}>
                  <Sparkles className="w-4 h-4 text-foreground" />
                </div>
                <div className="flex-1">
                  <div className="rounded-2xl p-4 bg-slate-900/50 border border-slate-800/50">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Processing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Input Area */}
        <div className="sticky bottom-0 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800/50">
          <div className="max-w-5xl mx-auto px-4 py-4">
            
            {activeTab === 'pdf' ? (
              <div className="space-y-3">
                {file && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-emerald-400 flex-1 truncate">{file.name}</span>
                    <button
                      onClick={() => setFile(null)}
                      className="p-1 hover:bg-emerald-500/20 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-emerald-400" />
                    </button>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-3 rounded-xl border-2 border-dashed border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium text-slate-400 hover:text-emerald-400"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{file ? 'Change File' : 'Upload PDF'}</span>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept=".pdf" 
                  />
                  
                  <button
                    onClick={handleProcess}
                    disabled={!file || isLoading}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span className="hidden sm:inline">Analyze</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Message AI Lab... (Shift+Enter for new line)`}
                    rows={1}
                    className="w-full max-h-32 bg-slate-900/50 border border-slate-800/50 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                    style={{ minHeight: '48px' }}
                  />
                  {input && (
                    <button
                      onClick={() => setInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-800 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-500" />
                    </button>
                  )}
                </div>
                
                <button
                  onClick={handleProcess}
                  disabled={!input.trim() || isLoading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            )}

            {/* Helper Text */}
            <p className="text-xs text-slate-600 mt-2 text-center">
              {currentTab.provider} • Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>

      {/* Copied Toast */}
      {showCopied && (
        <div className="fixed bottom-24 right-4 px-4 py-2 rounded-lg bg-emerald-600 text-foreground text-sm font-medium shadow-lg animate-in slide-in-from-bottom-5 fade-in">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
};
