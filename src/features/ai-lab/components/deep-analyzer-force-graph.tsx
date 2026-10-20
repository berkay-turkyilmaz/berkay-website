"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ROLE_COLORS, weightToColor, type Chunk, type ChunkRole } from "./deep-analyzer-model";

// ─── D3 Force Graph ───────────────────────────────────────────────────────────

export function ForceGraph({
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
