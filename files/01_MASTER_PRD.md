# Prime Learning — "Portal" Landing Page PRD

## Project Context

You are building the landing page for **Prime Learning**, a premium e-learning platform (reference: primelearning.ae). This is NOT a standard marketing site. This is a **cinematic, scroll-driven "portal" experience** where the user feels like they are *descending into* the platform as they scroll. Think Apple product pages × Awwwards Site of the Day × Linear's marketing pages × Igloo Inc.

**The one-sentence vision:** As the user scrolls, they go from "standing at the gates" (hero) → "walking through the halls" (categories) → "sitting at the desk" (courses) → "graduating" (CTA). Every scroll tick should feel *meaningful*, not just "content scrolled past."

**Brand identity:**
- Name: Prime Learning
- Tagline: "Learn Smarter. Grow Faster. Lead With Purpose."
- Vibe: premium, intelligent, slightly futuristic, UAE/Dubai-sophisticated (not loud — refined)
- Audience: ambitious professionals, students, enterprise L&D buyers

---

## Tech Stack (non-negotiable)

- **Next.js 15** (App Router), **TypeScript strict mode**
- **React Three Fiber** + **drei** + **@react-three/postprocessing** for WebGL
- **GSAP 3** with **ScrollTrigger** plugin for scroll choreography
- **Lenis** for smooth scroll (wired to ScrollTrigger via proxy)
- **Tailwind CSS v4** + **shadcn/ui** for baseline components
- **Framer Motion** for micro-interactions only (small UI things, not scroll)
- **next/font** with **Inter** (body) + **Instrument Serif** (display accent)
- **Zustand** for any shared client state (theme, scroll progress exposed globally)
- Deploy target: **Vercel**

**Performance budget:**
- LCP < 2.0s on 4G / Moto G4
- Total JS transferred < 300KB gzip on initial route
- WebGL canvas must degrade gracefully: feature-detect, provide reduced-motion fallback, lazy-mount below 768px with a static poster frame instead
- Respect `prefers-reduced-motion` — kill scroll effects, keep content

---

## Visual Language

**Color system** (define as CSS variables in globals.css):
- `--ink`: #0A0A0F (near-black, main bg)
- `--paper`: #F5F2EB (cream, section breaks)
- `--gold`: #D4A574 (accent, Dubai-desert inflection)
- `--electric`: #5B6CFF (secondary accent, "intelligence")
- `--mist`: #1A1A24 (elevated surfaces on dark)
- `--fog`: rgba(255,255,255,0.06) (borders on dark)

Default to **dark mode first**, with a light "paper" section mid-page for contrast whiplash.

**Typography scale:**
- Display: Instrument Serif, 120–200px on desktop, italic for keywords
- Headline: Inter, weight 500, -0.03em tracking, 48–80px
- Body: Inter, weight 400, 16–18px, 1.6 line-height
- Eyebrow labels: Inter, weight 500, 11px, uppercase, 0.2em tracking

**Grain overlay:** Subtle SVG noise at 3% opacity across the whole viewport. Crucial for the premium feel — don't skip it.

---

## Page Structure (8 scroll "chapters")

The page is ONE continuous scroll, but internally divided into 8 chapters. Each chapter has a clear entrance, hold, and exit animation driven by GSAP ScrollTrigger.

### Chapter 1 — The Gate (0–100vh)
**WebGL hero.** A 3D "portal" — an organic, slowly-rotating torus knot or icosahedron made of instanced particles that form and dissolve. Behind it: a shader-driven gradient (deep navy → ink → flecks of gold). Camera subtly parallaxes with mouse. On top:
- Eyebrow: "PRIME LEARNING"
- Display headline: "Unlock skills that *drive* your future." (the word "drive" in italic serif)
- Subcopy one line
- Two buttons: "Explore Courses" (primary, gold) + "How it works" (ghost)
- Scroll indicator at bottom — not a generic chevron, a custom vertical line that draws itself

As user scrolls, the 3D object **dollies toward the camera and passes through it** (camera zooms into its center) — this is the "entering the portal" moment. Duration: first 100vh of scroll.

### Chapter 2 — The Manifesto (100–200vh)
Dark section. Large-type statement that reveals **word-by-word** as you scroll:

> "We believe learning should feel like **momentum**, not obligation. That mastery is a **practice**, not a credential. That your next chapter is closer than you think."

Each bold word gets a gold underline that draws itself on reveal. Background: slow-moving faint WebGL fog (could be reused canvas from Chapter 1, transitioned).

### Chapter 3 — Stats Reveal (200–260vh)
Horizontal pin. Three stats slide in from the right as the user scrolls down:
- Learners enrolled
- Courses across 7 categories
- Average completion rate

Each number counts up using GSAP. Stats sit on a `--paper` (cream) background — **first color flip of the page.** The transition from dark → cream should feel like a door opening.

### Chapter 4 — Categories Carousel (260–420vh)
Pinned section (160vh of scroll translates to horizontal movement).

