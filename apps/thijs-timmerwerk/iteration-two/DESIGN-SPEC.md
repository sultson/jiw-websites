# Stuctopper.nl — Design Spec

Reverse-engineered from the saved homepage. Source: `inspiration/stuctopper/stuctopper.html` + `stuctopper_files/`. Built on WordPress + Elementor Pro, "Spaciaz" theme. Values below are pulled verbatim from `post-41.css`, `widget-rating.min.css`, `main.css`, `brands.css`, and the JS handlers.

## 1. Color palette

Elementor global kit (`post-41.css`):

| Token | Hex | Role |
|---|---|---|
| `--e-global-color-primary` | `#F76300` | **Dominant accent** — orange. CTAs, big display headings, icon chips |
| `--e-global-color-accent` | `#000000` | Pure black — secondary headings, dark surfaces |
| `--e-global-color-text` | `#2B2B2B` | Body text (near-black, not pure) |
| `--e-global-color-background` | `#FFFFFF` | Page background |
| `--e-global-color-border` | `#F2F2F2` | Hairlines / card borders |

Supporting values found in `post-41.css`: `#F7F7F7` and `#F6F3EC` (warm off-white section panels), `#E2E2E2` (dividers), `#A8A8A8` (muted/caption text), `#FB8F4C` (lighter orange — hover/gradient stop), `#FFD200`/`#FFC000`/`#fec42d` (gold — star rating fill). `widget-rating.min.css` default star colors: empty `#ccd6df`, marked `#f0ad4e`; this site overrides marked to gold `#FFC000`.

Accent is unambiguous: **bright safety-orange `#F76300` on white**, black for contrast. No gradients of consequence (`box-shadow:0px 0px 0px 0px rgba(0,0,0,0.5)` = effectively off; the site avoids drop shadows).

## 2. Typography

Two custom families, no Google Fonts on the page.

- **Display:** `kreadon` family — used as `"kreadon"`, `"kreadon Bold"` (weight 700), `"Kreadon Light"` (weight 500). Geometric, tight, modern sans. All headings and buttons.
- **Body:** `"Rethink Sans"` — weight 400/700 for paragraphs, eyebrows, lists.

Both loaded as theme webfonts (Spaciaz). Substitute: Kreadon → a tight geometric sans (e.g. *Clash Display* / *General Sans* / *Hanken Grotesk* bold); Rethink Sans is free on Google Fonts — use it directly.

Heading scale (from `.elementor-heading-title` rules, `post-41.css`):

| Level | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|
| Hero display | 70px (also 95/105px variants for oversized) | 700 kreadon Bold | 1.06em | **-2px** (tight) |
| H2 section | 45–56px | 700 | ~1.1 | +1px |
| H3 | 32–42px | 700 | 1.1 | 0 |
| Card title | 20–26px | 700 | 1.2em | 0, word-spacing 1px |
| Eyebrow / kicker | 16px | 700 Rethink Sans | 1.2em | 0, word-spacing 1px |
| Body | 16px (base), 18–20px lead | 400 | ~1.6 | 0 |
| Small / caption | 14–15px | 400 | — | — |

**Signature treatment:** headlines are **period-terminated** — "Stijlvol Strak Stucwerk.", "Onze werkzaamheden.", "Strak. Stijlvol. Stuctopper." The full stop is part of the brand voice. Uppercase is *not* used for eyebrows; they are sentence-case 16px bold.

## 3. Layout system

- **Max content width:** `--container-max-width: 1290px` desktop (`post-10.css`), `1024px` at the tablet breakpoint, `767px` mobile.
- **Breakpoints:** 1366px, 1024px, 767px (`post-41.css` media queries).
- **Section rhythm:** generous. Big sections use `--padding-top: 80px / 60px / 50px`; tighter bands use 35px; most containers are 0-padded and rely on child spacing. Treat **80px vertical** as the default section pad, 50px for compact bands.
- **Grids:** Elementor `e-con` grid — `repeat(3,1fr)` for service/work grids, `repeat(2,1fr)` for split content, collapsing to `repeat(1,1fr)` on mobile. Gutters ~20–30px.
- **Inner padding stops:** `40px 40px 50px 40px`, `30px`, `20px` — cards breathe with 30–40px internal padding.

