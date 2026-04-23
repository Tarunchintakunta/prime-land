"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useScrollStore } from "@/components/providers/ScrollStore";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface Stat {
  label: string;
  description: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

const STATS: Stat[] = [
  {
    label: "Learners enrolled",
    description: "across 43 countries and counting",
    value: 12400,
    suffix: "+",
  },
  {
    label: "Courses published",
    description: "spanning all seven core categories",
    value: 85,
  },
  {
    label: "Average completion",
    description: "nearly double the industry baseline",
    value: 87,
    suffix: "%",
  },
];

/**
 * Chapter 3 — Stats.
 *
 * Paper-bg section. Three stat blocks. As the user scrubs through the
 * pinned zone, each block slides in from the right and its numeral counts
 * up 0 → value. Ends with a safety setter so the blocks are guaranteed
 * visible at final values even if the scrub is interrupted (fast-scroll).
 *
 * Bug fixes relative to the previous revision:
 *   1. Initial state uses xPercent only — NEVER opacity:0. Previously, if
 *      the pin released before scroll progress hit 1.0, stat 3 stayed at
 *      opacity 0 and only its static-colored suffix was faintly visible.
 *   2. Gold vertical dividers between stats are now explicit absolute
 *      elements scoped to i > 0, not a `:first:hidden` Tailwind trick
 *      that matched every first-child instance (i.e. all of them).
 *   3. A descriptor line sits under each numeral, using the paper-bg text
 *      tier so the intentional sparseness doesn't read as "broken sparse".
 *   4. The third stat is right-aligned against the container edge so it
 *      doesn't float in dead space.
 */
export function Chapter3Stats() {
  const rootRef = useRef<HTMLElement>(null);
  const blocksRef = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const liveRef = useRef<HTMLDivElement>(null);
  const setChapter = useScrollStore((s) => s.setChapter);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const blocks = blocksRef.current.filter(Boolean) as HTMLDivElement[];
    const counterState = STATS.map(() => ({ value: 0 }));

    // Initial state — visible, just translated right. Opacity stays at 1.
    gsap.set(blocks, { xPercent: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=120%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    blocks.forEach((b, i) => {
      tl.to(
        b,
        { xPercent: 0, duration: 0.8, ease: "expo.out" },
        i * 0.25
      );
      tl.to(
        counterState[i],
        {
          value: STATS[i].value,
          duration: 0.8,
          ease: "expo.out",
          onUpdate: () => {
            const el = numberRefs.current[i];
            if (!el) return;
            el.textContent = formatNumber(counterState[i].value);
          },
        },
        i * 0.25
      );
    });

    // Safety: when the pin releases (scroll has moved past the section),
    // force everything to final state. Protects against the tuning gap
    // between scrub end and pin end. Also sets when returning from above.
    const settle = () => {
      blocks.forEach((b) => gsap.set(b, { xPercent: 0 }));
      numberRefs.current.forEach((el, i) => {
        if (el) el.textContent = formatNumber(STATS[i].value);
      });
    };
    const safety = ScrollTrigger.create({
      trigger: root,
      start: "bottom center",
      onEnter: settle,
    });

    const chapterTrigger = ScrollTrigger.create({
      trigger: root,
      start: "top center",
      end: "+=200%",
      onEnter: () => setChapter("stats"),
      onEnterBack: () => setChapter("stats"),
    });

    const announce = ScrollTrigger.create({
      trigger: root,
      start: "bottom center",
      once: true,
      onEnter: () => {
        if (!liveRef.current) return;
        liveRef.current.textContent = STATS.map(
          (s) =>
            `${s.label}: ${s.prefix ?? ""}${s.value.toLocaleString()}${s.suffix ?? ""}.`
        ).join(" ");
      },
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      safety.kill();
      chapterTrigger.kill();
      announce.kill();
    };
  }, [setChapter]);

  return (
    <section
      ref={rootRef}
      id="chapter-stats"
      className="relative min-h-[100svh] w-full overflow-hidden"
      style={{ backgroundColor: "var(--paper)" }}
      aria-label="Prime Learning by the numbers"
    >
      <div className="mx-auto flex h-[100svh] max-w-7xl flex-col justify-center px-8 lg:px-16">
        <Eyebrow onPaper>By the numbers</Eyebrow>
        <h2
          className="display mt-6 max-w-[14ch]"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            color: "var(--text-primary-ink)",
          }}
        >
          Scale you can{" "}
          <em className="italic" style={{ color: "var(--gold-dark)" }}>
            feel
          </em>
          .
        </h2>

        {/* Stats grid */}
        <div className="relative mt-24 grid grid-cols-1 gap-20 md:grid-cols-3 md:gap-0">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              ref={(el) => {
                blocksRef.current[i] = el;
              }}
              className={`relative flex flex-col gap-4 md:px-10 ${
                i === 0 ? "md:pl-0" : ""
              } ${i === 2 ? "md:items-end md:pr-0 md:text-right" : ""}`}
            >
              {/* 1px × 120px vertical gold divider between stats
                  (suppressed on the first column). */}
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 hidden h-[120px] w-px -translate-y-1/2 bg-[var(--gold)] md:block"
                />
              )}

              {/* Big numeral + inline suffix */}
              <div className="flex items-baseline gap-1">
                <span
                  ref={(el) => {
                    numberRefs.current[i] = el;
                  }}
                  className="display block"
                  style={{
                    fontSize: "clamp(3rem, 9vw, 7rem)",
                    lineHeight: 0.95,
                    color: "var(--text-primary-ink)",
                  }}
                >
                  0
                </span>
                {(s.prefix || s.suffix) && (
                  <span
                    className="display"
                    style={{
                      fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
                      lineHeight: 1,
                      color: "var(--gold-dark)",
                    }}
                  >
                    {s.prefix}
                    {s.suffix}
                  </span>
                )}
              </div>

              <p
                className="max-w-[32ch] text-base leading-relaxed"
                style={{ color: "var(--text-secondary-ink)" }}
              >
                {s.description}
              </p>
              <p
                className="text-xs uppercase tracking-[0.22em]"
                style={{ color: "var(--text-tertiary-ink)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div ref={liveRef} role="status" aria-live="polite" className="sr-only" />
    </section>
  );
}

function formatNumber(n: number) {
  return Math.round(n).toLocaleString();
}
