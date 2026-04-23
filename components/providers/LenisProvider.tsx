"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";
import { bindLenisToScrollTrigger } from "@/lib/scroll";
import { useScrollStore } from "@/components/providers/ScrollStore";

interface Props {
  children: React.ReactNode;
}

/**
 * Wraps the app with a Lenis smooth-scroll instance, wires it into
 * ScrollTrigger, and pushes scroll position into the zustand store.
 * Respects prefers-reduced-motion (disables Lenis entirely).
 */
export function LenisProvider({ children }: Props) {
  const lenisRef = useRef<Lenis | null>(null);
  const setScrollY = useScrollStore((s) => s.setScrollY);

  useEffect(() => {
    registerGsap();

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      // Let browser handle native scroll — ScrollTrigger listens to window.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1,
      smoothWheel: true,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;
    // Expose for anchor-link smooth-scroll without pulling Lenis into every
    // consumer's bundle.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      setScrollY(scroll);
    });

    const cleanup = bindLenisToScrollTrigger(lenis);

    // After first paint, refresh so pinned sections measure correctly.
    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      window.clearTimeout(refreshId);
      cleanup();
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [setScrollY]);

  return <>{children}</>;
}
