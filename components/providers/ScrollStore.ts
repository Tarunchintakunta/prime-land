"use client";

import { create } from "zustand";

/**
 * Global scroll state — consumed by the WebGL canvas so it can dolly the
 * camera without owning its own ScrollTrigger. ChapterKey reflects which
 * chapter is currently in view; the background cross-fade layer reads this.
 */

export type ChapterKey =
  | "gate"
  | "manifesto"
  | "stats"
  | "categories"
  | "courses"
  | "how"
  | "plans"
  | "graduation";

export type Theme = "ink" | "paper";

interface ScrollState {
  /** 0–1 progress through Chapter 1's portal dolly. */
  portalProgress: number;
  /** Absolute document-scroll Y. */
  scrollY: number;
  /** Active chapter (drives background theme cross-fade). */
  chapter: ChapterKey;
  /** Theme derived from chapter — "ink" (dark) or "paper" (cream). */
  theme: Theme;
  /** 0–1 morph driver for Chapter 8 (particles → letters). */
  morph: number;

  setPortalProgress: (v: number) => void;
  setScrollY: (v: number) => void;
  setChapter: (c: ChapterKey) => void;
  setMorph: (v: number) => void;
}

const themeByChapter: Record<ChapterKey, Theme> = {
  gate: "ink",
  manifesto: "ink",
  stats: "paper",
  categories: "paper",
  courses: "ink",
  how: "ink",
  plans: "paper",
  graduation: "ink",
};

export const useScrollStore = create<ScrollState>((set) => ({
  portalProgress: 0,
  scrollY: 0,
  chapter: "gate",
  theme: "ink",
  morph: 0,
  setPortalProgress: (v) => set({ portalProgress: v }),
  setScrollY: (v) => set({ scrollY: v }),
  setChapter: (c) => set({ chapter: c, theme: themeByChapter[c] }),
  setMorph: (v) => set({ morph: v }),
}));
