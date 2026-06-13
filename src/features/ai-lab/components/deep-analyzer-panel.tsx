"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import * as d3 from "d3";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Zap,
  AlertTriangle,
  Info,
  BarChart2,
  Network,
  Layers,
  Copy,
  CheckCheck,
  Loader2,
  ChevronRight,
  Sparkles,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ChunkRole =
  | "subject"
  | "predicate"
  | "context"
  | "evidence"
  | "connector"
  | "conclusion";

type Chunk = {
  id: number;
  text: string;
  role: ChunkRole;
  weight: number;
  pos_dominant: string;
  reasoning: string;
  related: number[];
  token_count: number;
  redundancy: number;
};

type AnalysisResult = {
  chunks: Chunk[];
  totalTokens: number;
  contextWindowSize: number;
  redundantChunks: number[];
  compressionPotential: number;
};

type ViewMode = "heatmap" | "graph" | "split";

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_COLORS: Record<ChunkRole, string> = {
  subject: "#60a5fa",
  predicate: "#34d399",
  context: "#a78bfa",
  evidence: "#fbbf24",
  connector: "#94a3b8",
  conclusion: "#f472b6",
};

const SAMPLE_TEXT_BODIES = {
  tr: {
    technical:
      "React, Facebook tarafından geliştirilen açık kaynaklı bir JavaScript kütüphanesidir. Kullanıcı arayüzleri oluşturmak için component tabanlı bir mimari kullanır. Virtual DOM sayesinde gerçek DOM manipülasyonunu minimize eder. Bu yaklaşım, büyük ölçekli uygulamalarda performans avantajı sağlar. State yönetimi için useState ve useReducer hook'ları kullanılabilir. Ayrıca useEffect ile side effect'ler yönetilebilir.",
    academic:
      "Yapay zeka, insan zekasını taklit eden bilgisayar sistemleri geliştirme bilimidir. Makine öğrenmesi, bu alanın en önemli alt dallarından birini oluşturmaktadır. Derin öğrenme algoritmaları, büyük veri setleri üzerinde örüntü tanıma konusunda üstün başarı sergilemiştir. Doğal dil işleme teknolojileri ise insan-bilgisayar etkileşimini köklü biçimde dönüştürmektedir.",
    blog: "Next.js ile modern web uygulamaları geliştirmek hiç bu kadar kolay olmamıştı. App Router ile birlikte server components devreye girdi. Bu değişiklik, hem performansı hem de geliştirici deneyimini iyileştirdi. Streaming ve Suspense desteği ile kullanıcılar içeriği daha hızlı görüyor. Vercel deployment entegrasyonu da işleri son derece basitleştiriyor.",
  },
  en: {
    technical:
      "React is an open-source JavaScript library developed by Facebook. It uses a component-based architecture to build user interfaces. The Virtual DOM minimizes direct DOM manipulation. This approach delivers performance benefits in large-scale applications. useState and useReducer hooks can manage state, and useEffect handles side effects.",
    academic:
      "Artificial intelligence is the science of building computer systems that mimic human intelligence. Machine learning is one of its most important subfields. Deep learning algorithms have excelled at pattern recognition on large datasets. Natural language processing is fundamentally transforming human-computer interaction.",
    blog: "Building modern web apps with Next.js has never been easier. The App Router introduced server components. This change improved both performance and developer experience. Streaming and Suspense let users see content faster. Vercel deployment integration simplifies operations even further.",
  },
} as const;

// ─── Weight → Color helper ────────────────────────────────────────────────────

function weightToColor(weight: number, opacity = 1): string {
  if (weight > 0.75) return `rgba(239,68,68,${opacity})`;
  if (weight > 0.5) return `rgba(249,115,22,${opacity})`;
  if (weight > 0.25) return `rgba(234,179,8,${opacity})`;
  return `rgba(100,116,139,${opacity})`;
}

// ─── D3 Force Graph ───────────────────────────────────────────────────────────

