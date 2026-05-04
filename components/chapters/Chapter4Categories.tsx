"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useScrollStore } from "@/components/providers/ScrollStore";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface Category {
  number: string;
  name: string;
  description: string;
  /** Hero image for the card mid-section (served from /public/categories). */
  imageSrc: string;
  imageAlt: string;
}

const CATEGORIES: Category[] = [
  {
    number: "01",
    name: "Business & Leadership",
    description:
      "Strategy, operations, and the soft skills that move organizations. For managers, founders, and those on the way there.",
    imageSrc: "/categories/01-business-leadership.png",
    imageAlt: "Team in a meeting with a growth arrow graphic",
  },
  {
    number: "02",
    name: "Technology & Data",
    description:
      "Engineering, AI, and the infrastructure of the modern internet. Applied, not academic.",
    imageSrc: "/categories/02-technology-data.png",
    imageAlt: "Physical and digital analytics dashboards",
  },
  {
    number: "03",
    name: "Finance & Markets",
    description:
      "Capital markets, valuation, and the numbers behind every decision. From analyst to executive.",
    imageSrc: "/categories/03-finance-markets.png",
    imageAlt: "3D bar chart and magnifying glass over financial reports",
  },
  {
    number: "04",
    name: "Creative & Design",
    description:
      "Brand, product, and the craft of making things people love. Taste is a trainable skill.",
    imageSrc: "/categories/04-creative-design.png",
    imageAlt: "Designer workspace with laptop and monitors",
  },
  {
    number: "05",
    name: "Professional Skills",
    description:
      "Communication, negotiation, and the daily practice of working well with others.",
    imageSrc: "/categories/05-professional-skills.png",
    imageAlt: "Business presentation with charts on a whiteboard",
  },
  {
    number: "06",
    name: "Academic Prep",
    description:
      "Standardized tests, rigorous fundamentals, and the discipline to reach the top of any cohort.",
    imageSrc: "/categories/06-academic-prep.png",
    imageAlt: "Stack of books with a graduation cap and ladders",
  },
  {
    number: "07",
    name: "Business School Admissions",
    description:
      "Essays, interviews, and the positioning work that gets you into the programs you want.",
    imageSrc: "/categories/05-professional-skills.png",
    imageAlt: "Professional meeting and presentation skills",
  },
];

/**
 * Chapter 4 — Categories Carousel.
 *
 * Pinned section. As the user scrolls vertically for ~160vh, a horizontal
 * strip of 7 cards translates left. Pure GSAP + transforms — no carousel
 * lib. Cards are 28vw with a responsive compact gap. Hover: lift + gold inset border.
 */
export function Chapter4Categories() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setChapter = useScrollStore((s) => s.setChapter);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    // Compute how far the track must translate so its last card is flush
    // with the right edge of the viewport. Measure inside a matchMedia so
    // we recompute on resize.
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1px)", () => {
      const distance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    const chapterTrigger = ScrollTrigger.create({
      trigger: root,
      start: "top center",
      end: "bottom center",
      onEnter: () => setChapter("categories"),
      onEnterBack: () => setChapter("categories"),
    });

    return () => {
      mm.revert();
      chapterTrigger.kill();
    };
  }, [setChapter]);

  return (
    <section
      ref={rootRef}
      id="chapter-categories"
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh", backgroundColor: "var(--paper)" }}
      aria-label="Course categories"
    >
      <div className="absolute left-8 top-16 z-10 lg:left-24">
        <Eyebrow onPaper>Seven categories</Eyebrow>
        <h2
          className="display mt-3 max-w-[18ch]"
          style={{
            fontSize: "clamp(1.75rem, 4.5vw, 3.5rem)",
            color: "var(--text-primary-ink)",
          }}
        >
          The shape of a <em className="italic" style={{ color: "var(--gold-dark)" }}>complete</em> education.
        </h2>
      </div>

      <div className="absolute inset-0 flex items-center">
        <div
          ref={trackRef}
          className="flex items-stretch gap-[clamp(1rem,2vw,2rem)] pl-[clamp(1rem,4vw,4rem)] pr-[clamp(1rem,4vw,4rem)]"
          style={{ willChange: "transform" }}
        >
          {CATEGORIES.map(({ number, name, description, imageSrc, imageAlt }) => (
            <article
              key={number}
              className="group relative flex w-[80vw] shrink-0 flex-col gap-6 rounded-2xl border border-[rgba(10,10,15,0.08)] bg-white/40 p-8 backdrop-blur transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:bg-white/60 md:w-[40vw] lg:w-[28vw] lg:gap-8 lg:p-10"
              style={{ minHeight: "60vh" }}
            >
              {/* gold inset border fades in on hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl border border-[var(--gold)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span
                className="display shrink-0"
                style={{
                  fontSize: "clamp(3rem, 5vw, 4.5rem)",
                  color: "var(--gold-dark)",
                }}
              >
                {number}
              </span>
              <div className="relative min-h-[clamp(11rem,26vh,18rem)] w-full flex-1 overflow-hidden rounded-xl bg-[var(--mist)] shadow-sm ring-1 ring-[rgba(10,10,15,0.08)] transition-[box-shadow] duration-500 group-hover:ring-[var(--gold)]/35">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 28vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  quality={85}
                />
              </div>
              <div className="shrink-0">
                <h3
                  className="headline"
                  style={{
                    fontSize: "clamp(1.5rem, 2.4vw, 2.25rem)",
                    color: "var(--text-primary-ink)",
                  }}
                >
                  {name}
                </h3>
                <p
                  className="mt-4 text-base leading-relaxed"
                  style={{ color: "var(--text-secondary-ink)" }}
                >
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
