/** The "B." mark used by the generated favicon and touch icon (same drawing as public/icon.svg). */
export function BrandGlyph({ size, radius }: { size: number; radius: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1B1915",
        borderRadius: radius,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <g transform="translate(-2.7 0)">
          <path
            fill="#F6F2EA"
            fillRule="evenodd"
            d="M10 7h7.2c3.1 0 5.1 1.6 5.1 4.1 0 1.6-.8 2.8-2.2 3.4 1.8.5 2.9 1.9 2.9 3.8 0 2.8-2.2 4.7-5.6 4.7H10V7zm3.4 2.9v3.2h3.3c1.2 0 1.9-.6 1.9-1.6s-.7-1.6-1.9-1.6h-3.3zm0 6v3.6h3.7c1.4 0 2.2-.7 2.2-1.8 0-1.1-.8-1.8-2.2-1.8h-3.7z"
          />
          <circle cx="26.1" cy="23.6" r="2.1" fill="#E0562A" />
        </g>
      </svg>
    </div>
  );
}
