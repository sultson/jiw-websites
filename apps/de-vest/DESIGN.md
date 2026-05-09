# De Vest Schilderwerken — Design system

Heritage-editorial × atelier. Warm tinted neutrals, charcoal type, the brand orange used sparingly and precisely. Type-led on Historie, photo-led on Werk and Behang. The aim: a 95-year-old craftsman's monograph, not a contractor brochure.

## Colour strategy

**Restrained.** Tinted near-white surface, deep charcoal type, one bright orange accent kept under 8% of any view. The orange (`#fd7f2c`, taken directly from the logo verfroller graphic) is brighter than a typical "ochre" accent, so the discipline must be tighter: CTAs, the painted-square corner motif, link underlines, single accent strokes, the small generational mark `№ III`. Never as a body or background field.

| Token | Hex | Role |
|---|---|---|
| `--color-paper`        | `#F8F5EE` | Body surface, warm-tinted near-white |
| `--color-paper-soft`   | `#FCFAF4` | Cards, insets, light surfaces |
| `--color-paper-deep`   | `#EDE8DC` | Section dividers (Werkwijze, Faq), Historie spread ground |
| `--color-stone`        | `#D6D0C2` | Image placeholder bg, decorative rules |
| `--color-stone-soft`   | `#E6E1D5` | Pill bg, soft chips, sample swatches |
| `--color-ink`          | `#181B20` | Primary type, footer ground, logo wordmark match |
| `--color-ink-soft`     | `#2C3037` | Secondary type, body |
| `--color-ink-mute`     | `#525762` | Tertiary type, captions |
| `--color-orange`       | `#fd7f2c` | Brand accent (8% rule). Locked to logo |
| `--color-orange-deep`  | `#D9651A` | Hover state, secondary CTA fill |
| `--color-orange-soft`  | `#FBE0CB` | Light accent surface for highlights, behang label |

Never use pure `#000` or `#fff`. All neutrals tint warm (chroma ≈ 0.005–0.01 toward orange hue 50). No gradient text. No glassmorphism. No drop shadows on photo tiles.

## Typography

