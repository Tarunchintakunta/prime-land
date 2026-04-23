"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useScrollStore } from "@/components/providers/ScrollStore";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { COURSES, CATEGORIES } from "./courseData";
import { CoursePattern } from "./CoursePattern";

/**
 * Chapter 5 — Courses Grid.
 *
 * Tab switcher at top with a gold underline that slides between tabs. On
 * switch, cards exit with stagger (y:-20, opacity:0) and enter (y:20→0).
 *
 * The PRD suggests using GSAP's Flip plugin for the underline. To keep our
 * plugin surface minimal (we already load ScrollTrigger globally), we
 * animate the underline via explicit offset/width measured from the
 * active tab — the effect is identical and we ship less JS.
 */
export function Chapter5Courses() {
  const rootRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const setChapter = useScrollStore((s) => s.setChapter);

  const activeCategory = CATEGORIES[activeIdx];
  const courses = COURSES[activeCategory];

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const t = ScrollTrigger.create({
      trigger: root,
      start: "top 70%",
      end: "bottom 30%",
      onEnter: () => setChapter("courses"),
      onEnterBack: () => setChapter("courses"),
    });
    return () => t.kill();
  }, [setChapter]);

  // Move the underline under the active tab.
  useEffect(() => {
    const tab = tabRefs.current[activeIdx];
    const underline = underlineRef.current;
    if (!tab || !underline) return;
    const rect = tab.getBoundingClientRect();
    const parentRect = tab.parentElement?.getBoundingClientRect();
    if (!parentRect) return;
    gsap.to(underline, {
      x: rect.left - parentRect.left,
      width: rect.width,
      duration: 0.55,
      ease: "expo.out",
    });
  }, [activeIdx]);

  // Exit/enter animation on tab switch.
  const prevIdx = useRef(activeIdx);
  useEffect(() => {
    if (prevIdx.current === activeIdx) return;
    prevIdx.current = activeIdx;
    const cards = cardsRef.current?.querySelectorAll<HTMLElement>("[data-card]");
    if (!cards) return;
    gsap.fromTo(
      cards,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.06,
        ease: "expo.out",
      }
    );
  }, [activeIdx]);

  return (
    <section
      ref={rootRef}
      id="chapter-courses"
      className="relative w-full px-6 py-32 lg:px-16"
      style={{ backgroundColor: "var(--ink)" }}
      aria-label="Courses"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>What to study</Eyebrow>
            <h2
              className="display mt-3 max-w-[16ch]"
              style={{ fontSize: "clamp(2rem, 5.5vw, 4.25rem)", color: "var(--text-primary)" }}
            >
              Courses built with <em className="italic text-[var(--gold)]">intent</em>.
            </h2>
          </div>
          <a
            href="#"
            className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--text-secondary)] hover:text-[var(--gold-bright)]"
          >
            Show all
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>

        {/* Tabs */}
        <div className="relative mt-12 flex gap-8 border-b border-[var(--fog)]">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              onClick={() => setActiveIdx(i)}
              className={`relative py-4 text-sm uppercase tracking-[0.2em] transition-colors duration-300 ${
                i === activeIdx
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {cat}
            </button>
          ))}
          <span
            ref={underlineRef}
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-px bg-[var(--gold)]"
            style={{ width: 0 }}
          />
        </div>

        {/* Grid */}
        <div
          ref={cardsRef}
          className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {courses.map((c) => (
            <article
              key={c.title}
              data-card
              className="group flex flex-col overflow-hidden rounded-xl border border-[var(--fog)] bg-[var(--mist)] transition-all duration-500 hover:border-[var(--gold)]/50 hover:-translate-y-1"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--mist)]">
                {/* Photo layer — scales subtly on hover per PRD */}
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.05]">
                  <Image
                    src={c.image}
                    alt={c.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover"
                    quality={75}
                  />
                </div>
                {/* Branded gradient wash — keeps the card visually on-brand
                    even with varied imagery underneath. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{ background: c.gradient }}
                />
                <CoursePattern pattern={c.pattern} />
                {/* Play circle — fades in on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-black/30 backdrop-blur">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="translate-x-[1px] text-white">
                      <path d="M3 2l11 6-11 6V2z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                <div>
                  <h3
                    className="headline text-lg"
                    style={{ lineHeight: 1.25, color: "var(--text-primary)" }}
                  >
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>{c.instructor}</p>
                </div>
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em]" style={{ color: "var(--text-tertiary)" }}>
                  <span>{c.duration}</span>
                  <span className="text-[var(--gold-bright)]">AED {c.priceAed.toLocaleString()}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
