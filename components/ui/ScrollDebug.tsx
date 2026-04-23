"use client";

import { useEffect, useState } from "react";
import { useScrollStore } from "@/components/providers/ScrollStore";

/**
 * Dev-only overlay. Shows via `?debug=1`. Displays scroll progress 0–1,
 * current chapter, and the portal dolly value — invaluable while iterating
 * on scroll timelines.
 */
export function ScrollDebug() {
  const [enabled, setEnabled] = useState(false);
  const { scrollY, chapter, portalProgress, theme, morph } = useScrollStore();
  const [docHeight, setDocHeight] = useState(1);

  useEffect(() => {
    const url = new URL(window.location.href);
    setEnabled(url.searchParams.get("debug") === "1");

    const measure = () =>
      setDocHeight(document.documentElement.scrollHeight - window.innerHeight);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  if (!enabled) return null;

  const progress = Math.min(1, Math.max(0, scrollY / Math.max(1, docHeight)));

  return (
    <div className="fixed right-4 top-4 z-[100] rounded-md border border-[var(--fog)] bg-[var(--ink)]/80 px-3 py-2 font-mono text-[11px] text-white/90 backdrop-blur">
      <div>chapter: <span className="text-[var(--gold)]">{chapter}</span></div>
      <div>theme: <span className="text-[var(--gold)]">{theme}</span></div>
      <div>progress: <span className="text-[var(--gold)]">{progress.toFixed(3)}</span></div>
      <div>portal: <span className="text-[var(--gold)]">{portalProgress.toFixed(3)}</span></div>
      <div>morph: <span className="text-[var(--gold)]">{morph.toFixed(3)}</span></div>
      <div>scrollY: <span className="text-[var(--gold)]">{Math.round(scrollY)}</span></div>
    </div>
  );
}
