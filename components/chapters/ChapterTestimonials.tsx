"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useScrollStore } from "@/components/providers/ScrollStore";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Quote = {
  name: string;
  role: string;
  avatar: string;
  text: string;
};

const ROW_A: Quote[] = [
  {
    name: "Avery Chen",
    role: "Engineer · Vercel",
    avatar: "https://i.pravatar.cc/80?img=5",
    text: "I shipped my first internal tool in week three. By month two I was leading a code review on the same patterns I'd just learned.",
  },
  {
    name: "Lucas Møller",
    role: "Designer · Linear",
    avatar: "https://i.pravatar.cc/80?img=11",
    text: "The mentor reviews are the entire game. I've done bootcamps that cost 10× more and gave me less.",
  },
  {
    name: "Hana Park",
    role: "PM · Notion",
    avatar: "https://i.pravatar.cc/80?img=49",
    text: "Prime Learning feels like a magazine you can actually take action on. Beautiful, but real.",
  },
  {
    name: "Tomás Riera",
    role: "Founder · Solo",
    avatar: "https://i.pravatar.cc/80?img=13",
    text: "I bought it for the AI track and stayed for the storytelling course. Refreshingly broad library.",
  },
  {
    name: "Sara Okafor",
    role: "Data Lead · Wise",
    avatar: "https://i.pravatar.cc/80?img=44",
    text: "The certificate actually meant something. Recruiters at three of my interviews recognized it.",
  },
];

const ROW_B: Quote[] = [
  {
    name: "Imani Tate",
    role: "Eng Manager · Block",
    avatar: "https://i.pravatar.cc/80?img=23",
    text: "We rolled Prime Learning out to my whole team. Onboarding velocity improved measurably the next quarter.",
  },
  {
    name: "Ben Carter",
    role: "iOS Dev · Spotify",
    avatar: "https://i.pravatar.cc/80?img=33",
    text: "Polished without being hollow. Every lesson assumes you have taste and respects your time.",
  },
  {
    name: "Mei-Ling Zhao",
    role: "Researcher · DeepMind",
    avatar: "https://i.pravatar.cc/80?img=39",
    text: "Honestly the best subscription I pay for. Not even close.",
  },
  {
    name: "Diego Ramos",
    role: "Brand Lead · Patagonia",
    avatar: "https://i.pravatar.cc/80?img=58",
    text: "Production value rivals MasterClass. Practical depth rivals my old MFA program.",
  },
  {
    name: "Olu Bankole",
    role: "Eng · Figma",
    avatar: "https://i.pravatar.cc/80?img=64",
    text: "I unsubscribed from three other platforms after the first month here.",
  },
];

export function ChapterTestimonials() {
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const setChapter = useScrollStore((s) => s.setChapter);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    gsap.set(headingRef.current, { opacity: 0, y: 30 });

    const headingIn = ScrollTrigger.create({
      trigger: root,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(headingRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
        });
      },
    });

    const chapterTrigger = ScrollTrigger.create({
      trigger: root,
      start: "top center",
      end: "bottom center",
      onEnter: () => setChapter("testimonials"),
      onEnterBack: () => setChapter("testimonials"),
    });

    return () => {
      headingIn.kill();
      chapterTrigger.kill();
    };
  }, [setChapter]);

  return (
    <section
      ref={rootRef}
      id="chapter-testimonials"
      className="relative overflow-hidden py-24 md:py-32"
      style={{ backgroundColor: "var(--ink)" }}
      aria-labelledby="testimonials-heading"
    >
      {/* Subtle radial gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(212,165,116,0.07), transparent 60%)",
        }}
      />

      <div ref={headingRef} className="relative mx-auto max-w-7xl px-6 text-center">
        <Eyebrow>Loved by learners</Eyebrow>
        <h2
          id="testimonials-heading"
          className="display mt-5"
          style={{
            fontSize: "clamp(2.25rem, 5vw, 4rem)",
            color: "var(--text-primary)",
            lineHeight: 1.1,
          }}
        >
          The kind of reviews
          <br />
          <em className="italic" style={{ color: "var(--gold)" }}>
            we screenshot.
          </em>
        </h2>
      </div>

      <div className="relative mt-14 space-y-5">
        <MarqueeRow items={ROW_A} direction="left" />
        <MarqueeRow items={ROW_B} direction="right" />
      </div>

      {/* Edge fades */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32"
        style={{
          background: "linear-gradient(to right, var(--ink), transparent)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32"
        style={{
          background: "linear-gradient(to left, var(--ink), transparent)",
        }}
      />
    </section>
  );
}

function MarqueeRow({
  items,
  direction,
}: {
  items: Quote[];
  direction: "left" | "right";
}) {
  const animClass =
    direction === "left" ? "animate-marquee" : "animate-marquee-rev";
  const all = [...items, ...items];

  return (
    <div className="group relative overflow-hidden">
      <div
        className={`marquee-track ${animClass} group-hover:[animation-play-state:paused]`}
      >
        {all.map((q, i) => (
          <article
            key={`${q.name}-${i}`}
            className="w-[340px] shrink-0 rounded-2xl p-5"
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              backgroundColor: "var(--mist)",
            }}
          >
            <div className="flex items-center gap-3">
              <Image
                src={q.avatar}
                alt=""
                width={40}
                height={40}
                className="rounded-full"
                unoptimized
              />
              <div>
                <div
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {q.name}
                </div>
                <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {q.role}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, k) => (
                  <svg
                    key={k}
                    aria-hidden="true"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                  >
                    <path
                      d="M6 1l1.3 2.7 3 .4-2.2 2.1.5 3L6 7.8l-2.6 1.4.5-3L1.7 4.1l3-.4z"
                      fill="var(--gold)"
                    />
                  </svg>
                ))}
              </div>
            </div>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              &ldquo;{q.text}&rdquo;
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
