# Doelio — Design System

Apple "Liquid Glass" (WWDC 2025 / iOS 26), faithfully. Dark, luminous aurora backdrop so the glass actually refracts and its specular edges read. Glass-on-white is banned: the material needs something vivid behind it.

## Theme
Dark. Scene: a Dutch owner scrolling on an iPhone at night, deciding if this agency is technically current. Dark + aurora reads as cutting-edge and shows the material off; specular highlights and refraction are far stronger on dark.

## Color (OKLCH, never #000/#fff, neutrals tinted toward indigo)
- `--base`   oklch(0.15 0.025 270)  — deepest background
- `--surface` oklch(0.19 0.03 275)  — raised background
- `--ink`    oklch(0.97 0.006 265)  — primary text
- `--ink-dim` oklch(0.76 0.02 265)  — secondary text
- `--ink-faint` oklch(0.60 0.02 265) — labels, meta
- Aurora (backdrop only, behind glass):
  - `--azure`  oklch(0.74 0.15 240)
  - `--indigo` oklch(0.58 0.20 282)
  - `--violet` oklch(0.66 0.21 300)
  - `--cyan`   oklch(0.82 0.12 200)
- Accent (CTA / focus): `--accent` oklch(0.72 0.16 255), gradient toward `--violet`.

Strategy: Committed. The aurora carries the brand; glass + white type stay restrained on top.

## Typography
Authentic Apple stack, mirroring apple.com (no webfont — fastest on mobile, true SF Pro on Apple devices):
`-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif`

Single family, contrast via weight + scale (Apple's own approach).
- Display: clamp(2.6rem, 6.5vw, 5rem), weight 600, tracking -0.03em, leading 1.02
- H2: clamp(2rem, 4vw, 3.1rem), weight 600, tracking -0.025em
- H3: clamp(1.2rem, 2vw, 1.55rem), weight 600, tracking -0.015em
- Body-lg: clamp(1.05rem, 1.2vw, 1.25rem), weight 400, leading 1.55
- Body: 1.0625rem, weight 400, leading 1.6
- Label: 0.78rem, weight 590, uppercase, tracking 0.18em, ink-faint

Light type on dark: line-heights nudged up.

## Spacing & layout
- 8px grid. Section padding clamp(5rem, 11vw, 9rem).
- Content max-width 1120px; hero text max ~18ch–34ch for punch.
- Asymmetric. Capabilities are a **bento** of differently-sized glass tiles, not a 4-up grid.
- Floating glass nav (rounded pill, hovers over content).

## Glass component anatomy (the material)
Baseline (works everywhere, 60fps mobile Safari):
1. `backdrop-filter: blur(14–18px) saturate(180%) brightness(1.05)` (+ `-webkit-`), capped ≤12px blur on mobile.
2. Faint tint `color-mix(in oklab, white 8–12%, transparent)`.
3. Layered shadow stack: contact + key + ambient + inset top specular bevel + inset bottom shade + soft inner glow.
4. Specular rim: `::after` masked gradient border, light from top-left (~135deg), dark bottom-right.
5. Scrim layer behind text where copy is dense, for AA contrast.
6. Squircle: `border-radius` + `corner-shape: squircle` (progressive).

Enhancement (Chromium desktop, pointer-fine only, gated by JS class `.refract` on <html>):
- SVG `feDisplacementMap` edge refraction + 3-pass chromatic aberration via `backdrop-filter: url(#liquid-glass)`. Never on mobile (Safari ignores it anyway; cost too high).

Variants: `glass` (cards/tiles), `glass-bar` (nav, stronger blur), `glass-pill` (buttons/chips).

## Motion
- ease-out-expo `cubic-bezier(0.16, 1, 0.3, 1)`. No bounce/elastic.
- One orchestrated page-load: staggered fade+rise reveals (IntersectionObserver), 60–90ms stagger.
- Aurora drifts slowly (transform/opacity only). Specular pointer-tracking on glass (desktop, perf-light).
- Everything off under `prefers-reduced-motion`. Opaque surfaces under `prefers-reduced-transparency`.

## Accessibility
- Text targets WCAG AA on glass (scrim guarantees it).
- Touch targets ≥44px. Focus-visible accent ring. `lang` reflects toggle.

## Bans honored
No gradient text, no side-stripe borders, no hero-metric block, no identical card grid, no em dashes. Glass is purposeful here (it's the brand), which is the sanctioned exception to the glassmorphism ban.
