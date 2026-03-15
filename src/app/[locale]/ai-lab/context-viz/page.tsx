"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
} from "lucide-react";

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

const ROLE_LABELS: Record<ChunkRole, string> = {
  subject: "Özne/Ana Fikir",
  predicate: "Yüklem/Eylem",
  context: "Bağlam",
  evidence: "Kanıt/Destek",
  connector: "Bağlaç",
  conclusion: "Sonuç",
};

const SAMPLE_TEXTS = [
  {
    label: "Teknik Açıklama",
    text: "React, Facebook tarafından geliştirilen açık kaynaklı bir JavaScript kütüphanesidir. Kullanıcı arayüzleri oluşturmak için component tabanlı bir mimari kullanır. Virtual DOM sayesinde gerçek DOM manipülasyonunu minimize eder. Bu yaklaşım, büyük ölçekli uygulamalarda performans avantajı sağlar. State yönetimi için useState ve useReducer hook'ları kullanılabilir. Ayrıca useEffect ile side effect'ler yönetilebilir.",
  },
  {
    label: "Akademik Metin",
    text: "Yapay zeka, insan zekasını taklit eden bilgisayar sistemleri geliştirme bilimidir. Makine öğrenmesi, bu alanın en önemli alt dallarından birini oluşturmaktadır. Derin öğrenme algoritmaları, büyük veri setleri üzerinde örüntü tanıma konusunda üstün başarı sergilemiştir. Doğal dil işleme teknolojileri ise insan-bilgisayar etkileşimini köklü biçimde dönüştürmektedir.",
  },
  {
    label: "Blog Yazısı",
    text: "Next.js ile modern web uygulamaları geliştirmek hiç bu kadar kolay olmamıştı. App Router ile birlikte server components devreye girdi. Bu değişiklik, hem performansı hem de geliştirici deneyimini iyileştirdi. Streaming ve Suspense desteği ile kullanıcılar içeriği daha hızlı görüyor. Vercel deployment entegrasyonu da işleri son derece basitleştiriyor.",
  },
];

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

