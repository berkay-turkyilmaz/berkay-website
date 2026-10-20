/** Rezervasyon demosuna özgü çizim: berber direği, makas ve ayna çerçevesi. */
export function BarberArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 260" className={className} role="img" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="bp-stripes" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <rect width="28" height="28" fill="#f4efe4" />
          <rect width="9" height="28" fill="#b3342b" />
          <rect x="14" width="9" height="28" fill="#2c4a7c" />
        </pattern>
      </defs>
      {/* ayna çerçevesi */}
      <g transform="translate(150 24)">
        <rect width="150" height="212" rx="75" fill="none" stroke="#c9a24d" strokeWidth="6" />
        <rect x="12" y="12" width="126" height="188" rx="63" fill="#c9a24d" fillOpacity="0.07" />
        <path d="M44 150c10-26 22-40 31-40s21 14 31 40" fill="none" stroke="#c9a24d" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
        <path d="M40 60l22-22M40 82l44-44" stroke="#f4efe4" strokeOpacity="0.25" strokeWidth="5" strokeLinecap="round" />
      </g>
      {/* berber direği */}
      <g transform="translate(34 18)">
        <rect x="0" y="0" width="58" height="14" rx="5" fill="#c9a24d" />
        <rect x="6" y="14" width="46" height="170" fill="url(#bp-stripes)" />
        <rect x="6" y="14" width="46" height="170" fill="none" stroke="#0e1a15" strokeOpacity="0.35" />
        <rect x="6" y="14" width="12" height="170" fill="#fff" fillOpacity="0.16" />
        <rect x="0" y="184" width="58" height="14" rx="5" fill="#c9a24d" />
        <circle cx="29" cy="-4" r="9" fill="#c9a24d" />
      </g>
      {/* makas */}
      <g transform="translate(88 150) rotate(-18)" fill="none" stroke="#f4efe4" strokeWidth="5" strokeLinecap="round">
        <circle cx="12" cy="62" r="13" stroke="#c9a24d" />
        <circle cx="46" cy="70" r="13" stroke="#c9a24d" />
        <path d="M20 52L96 -4" />
        <path d="M40 58L110 14" />
      </g>
    </svg>
  );
}
