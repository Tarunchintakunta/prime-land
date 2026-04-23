"use client";

import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

/**
 * Wires Lenis's RAF tick into ScrollTrigger via a proxy, so every GSAP
 * ScrollTrigger reacts to Lenis's smoothed scroll position instead of the
 * browser's raw scroll. Without this, pinned sections feel detached.
 */
export function bindLenisToScrollTrigger(lenis: Lenis) {
  lenis.on("scroll", ScrollTrigger.update);

  // Use GSAP's ticker as the single RAF loop for both Lenis and ScrollTrigger.
  gsap.ticker.add((time) => {
    // Lenis expects ms; gsap.ticker supplies seconds.
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return () => {
    lenis.off("scroll", ScrollTrigger.update);
  };
}