export default function ContextVizPage() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [activeChunk, setActiveChunk] = useState<number | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

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
        throw new Error(data.error || "Analysis failed");
      }

      const data: AnalysisResult = await res.json();
      setScanProgress(100);
      await new Promise((r) => setTimeout(r, 300));
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading]);

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

  const contextFill =
    result ? (result.totalTokens / result.contextWindowSize) * 100 : 0;
  const contextColor =
    contextFill > 75 ? "#ef4444" : contextFill > 40 ? "#f59e0b" : "#34d399";

  const activeChunkData = result?.chunks.find((c) => c.id === activeChunk);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* ── Header ── */}
      <div className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">
                Context Window Visualizer
              </h1>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                Powered by Groq · Llama 3.1
              </p>
            </div>
          </div>

          {/* View mode switcher */}
          <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
            {(["heatmap", "split", "graph"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === mode
                    ? "bg-slate-700 text-white shadow"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {mode === "heatmap" && <Layers className="w-3 h-3" />}
                {mode === "split" && <BarChart2 className="w-3 h-3" />}
                {mode === "graph" && <Network className="w-3 h-3" />}
                {mode === "heatmap"
                  ? "Isı"
                  : mode === "split"
                  ? "Split"
                  : "Graf"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* ── Input area ── */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Analiz edilecek metni buraya yapıştır..."
                rows={6}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 resize-none transition-all"
              />
              <div className="absolute bottom-3 right-3 text-[10px] text-slate-600 font-mono">
                ~{Math.round(inputText.split(" ").length * 1.3)} token
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={analyze}
                disabled={isLoading || inputText.trim().length < 10}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-bold shadow-lg shadow-violet-500/20 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                {isLoading ? "Analiz ediliyor..." : "Analiz Et"}
              </motion.button>

              <span className="text-slate-700 text-xs">veya</span>

              <div className="flex gap-2 flex-wrap">
                {SAMPLE_TEXTS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => fillSample(s.text)}
                    className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
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
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Context Window
                </span>
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: contextColor }}
                >
                  {result?.totalTokens ?? 0} / {result?.contextWindowSize ?? 8192}
                </span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: contextColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(contextFill, 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="mt-2 text-[10px] text-slate-600">
                {contextFill.toFixed(1)}% dolu · Llama 3.1 8192 token limit
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
                          Sıkıştırma Fırsatı
                        </div>
                        <div className="text-xs text-slate-400">
                          Metin{" "}
                          <span className="text-amber-400 font-bold">
                            %{result.compressionPotential}
                          </span>{" "}
                          daha verimli yazılabilir.
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
                          {copied ? "Kopyalandı!" : "Optimize kopyala"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Role legend */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                      Chunk Rolleri
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
                                <span className="text-xs text-slate-400">
                                  {ROLE_LABELS[role]}
                                </span>
                              </div>
                              <span className="text-xs font-mono text-slate-500">
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
              <div className="bg-slate-900/60 border border-violet-500/20 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                    <span className="text-sm font-semibold text-violet-300">
                      Metin taranıyor...
                    </span>
                  </div>
                  <span className="text-xs font-mono text-violet-400">
                    {Math.round(scanProgress)}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"
                    style={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                {/* Simulated scanning text */}
                <div className="mt-4 font-mono text-[11px] text-slate-600 space-y-1">
                  <div className="text-emerald-500/70">
                    ✓ Cümleler parse edildi
                  </div>
                  {scanProgress > 30 && (
                    <div className="text-emerald-500/70">
                      ✓ Token sayımı tamamlandı
                    </div>
                  )}
                  {scanProgress > 60 && (
                    <div className="text-violet-400/70 animate-pulse">
                      → Groq Llama 3.1 semantik analiz yapıyor...
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
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Layers className="w-4 h-4 text-slate-400" />
                    <h2 className="text-sm font-bold text-slate-300">
                      Semantik Isı Haritası
                    </h2>
                    <span className="text-[10px] text-slate-600 ml-auto">
                      Hover → detay paneli
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
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Network className="w-4 h-4 text-slate-400" />
                    <h2 className="text-sm font-bold text-slate-300">
                      Semantik Bağlantı Grafiği
                    </h2>
                    <span className="text-[10px] text-slate-600 ml-auto">
                      Scroll → zoom · Drag → pan
                    </span>
                  </div>
                  <div
                    className="rounded-xl overflow-hidden border border-slate-800/60"
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
                    className="bg-slate-900/80 border rounded-2xl p-5"
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
                          <span className="text-xs font-mono text-slate-500">
                            Chunk #{activeChunkData.id + 1}
                          </span>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor:
                                ROLE_COLORS[activeChunkData.role] + "20",
                              color: ROLE_COLORS[activeChunkData.role],
                            }}
                          >
                            {ROLE_LABELS[activeChunkData.role]}
                          </span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                            ~{activeChunkData.token_count} token
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
                            Ağırlık: {Math.round(activeChunkData.weight * 100)}%
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 mb-3 leading-relaxed">
                          "{activeChunkData.text}"
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <ChevronRight className="w-3 h-3" />
                          {activeChunkData.reasoning}
                        </div>
                        {activeChunkData.related.length > 0 && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[10px] text-slate-600">
                              İlgili:
                            </span>
                            {activeChunkData.related.map((r) => (
                              <button
                                key={r}
                                onClick={() => setActiveChunk(r)}
                                className="text-[10px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded font-mono transition-colors"
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
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-slate-400" />
                  <h2 className="text-sm font-bold text-slate-300">
                    Tam Analiz Tablosu
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-800">
                        {["#", "Metin", "Rol", "Ağırlık", "Token", "Fazlalık", "Sebep"].map(
                          (h) => (
                            <th
                              key={h}
                              className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest"
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
                          className={`border-b border-slate-800/50 cursor-pointer transition-colors ${
                            activeChunk === chunk.id
                              ? "bg-slate-800/60"
                              : "hover:bg-slate-800/30"
                          }`}
                        >
                          <td className="px-4 py-3 font-mono text-slate-500">
                            {chunk.id + 1}
                          </td>
                          <td className="px-4 py-3 text-slate-300 max-w-xs truncate">
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
                              {ROLE_LABELS[chunk.role]}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
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
                              <span className="text-slate-400 font-mono">
                                {Math.round(chunk.weight * 100)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-500">
                            {chunk.token_count}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`font-mono ${
                                chunk.redundancy > 0.5
                                  ? "text-red-400"
                                  : "text-slate-600"
                              }`}
                            >
                              {Math.round(chunk.redundancy * 100)}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
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
  );
}