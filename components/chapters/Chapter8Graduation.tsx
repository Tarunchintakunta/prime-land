"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useScrollStore } from "@/components/providers/ScrollStore";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { FallbackHero } from "@/components/hero/FallbackHero";

const PortalScene = dynamic(
  () => import("@/components/hero/PortalScene").then((m) => m.PortalScene),
  { ssr: false, loading: () => <FallbackHero /> }
);

/**
 * Chapter 8 — Graduation.
 *
 * Reuses PortalScene in "graduation" mode. The particle cloud morphs as
 * scroll progress through this section advances — this chapter writes the
 * morph uniform into zustand; the scene picks it up via useFrame.
 *
 * (The "BEGIN" letterform sampling is handled by ParticleIcosahedron's
 * morph target — in this pass the morph expands the cloud outward as a
 * stylized "blossom" rather than exact letter shapes; the feel is what
 * matters most and exact letter positions are an easy Pass-3 upgrade.)
 */
export function Chapter8Graduation() {
  const rootRef = useRef<HTMLElement>(null);
  const setChapter = useScrollStore((s) => s.setChapter);
  const setMorph = useScrollStore((s) => s.setMorph);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const morphTrigger = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => setMorph(self.progress),
    });
    const chapterTrigger = ScrollTrigger.create({
      trigger: root,
      start: "top center",
      end: "bottom center",
      onEnter: () => setChapter("graduation"),
      onEnterBack: () => setChapter("graduation"),
    });

    return () => {
      morphTrigger.kill();
      chapterTrigger.kill();
    };
  }, [setChapter, setMorph]);

  return (
    <section
      ref={rootRef}
      id="chapter-graduation"
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--ink)" }}
      aria-label="Begin"
    >
      <div className="absolute inset-0">
        <PortalScene source="graduation" mode="graduation" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,15,0.8)_85%)]"
      />
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <Eyebrow>Your turn</Eyebrow>
        <h2
          className="display mt-4 max-w-[14ch]"
          style={{
            fontSize: "clamp(3rem, 9vw, 7.5rem)",
            textShadow: "0 0 80px rgba(212,165,116,0.15)",
            color: "var(--text-primary)",
          }}
        >
          Begin.
        </h2>
        <p className="body-lg mt-6 max-w-xl">
          Your next chapter is one scroll away.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button variant="primary">Explore Courses</Button>
          <Button variant="ghost">Talk to Sales</Button>
        </div>
      </div>
    </section>
  );
}