function ForceGraph({
  chunks,
  activeChunk,
  onHover,
}: {
  chunks: Chunk[];
  activeChunk: number | null;
  onHover: (id: number | null) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined> | null>(null);

  useEffect(() => {
    if (!svgRef.current || chunks.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth || 600;
    const height = svgRef.current.clientHeight || 400;

    // Build nodes & edges
    const nodes = chunks.map((c) => ({
      ...c,
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: height / 2 + (Math.random() - 0.5) * 200,
    }));

    const links: { source: number; target: number; strength: number }[] = [];
    chunks.forEach((c) => {
      c.related.forEach((rel) => {
        if (rel < chunks.length) {
          links.push({ source: c.id, target: rel, strength: 0.5 });
        }
      });
    });

    // Defs: glow filter
    const defs = svg.append("defs");
    const filter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Container
    const g = svg.append("g");

    // Zoom
    svg.call(
      d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
        g.attr("transform", event.transform);
      })
    );

    // Links
    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#334155")
      .attr("stroke-width", (d) => d.strength * 2)
      .attr("stroke-dasharray", "4 2")
      .attr("opacity", 0.6);

    // Nodes
    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .on("mouseenter", (_event, d) => onHover(d.id))
      .on("mouseleave", () => onHover(null));

    // Node circle
    node
      .append("circle")
      .attr("r", (d) => 14 + d.weight * 22)
      .attr("fill", (d) => weightToColor(d.weight, 0.15))
      .attr("stroke", (d) =>
        activeChunk === d.id
          ? "#f8fafc"
          : ROLE_COLORS[d.role as ChunkRole] || "#94a3b8"
      )
      .attr("stroke-width", (d) => (activeChunk === d.id ? 2.5 : 1.5))
      .attr("filter", (d) => (d.weight > 0.7 ? "url(#glow)" : "none"));

    // Weight label
    node
      .append("text")
      .text((d) => Math.round(d.weight * 100) + "%")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "#f8fafc")
      .attr("font-size", "10px")
      .attr("font-weight", "700")
      .attr("pointer-events", "none");

    // Chunk id badge
    node
      .append("text")
      .text((d) => `#${d.id + 1}`)
      .attr("text-anchor", "middle")
      .attr("dy", (d) => -(14 + d.weight * 22 + 6))
      .attr("fill", "#94a3b8")
      .attr("font-size", "9px")
      .attr("pointer-events", "none");

    // Simulation
    const simulation = d3
      .forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: d3.SimulationNodeDatum) => (d as Chunk).id)
          .distance(120)
      )
      .force("charge", d3.forceManyBody().strength(-180))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide((d: d3.SimulationNodeDatum) => 18 + (d as Chunk).weight * 24)
      );

    simulationRef.current = simulation;

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as unknown as { x: number }).x)
        .attr("y1", (d) => (d.source as unknown as { y: number }).y)
        .attr("x2", (d) => (d.target as unknown as { x: number }).x)
        .attr("y2", (d) => (d.target as unknown as { y: number }).y);

      node.attr(
        "transform",
        (d) => `translate(${(d as { x: number }).x},${(d as { y: number }).y})`
      );
    });

    return () => {
      simulation.stop();
    };
  }, [chunks, activeChunk, onHover]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ background: "transparent" }}
    />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DeepAnalyzerPanel() {
  const t = useTranslations("AiLabPage.deepAnalyzer");
  const locale = useLocale();
  const roleLabels = useMemo(
    (): Record<ChunkRole, string> => ({
      subject: t("role_subject"),
      predicate: t("role_predicate"),
      context: t("role_context"),
      evidence: t("role_evidence"),
      connector: t("role_connector"),
      conclusion: t("role_conclusion"),
    }),
    [t]
  );
  const sampleTexts = useMemo(() => {
    const bodies = locale.startsWith("tr") ? SAMPLE_TEXT_BODIES.tr : SAMPLE_TEXT_BODIES.en;
    return [
      { label: t("sample_technical"), text: bodies.technical },
      { label: t("sample_academic"), text: bodies.academic },
      { label: t("sample_blog"), text: bodies.blog },
    ];
  }, [locale, t]);
  const tableHeaders = useMemo(
    () => [
      t("col_num"),
      t("col_text"),
      t("col_role"),
      t("col_weight"),
      t("col_token"),
      t("col_redundancy"),
      t("col_reason"),
    ],
    [t]
  );

  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [activeChunk, setActiveChunk] = useState<number | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  const [fileBusy, setFileBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scan animation
  useEffect(() => {
    if (!isLoading) {
      setScanProgress(0);
      setIsScanning(false);
      return;
    }
    setIsScanning(true);
    let prog = 0;
    const iv = setInterval(() => {
      prog += Math.random() * 8;
      if (prog >= 90) {
        clearInterval(iv);
        prog = 90;
      }
      setScanProgress(prog);
    }, 120);
    return () => clearInterval(iv);
  }, [isLoading]);

  const analyze = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    setActiveChunk(null);

    try {
      const res = await fetch("/api/analyze-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("error_analysis"));
      }

      const data: AnalysisResult = await res.json();
      setScanProgress(100);
      await new Promise((r) => setTimeout(r, 300));
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("error_unknown"));
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading, t]);

  const copyOptimized = useCallback(() => {
    if (!result) return;
    const optimized = result.chunks
      .filter((c) => !result.redundantChunks.includes(c.id))
      .map((c) => c.text)
      .join(" ");
    navigator.clipboard.writeText(optimized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const fillSample = (text: string) => {
    setInputText(text);
    setResult(null);
    setError(null);
  };

  const handleFileImport = useCallback(async (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      setError(t("error_file_too_large"));
      return;
    }
    setError(null);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

    if (ext === "txt" || ext === "md") {
      const text = await file.text();
      setInputText(text);
      setResult(null);
      return;
    }

    if (ext === "pdf" || file.type === "application/pdf") {
      setFileBusy(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/pdf", { method: "POST", body: fd });
        const data = (await res.json()) as {
          error?: string;
          chunks?: string[];
        };
        if (!res.ok) throw new Error(data.error ?? t("error_pdf_process"));
        const chunks = data.chunks ?? [];
        setInputText(chunks.join("\n\n"));
        setResult(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : t("error_file_read"));
      } finally {
        setFileBusy(false);
      }
      return;
    }

    setError(t("error_unsupported"));
  }, [t]);

  const contextFill =
    result ? (result.totalTokens / result.contextWindowSize) * 100 : 0;
  const contextColor =
    contextFill > 75 ? "#ef4444" : contextFill > 40 ? "#f59e0b" : "#34d399";

  const activeChunkData = result?.chunks.find((c) => c.id === activeChunk);

  return (
    <div className="flex flex-col h-full min-h-0 bg-ailab-canvas text-ailab-text antialiased">
      {/* ── Header ── */}
      <div className="flex-shrink-0 border-b border-ailab-border-subtle bg-ailab-glass-04 backdrop-blur-xl z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-ailab-glass-08 ring-1 ring-inset ring-ailab-border-emphasis shadow-ailab-accent-sm">
              <Brain className="w-5 h-5 text-ailab-text" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-ailab-text tracking-tight">{t("title")}</h1>
              <p className="text-[10px] text-ailab-muted font-mono uppercase tracking-widest">
                {t("subtitle")}
              </p>
            </div>
          </div>

          {/* View mode switcher */}
          <div className="flex items-center gap-1 bg-ailab-glass-06 rounded-lg p-1 border border-ailab-border-subtle shrink-0 overflow-x-auto max-w-[50vw] sm:max-w-none">
            {(["heatmap", "split", "graph"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === mode
                    ? "bg-ailab-glass-10 text-ailab-text shadow"
                    : "text-ailab-muted hover:text-ailab-text"
                }`}
              >
                {mode === "heatmap" && <Layers className="w-3 h-3" />}
                {mode === "split" && <BarChart2 className="w-3 h-3" />}
                {mode === "graph" && <Network className="w-3 h-3" />}
                {mode === "heatmap"
                  ? t("view_heatmap")
                  : mode === "split"
                  ? t("view_split")
                  : t("view_graph")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto ailab-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-12">
        {/* ── Input area ── */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFileImport(f);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onDragOver={(e) => {
                e.preventDefault();
                setDropActive(true);
              }}
              onDragLeave={() => setDropActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDropActive(false);
                const f = e.dataTransfer.files[0];
                if (f) void handleFileImport(f);
              }}
              onClick={() => fileInputRef.current?.click()}
              disabled={fileBusy || isLoading}
              className={cn(
                "w-full rounded-2xl border border-dashed px-4 py-5 text-left transition-all duration-300",
                "bg-ailab-glass-04 backdrop-blur-sm ring-1 ring-inset ring-ailab-border-subtle",
                "hover:bg-ailab-glass-06 hover:ring-ailab-accent/25",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/45",
                dropActive && "border-ailab-accent bg-ailab-glass-08 shadow-ailab-accent-sm ring-ailab-accent/35",
                (fileBusy || isLoading) && "opacity-60 pointer-events-none"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ailab-glass-06 ring-1 ring-inset ring-ailab-border-muted">
                  <Upload className="h-4 w-4 text-ailab-muted" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-medium text-ailab-text">{t("upload_title")}</p>
                  <p className="text-[10px] text-ailab-muted mt-0.5">{t("upload_hint")}</p>
                </div>
              </div>
            </button>

            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t("placeholder")}
                rows={6}
                className="w-full bg-ailab-glass-06 border border-ailab-border-subtle rounded-2xl px-5 py-4 text-sm text-ailab-text placeholder:text-ailab-muted focus:outline-none focus:ring-2 focus:ring-ailab-accent/40 focus:border-ailab-accent/35 resize-none transition-all"
              />
              <div className="absolute bottom-3 right-3 text-[10px] text-ailab-muted font-mono">
                {t("token_estimate", {
                  n: Math.round(inputText.split(" ").length * 1.3),
                })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={analyze}
                disabled={isLoading || fileBusy || inputText.trim().length < 10}
                className="flex items-center gap-2 px-6 py-3 bg-ailab-accent text-ailab-canvas hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-bold shadow-ailab-accent-sm transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                {isLoading ? t("analyzing") : t("analyze")}
              </motion.button>

              <span className="text-ailab-muted text-xs">{t("or")}</span>

              <div className="flex gap-2 flex-wrap">
                {sampleTexts.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => fillSample(s.text)}
                    className="px-3 py-1.5 text-xs bg-ailab-glass-06 hover:bg-ailab-glass-08 border border-ailab-border-muted rounded-lg text-ailab-muted hover:text-ailab-text transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Stats panel ── */}
          <div className="space-y-3">
            {/* Context window bar */}
            <div className="bg-ailab-glass-06 border border-ailab-border-subtle rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-ailab-muted uppercase tracking-widest">
                  {t("context_window")}
                </span>
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: contextColor }}
                >
                  {result?.totalTokens ?? 0} / {result?.contextWindowSize ?? 8192}
                </span>
              </div>
              <div className="h-2.5 bg-ailab-glass-08 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: contextColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(contextFill, 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="mt-2 text-[10px] text-ailab-muted">
                {t("context_fill", { pct: contextFill.toFixed(1) })}
              </div>
            </div>

            {result && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {/* Compression */}
                  {result.compressionPotential > 0 && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-amber-400 mb-1">
                          {t("compression_title")}
                        </div>
                        <div className="text-xs text-ailab-muted">
                          {t("compression_body", { pct: result.compressionPotential })}
                        </div>
                        <button
                          onClick={copyOptimized}
                          className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                        >
                          {copied ? (
                            <CheckCheck className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          {copied ? t("copied") : t("copy_optimized")}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Role legend */}
                  <div className="bg-ailab-glass-06 border border-ailab-border-subtle rounded-2xl p-4">
                    <div className="text-[10px] font-bold text-ailab-muted uppercase tracking-widest mb-3">
                      {t("chunk_roles")}
                    </div>
                    <div className="space-y-1.5">
                      {(Object.entries(ROLE_COLORS) as [ChunkRole, string][]).map(
                        ([role, color]) => {
                          const count = result.chunks.filter(
                            (c) => c.role === role
                          ).length;
                          if (count === 0) return null;
                          return (
                            <div
                              key={role}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="text-xs text-ailab-muted">
                                  {roleLabels[role]}
                                </span>
                              </div>
                              <span className="text-xs font-mono text-ailab-muted">
                                {count}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* ── Scan animation ── */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-ailab-glass-06 border border-ailab-accent/25 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-ailab-accent animate-pulse" />
                    <span className="text-sm font-semibold text-ailab-accent">
                      {t("scanning")}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-ailab-accent">
                    {Math.round(scanProgress)}%
                  </span>
                </div>
                <div className="h-1.5 bg-ailab-glass-08 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-ailab-accent to-ailab-accent/70 rounded-full"
                    style={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                {/* Simulated scanning text */}
                <div className="mt-4 font-mono text-[11px] text-ailab-muted space-y-1">
                  <div className="text-emerald-500/70">{t("scan_parsed")}</div>
                  {scanProgress > 30 && (
                    <div className="text-emerald-500/70">{t("scan_tokens")}</div>
                  )}
                  {scanProgress > 60 && (
                    <div className="text-ailab-accent/70 animate-pulse">
                      {t("scan_semantic")}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Error ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-400"
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ── */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Heatmap view */}
              {(viewMode === "heatmap" || viewMode === "split") && (
                <div className="bg-ailab-glass-06 border border-ailab-border-subtle rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Layers className="w-4 h-4 text-ailab-muted" />
                    <h2 className="text-sm font-bold text-ailab-text">{t("heatmap_title")}</h2>
                    <span className="text-[10px] text-ailab-muted ml-auto">
                      {t("heatmap_hint")}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 leading-relaxed">
                    {result.chunks.map((chunk, i) => {
                      const isActive = activeChunk === chunk.id;
                      const isRedundant = result.redundantChunks.includes(
                        chunk.id
                      );
                      return (
                        <motion.span
                          key={chunk.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.04 }}
                          onMouseEnter={() => setActiveChunk(chunk.id)}
                          onMouseLeave={() => setActiveChunk(null)}
                          className={`relative inline-block px-2.5 py-1.5 rounded-lg text-sm cursor-pointer transition-all duration-200 ${
                            isRedundant ? "opacity-40 line-through" : ""
                          }`}
                          style={{
                            backgroundColor: weightToColor(chunk.weight, 0.18),
                            border: `1.5px solid ${
                              isActive
                                ? ROLE_COLORS[chunk.role] || "#94a3b8"
                                : weightToColor(chunk.weight, 0.3)
                            }`,
                            color: isActive ? "#f8fafc" : "#cbd5e1",
                            transform: isActive ? "scale(1.03)" : "scale(1)",
                            boxShadow: isActive
                              ? `0 0 12px ${weightToColor(chunk.weight, 0.4)}`
                              : "none",
                          }}
                        >
                          <span
                            className="absolute -top-1.5 -left-1 text-[8px] font-mono font-bold rounded px-0.5"
                            style={{
                              color: ROLE_COLORS[chunk.role] || "#94a3b8",
                              backgroundColor: "#0f172a",
                            }}
                          >
                            #{chunk.id + 1}
                          </span>
                          {chunk.text}
                        </motion.span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Graph view */}
              {(viewMode === "graph" || viewMode === "split") && (
                <div className="bg-ailab-glass-06 border border-ailab-border-subtle rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Network className="w-4 h-4 text-ailab-muted" />
                    <h2 className="text-sm font-bold text-ailab-text">{t("graph_title")}</h2>
                    <span className="text-[10px] text-ailab-muted ml-auto">
                      {t("graph_hint")}
                    </span>
                  </div>
                  <div
                    className="rounded-xl overflow-hidden border border-ailab-border-subtle/60"
                    style={{ height: "380px" }}
                  >
                    <ForceGraph
                      chunks={result.chunks}
                      activeChunk={activeChunk}
                      onHover={setActiveChunk}
                    />
                  </div>
                </div>
              )}

              {/* Active chunk detail */}
              <AnimatePresence>
                {activeChunkData && (
                  <motion.div
                    key={activeChunkData.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="bg-ailab-glass-08 border rounded-2xl p-5"
                    style={{
                      borderColor: ROLE_COLORS[activeChunkData.role] + "40",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="p-2.5 rounded-xl mt-0.5"
                        style={{
                          backgroundColor:
                            ROLE_COLORS[activeChunkData.role] + "20",
                        }}
                      >
                        <Info
                          className="w-4 h-4"
                          style={{ color: ROLE_COLORS[activeChunkData.role] }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xs font-mono text-ailab-muted">
                            {t("chunk_label", { n: activeChunkData.id + 1 })}
                          </span>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor:
                                ROLE_COLORS[activeChunkData.role] + "20",
                              color: ROLE_COLORS[activeChunkData.role],
                            }}
                          >
                            {roleLabels[activeChunkData.role]}
                          </span>
                          <span className="text-[10px] bg-ailab-glass-08 text-ailab-muted px-2 py-0.5 rounded-full font-mono">
                            {t("token_estimate", { n: activeChunkData.token_count })}
                          </span>
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                            style={{
                              backgroundColor: weightToColor(
                                activeChunkData.weight,
                                0.15
                              ),
                              color: weightToColor(activeChunkData.weight),
                            }}
                          >
                            {t("weight")}: {Math.round(activeChunkData.weight * 100)}%
                          </span>
                        </div>
                        <p className="text-sm text-ailab-text mb-3 leading-relaxed">
                          "{activeChunkData.text}"
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-ailab-muted">
                          <ChevronRight className="w-3 h-3" />
                          {activeChunkData.reasoning}
                        </div>
                        {activeChunkData.related.length > 0 && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[10px] text-ailab-muted">{t("related")}</span>
                            {activeChunkData.related.map((r) => (
                              <button
                                key={r}
                                onClick={() => setActiveChunk(r)}
                                className="text-[10px] px-2 py-0.5 bg-ailab-glass-08 hover:bg-ailab-glass-10 text-ailab-muted hover:text-ailab-text rounded font-mono transition-colors"
                              >
                                #{r + 1}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chunk table */}
              <div className="bg-ailab-glass-06 border border-ailab-border-subtle rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-ailab-border-subtle flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-ailab-muted" />
                  <h2 className="text-sm font-bold text-ailab-text">{t("table_title")}</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-ailab-border-subtle">
                        {tableHeaders.map((h) => (
                            <th
                              key={h}
                              className="px-4 py-3 text-left text-[10px] font-bold text-ailab-muted uppercase tracking-widest"
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {result.chunks.map((chunk, i) => (
                        <motion.tr
                          key={chunk.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          onMouseEnter={() => setActiveChunk(chunk.id)}
                          onMouseLeave={() => setActiveChunk(null)}
                          className={`border-b border-ailab-border-muted/50 cursor-pointer transition-colors ${
                            activeChunk === chunk.id
                              ? "bg-ailab-glass-08/90"
                              : "hover:bg-ailab-glass-06/80"
                          }`}
                        >
                          <td className="px-4 py-3 font-mono text-ailab-muted">
                            {chunk.id + 1}
                          </td>
                          <td className="px-4 py-3 text-ailab-text max-w-xs truncate">
                            {chunk.text.slice(0, 60)}
                            {chunk.text.length > 60 ? "…" : ""}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                              style={{
                                backgroundColor:
                                  ROLE_COLORS[chunk.role] + "20",
                                color: ROLE_COLORS[chunk.role],
                              }}
                            >
                              {roleLabels[chunk.role]}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-ailab-glass-08 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${chunk.weight * 100}%`,
                                    backgroundColor: weightToColor(
                                      chunk.weight
                                    ),
                                  }}
                                />
                              </div>
                              <span className="text-ailab-muted font-mono">
                                {Math.round(chunk.weight * 100)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-ailab-muted">
                            {chunk.token_count}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`font-mono ${
                                chunk.redundancy > 0.5
                                  ? "text-red-400"
                                  : "text-ailab-muted"
                              }`}
                            >
                              {Math.round(chunk.redundancy * 100)}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-ailab-muted max-w-xs truncate">
                            {chunk.reasoning}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}