- **Display:** **Fraunces** (Google Fonts), weights 600 / 700, optical-size axis enabled. Tight tracking on H1 (-0.025 to -0.035 em). Sentence case for product copy. Use the soft-axis `SOFT 50` setting on display headings for warmer terminals; tighter `SOFT 0` on body display where present.
- **Body:** **Inter**, weights 400 / 500 / 600. Body line length capped at 65–72ch. Line height 1.55–1.65 for body, 1.05–1.15 for display.
- **Mono:** `ui-monospace` for sheet numbers (`№ III`, `01 / 18` lightbox counter, footer legal-line, year markers in Historie that aren't the hero year).
- **Scale (mobile → tablet → desktop):**
  - Display (Hero year, Historie hero years): 64 → 96 → 128px
  - H1: 40 → 56 → 80px
  - H2: 28 → 34 → 44px
  - H3: 20 → 22 → 26px
  - Body: 16 → 18px
  - Eyebrow / kicker: 11px uppercase, 0.28em tracking, ink-mute (NOT orange — the orange is reserved)
- **Hierarchy ratio:** ≥1.4× between adjacent steps.

## Layout

- Outer container max width 1240px, side padding 16 / 24 / 32px.
- Section vertical rhythm: 80 → 96 → 112 → 128px. Vary by 16–24px section to section. Never identical.
- 12-column grid on `lg`. Asymmetric splits for Hero (7+5), Historie spread (5+7 alternating per generation), Werkwijze (6 steps as 3×2 with mono numerals leading).
- Werk grid: 2 / 3 col, asymmetric portrait-bias, gaps 8 / 12px. Lightbox required.
- Behang band: edge-to-edge, 3-up close-up tiles at lg, scrolls horizontally on mobile (snap, no momentum trick, no peek-arrows).

## Components

- **LogoMark.** The supplied SVG, componentized. On first paint of the page, a one-pass "inking" reveal: the verfroller graphic strokes in (300ms), the wordmark fades up (200ms, staggered 80ms after). Static thereafter. No loop. `prefers-reduced-motion: reduce` → static logo, no motion at all.
- **Vakkaart proof panel** (Hero right column). Bordered sheet with sheet-header bar reading `№ III · DE VEST` in mono, vertical stack of icon + label + sub-line rows: `Sinds 1930`, `Drie generaties`, `VCA gecertificeerd`, `Eindhoven · Kempen`. Two corner squares (orange top-left, ink bottom-right) signal a craftsman's drawing sheet. Borrowed from kok's design language but with heritage labels.
- **Service card (Vakgebieden).** Paper-soft surface, 1px ink/15 border, mono index number top-left, headline (Fraunces 600), sub, bulleted list with orange check, ghost-style "Meer over [vak]" link with arrow that translates 4px on hover. Five cards, varied content lengths so they're never identical.
- **Werkwijze step.** Number is the hero (96px Fraunces 700 in orange-deep), title small caps eyebrow, body small. Six steps in 3×2 grid with 1px ink/10 dividers. Step 6 (Onderhoud, the yearly check) gets a small calendar icon to flag its distinctness.
- **Historie spread.** Vertical timeline. Three "generations" each get a full row: huge year display (128px Fraunces 700), name (H2), 2–3 sentence body (max 68ch), one optional archival image right-aligned. Vertical 1px ink/15 rule connects them. Generation mark `№ I / № II / № III` in mono floats top-right of each row.
- **Behang band.** Three vliesbehang close-up tiles at full bleed. Captions are mono, single-line, italicless: `Vliesbehang · Particulier · Eindhoven`. No card chrome, no shadows. Just photos and one orange hairline rule above the band.
- **Materialen strip.** Five wordmarks in a single horizontal row (Sigma, Sikkens, Trimetal, Caparol, Veveo). Set in Inter 500, ink-mute, no logos. Hairline rule top and bottom. Reads as a credentials line, not a partner zoo.
- **FAQ row.** Plus icon rotates 45° on open. Number index left-aligned in mono. Body content reveal via `grid-template-rows: 0fr → 1fr` transition.
- **Lightbox.** Ink/95 backdrop, image max 88vh, mono `n / total` counter at bottom, ESC + arrow keys + click-out to close.
- **CTA buttons.**
  - `btn-orange`: filled `#fd7f2c` on ink text. Min-height 48px. Uppercase 0.04em tracking. Hover → orange-deep, 250ms ease-out.
  - `btn-outline`: 1px ink, paper bg, ink text. Same dimensions.
  - `btn-ghost`: text-only with arrow, used in service cards.
- **StickyCta (mobile).** Bottom-fixed bar, paper-soft surface, 1px ink/10 top border, two equal buttons: "Bel 06 53 86 00 31" (btn-outline with phone icon) + "Vraag offerte aan" (btn-orange). Hides when intake modal is open.
- **IntakeModal.** Centered modal on desktop, full-sheet on mobile. Multi-step: (1) service category, (2) postcode + adres, (3) photos (up to 5), (4) name + tel + mail + bericht. Submit posts to `/api/intake` (Worker route → R2 + Cloudflare Email). Same UX vocabulary as RN-Schilders' IntakeModal but rebranded to De Vest tokens.

## Motion

- Page-load: `rise-in` keyframe (translateY 12px → 0, opacity 0 → 1), 600ms `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo). Stagger 80ms across hero elements.
- LogoMark inking: one-pass on first paint only. Stroke-dashoffset draw on the verfroller path (300ms ease-out-quart) → wordmark fade-up (200ms).
- Hover: 200–300ms colour transitions. Image scale 1.04× on hover, 700ms ease-out. No bounce.
- Accordion (Faq): 300ms `grid-template-rows` + opacity. Plus icon 300ms rotate.
- Reduced motion: all of the above collapse to 0.001ms; image scales held at 1; logo renders static.

## Don'ts

- No card grids of identically-sized boxes with icon-heading-text.
- No side-stripe coloured borders. No `border-left: 4px solid orange`.
- No gradient text. No `background-clip: text` tricks.
- No drop shadows on photo tiles. Bordered or borderless flat tiles only.
- No exclamation marks in copy. No "Bel ons nu!" CTAs.
- No em dashes (—) or `--` in copy. Use periods, commas, colons, parentheses.
- No "trots", no "passie", no "uw droomhuis". Concrete craft language only.
- No sepia, no parchment, no fake stamps, no vintage badges. Heritage is communicated through type and restraint.
- No looping LogoMark animation. One pass on first paint, then static.
- No orange backgrounds at section scale. The 8% rule is a hard ceiling.
