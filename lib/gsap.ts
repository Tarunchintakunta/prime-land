"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Centralized GSAP setup. Import from here (not from "gsap" directly) so
 * plugins are registered exactly once and easings stay consistent.
 *
 * Keep this file framework-agnostic — no React imports.
 */

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

// Shared easings — Pass 3 audits these; change here, reflect everywhere.
export const EASE = {
  entrance: "expo.out",
  section: "power4.inOut",
  ui: "back.out(1.7)",
  ambient: "sine.inOut",
  // Legacy — prefer one of the above.
  out: "power3.out",
} as const;

export { gsap, ScrollTrigger };
