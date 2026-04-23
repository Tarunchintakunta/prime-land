# Prime Learning — Pass 2: Finish the Chapters

You already scaffolded the project and built Chapters 1 & 2. Now build out Chapters 3–8 to the same quality bar. Reference `01_MASTER_PRD.md` for the full spec — this prompt is the shortlist of what to do now and the specific details that matter per chapter.

## General rules for this pass

- Stay in the component architecture already established.
- Every chapter uses **GSAP ScrollTrigger**, driven by the same Lenis instance. Do not introduce a second scroll library.
- Color flips between dark (`--ink`) and paper (`--paper`) should happen via a **fixed-position background layer** that cross-fades, not by setting bg on each section — otherwise the transitions will feel chunky. Use a single `<BackgroundCanvas>` at layout level that reads the active chapter from the Zustand store.
- Before moving to the next chapter, verify the previous one releases its pins cleanly on both scroll-down and scroll-up. This is the #1 cause of janky sites that "look cool but feel broken."

## Chapter 3 — Stats

Horizontal scroll within a pinned container. Three stat blocks slide in from the right as scroll progresses 0→1 through the pinned zone. Each stat counts up using GSAP (not CSS) so you can tie it to scroll progress, not time.

- Stat 1: "Learners" → animate from 0 to whatever placeholder (e.g., 12400)
- Stat 2: "Courses" → 0 to 85
- Stat 3: "Avg completion" → 0 to 87, suffix "%"

Background is `--paper`. Use `--ink` text. A thin `--gold` divider between stats.

## Chapter 4 — Categories Carousel

Pin the section for 160vh of scroll. Inside, a horizontal strip of 7 cards translates left as scroll progresses. Card width: 28vw. Gap: 4vw.

Do NOT use Swiper or any carousel library — this is pure GSAP + transform. Simpler, smaller bundle, exactly the control we need.

Each card has a generated SVG illustration — draw these yourself inline, 6 simple line-art icons using `<path>` with `stroke-dasharray` animation on hover.

On hover: card lifts 8px, `--gold` border fades in (1px, inset).

## Chapter 5 — Courses Grid

Three category tabs at top: "AI", "Data Science", "Product". Active tab has a gold underline that slides between tabs using FLIP technique (GSAP's Flip plugin — register it).

Below, a 4-column grid on desktop, 2 on tablet, 1 on mobile. Cards animate in with stagger on tab switch (exit: y:-20, opacity:0; enter: y:20→0, opacity:0→1, stagger 0.06).

Card thumbnails: CSS linear-gradient backgrounds with an SVG pattern overlay. Four distinct gradient presets per category so they don't all look the same.

## Chapter 6 — How It Works

Sticky vertical timeline. The container is 180vh tall. Inside, a 100vh sticky viewport with:
- Left column (40%): three step titles stacked, the active one scales up + goes full opacity, inactives are 0.4 opacity
- Right column (60%): the illustration area, one illustration at a time, swapped as scroll crosses each step's threshold

Illustrations:
- Step 1 (Browse): a grid of cards that shuffles
- Step 2 (Enroll): a progress bar that fills
- Step 3 (Certificate): an SVG certificate that assembles piece by piece, then a gold stamp rotates in and thuds down (GSAP `back.out(3)` easing on the stamp — critical for the satisfaction)

## Chapter 7 — Plans

Paper bg. Three pricing cards. Middle card (Enterprise) is the "recommended" one.

As the user scrolls into the section, all three cards fade up simultaneously. As they scroll past the midpoint, the left and right cards translate outward by 20px and drop to 0.7 opacity, while the center card scales to 1.03. This is scroll-linked, not a one-shot animation — scrolling back reverses it.

## Chapter 8 — Graduation

Mount the Chapter 1 `PortalScene` again, but this time with a different prop: `mode="graduation"`. In graduation mode, the particle icosahedron **morphs** — particles reposition to spell "BEGIN" in 3D space.

Implementation: pre-compute target positions for each particle by sampling points along the outlines of the letters (use a font atlas or just hand-define path data for 5 letters). Store both source and target positions in the shader as attributes, lerp between them with a uniform `uMorph` driven by scroll progress.

Below the canvas: two CTA buttons — "Explore Courses" (primary gold) and "Talk to Sales" (ghost).

## Footer

Three-column layout. Left: logo + tagline + email. Middle: link columns (Academy, Resources, Legal). Right: a small newsletter signup form (input + button, just visual — wire to nothing for now, but the input must have proper focus states with `--gold` outline).

Bottom strip: copyright, "Made in Dubai", and a tiny WebGL/no-WebGL toggle for users who want to disable the canvas.

## Acceptance

- All 8 chapters polished, no placeholder text remaining
- Scroll from top to bottom feels like ONE continuous experience, not 8 separate pages stitched together
- Color cross-fade background works
- All pins release cleanly on scroll-up
- Reduced-motion still kills everything cleanly
- Bundle size hasn't ballooned — check with `next build` and report the First Load JS per route
- No hydration errors in console

Give me a summary of what you built, what you'd polish next if you had another day, and flag any chapter that compromised on the PRD (it's fine if you did, just tell me where).