Seven category cards move horizontally as the user scrolls vertically. Each card:
- Large numeral (01–07)
- Category name (e.g., "Technology & Data")
- 3-line description
- Small illustration (use simple SVG line art — generate inline, don't rely on external assets)
- Hover: card lifts, gold border glows

Categories: Business & Leadership, Technology & Data, Finance & Markets, Creative & Design, Professional Skills, Academic Prep, Business School Admissions.

### Chapter 5 — Courses Grid (420–560vh)
Back to normal vertical scroll. Dark bg again (second color flip — the whiplash is intentional).

A grid of course cards with a **category tab switcher** at top (AI, Data Science, Product Management, etc.). Tab switching is animated — cards exit with stagger, new cards enter. Each card:
- 16:9 thumbnail area (use CSS gradients + generated SVG patterns, no stock imagery — part of the premium feel is that it's all built, not sourced)
- Title, instructor, duration, price in AED
- Hover: thumbnail scales subtly, a "play" circle fades in center

Four cards per category, "Show all →" at the end.

### Chapter 6 — How It Works (560–680vh)
Three-step process, but rendered as a **sticky vertical timeline** where each step pins for ~30vh while its illustration animates. Steps: Browse → Enroll → Earn Certificate.

Each step has a small canvas animation (can be CSS/SVG, doesn't have to be WebGL) — e.g., step 3 draws a certificate SVG with a stamp that lands with a satisfying GSAP bounce.

### Chapter 7 — Plans (680–780vh)
Cream/paper bg again. Three pricing cards: Team / Enterprise / AI Fluency. Standard pricing layout BUT with a twist: as you scroll, the recommended card (Enterprise) slightly scales up and the others recede. Subtle, not gimmicky.

### Chapter 8 — The Graduation (780–900vh)
Final CTA. Dark again. Reuse the Chapter 1 WebGL scene but now the particles form the word "BEGIN" (or the Prime Learning logomark). Two CTAs: "Explore Courses" and "Talk to Sales."

Footer follows in normal flow below.

---

## Scroll Choreography Rules

1. **Lenis smooth scroll wraps everything.** Target lerp: 0.08. Wheel multiplier: 1.
2. **GSAP ScrollTrigger is the only way** sections animate on scroll. No intersection-observer one-offs.
3. Every pinned section MUST release its pin cleanly — test on rapid scroll-up.
4. **Global scroll progress** exposed via Zustand store so the 3D canvas can react (e.g., portal dolly is driven by a 0→1 progress value, not by its own ScrollTrigger).
5. Section transitions should overlap by ~15vh so there's no "hard cut" feeling.

---

## The WebGL Hero — Detailed Spec

**File:** `/components/hero/PortalScene.tsx`

- `<Canvas>` with `dpr={[1, 2]}`, `gl={{ antialias: true, alpha: true }}`
- A **particle system** of ~8000 points arranged on the surface of an icosahedron, geometry instanced
- Custom shader material: points have soft radial falloff, color lerped between `--gold` and `--electric` based on distance from camera
- Object slowly rotates on Y axis (0.05 rad/s) and breathes (scale oscillates 1.0 ↔ 1.03 over 4s)
- **Camera rig:** driven by scroll progress — z position goes from 5 to -2 over 0→1 scroll, at which point camera is *inside* the object and we see the fragmented back side as we exit into Chapter 2
- Mouse parallax on camera rotation (max ±0.05 rad), damped
- `<EffectComposer>` with bloom (intensity 0.8, threshold 0.9) and chromatic aberration (offset 0.001) — subtle

Fallback: if `navigator.hardwareConcurrency < 4` or canvas creation fails, render a static SVG version of the icosahedron with a CSS `filter: blur()` animation. Set `.no-webgl` class on body.

---

## Component Architecture

```
/app
  /page.tsx                    # orchestrates all chapters
  /layout.tsx                  # fonts, Lenis provider, grain overlay
/components
  /chapters
    Chapter1Gate.tsx
    Chapter2Manifesto.tsx
    Chapter3Stats.tsx
    Chapter4Categories.tsx
    Chapter5Courses.tsx
    Chapter6HowItWorks.tsx
    Chapter7Plans.tsx
    Chapter8Graduation.tsx
  /hero
    PortalScene.tsx
    ParticleIcosahedron.tsx
    portal.vert.glsl
    portal.frag.glsl
    FallbackHero.tsx
  /ui
    Button.tsx                 # variants: primary, ghost, gold
    Eyebrow.tsx
    GrainOverlay.tsx
    ScrollIndicator.tsx
  /providers
    LenisProvider.tsx
    ScrollStore.ts             # zustand store exposing scrollY, progress per chapter
/lib
  gsap.ts                      # registers plugins, exports shared easings
  scroll.ts                    # Lenis <-> ScrollTrigger bridge
```

---

## Deliverables for This First Pass

1. Scaffold the Next.js 15 project with all dependencies installed.
2. Implement the **global shell**: Lenis provider, GSAP setup, grain overlay, fonts, color tokens.
3. Implement **Chapter 1 (The Gate) in full** — the WebGL portal with scroll-driven camera dolly.
4. Implement **Chapter 2 (Manifesto)** with the word-by-word reveal.
5. Stub out Chapters 3–8 as placeholder sections (correct height, correct bg color flip, section title visible) so the scroll length is realistic and we can feel the pacing.
6. Add a small dev-only `ScrollDebug.tsx` overlay (top-right, toggleable with `?debug=1`) showing current scroll progress 0–1 and which chapter is active. Essential for the iteration work ahead.

**Do not attempt all 8 chapters in one shot.** Get the scaffold + Chapters 1 & 2 polished first. I'll come back for the rest in subsequent prompts.

---

## Acceptance Criteria for Pass 1

- `npm run dev` works clean, no console errors or warnings
- Scroll feels smooth (Lenis active, no jank)
- Chapter 1 WebGL renders; scrolling down dollies camera into the object
- Chapter 2 text reveals word-by-word on scroll
- `prefers-reduced-motion` kills all scroll animations; content still readable top-to-bottom
- Mobile (< 768px): WebGL replaced by static SVG hero; all text legible; no horizontal overflow
- Lighthouse Performance score ≥ 85 on desktop, ≥ 70 on mobile (preview env)
- Code is commented where shader math or GSAP timelines get non-obvious

When you're done, give me a concise summary of what's wired up, what's stubbed, and any decisions you made that deviated from this PRD.
