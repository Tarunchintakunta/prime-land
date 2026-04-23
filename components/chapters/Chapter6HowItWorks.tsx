"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useScrollStore } from "@/components/providers/ScrollStore";
import { Eyebrow } from "@/components/ui/Eyebrow";

const STEPS = [
  {
    title: "Browse",
    blurb:
      "Start with the catalog. Filter by career stage, commitment, or category — every course has a clear outcome attached.",
  },
  {
    title: "Enroll",
    blurb:
      "Pick your pace. Live cohorts run weekly; self-paced tracks stay open. One click, and you're in.",
  },
  {
    title: "Earn Certificate",
    blurb:
      "Ship real work, get reviewed, and walk away with a credential recruiters recognize. Made in Dubai, honored everywhere.",
  },
];

/** Total scroll distance the pinned viewport occupies, in viewport heights. */
const PIN_VH = 200;

/**
 * Chapter 6 — How It Works.
 *
 * GSAP-pinned three-step vertical timeline. The section is pinned to the
 * viewport top for {PIN_VH}% of scroll; inside that pin, three equal zones
 * activate Browse / Enroll / Earn Certificate.
 *
 * Hardening over the previous revision:
 *   - All GSAP setup runs inside `gsap.context()` scoped to the root element
 *     so cleanup is bulletproof under React 19 strict mode (double-mount).
 *   - No JSX inline `style={{ transform: ... }}` on ANY animated element —
 *     those would be clobbered by React reconciliation. Initial states are
 *     set via `gsap.set` in the useEffect instead.
 *   - `pinType: "transform"` — transform-based pinning is more robust than
 *     the position:fixed default, especially when a parent has backdrop-
 *     filter / backdrop-blur anywhere up the tree (our TopNav does).
 *   - Concrete pixel end via a function (`() => \`+=${innerHeight * 2}\``)
 *     so there's no ambiguity about what `+=200%` means under different
 *     browser/Lenis combinations.
 *   - Post-setup: `ScrollTrigger.refresh()` is called, then we read the
 *     pin's current progress and explicitly activate whichever step the
 *     scroll position is already inside (covers hot-reloads while scrolled).
 */