## 4. Section-by-section teardown

1. **Top bar / header** — phone number + "Offerte aanvragen" CTA. Sticky nav (sticky-kit.js loaded). White background, black logo, orange button.
2. **Hero** — "Stijlvol Strak Stucwerk." 70px orange display headline on white, with white-text overlay variants over imagery. Sub: "Wij doen stuc & schilder projecten door heel Nederland." Avatar stack + 4.8 rating as trust proof inline. Large rounded image(s), `border-radius:20px`. CTA "Offerte aanvragen".
3. **USP / icon-list strip** — "10% korting op nieuwbouw", "5 jaar garantie op stucwerk", "Duidelijke prijsafspraak…", "Vrijblijvend adviesgesprek aan huis…". Orange icon chips in a row.
4. **Onze werkzaamheden** (services) — "Onze werkzaamheden." H2. 3-column card grid (Stucwerk, Latex spuiten, etc.). Rounded image cards `border-radius:10px`, title + short text. Flip-box widget available (`custom-pro-widget-flip-box`).
5. **Trust / rating block** — "De beste stukadoor's in Nederland!*" with a large **4.8** number, gold star row (`#FFC000`), Google-style review widget.
6. **About / brand** — "Stuctopper is jouw topper." Split 2-column: image + copy. `spaciaz-border-shape` decorative corner shapes injected (see Motion).
7. **Work gallery / projects** — Swiper carousels (`aria-label="1 / 6"` etc.), multiple sliders of project photos. Large rounded images.
8. **Reviews carousel** — testimonial cards in a swiper, avatar + name + stars.
9. **Tips & tricks / blog teaser** — "Tips & trics van Stuctopper" — posts grid (`posts-grid.min.js`).
10. **FAQ** — "Veelgestelde vragen" accordion.
11. **CTA band** — "Strak. Stijlvol. Stuctopper." closing call, orange button.
12. **Footer** — dark/black surface, link columns, social icons, legal links (Algemene voorwaarden, Cookievoorkeuren). Floating WhatsApp click-to-chat bubble (`main.css` `.ht-ctc-chat`, bounce-in animation).

## 5. Components

- **Buttons** — pill-ish, `border-radius: 5px` (small) on primary; fill `#F76300`, 1px solid same-color border, kreadon font, 14–15px, weight 500, padding ~`12px 25px`. A secondary "ghost" button uses white fill. Buttons carry an **icon sub-element** with its own orange background that animates on hover (`.elementor-button:hover .elementor-button-content-wrapper:before` slides an orange fill in).
- **Cards** — `border-radius: 10px` (image/service cards) or `20px` (feature panels); flat — no shadow. Border `1px #F2F2F2` where present. Internal padding 30–40px.
- **Pills/large panels** — `border-radius: 20px–30px`; `300px` radius used for full-pill shapes; `50%` for circular avatar/icon tokens.
- **Rating widget** — row of star icons, 16px (`--e-rating-icon-font-size`), empty `#ccd6df`, filled gold; partial fill via clipped overlay `width: var(--e-rating-icon-marked-width)`. Paired with a big numeric "4.8".
- **Avatar stack** — overlapping circular customer avatars (`avatar-1.jpg`, `avatar-3.jpg`), `border-radius:50%`, white ring, beside the rating.
- **Icon chips** — orange-filled rounded squares/circles holding line icons for USPs.
- **Decorative corner shapes** — `.spaciaz-border-shape` in `top-left/top-right/bottom-right/bottom-left` corners (injected by `background-shape.js`).

## 6. Motion & micro-interaction

