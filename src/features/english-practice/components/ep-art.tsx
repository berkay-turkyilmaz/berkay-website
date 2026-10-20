/** EnglishPath'e özgü çizim: kitap yığını, konuşma balonları ve A1→C1 merdiveni. */
export function EpHeroArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 260" className={className} role="img" aria-hidden="true" focusable="false">
      {/* A1 -> C1 merdiveni */}
      <g>
        {[
          { x: 112, h: 40, l: "A1" },
          { x: 170, h: 72, l: "A2" },
          { x: 228, h: 104, l: "B1" },
          { x: 286, h: 136, l: "B2" },
          { x: 344, h: 168, l: "C1" },
        ].map((s, i) => (
          <g key={s.l}>
            <rect x={s.x} y={236 - s.h} width="54" height={s.h} rx="8" fill={i === 4 ? "#fbbf24" : "#ffffff"} fillOpacity={i === 4 ? 1 : 0.1 + i * 0.05} stroke="#ffffff" strokeOpacity="0.22" />
            <text x={s.x + 27} y={236 - s.h + 24} textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="15" fontWeight="700" fill={i === 4 ? "#1e1b4b" : "#e0e7ff"}>
              {s.l}
            </text>
          </g>
        ))}
      </g>
      {/* kitap yığını */}
      <g transform="translate(6 150)">
        <rect x="0" y="52" width="104" height="18" rx="4" fill="#4f46e5" />
        <rect x="6" y="34" width="92" height="18" rx="4" fill="#fbbf24" />
        <rect x="2" y="16" width="98" height="18" rx="4" fill="#e0e7ff" />
        <rect x="12" y="58" width="40" height="3" rx="1.5" fill="#fff" fillOpacity="0.5" />
        <rect x="14" y="40" width="30" height="3" rx="1.5" fill="#1e1b4b" fillOpacity="0.45" />
        <rect x="10" y="22" width="36" height="3" rx="1.5" fill="#4f46e5" fillOpacity="0.5" />
      </g>
      {/* konuşma balonları */}
      <g className="ep-float" style={{ ["--r" as string]: "-4deg" }}>
        <g transform="translate(-40 0)"><path d="M170 18h92a14 14 0 0 1 14 14v26a14 14 0 0 1-14 14h-56l-18 16v-16h-18a14 14 0 0 1-14-14V32a14 14 0 0 1 14-14z" fill="#ffffff" />
        <text x="223" y="52" textAnchor="middle" fontFamily="var(--font-display-src), Georgia, serif" fontSize="26" fill="#312e81">Hello!</text></g>
      </g>
      <g className="ep-float" style={{ ["--r" as string]: "5deg", animationDelay: "-2s" }}>
        <g transform="translate(-268 10)"><path d="M278 78h56a12 12 0 0 1 12 12v18a12 12 0 0 1-12 12h-10v14l-14-14h-32a12 12 0 0 1-12-12V90a12 12 0 0 1 12-12z" fill="#fbbf24" />
        <text x="305" y="106" textAnchor="middle" fontFamily="var(--font-display-src), Georgia, serif" fontSize="20" fill="#1e1b4b">Merhaba</text></g>
      </g>
    </svg>
  );
}

/** Üst çubuk için küçük marka işareti: defter + işaretleyici. */
export function EpMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden="true" focusable="false">
      <rect width="36" height="36" rx="9" fill="#312e81" />
      <path d="M9 10.5c3.5-1.4 6.6-1 9 .8v15c-2.4-1.8-5.5-2.2-9-.8z" fill="#e0e7ff" />
      <path d="M27 10.5c-3.5-1.4-6.6-1-9 .8v15c2.4-1.8 5.5-2.2 9-.8z" fill="#fbbf24" />
    </svg>
  );
}
