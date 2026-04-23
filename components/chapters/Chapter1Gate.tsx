"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useScrollStore } from "@/components/providers/ScrollStore";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { FallbackHero } from "@/components/hero/FallbackHero";

// Canvas is client-only and heavy — dynamic import with SSR off keeps the
// first-paint JS small and prevents hydration drift on the <canvas> element.
const PortalScene = dynamic(
  () => import("@/components/hero/PortalScene").then((m) => m.PortalScene),
  { ssr: false, loading: () => <FallbackHero /> }
);

/**
 * Chapter 1 — The Gate.
 *
 * Renders the WebGL hero and the overlay content. A single ScrollTrigger
 * drives `portalProgress` in the zustand store over the first 100vh; the
 * canvas subscribes to that progress and dollies its camera accordingly.
 *
 * Also marks itself as the active chapter when in view.
 */
export function Chapter1Gate() {
  const rootRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const setPortalProgress = useScrollStore((s) => s.setPortalProgress);
  const setChapter = useScrollStore((s) => s.setChapter);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    const content = contentRef.current;
    if (!root || !content) return;

    const triggers: ScrollTrigger[] = [];

    // 1) Portal progress: scrub 0→1 across the first 100vh of scroll.
    triggers.push(
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => setPortalProgress(self.progress),
      })
    );

    // 2) Mark chapter active when in viewport.
    triggers.push(
      ScrollTrigger.create({
        trigger: root,
        start: "top center",
        end: "bottom center",
        onEnter: () => setChapter("gate"),
        onEnterBack: () => setChapter("gate"),
      })
    );

    // 3) Gentle content fade-out as we descend — the portal takes over.
    const fade = gsap.to(content, {
      opacity: 0,
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // 4) Hero entrance, staggered, kicked off when the Loader signals done.
    //    Pre-state: hidden; reveal runs once.
    const heroItems = content.querySelectorAll<HTMLElement>("[data-hero-item]");
    gsap.set(heroItems, { opacity: 0, y: 24 });
    const enterHero = () => {
      gsap.to(heroItems, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "expo.out",
      });
    };
    window.addEventListener("pl:loader-complete", enterHero, { once: true });
    // Safety: if loader never runs (first-paint only), reveal after 1.2s.
    const safety = window.setTimeout(enterHero, 1200);

    return () => {
      triggers.forEach((t) => t.kill());
      fade.scrollTrigger?.kill();
      fade.kill();
      window.removeEventListener("pl:loader-complete", enterHero);
      window.clearTimeout(safety);
    };
  }, [setPortalProgress, setChapter]);

  return (
    <section
      ref={rootRef}
      id="chapter-gate"
      className="relative h-[100svh] w-full overflow-hidden"
      style={{ backgroundColor: "var(--ink)" }}
      aria-label="Introduction"
    >
      {/* WebGL layer */}
      <PortalScene source="portal" />

      {/* Vignette — keeps hero text legible over the particle cloud. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(10,10,15,0.7)_80%,rgba(10,10,15,0.95)_100%)]"
      />

      {/* Hero content */}
      <div
        ref={contentRef}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <div data-hero-item>
          <Eyebrow>Prime Learning</Eyebrow>
        </div>
        <h1
          data-hero-item
          className="display mt-8 max-w-[14ch]"
          style={{
            fontSize: "clamp(3.25rem, 10vw, 8.5rem)",
            textShadow: "0 0 80px rgba(212,165,116,0.15)",
            color: "var(--text-primary)",
          }}
        >
          Unlock skills that{" "}
          <em className="italic text-[var(--gold)]">drive</em> your future.
        </h1>
        <p data-hero-item className="body-lg mt-8 max-w-xl">
          Learn Smarter. Grow Faster. Lead With Purpose.
        </p>
        <div data-hero-item className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button variant="primary">Explore Courses</Button>
          <Button variant="ghost">How it works</Button>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