- **`button-mousemove.min.js`** — magnetic buttons. On `.movingButton`, `mousemove` translates the element toward the cursor: `translate3d(dx,dy,0)` where `dx/dy` are cursor-offset-from-center **clamped to ±20px**; resets to 0 on `mouseleave`. Reproduce in React: track pointer in a `mousemove` handler, set `transform` with the clamped delta, ease back with a `transition` on leave.
- **`animate-circle.min.js`** — canvas progress ring. Draws a background circle then an arc from `0` to `2π·percentage/100`; `onScroll` mode maps `window.pageYOffset / scrollHeight` to the arc, redrawing each `requestAnimationFrame`. Used as a scroll-progress / stat indicator. Reproduce with an SVG circle and `stroke-dashoffset` tied to scroll.
- **`background-shape.js`** — appends decorative `.spaciaz-border-shape` divs into section corners (configurable per corner). Pure CSS-positioned ornaments.
- **Scroll reveals** — Elementor entrance animations (fade/slide-up on scroll) on widgets.
- **WhatsApp bubble** — `ctcBounce` keyframe: scale 0 → 1.3 → 1 over .45s ease-out; greetings box uses `cubic-bezier(.19,1,.22,1)` scale+translate.
- **jarallax** loaded — subtle parallax on hero/section background images.

## 7. Signature moves (what makes it feel premium)

1. **One loud color, used fearlessly** — bright orange `#F76300` on pure white, with black. No timid grays-on-grays. The orange owns the brand.
2. **Period-terminated display headlines** in a tight (-2px tracking) geometric bold sans — "Strak. Stijlvol. Stuctopper." reads like a slogan, not a header.
3. **Magnetic buttons** — the ±20px cursor-following transform makes CTAs feel responsive and crafted.
4. **Flat, shadow-free, large-radius cards** (10–20px) — the design earns depth from photography and color blocking, not drop shadows. Clean and confident.
5. **Inline trust stack** — overlapping avatars + gold stars + a big "4.8" sitting right next to the hero CTA, so social proof is the first thing seen.

## 8. Mobile behavior

- Container drops to 767px max; sections keep ~40–50px vertical pad.
- Hero: headline scales down from 70px (kreadon stays bold/tight), image stacks below text, CTA full-ish width.
- Nav collapses to a hamburger (`nav-mobile.min.js`); off-canvas menu.
- All `repeat(3,1fr)` / `repeat(2,1fr)` grids collapse to `repeat(1,1fr)` — single-column stacked cards.
- WhatsApp bubble can go full-width sheet at ≤420px (`main.css` `ctc_m_full_width`).
- Magnetic-button effect should be disabled on touch (no hover).

## 9. STEAL vs ADAPT vs SKIP — for Thijs Timmerwerk (carpentry/renovation)

**STEAL directly:**
- The whole color discipline: one bold accent on white + black. Swap orange for a **warm wood/amber or deep timber tone** (carpentry-appropriate) but keep the single-loud-color principle.
- Period-terminated headlines in a tight bold geometric display sans (Rethink Sans for body is free — keep it).
- Flat shadow-free cards, 10–20px radius, 30–40px internal padding.
- Inline avatar-stack + star + numeric rating beside the hero CTA.
- Magnetic CTA button (±20px clamp) — cheap, high-impact, easy in React.
- Service grid: 3-up rounded image cards collapsing to 1-up.
- USP icon strip with accent-filled icon chips.
- 1290px max width, 80px section rhythm.

**ADAPT:**
- Hero: carpentry is photo-led — use a strong project photo (kozijnen, trap, dakkapel) with the rounded-image treatment; keep the slogan headline.
- Work gallery swiper → use for before/after or finished projects.
- Decorative corner shapes — keep subtle or drop; they suit a plaster brand more than carpentry.

**SKIP:**
- Elementor/WordPress stack entirely — rebuild in the repo's Vite + React 19 + Tailwind v4.
- WhatsApp click-to-chat plugin chrome — if a chat bubble is wanted, build a lightweight one.
- The canvas `animate-circle` scroll ring — gimmicky; only add if there's a real stat to show.
- Per-corner `spaciaz-border-shape` ornaments unless they earn their place.
- Gold star color `#FFC000` is fine, but don't introduce a second accent beyond it.
