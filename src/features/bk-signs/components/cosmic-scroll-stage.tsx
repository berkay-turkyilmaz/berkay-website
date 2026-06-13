"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { VideoLayer } from "@/features/bk-signs/components/video-layer";
import { SIGNS_VIDEO_SLOTS } from "@/features/bk-signs/data/video-assets";

const PHASE_TEXTS = [
  "Güneş akıp gidiyor…",
  "Yıldız genişliyor…",
  "Süpernova…",
  "Demir uzaya saçılıyor…",
  "Dünyaya ulaşıyor…",
];

export function CosmicScrollStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const sunX = useTransform(scrollYProgress, [0, 0.25], ["-8%", "22%"]);
  const sunScale = useTransform(scrollYProgress, [0, 0.25, 0.45, 0.55], [0.55, 0.7, 1.35, 1.6]);
  const sunOpacity = useTransform(scrollYProgress, [0.38, 0.48], [1, 0]);
  const sunHue = useTransform(scrollYProgress, [0.15, 0.45], [45, 0]);
  const sunFilter = useTransform(sunHue, (h) => `hue-rotate(${h}deg)`);
  const burstOpacity = useTransform(scrollYProgress, [0.42, 0.5, 0.62], [0, 1, 0]);
  const burstScale = useTransform(scrollYProgress, [0.45, 0.62], [0.2, 2.8]);
  const ironOpacity = useTransform(scrollYProgress, [0.58, 0.72, 0.92], [0, 1, 0.6]);
  const earthScale = useTransform(scrollYProgress, [0.65, 0.95], [0.6, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);
  const videoSunOpacity = useTransform(scrollYProgress, [0, 0.35, 0.45], [0.55, 0.85, 0]);
  const videoBurstOpacity = useTransform(scrollYProgress, [0.4, 0.48, 0.65], [0, 0.9, 0]);
  const videoEarthOpacity = useTransform(scrollYProgress, [0.6, 0.72, 0.95], [0, 0.85, 0.5]);

  return (
    <div ref={containerRef} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden bg-[#020208]">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 20% 30%, #fff8, transparent), radial-gradient(1px 1px at 60% 70%, #fff6, transparent), radial-gradient(1.5px 1.5px at 80% 20%, #fffc, transparent), radial-gradient(1px 1px at 40% 80%, #fff5, transparent)",
          }}
          aria-hidden
        />

        <motion.div className="absolute inset-0 z-[1]" style={{ opacity: videoSunOpacity }}>
          <VideoLayer src={SIGNS_VIDEO_SLOTS.sun} className="opacity-80 mix-blend-screen" />
        </motion.div>
        <motion.div className="absolute inset-0 z-[1]" style={{ opacity: videoBurstOpacity }}>
          <VideoLayer src={SIGNS_VIDEO_SLOTS.burst} loop={false} className="opacity-90 mix-blend-screen" />
        </motion.div>
        <motion.div className="absolute inset-0 z-[1]" style={{ opacity: videoEarthOpacity }}>
          <VideoLayer src={SIGNS_VIDEO_SLOTS.ironEarth} className="opacity-75 mix-blend-screen" />
        </motion.div>

        <motion.div
          className="absolute z-10 rounded-full"
          style={{
            x: sunX,
            scale: sunScale,
            opacity: sunOpacity,
            width: 140,
            height: 140,
            filter: sunFilter,
            background:
              "radial-gradient(circle at 35% 35%, #fffef0 0%, #ffd54a 35%, #ff6b00 70%, #cc2200 100%)",
            boxShadow:
              "0 0 80px 30px rgba(255, 160, 40, 0.45), 0 0 160px 60px rgba(255, 80, 0, 0.2)",
          }}
        />

        <motion.div
          className="pointer-events-none absolute z-20 rounded-full border-2 border-amber-100/80 bg-[radial-gradient(circle,rgba(255,240,200,0.5)_0%,transparent_65%)]"
          style={{
            opacity: burstOpacity,
            scale: burstScale,
            width: 200,
            height: 200,
          }}
          aria-hidden
        />

        <motion.div
          className="absolute bottom-[12%] z-30 flex flex-col items-center"
          style={{ opacity: ironOpacity, scale: earthScale }}
        >
          <div className="relative h-28 w-28 rounded-full bg-[radial-gradient(circle_at_30%_30%,#4a7c59,#1a3a4a_50%,#0a1520)] shadow-[0_0_60px_rgba(80,140,200,0.25)]">
            <div className="absolute -top-16 left-1/2 h-16 w-0.5 -translate-x-1/2 bg-gradient-to-b from-amber-300/80 to-transparent" />
            <div className="absolute -top-20 left-[30%] h-20 w-0.5 rotate-12 bg-gradient-to-b from-orange-400/70 to-transparent" />
            <div className="absolute -top-14 right-[25%] h-14 w-0.5 -rotate-6 bg-gradient-to-b from-amber-200/60 to-transparent" />
          </div>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.25em] text-amber-200/50">
            Demir — Hadîd 25
          </p>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-0 right-0 z-40 text-center"
          style={{ opacity: labelOpacity }}
        >
          <PhaseLabel progress={scrollYProgress} />
        </motion.div>

        <motion.div
          className="absolute left-4 right-4 top-4 z-50 mx-auto max-w-md"
          style={{ opacity: labelOpacity }}
        >
          <div className="h-0.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full origin-left rounded-full bg-amber-400/70"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
        </motion.div>

        <motion.p
          className="absolute top-8 text-center text-[10px] uppercase tracking-[0.3em] text-white/25"
          style={{ opacity: labelOpacity }}
        >
          Aşağı kaydır
        </motion.p>
      </div>
    </div>
  );
}

function PhaseLabel({ progress }: { progress: MotionValue<number> }) {
  const displayText = useTransform(progress, (v) => {
    if (v < 0.2) return PHASE_TEXTS[0];
    if (v < 0.4) return PHASE_TEXTS[1];
    if (v < 0.58) return PHASE_TEXTS[2];
    if (v < 0.78) return PHASE_TEXTS[3];
    return PHASE_TEXTS[4];
  });

  return (
    <motion.p className="text-sm font-medium text-amber-100/70">{displayText}</motion.p>
  );
}
