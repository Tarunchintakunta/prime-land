"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useScrollStore } from "@/components/providers/ScrollStore";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Instructor = {
  name: string;
  credential: string;
  courses: number;
  portrait: string;
};

const INSTRUCTORS: Instructor[] = [
  {
    name: "Mei Lin",
    credential: "Principal Engineer, ex-Stripe",
    courses: 6,
    portrait:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=70",
  },
  {
    name: "Andre Cole",
    credential: "Design Director, ex-Apple",
    courses: 4,
    portrait:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=70",
  },
  {
    name: "Priya Sharma",
    credential: "Founding ML Engineer, ex-Anthropic",
    courses: 3,
    portrait:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=70",
  },
  {
    name: "Jonas Veldt",
    credential: "Cinematographer, A24",
    courses: 5,
    portrait:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=70",
  },
];

export function ChapterInstructorSpotlight() {
  const rootRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const setChapter = useScrollStore((s) => s.setChapter);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.set([quoteRef.current, imageRef.current], { opacity: 0, y: 40 });
      gsap.set(
        cardsRef.current.filter(Boolean) as HTMLElement[],
        { opacity: 0, y: 30 }
      );

      ScrollTrigger.create({
        trigger: root,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(quoteRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "expo.out",
          });
          gsap.to(imageRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "expo.out",
            delay: 0.12,
          });
        },
      });

      ScrollTrigger.create({
        trigger: cardsRef.current[0] ?? root,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(cardsRef.current.filter(Boolean) as HTMLElement[], {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "expo.out",
            stagger: 0.08,
          });
        },
      });
    }, root);

    const chapterTrigger = ScrollTrigger.create({
      trigger: root,
      start: "top center",
      end: "bottom center",
      onEnter: () => setChapter("instructors"),
      onEnterBack: () => setChapter("instructors"),
    });

    return () => {
      ctx.revert();
      chapterTrigger.kill();
    };
  }, [setChapter]);

  return (
    <section
      ref={rootRef}
      id="chapter-instructors"
      className="relative py-24 md:py-32"
      style={{ backgroundColor: "var(--ink)" }}
      aria-label="Instructor spotlight"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Quote block */}
          <div ref={quoteRef} className="lg:col-span-7">
            <Eyebrow>Spotlight</Eyebrow>

            {/* Decorative opening quotation mark */}
            <svg
              aria-hidden="true"
              className="mt-6 h-8 w-8"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M4 20c0-5.333 2.667-10 8-14l2 2C10.667 10.667 9.333 14 10 18h6v8H4v-6zm16 0c0-5.333 2.667-10 8-14l2 2C26.667 10.667 25.333 14 26 18h6v8H20v-6z"
                fill="var(--gold)"
                opacity="0.5"
              />
            </svg>

            <blockquote
              className="display mt-2 italic"
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
                lineHeight: 1.15,
                color: "var(--text-primary)",
              }}
            >
              &ldquo;The best craftspeople I&rsquo;ve ever worked with were also
              the best teachers. Prime Learning finally gives them the stage they
              deserve.&rdquo;
            </blockquote>

            <figcaption className="mt-8 flex items-center gap-3 text-sm">
              <div
                className="h-px w-10"
                style={{ backgroundColor: "rgba(245,242,235,0.3)" }}
              />
              <span style={{ color: "var(--text-primary)" }}>Mei Lin</span>
              <span style={{ color: "var(--text-tertiary)" }}>·</span>
              <span style={{ color: "var(--text-secondary)" }}>
                Principal Engineer, ex-Stripe
              </span>
            </figcaption>
          </div>

          {/* Featured portrait */}
          <div
            ref={imageRef}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl lg:col-span-5"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Image
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80"
              alt="Mei Lin, Principal Engineer"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="animate-ken-burns object-cover"
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs">
              <span
                className="display text-base"
                style={{ color: "var(--text-primary)" }}
              >
                Mei Lin
              </span>
              <span
                className="rounded-full px-2.5 py-1"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                  color: "var(--text-primary)",
                }}
              >
                6 courses
              </span>
            </div>
          </div>
        </div>

        {/* Instructor grid */}
        <div className="mt-20 grid grid-cols-2 gap-5 md:grid-cols-4">
          {INSTRUCTORS.map((p, i) => (
            <figure
              key={p.name}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="group"
            >
              <div
                className="relative aspect-[3/4] overflow-hidden rounded-xl"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: "var(--mist)",
                }}
              >
                <Image
                  src={p.portrait}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover grayscale transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>
              <figcaption className="mt-4">
                <div
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {p.name}
                </div>
                <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {p.credential}
                </div>
                <div
                  className="mt-1 text-xs"
                  style={{ color: "var(--gold-bright)" }}
                >
                  {p.courses} courses
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
