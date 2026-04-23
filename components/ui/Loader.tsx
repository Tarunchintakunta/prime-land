"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

/**
 * Intro loader. Shows a centered logomark + a gold line that draws from
 * 0 → 100% as the hero WebGL scene boots. We approximate init progress with
 * a timed ease (fonts + first-paint happen fast; we mostly mask the canvas
 * pop-in). On complete the overlay fades out with expo.out and dispatches a
 * `pl:loader-complete` event so the hero can stagger its content in.
 */
export function Loader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    registerGsap();
    const overlay = overlayRef.current;
    const line = lineRef.current;
    if (!overlay || !line) return;

    // Honor prefers-reduced-motion — skip the theater, show content.
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      overlay.style.display = "none";
      window.dispatchEvent(new Event("pl:loader-complete"));
      setDone(true);
      return;
    }

    // Wait for fonts to settle so the logomark doesn't shift.
    const fontsReady =
      "fonts" in document ? document.fonts.ready : Promise.resolve();

    let tl: gsap.core.Timeline | null = null;
    fontsReady.then(() => {
      tl = gsap.timeline();
      tl.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "expo.out",
          transformOrigin: "left",
        }
      );
      tl.to(overlay, {
        opacity: 0,
        duration: 0.8,
        ease: "expo.out",
        onComplete: () => {
          overlay.style.pointerEvents = "none";
          overlay.style.display = "none";
          setDone(true);
          window.dispatchEvent(new Event("pl:loader-complete"));
        },
      });
    });

    return () => {
      tl?.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--ink)]"
    >
      <span
        className="display text-2xl tracking-tight text-[var(--gold)]"
        style={{ textShadow: "0 0 40px rgba(212,165,116,0.3)" }}
      >
        Prime Learning
      </span>
      <div className="mt-8 h-px w-[min(320px,60vw)] overflow-hidden bg-white/10">
        <span
          ref={lineRef}
          className="block h-full w-full bg-[var(--gold)]"
          style={{ transform: "scaleX(0)", transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}
