"use client";

import { useEffect, useRef, useState } from "react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    registerGsap();
    const overlay = overlayRef.current;
    const video = videoRef.current;
    if (!overlay || !video) return;

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

    let tl: gsap.core.Timeline | null = null;
    let fallbackTimer: number | null = null;
    let completed = false;

    const complete = () => {
      if (completed) return;
      completed = true;
      tl = gsap.timeline();
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
    };

    const onEnded = () => complete();
    const onError = () => complete();
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);

    video.playbackRate = 2;
    video.play().catch(() => {
      fallbackTimer = window.setTimeout(complete, 2000);
    });
    fallbackTimer = window.setTimeout(complete, 5000);

    return () => {
      tl?.kill();
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--ink)]"
    >
      <video
        ref={videoRef}
        className="h-auto w-[min(980px,94vw)]"
        muted
        playsInline
        preload="auto"
      >
        <source src="/brand/prime-logo-animation.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