export function Chapter6HowItWorks() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const illoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeStepRef = useRef<number>(-1);
  const setChapter = useScrollStore((s) => s.setChapter);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const titles = titleRefs.current.filter(Boolean) as HTMLElement[];
    const illos = illoRefs.current.filter(Boolean) as HTMLElement[];
    if (titles.length < 3 || illos.length < 3) return;

    const ctx = gsap.context(() => {
      // ────────────── CHILD QUERIES ──────────────
      const browseCards = illos[0].querySelectorAll<HTMLElement>("[data-browse-card]");
      const enrollBar = illos[1].querySelector<HTMLElement>("[data-enroll-bar]");
      const enrollPct = illos[1].querySelector<HTMLElement>("[data-enroll-pct]");
      const certPieces = illos[2].querySelectorAll<HTMLElement>("[data-cert-piece]");
      const certStamp = illos[2].querySelector<HTMLElement>("[data-cert-stamp]");

      // ────────────── INITIAL STATE ──────────────
      // Titles: step 0 bright, others dim.
      gsap.set(titles, {
        opacity: 0.4,
        scale: 0.95,
        transformOrigin: "left center",
      });
      gsap.set(titles[0], { opacity: 1, scale: 1 });

      // Illustration containers: step 0 visible, others hidden.
      gsap.set(illos, { opacity: 0, y: 20 });
      gsap.set(illos[0], { opacity: 1, y: 0 });

      // Child elements pre-hidden to match their reveal "from" states —
      // the `gsap.to` calls below animate cleanly in. No inline style, so
      // React reconciliation can't clobber these.
      gsap.set(browseCards, { y: 40, opacity: 0, rotate: -4 });
      if (enrollBar) gsap.set(enrollBar, { scaleX: 0, transformOrigin: "left" });
      if (enrollPct) enrollPct.textContent = "0%";
      gsap.set(certPieces, { opacity: 0, y: 20 });
      if (certStamp) gsap.set(certStamp, { scale: 0, opacity: 0, rotate: -12 });

      // ────────────── STEP ACTIVATION ──────────────
      const activateStep = (i: number) => {
        if (activeStepRef.current === i) return;
        activeStepRef.current = i;

        titles.forEach((t, j) => {
          gsap.to(t, {
            opacity: j === i ? 1 : 0.4,
            scale: j === i ? 1 : 0.95,
            duration: 0.5,
            ease: "expo.out",
            overwrite: "auto",
          });
        });

        illos.forEach((il, j) => {
          gsap.to(il, {
            opacity: j === i ? 1 : 0,
            y: j === i ? 0 : 20,
            duration: 0.55,
            ease: "expo.out",
            overwrite: "auto",
          });
        });

        if (i === 0) {
          gsap.set(browseCards, { y: 40, opacity: 0, rotate: -4 });
          gsap.to(browseCards, {
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.8,
            stagger: 0.06,
            ease: "expo.out",
            overwrite: "auto",
          });
        }
        if (i === 1) {
          if (enrollBar) {
            gsap.set(enrollBar, { scaleX: 0 });
            gsap.to(enrollBar, {
              scaleX: 1,
              duration: 1.4,
              ease: "expo.out",
              overwrite: "auto",
            });
          }
          if (enrollPct) {
            enrollPct.textContent = "0%";
            const state = { n: 0 };
            gsap.to(state, {
              n: 100,
              duration: 1.4,
              ease: "expo.out",
              onUpdate: () => {
                enrollPct.textContent = `${Math.round(state.n)}%`;
              },
              overwrite: "auto",
            });
          }
        }
        if (i === 2) {
          gsap.set(certPieces, { opacity: 0, y: 20 });
          gsap.to(certPieces, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.12,
            ease: "expo.out",
            overwrite: "auto",
          });
          if (certStamp) {
            gsap.set(certStamp, { scale: 0, opacity: 0, rotate: -12 });
            gsap.to(certStamp, {
              scale: 1,
              opacity: 1,
              rotate: 0,
              duration: 0.9,
              delay: 0.6,
              ease: "back.out(3)",
              overwrite: "auto",
            });
          }
        }
      };

      // ────────────── SCROLLTRIGGERS ──────────────
      // ONE trigger that both pins and drives step activation. Using the
      // pin's own `onUpdate` with normalized 0→1 progress avoids the
      // `top+=X% top` ambiguity when a pin spacer is in play — previously,
      // step zones measured against the un-pinned 100vh root height and so
      // clustered entirely within the first viewport, never firing for
      // steps 1 or 2.
      const pinTrigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${window.innerHeight * (PIN_VH / 100)}`,
        pin: true,
        pinType: "transform",
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const stepIndex = Math.min(
            STEPS.length - 1,
            Math.max(0, Math.floor(self.progress * STEPS.length))
          );
          activateStep(stepIndex);
        },
      });

      // Chapter theme flip — extends past the pin end so the ink theme
      // doesn't blip mid-transition when unpinning.
      ScrollTrigger.create({
        trigger: root,
        start: "top center",
        end: `+=${(PIN_VH + 100) * 0.01 * window.innerHeight}`,
        onEnter: () => setChapter("how"),
        onEnterBack: () => setChapter("how"),
      });

      // Force a refresh now that everything is wired, then activate the
      // step the scroll position is already inside. Covers reloads while
      // scrolled into Ch6 — where onUpdate wouldn't fire until next scroll.
      ScrollTrigger.refresh();
      const p = pinTrigger.progress;
      const initialStep = Math.min(
        STEPS.length - 1,
        Math.max(0, Math.floor(p * STEPS.length))
      );
      activateStep(initialStep);
    }, root);

    return () => ctx.revert();
  }, [setChapter]);

  return (
    <section
      ref={rootRef}
      id="chapter-how"
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh", backgroundColor: "var(--ink)" }}
      aria-label="How it works"
    >
      <div className="mx-auto grid h-[100svh] w-full max-w-7xl grid-cols-1 gap-12 px-6 pt-28 lg:grid-cols-[40%_1fr] lg:px-16">
        {/* Left column — step titles */}
        <div className="flex flex-col justify-center gap-8">
          <Eyebrow>How it works</Eyebrow>
          <h2
            className="display"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
              color: "var(--text-primary)",
            }}
          >
            From curious to{" "}
            <em className="italic text-[var(--gold)]">credentialed</em>.
          </h2>
          <ul className="mt-4 space-y-5">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <button
                  ref={(el) => {
                    titleRefs.current[i] = el;
                  }}
                  className="flex flex-col items-start text-left"
                >
                  <span className="text-sm text-[var(--gold-bright)]">
                    0{i + 1}
                  </span>
                  <h3
                    className="display"
                    style={{
                      fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                      lineHeight: 1,
                      color: "var(--text-primary)",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="mt-3 max-w-md text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {s.blurb}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column — illustrations (stacked, one visible at a time) */}
        <div className="relative flex items-center justify-center">
          <div
            ref={(el) => {
              illoRefs.current[0] = el;
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <BrowseIllustration />
          </div>
          <div
            ref={(el) => {
              illoRefs.current[1] = el;
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <EnrollIllustration />
          </div>
          <div
            ref={(el) => {
              illoRefs.current[2] = el;
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <CertificateIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

function BrowseIllustration() {
  return (
    <div
      className="relative grid h-[min(420px,60vh)] w-[min(420px,60vw)] grid-cols-3 grid-rows-3 gap-3"
      aria-hidden="true"
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          data-browse-card
          className="rounded-md border border-[var(--fog)]"
          style={{
            background:
              i % 3 === 0
                ? "linear-gradient(135deg, #5b6cff 0%, #1a1a24 100%)"
                : i % 3 === 1
                  ? "linear-gradient(135deg, #d4a574 0%, #1a1a24 100%)"
                  : "linear-gradient(135deg, #1a1a24 0%, #5b6cff 100%)",
          }}
        />
      ))}
    </div>
  );
}

function EnrollIllustration() {
  return (
    <div className="flex w-[min(460px,70vw)] flex-col gap-4" aria-hidden="true">
      <div
        className="flex items-center justify-between text-xs uppercase tracking-[0.2em]"
        style={{ color: "var(--text-secondary)" }}
      >
        <span>Enrolling</span>
        <span data-enroll-pct className="text-[var(--gold-bright)]">
          0%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[var(--fog)]">
        {/* NOTE: no inline transform on data-enroll-bar — GSAP owns that.
            An inline style={{ transform: ... }} here would be re-applied by
            React on any reconciliation, clobbering the animation. */}
        <div
          data-enroll-bar
          className="h-full w-full origin-left rounded-full bg-[var(--gold)]"
        />
      </div>
      <div className="mt-6 space-y-2">
        {["Payment confirmed", "Cohort assigned", "Welcome kit delivered"].map(
          (line, i) => (
            <p
              key={line}
              className="flex items-center gap-3 text-sm"
              style={{ opacity: 1 - i * 0.15, color: "var(--text-secondary)" }}
            >
              <span className="inline-block h-1 w-1 rounded-full bg-[var(--gold)]" />
              {line}
            </p>
          )
        )}
      </div>
    </div>
  );
}

function CertificateIllustration() {
  return (
    <div
      className="relative flex h-[min(360px,56vh)] w-[min(520px,72vw)] items-center justify-center"
      aria-hidden="true"
    >
      <div
        data-cert-piece
        className="absolute inset-0 rounded-lg border border-[var(--gold)]/70 bg-gradient-to-br from-[#1a1a24] to-[#0a0a0f] shadow-2xl"
      />
      <div
        data-cert-piece
        className="absolute left-8 top-8 text-xs uppercase tracking-[0.25em] text-[var(--gold-bright)]"
      >
        Certificate of Completion
      </div>
      <div
        data-cert-piece
        className="display absolute left-8 top-16 text-2xl"
        style={{ color: "var(--text-primary)" }}
      >
        Prime Learning
      </div>
      <div
        data-cert-piece
        className="absolute bottom-10 left-8 right-20 h-px bg-white/20"
      />
      <div
        data-cert-piece
        className="absolute bottom-12 left-8 text-xs"
        style={{ color: "var(--text-tertiary)" }}
      >
        Issued to learner
      </div>
      {/* NOTE: no inline transform on data-cert-stamp — GSAP owns that. */}
      <div
        data-cert-stamp
        className="absolute bottom-8 right-8 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--gold)] text-[10px] uppercase tracking-[0.2em] text-[var(--gold-bright)]"
      >
        <span className="text-center leading-tight">
          Prime
          <br />
          Verified
        </span>
      </div>
    </div>
  );
}
