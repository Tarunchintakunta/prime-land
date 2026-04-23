"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useScrollStore, type ChapterKey } from "@/components/providers/ScrollStore";

interface Props {
  id: string;
  chapter: ChapterKey;
  number: string;
  title: string;
  heightVh?: number;
  textOnDark?: boolean;
}

/**
 * Placeholder chapter used for Pass 1 scaffolding. Establishes correct
 * section height and marks itself active when scrolled into view so the
 * BackgroundCanvas can swap themes. Replaced by real chapters in Pass 2.
 */
export function ChapterStub({
  id,
  chapter,
  number,
  title,
  heightVh = 100,
  textOnDark = true,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const setChapter = useScrollStore((s) => s.setChapter);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;
    const t = ScrollTrigger.create({
      trigger: root,
      start: "top center",
      end: "bottom center",
      onEnter: () => setChapter(chapter),
      onEnterBack: () => setChapter(chapter),
    });
    return () => t.kill();
  }, [chapter, setChapter]);

  return (
    <section
      ref={rootRef}
      id={id}
      className="chapter-scaffold relative w-full"
      style={{ minHeight: `${heightVh}svh` }}
      aria-label={title}
    >
      <div className="mx-auto max-w-3xl">
        <span
          className="eyebrow"
          style={{ color: textOnDark ? "var(--gold)" : "#947346" }}
        >
          Chapter {number}
        </span>
        <h2
          className="display mt-4"
          style={{
            fontSize: "clamp(2rem, 6vw, 5rem)",
            color: textOnDark ? "white" : "var(--ink)",
          }}
        >
          {title}
        </h2>
        <p
          className="body-lg mt-4"
          style={{ color: textOnDark ? "rgba(245,242,235,0.6)" : "rgba(10,10,15,0.55)" }}
        >
          Stub — this chapter is finalized in Pass 2.
        </p>
      </div>
    </section>
  );
}
