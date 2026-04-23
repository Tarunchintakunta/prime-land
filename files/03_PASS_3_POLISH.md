# Prime Learning — Pass 3: Polish, Perf, and the "Feel"

The site is functionally complete. Now make it *feel* right. This is the pass that separates a tech demo from something that wins awards.

## The feel audit

Go through the full page yourself (run `npm run dev`, scroll top to bottom 3 times) and make notes. Then fix, in priority order:

1. **Any stutter or frame drop** — profile with Chrome DevTools Performance tab. If anything drops below 55fps during scroll, fix it. Common culprits: too many ScrollTriggers firing updates, heavy filter/box-shadow on animated elements, forgotten `will-change`, particle count too high.
2. **Easing.** Audit every GSAP call. Default `power2.out` everywhere is amateur. Use:
   - `expo.out` for entrances (feels "arrived")
   - `power4.inOut` for section transitions
   - `back.out(1.7)` for UI micro-interactions
   - `sine.inOut` for ambient loops
3. **Timing.** Nothing should animate for less than 0.4s or more than 1.2s except ambient loops. If you have an 0.3s entrance, extend it. If you have a 2s entrance, cut it.
4. **Text shadow on display type.** Add `text-shadow: 0 0 80px rgba(212,165,116,0.15)` to the hero headline. Subtle gold glow. Premium feel.

## Cursor

Build a custom cursor — **only on desktop with fine pointer**. It's a 8px `--gold` dot that scales to 40px and goes `mix-blend-mode: difference` when hovering interactive elements. Trails the real cursor with slight lerp (0.15). Disable on touch devices. This alone adds 20% to the "expensive site" feeling.

## Loading experience

Currently the first paint is probably OK but the hero canvas pops in. Build a proper loader:
- Dark overlay with Prime Learning logomark center
- Below logomark: a 1px `--gold` line that draws from 0 to 100% width tied to actual asset + WebGL init progress (use `useProgress` from drei for the canvas, combine with a simple asset loader for fonts)
- On complete: overlay fades out over 0.8s with `expo.out`, at the same time the hero content animates in (eyebrow → headline → subcopy → buttons, 0.08s stagger)

## Page transitions (even though it's one page)

Anchor links in the nav (Why / Categories / Courses / How It Works) should do a smooth Lenis scroll with easing, not a hard jump. Duration 1.4s, `expo.inOut`.

## SEO and metadata

- Proper `<title>` and `<meta description>` in `app/layout.tsx`
- OpenGraph image: generate a 1200×630 using `@vercel/og` with the Prime Learning logomark on the `--ink` background with the gold portal illustration
- `robots.txt` and `sitemap.xml` via Next's built-in handlers
- Schema.org markup: `EducationalOrganization` JSON-LD in layout

## Accessibility pass

- Every interactive element reachable by keyboard, visible focus ring (gold, 2px, offset 4px)
- Skip-to-content link at the very top (visually hidden until focused)
- All decorative illustrations get `aria-hidden="true"`
- Stats section numbers: when they count up, announce the final value to screen readers via `aria-live="polite"` once settled
- Canvas gets an `aria-label` describing what's there
- Color contrast: verify `--gold` on `--ink` passes AA for the sizes it's used at. If the 16px body copy doesn't pass, bump it to a lighter gold only for body text.

## Performance hard targets

Run `next build` and report:
- First Load JS per route (target: < 250KB gzip for `/`)
- LCP in Lighthouse mobile (target: < 2.5s)
- CLS (target: < 0.05)
- TBT (target: < 200ms)

If any miss, fix in this order:
1. Dynamic-import the WebGL canvas with `next/dynamic({ ssr: false })`
2. Split GSAP plugins — only import ScrollTrigger and Flip where used, not the full gsap/all bundle
3. Code-split Chapter 8's morph geometry (it's only needed at the bottom)
4. Preload only critical fonts, `font-display: swap` for the rest
5. Image optimize: everything served through `next/image` with proper `sizes`

## Debug features to keep

Leave the `?debug=1` overlay in but hidden by default. Also add:
- `?slow=1` — multiplies all GSAP durations by 3 so you can see animations clearly
- `?grid=1` — overlays a 12-column grid at layout for alignment checks
- `?nowebgl=1` — forces fallback mode even on capable devices

These are invaluable for the next iteration, don't strip them for "production clean."

## Final deliverables

- Working production build, deployable to Vercel as-is
- `README.md` covering: setup, scripts, the `?debug` flags, notable architectural decisions, and a "known issues / next up" section
- A `PERFORMANCE.md` with the Lighthouse scores and the before/after if you optimized
- A `CHANGELOG.md` with what changed in this pass

Summarize in chat: biggest wins, anything you'd still improve, and honest assessment of whether this feels like a top-tier premium site or if something's still holding it back.
