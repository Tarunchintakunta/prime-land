# Prime Learning — Landing Page

Cinematic, scroll-driven landing page for Prime Learning — eight chapters,
WebGL portal hero, GSAP choreography wrapped in a Lenis smooth-scroll shell.

## Setup

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # serve production build
npm run typecheck    # tsc --noEmit, strict mode
```

Node 20+ recommended. Uses Next.js 15 App Router with React 19.

## Debug flags (URL params)

These are intentionally kept in the production build — they're hidden by
default and invaluable when iterating on scroll choreography.

- `?debug=1` — top-right overlay: current chapter, theme, portal/morph
  progress, absolute scrollY.
- `?slow=1` — multiplies every GSAP duration by 3 so you can actually see
  what's easing in/out. Also triples CSS transitions via a data-attribute
  hook.
- `?grid=1` — overlays a 12-column guide at layout width for alignment.
- `?nowebgl=1` — force the static SVG fallback hero even on capable
  hardware. Useful for testing the no-WebGL path without fiddling with
  `hardwareConcurrency`.

Combine freely: `?debug=1&slow=1`.

## Architecture

```
app/
├── layout.tsx            # fonts, metadata, JSON-LD, provider stack
├── page.tsx              # chapter orchestration
├── globals.css           # tokens, Tailwind entry, cursor, grain, debug
├── opengraph-image.tsx   # edge-rendered 1200×630 OG image
├── robots.ts
└── sitemap.ts

components/
├── chapters/
│   ├── Chapter1Gate.tsx          # WebGL hero, scroll-driven camera dolly
│   ├── Chapter2Manifesto.tsx     # word-by-word reveal
│   ├── Chapter3Stats.tsx         # horizontal pin, scrubbed counters
│   ├── Chapter4Categories.tsx    # 7-card horizontal carousel (pinned)
│   ├── Chapter5Courses.tsx       # tabbed grid with sliding gold underline
│   ├── Chapter6HowItWorks.tsx    # sticky timeline, 3 illustrations
│   ├── Chapter7Plans.tsx         # 3-card pricing, middle scales up on scrub
│   ├── Chapter8Graduation.tsx    # reuses PortalScene in "graduation" mode
│   ├── ChapterStub.tsx           # (unused post-Pass 2; left for iteration)
│   ├── CategoryIcons.tsx         # 7 inline SVG line-art icons
│   ├── CoursePattern.tsx         # 4 SVG thumbnail patterns
│   └── courseData.ts
├── hero/
│   ├── PortalScene.tsx           # R3F <Canvas> + EffectComposer
│   ├── ParticleIcosahedron.tsx   # 8k-point cloud + morph targets
│   ├── FallbackHero.tsx          # static SVG fallback
│   └── shaders.ts                # inline GLSL (vert/frag)
├── ui/
│   ├── BackgroundCanvas.tsx      # ink↔paper cross-fade (fixed layer)
│   ├── Button.tsx
│   ├── CustomCursor.tsx          # desktop-only, fine-pointer only
│   ├── Eyebrow.tsx
│   ├── Footer.tsx
│   ├── GrainOverlay.tsx
│   ├── Loader.tsx                # intro loader + `pl:loader-complete` event
│   ├── ScrollDebug.tsx           # ?debug=1 overlay
│   ├── ScrollIndicator.tsx       # drawing-vertical-line scroll hint
│   └── TopNav.tsx                # fades in after hero, Lenis anchor scroll
└── providers/
    ├── DebugFlags.tsx            # parses ?slow / ?grid
    ├── LenisProvider.tsx         # also exposes lenis on window.__lenis
    └── ScrollStore.ts            # zustand (portalProgress, chapter, theme, morph)

lib/
├── cn.ts
├── gsap.ts                       # registerPlugin + shared EASE constants
└── scroll.ts                     # Lenis ↔ ScrollTrigger bridge
```

## Architectural decisions

**Single source of truth for scroll state.** The zustand store in
`providers/ScrollStore.ts` holds `portalProgress`, `chapter`, `theme`, and
`morph`. The WebGL canvas reads its camera target from here rather than
owning a ScrollTrigger — that's PRD §Scroll Choreography Rule 4, and it
means the canvas can survive chapter remounts without tearing scroll
timelines.

**Background cross-fade at layout level.** `BackgroundCanvas.tsx` is a
single fixed-position div that flips between `--ink` and `--paper` based
on the active chapter's theme. Each chapter keeps itself transparent; the
only job chapters have is to call `setChapter(...)` from their in-view
ScrollTrigger.

**Inline GLSL.** Shaders live as template literals in `shaders.ts`. No
webpack loader, no file extension conventions, one less thing to break
when Next.js bumps its webpack config.

**No Flip plugin.** PRD suggested using GSAP's Flip plugin for the Chapter 5
tab underline. We animate width + translateX from measured boundingRect
instead — same visual, no extra bundle.

**Dynamic import of WebGL.** `PortalScene` is `next/dynamic` with
`ssr: false`. This pulls three / r3f / drei / postprocessing out of the
initial chunk; First Load JS stays at ~167 kB gzip.

**React 19 + R3F v9 RC.** We're on an R3F release-candidate lineage to
stay compatible with React 19. Worth re-pinning to the stable release once
it ships.

## Performance

See `PERFORMANCE.md` for numbers. Short version: initial route is 167 kB
gzip First Load JS; the heavy WebGL bundle is code-split and fetched only
after first paint.

## Accessibility

- Skip-to-content link at the top of `TopNav.tsx`.
- Gold 2px focus ring with 4px offset — applied via `:focus-visible` in
  globals.css.
- All decorative SVGs carry `aria-hidden="true"`; the hero canvas carries
  a descriptive `role="img"` + `aria-label`.
- Stats section announces final counter values via an `aria-live="polite"`
  region once the section settles (not on every scrub tick).
- `prefers-reduced-motion` disables Lenis, the loader, the custom cursor,
  and globally collapses GSAP animation durations to ~0 via
  `animation-duration: 0.001ms` in globals.css.

## Known issues / next up

1. **Chapter 8 morph** — at present the "BEGIN" morph expands the
   particle cloud outward as a stylized blossom rather than sampling
   actual letterforms. Swap `aMorphPosition` initialization in
   `ParticleIcosahedron.tsx` to sample 5 letter paths via SVG path
   sampling (e.g., `getPointAtLength`) or a signed-distance-field atlas.
2. **Sliding tab underline** on first paint sometimes renders at `width:0`
   before `useEffect` measures — add a layout-effect fallback.
3. **OG image** uses the default serif stack from `next/og`; can be
   upgraded with a Google Fonts fetch if we care about exact typography
   match in social previews.
4. **R3F v9 RC** — should be pinned to a stable release once available.
5. **Mobile WebGL** — we gate on `hardwareConcurrency < 4` which is a
   rough heuristic. A more accurate gate would feature-detect via a
   smaller WebGL capability probe.
