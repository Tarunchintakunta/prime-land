"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useScrollStore } from "@/components/providers/ScrollStore";

/**
 * The manifesto text. Bold words are marked with `**` — we split them into
 * spans at render time and attach an underline that draws on reveal.
 */
const MANIFESTO =
  "We believe learning should feel like **momentum**, not obligation. " +
  "That mastery is a **practice**, not a credential. " +
  "That your next chapter is closer than you think.";

type Token = { text: string; bold: boolean };

function tokenize(src: string): Token[] {
  const out: Token[] = [];
  const parts = src.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  for (const part of parts) {
    const bold = part.startsWith("**") && part.endsWith("**");
    const stripped = bold ? part.slice(2, -2) : part;
    for (const word of stripped.split(/(\s+)/)) {
      if (word === "") continue;
      out.push({ text: word, bold });
    }
  }
  return out;
}

/**
 * Chapter 2 — Manifesto.
 *
 * Each word is a span; a ScrollTrigger with scrub reveals opacity 0→1 in
 * sequence. Bold words additionally get a gold underline drawn via
 * scaleX 0→1.
 */
export function Chapter2Manifesto() {
  const rootRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const underlinesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const setChapter = useScrollStore((s) => s.setChapter);

  const tokens = tokenize(MANIFESTO);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const words = wordsRef.current.filter(Boolean) as HTMLSpanElement[];
    const underlines = underlinesRef.current.filter(Boolean) as HTMLSpanElement[];

    // Set initial state — dim, and underlines collapsed.
    gsap.set(words, { opacity: 0.12 });
    gsap.set(underlines, { scaleX: 0, transformOrigin: "left center" });

    // Master scroll-linked timeline: as the user scrolls through the section,
    // step through the words, raising each to full opacity.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 0.8,
      },
    });

    words.forEach((w, i) => {
      tl.to(w, { opacity: 1, duration: 0.15, ease: "none" }, i * 0.08);
    });
    underlines.forEach((u) => {
      tl.to(u, { scaleX: 1, duration: 0.4, ease: "none" }, "<");
    });

    const chapterTrigger = ScrollTrigger.create({
      trigger: root,
      start: "top center",
      end: "bottom center",
      onEnter: () => setChapter("manifesto"),
      onEnterBack: () => setChapter("manifesto"),
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      chapterTrigger.kill();
    };
  }, [setChapter]);

  let boldIdx = 0;

  return (
    <section
      ref={rootRef}
      id="chapter-manifesto"
      className="relative flex min-h-[120svh] items-center px-6 py-40"
      style={{ backgroundColor: "var(--ink)" }}
      aria-label="Manifesto"
    >
      <div className="mx-auto max-w-5xl">
        <p
          className="headline"
          style={{ fontSize: "clamp(2rem, 5.5vw, 4.75rem)", lineHeight: 1.18, color: "var(--text-primary)" }}
        >
          {tokens.map((t, i) => {
            const isSpace = /^\s+$/.test(t.text);
            if (isSpace) {
              return <span key={i}>{t.text}</span>;
            }
            if (t.bold) {
              const uIdx = boldIdx++;
              return (
                <span
                  key={i}
                  ref={(el) => {
                    wordsRef.current[i] = el;
                  }}
                  className="relative inline-block"
                >
                  <span className="relative">{t.text}</span>
                  <span
                    ref={(el) => {
                      underlinesRef.current[uIdx] = el;
                    }}
                    className="absolute -bottom-1 left-0 right-0 block h-[3px] bg-[var(--gold)]"
                    aria-hidden="true"
                  />
                </span>
              );
            }
            return (
              <span
                key={i}
                ref={(el) => {
                  wordsRef.current[i] = el;
                }}
                className="inline-block"
              >
                {t.text}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
