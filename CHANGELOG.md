# Changelog

## Pass 3 — Polish, perf, and the "feel"

### Added
- **Custom cursor** (`components/ui/CustomCursor.tsx`) — 8px gold dot, scales 5× with `mix-blend-mode: difference` on hover of interactive elements. Fine-pointer only; disabled for touch and reduced-motion.
- **Intro loader** (`components/ui/Loader.tsx`) — centered Prime Learning wordmark plus a gold line that draws 0→100% width, fades out with `expo.out` over 0.8s. Dispatches a `pl:loader-complete` event so the hero can stagger its content in.
- **Hero entrance choreography** — eyebrow → headline → subcopy → buttons reveal on loader completion (0.08s stagger, `expo.out`). Safety timeout of 1.2s in case the loader event never fires.
- **TopNav** (`components/ui/TopNav.tsx`) — fixed nav that fades in after leaving the hero, theme-aware (ink/paper). Anchor links scroll via Lenis with `expo.inOut`-shaped easing and 1.4s duration.
- **Skip-to-content** link at top of nav.
- **SEO / metadata** — full OpenGraph + Twitter card, JSON-LD `EducationalOrganization` schema, per-route `<title>` template, canonical URL, `robots.txt` via `app/robots.ts`, `sitemap.xml` via `app/sitemap.ts`, edge-rendered OG image at `app/opengraph-image.tsx`.
- **Accessibility** — `prefers-reduced-motion` disables Lenis, the loader, the custom cursor, and clamps CSS transitions. `aria-live="polite"` on stat counters (announced once settled). `role="img"` + `aria-label` on the WebGL canvas wrapper.
- **Debug flags** — `?slow=1` (3× slower GSAP via `gsap.globalTimeline.timeScale(1/3)` and CSS multiplier), `?grid=1` (12-column overlay), `?nowebgl=1` (already existed; documented). All hidden by default.

### Changed
- Hero headline gets `text-shadow: 0 0 80px rgba(212,165,116,0.15)` — subtle gold glow, premium feel.
- GSAP easings standardized via `EASE` constants in `lib/gsap.ts`: `expo.out` for entrances, `power4.inOut` for section transitions, `back.out(1.7)` for UI, `sine.inOut` for ambient loops.

## Pass 2 — Chapters 3–8 + Footer

### Added
- **Chapter 3 (Stats)** — horizontal pin for 150vh, three stat blocks translate in from the right, counters animate via GSAP tweening object state (not CSS) so they track scroll progress, not wall time. Screen-reader announces finals once settled.
- **Chapter 4 (Categories)** — pinned carousel of 7 cards. Pure GSAP + transform (no Swiper). Seven inline SVG line-art icons in `CategoryIcons.tsx`. Hover: card lifts 8px and a gold inset border fades in.
- **Chapter 5 (Courses)** — three tabs (AI / Data Science / Product), sliding gold underline, 4-column grid (2 on tablet, 1 on mobile). Cards built with CSS gradients + generated SVG pattern overlays (`CoursePattern.tsx`) — no stock imagery. Staggered exit/enter on tab switch.
- **Chapter 6 (How It Works)** — 180vh sticky container, 100vh viewport, left-column step titles with scale+opacity change on the active one, right-column illustration swap. Step 3's certificate stamp lands with `back.out(3)` for the satisfying thud.
- **Chapter 7 (Plans)** — three pricing cards, paper background. Entry fade-up, then scroll-linked scrub: outer cards translate outward and drop to 0.7 opacity, middle card scales to 1.03. Reverses on scroll-up.
- **Chapter 8 (Graduation)** — reuses `PortalScene` in `mode="graduation"`. Scroll progress drives `morph` in zustand; the particle shader lerps between resting icosahedron and the morph target via the `uMorph` uniform. Two CTAs at the bottom.
- **Footer** — 3-column layout (logo + tagline + email, link columns, newsletter form). Gold focus ring on the email input. Bottom strip with copyright, "Made in Dubai", and a WebGL toggle that sets/clears `?nowebgl` and reloads.
- **TopNav stub** wired to Lenis.

### Changed
- `ChapterStub.tsx` retained but no longer rendered — kept so Pass-2 scaffolding remains available if anyone wants to iterate on a chapter in isolation.

## Pass 1 — Scaffold + Chapters 1 & 2

### Added
- Next.js 15 App Router + React 19 + TypeScript strict.
- Tailwind v4 CSS-tokens design system (`--ink`, `--paper`, `--gold`, `--electric`, `--mist`, `--fog`).
- Fonts: Inter (body) + Instrument Serif (display, italic).
- **Lenis smooth scroll** wired to GSAP's ticker and ScrollTrigger proxy (`lib/scroll.ts`).
- **Zustand scroll store** (`providers/ScrollStore.ts`) — single source of truth for chapter, theme, portalProgress, morph.
- **BackgroundCanvas** (`ui/BackgroundCanvas.tsx`) — fixed-position cross-fade layer that flips ink↔paper based on active chapter.
- **GrainOverlay** — SVG noise at 3% opacity.
- **Chapter 1 (The Gate)** — full WebGL hero: 8000-particle icosahedral cloud, custom GLSL shaders, bloom + chromatic aberration post-processing, camera dolly driven 0→1 by scroll through first 100vh, mouse parallax. Feature-detects and falls back to a static SVG on low-end devices.
- **Chapter 2 (Manifesto)** — word-by-word reveal scrubbed to scroll. Bold words get gold underlines that draw from left.
- **ScrollDebug** — `?debug=1` overlay showing chapter, theme, progress.

### Infrastructure
- Dynamic import for the WebGL scene (`ssr: false`) keeps First Load JS at 159 kB gzip in Pass 1.
