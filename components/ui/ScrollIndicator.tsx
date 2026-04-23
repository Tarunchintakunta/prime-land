"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

/**
 * Vertical line that draws itself, loops, and fades near the bottom of the
 * viewport. Intentionally not a chevron — more premium.
 */
export function ScrollIndicator() {
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    registerGsap();
    const line = lineRef.current;
    if (!line) return;

    // Scale from 0 → 1 top-down, hold, fade, reset. A slow ambient loop.
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut" } });
    tl.fromTo(
      line,
      { scaleY: 0, transformOrigin: "top" },
      { scaleY: 1, duration: 1.4 }
    )
      .to(line, { opacity: 0.2, duration: 0.6 }, "+=0.3")
      .to(line, { scaleY: 0, transformOrigin: "bottom", duration: 0.9 })
      .set(line, { opacity: 1 });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      aria-hidden="true"
    >
      <span className="eyebrow" style={{ color: "var(--text-tertiary)" }}>Scroll</span>
      <span className="block h-16 w-px overflow-hidden relative">
        <span
          ref={lineRef}
          className="absolute inset-0 block bg-[var(--gold)]"
        />
      </span>
    </div>
  );
}
