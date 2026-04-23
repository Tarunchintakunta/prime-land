"use client";

import { useScrollStore } from "@/components/providers/ScrollStore";

/**
 * Fixed-position background layer. Cross-fades between `--ink` and `--paper`
 * based on the active chapter's theme. Kept at z-index -1 so all content
 * renders above it, and chapter sections themselves are transparent.
 *
 * This is what makes the dark ↔ cream flips feel like doors opening rather
 * than hard cuts (per PRD §Scroll Choreography Rules).
 */
export function BackgroundCanvas() {
  const theme = useScrollStore((s) => s.theme);
  const isPaper = theme === "paper";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 transition-colors duration-700"
      style={{
        backgroundColor: isPaper ? "var(--paper)" : "var(--ink)",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    />
  );
}
