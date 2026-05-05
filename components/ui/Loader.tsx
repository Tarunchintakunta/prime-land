"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, registerGsap } from "@/lib/gsap";

/**
 * Intro loader. Shows a centered logomark + a gold line that draws from
 * 0 → 100% as the hero WebGL scene boots. We approximate init progress with
 * a timed ease (fonts + first-paint happen fast; we mostly mask the canvas
 * pop-in). On complete the overlay fades out with expo.out and dispatches a
 * `pl:loader-complete` event so the hero can stagger its content in.
 */
export function Loader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    registerGsap();
    const overlay = overlayRef.current;
    const logoWrap = logoWrapRef.current;
    const line = lineRef.current;
    if (!overlay || !logoWrap || !line) return;

    // Honor prefers-reduced-motion — skip the theater, show content.
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      overlay.style.display = "none";
      window.dispatchEvent(new Event("pl:loader-complete"));
      setDone(true);
      return;
    }

    // Wait for fonts to settle so the logomark doesn't shift.
    const fontsReady =
      "fonts" in document ? document.fonts.ready : Promise.resolve();

    let tl: gsap.core.Timeline | null = null;
    fontsReady.then(() => {
      tl = gsap.timeline();
      tl.fromTo(
        logoWrap,
        { opacity: 0, y: 14, scale: 0.96, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "expo.out",
        }
      );
      tl.to(
        logoWrap,
        {
          filter: "drop-shadow(0 0 22px rgba(224,180,88,0.33))",
          duration: 0.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 1,
        },
        "-=0.15"
      );
      tl.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "expo.out",
          transformOrigin: "left",
        },
        "-=0.2"
      );
      tl.to(overlay, {
        opacity: 0,
        duration: 0.8,
        ease: "expo.out",
        onComplete: () => {
          overlay.style.pointerEvents = "none";
          overlay.style.display = "none";
          setDone(true);
          window.dispatchEvent(new Event("pl:loader-complete"));
        },
      });
    });

    return () => {
      tl?.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--ink)]"
    >
      <div ref={logoWrapRef} className="will-change-transform">
        <Image
          src="/brand/logo-dark.svg"
          alt="Prime Learning"
          width={304}
          height={100}
          className="h-[75px] w-auto"
          priority
        />
      </div>
      <div className="mt-8 h-px w-[min(320px,60vw)] overflow-hidden bg-white/10">
        <span
          ref={lineRef}
          className="block h-full w-full bg-[var(--gold)]"
          style={{ transform: "scaleX(0)", transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}
