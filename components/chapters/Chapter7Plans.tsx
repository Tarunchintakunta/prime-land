"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useScrollStore } from "@/components/providers/ScrollStore";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

interface Plan {
  name: string;
  tag: string;
  price: string;
  unit: string;
  features: string[];
  cta: string;
  recommended?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Team",
    tag: "For growing teams",
    price: "AED 990",
    unit: "/seat/mo",
    features: [
      "Up to 25 seats",
      "Full course catalog",
      "Quarterly skill reports",
      "Email support",
    ],
    cta: "Start a team",
  },
  {
    name: "Enterprise",
    tag: "For organizations",
    price: "Custom",
    unit: "annual plan",
    features: [
      "Unlimited seats",
      "Dedicated learning advisor",
      "Custom cohorts & content",
      "SSO, audit, and SLA",
    ],
    cta: "Talk to sales",
    recommended: true,
  },
  {
    name: "AI Fluency",
    tag: "For leaders, fast",
    price: "AED 4,900",
    unit: "one-time program",
    features: [
      "6-week cohort",
      "Executive-level curriculum",
      "Capstone review",
      "Credential included",
    ],
    cta: "Enroll",
  },
];

/**
 * Chapter 7 — Plans.
 *
 * Paper bg. All three cards fade up on section entry. As the user scrolls
 * past midpoint, the outer cards recede (translate outward + opacity 0.7)
 * and the middle card grows to scale 1.03. Scroll-linked with scrub so the
 * effect reverses on scroll-up.
 */
export function Chapter7Plans() {
  const rootRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const setChapter = useScrollStore((s) => s.setChapter);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    gsap.set(cards, { y: 30, opacity: 0 });

    // Entry fade-up (one-shot)
    const enter = gsap.to(cards, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.1,
      ease: "expo.out",
      scrollTrigger: {
        trigger: root,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    // Scroll-linked recede-and-grow
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "center 70%",
        end: "bottom top",
        scrub: 1,
      },
    });
    tl.to(cards[0], { x: -20, opacity: 0.7, duration: 1, ease: "none" }, 0);
    tl.to(cards[2], { x: 20, opacity: 0.7, duration: 1, ease: "none" }, 0);
    tl.to(cards[1], { scale: 1.03, duration: 1, ease: "none" }, 0);

    const chapterTrigger = ScrollTrigger.create({
      trigger: root,
      start: "top center",
      end: "bottom center",
      onEnter: () => setChapter("plans"),
      onEnterBack: () => setChapter("plans"),
    });

    return () => {
      enter.scrollTrigger?.kill();
      enter.kill();
      tl.scrollTrigger?.kill();
      tl.kill();
      chapterTrigger.kill();
    };
  }, [setChapter]);

  return (
    <section
      ref={rootRef}
      id="chapter-plans"
      className="relative w-full px-6 py-36 lg:px-16"
      style={{ backgroundColor: "var(--paper)" }}
      aria-label="Plans and pricing"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <Eyebrow onPaper>Plans</Eyebrow>
          <h2
            className="display mt-3"
            style={{
              fontSize: "clamp(2rem, 5.5vw, 4.25rem)",
              color: "var(--text-primary-ink)",
            }}
          >
            Pick a <em className="italic" style={{ color: "var(--gold-dark)" }}>path</em>.
          </h2>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className={`relative flex flex-col rounded-2xl border p-8 lg:p-10 ${
                plan.recommended
                  ? "border-[var(--gold)] bg-[var(--ink)] text-[var(--text-primary)] shadow-[0_24px_60px_-20px_rgba(212,165,116,0.35)]"
                  : "border-[rgba(10,10,15,0.1)] bg-white/60 text-[var(--text-primary-ink)]"
              }`}
            >
              {plan.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--gold)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--ink)]">
                  Recommended
                </span>
              )}
              <div>
                <h3
                  className="display"
                  style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1 }}
                >
                  {plan.name}
                </h3>
                <p
                  className="mt-2 text-sm"
                  style={{
                    color: plan.recommended
                      ? "var(--text-secondary)"
                      : "var(--text-secondary-ink)",
                  }}
                >
                  {plan.tag}
                </p>
              </div>
              <div className="mt-8">
                <span
                  className="display"
                  style={{ fontSize: "clamp(2rem, 3.4vw, 3rem)" }}
                >
                  {plan.price}
                </span>
                <span
                  className="ml-2 text-sm"
                  style={{
                    color: plan.recommended
                      ? "var(--text-secondary)"
                      : "var(--text-secondary-ink)",
                  }}
                >
                  {plan.unit}
                </span>
              </div>
              <ul className="mt-8 space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--gold)]" />
                    <span
                      style={{
                        color: plan.recommended
                          ? "var(--text-primary)"
                          : "var(--text-primary-ink)",
                      }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Button
                  variant={plan.recommended ? "primary" : "gold"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
