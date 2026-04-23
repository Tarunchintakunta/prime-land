"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Reads `?slow=1` / `?grid=1` / `?nowebgl=1` from the URL and applies them
 * on mount. `nowebgl` is honored by PortalScene itself; here we propagate
 * `slow` (triples every GSAP duration — invaluable when debugging timelines)
 * and `grid` (12-column layout overlay via globals.css).
 */
export function DebugFlags() {
  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    if (params.get("slow") === "1") {
      document.documentElement.dataset.slow = "1";
      // Multiply GSAP durations globally without touching each call site.
      gsap.globalTimeline.timeScale(1 / 3);
    }
    if (params.get("grid") === "1") {
      document.documentElement.dataset.grid = "1";
    }
  }, []);

  return null;
}
