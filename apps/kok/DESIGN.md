# Kok Vastgoedonderhoud — Design system

Modern editorial design language. Bold typography, generous whitespace, one accent. Photo-led where photos exist, type-led elsewhere. The aim: a contractor's site that reads like an architect's portfolio, not a trade landing page.

## Colour strategy

**Restrained.** Tinted neutral surface, charcoal type, one ochre accent used at <10% area. The ochre carries the brand mark (links, focus rings, CTA button, the small painted-square accent corner on the Vakkaart card).

| Token | Hex | OKLCH | Role |
|---|---|---|---|
| `--color-paper`        | `#F8F6F1` | warm-tinted near-white | Body surface |
| `--color-paper-soft`   | `#FCFAF6` | even lighter           | Card / inset surface |
| `--color-paper-deep`   | `#EFEBE2` | one step toward stone  | Section dividers (Services, FAQ) |
| `--color-stone`        | `#D8D3CB` |                        | Image bg, decorative |
| `--color-stone-soft`   | `#E8E4DD` |                        | Pill bg, soft chips |
| `--color-ink`          | `#1A1D22` | deep charcoal          | Primary type, footer ground |
| `--color-ink-soft`     | `#2D3138` |                        | Secondary type |
| `--color-ink-mute`     | `#4A4F58` |                        | Tertiary type |
| `--color-ochre`        | `#C5934A` | warm primer mustard    | Accent (10% rule) |
| `--color-ochre-deep`   | `#A8783A` |                        | Hover, secondary CTA fill |
| `--color-ochre-soft`   | `#E0BC7E` |                        | Light accent surfaces |

Never use pure `#000` or `#fff`. Every neutral is tinted toward warm ochre (chroma ≈ 0.005–0.008). No gradient text. No glassmorphism.

## Typography

- **Display:** Manrope, weights 700 / 800. Tight tracking (-0.025 to -0.04 em on H1). Title-case for product copy, never all-caps body.
- **Body:** Inter, weights 400 / 500 / 600. Body line length capped at 65–75ch. Line height 1.55–1.65 for body, 1.05–1.1 for display.
- **Mono:** ui-monospace for sheet numbers (`№ 01`, `01 / 18` lightbox counter, footer legal-line).
- **Scale (mobile → desktop):**
  - H1: 44 → 64 → 88px
  - H2: 30 → 36 → 48px
  - H3: 20 → 22 → 28px
  - Body: 16 → 18px
  - Kicker / eyebrow: 11px uppercase, 0.28em tracking, ochre-deep
- **Hierarchy ratio:** 1.4–1.6× between adjacent steps.

## Layout

- Outer container max width 1240px, side padding 16 / 24 / 32px.
- Section vertical rhythm: 80 → 112 → 128px (`py-20 sm:py-28`). Avoid identical padding section-to-section; vary by 16–24px to break monotony.
- 12-column grid on `lg`, asymmetric splits (7+5, 8+4) for hero / section heads.
- Showcase grid: 2 / 3 / 4 col, asymmetric portrait-bias tiles, gaps 8 / 12px.

## Components

- **Vakkaart proof panel** (Hero right column): bordered sheet with sheet header bar, vertical stack of icon + label + sub rows. Two corner squares (ochre top-left, ink bottom-right) signal an architectural drawing sheet.
- **Service card:** paper border, mono index number, headline, sub, bulleted list with ochre check, ghost-style "Vraag offerte aan" link with arrow that translates on hover.
- **Werkwijze step:** number is the hero (64px ochre-deep display), title small, body small. Steps sit in a 4-up grid with 1px ink/10 dividers.
- **FAQ row:** plus icon rotates 45° on open. Number index left-aligned in mono. Body content reveal via `grid-rows` transition.
- **Lightbox:** ink/95 backdrop, image max 88vh, mono `n / total` counter at the bottom.
- **CTA button shapes:** `btn-ochre` (filled ochre on ink text), `btn-outline` (1px ink), `btn-primary` (ink-on-paper for footer / dark contexts). All min-height 48px. Uppercase, 0.04em tracking.

## Motion

- Page-load: `rise-in` keyframe (translateY 12px → 0, opacity 0 → 1), 600ms ease-out, staggered 80ms.
- Hover: 200–300ms colour transitions. Image scale 1.05× on hover, 700ms ease-out.
- Accordion: 300ms `grid-template-rows: 0fr → 1fr` + opacity. Plus icon 300ms rotate.
- Respect `prefers-reduced-motion: reduce` (all animations collapsed to 0.001ms).

## Don'ts

- No card grids of identically-sized boxes with icon-heading-text. Service cards use mixed bullet content; pillars use number + icon corner; nothing is a clone.
- No side-stripe coloured borders.
- No gradient text. No `text-fill: transparent` tricks.
- No drop shadows on photo tiles. Use bordered or borderless flat tiles only.
- No exclamation marks in copy. No "Bel ons nu!" CTAs.
- No em dashes (—) or `--`. Use periods, commas, hyphens, parentheses.
