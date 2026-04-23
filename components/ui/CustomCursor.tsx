"use client";

import { useEffect, useRef } from "react";

/**
 * Desktop-only custom cursor. 8px gold dot, scales to 40px with
 * mix-blend-mode: difference on interactive-element hover. Trails the real
 * cursor with a mild lerp (~0.18). Mounted unconditionally — but bails out
 * immediately on coarse pointers (touch) or reduced motion.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasFinePointer = window.matchMedia?.("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!hasFinePointer || reducedMotion) return;

    const dot = dotRef.current;
    if (!dot) return;

    dot.style.display = "block";

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let hoveringInteractive = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const onOver = (e: PointerEvent) => {
      const tgt = e.target as HTMLElement | null;
      if (!tgt) return;
      const interactive = tgt.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]'
      );
      hoveringInteractive = !!interactive;
      if (hoveringInteractive) dot.classList.add("cursor-hover");
      else dot.classList.remove("cursor-hover");
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      dot.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%) scale(${hoveringInteractive ? 5 : 1})`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="cursor-dot"
      style={{ display: "none" }}
    />
  );
}
