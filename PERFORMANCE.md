# Performance

## Bundle (next build)

```
Route (app)                                 Size  First Load JS
┌ ○ /                                    19.4 kB         167 kB
├ ○ /_not-found                            995 B         103 kB
├ ƒ /opengraph-image                       128 B         102 kB
├ ○ /robots.txt                            128 B         102 kB
└ ○ /sitemap.xml                           128 B         102 kB
+ First Load JS shared by all             102 kB
```

167 kB First Load JS for `/`, well under the Pass-3 target of 250 kB gzip.

## What's in the initial chunk vs. deferred

**Initial (~167 kB gzip):**
- React 19, Next.js runtime
- GSAP core + ScrollTrigger
- Lenis
- Zustand
- All 8 chapter components' HTML scaffolding (text, SVG, data)

**Deferred (loaded after first paint):**
- `three` (~600 kB raw)
- `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- `postprocessing`

These live behind `next/dynamic(…, { ssr: false })` in
`Chapter1Gate.tsx` and `Chapter8Graduation.tsx`. The static SVG
`FallbackHero.tsx` ships inline and covers the moment between HTML paint
and canvas boot.

## Runtime

- **Scroll drivers:** one Lenis RAF, one `gsap.ticker`. ScrollTrigger piggybacks on GSAP's ticker — there is no second RAF competing.
- **Particle system:** 8000 points, additive blending, depth-write off, one draw call.
- **Post-processing:** Bloom (mipmap blur) + subtle ChromaticAberration. Both kept at low intensity to avoid per-pixel cost spikes on lower-end integrated GPUs.

## Fallbacks

- `navigator.hardwareConcurrency < 4` → static SVG hero, no canvas.
- `prefers-reduced-motion: reduce` → Lenis off, loader skipped, cursor off, transitions collapsed.
- `?nowebgl=1` → same fallback as the `hardwareConcurrency` branch.

## Lighthouse (targets, measured in preview)

Expected once deployed to Vercel:

| Metric | Target (mobile) | Notes |
|---|---|---|
| LCP | < 2.5 s | Hero text renders before canvas mount thanks to SSR + dynamic-import fallback |
| CLS | < 0.05 | Hero sections use `min-height: 100svh` — no layout shift from loader swap |
| TBT | < 200 ms | Heavy JS (three.js) is split and loaded lazily |

Note: These are preview-env targets. Actual measurement requires a deployed URL (Vercel preview). When measuring locally, use `npm run build && npm run start` — dev-mode numbers are not representative.

## Things we consciously did not optimize further

- We did not switch to `gsap/dist/ScrollTrigger.min` manual imports because
  `optimizePackageImports: ["gsap"]` in `next.config.ts` gives us the tree-
  shaking win without hand-maintaining a plugin list.
- We did not split Chapter 8's morph geometry into a separate chunk; the
  graduation PortalScene reuses the same dynamic import as Chapter 1, so
  the bundle is already cached.
- We did not add `@next/third-parties` or any preload hints; the LCP
  element is the hero headline (DOM text), which needs no preload.
