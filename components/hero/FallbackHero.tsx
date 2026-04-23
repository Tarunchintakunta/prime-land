/**
 * Static SVG icosahedron + CSS blur animation. Used when the client lacks
 * the hardware or the user prefers reduced motion. Styled to roughly match
 * the WebGL version's silhouette so the swap isn't jarring.
 */
export function FallbackHero() {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <style>{`
        @keyframes portal-spin { to { transform: rotate(360deg); } }
        @keyframes portal-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        .portal-fallback {
          width: min(60vmin, 620px);
          aspect-ratio: 1;
          filter: blur(28px);
          animation: portal-spin 48s linear infinite, portal-pulse 6s ease-in-out infinite;
        }
      `}</style>
      <svg viewBox="-1.2 -1.2 2.4 2.4" className="portal-fallback">
        <defs>
          <radialGradient id="ico-fill" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#5b6cff" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#d4a574" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0a0a0f" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* A stylized icosahedral hint — triangle fan around the origin */}
        {Array.from({ length: 20 }).map((_, i) => {
          const a = (i / 20) * Math.PI * 2;
          const b = ((i + 1) / 20) * Math.PI * 2;
          const r1 = 0.9 + Math.sin(i * 2.3) * 0.08;
          const r2 = 0.9 + Math.sin((i + 1) * 2.3) * 0.08;
          return (
            <polygon
              key={i}
              points={`0,0 ${Math.cos(a) * r1},${Math.sin(a) * r1} ${Math.cos(b) * r2},${Math.sin(b) * r2}`}
              fill="url(#ico-fill)"
              stroke="#d4a574"
              strokeOpacity="0.25"
              strokeWidth="0.005"
            />
          );
        })}
      </svg>
    </div>
  );
}
