# FootCare+ — Theme notes for component agents

Quiet, confident, medical, Frisian. Cream + teal + a single warm clay note.
Avoid beauty-salon sugar/blush vibes.

## Palette tokens (`@theme` in `src/index.css`)

| Token | Hex | Use |
|---|---|---|
| `--color-cream` | `#FBF8F2` | page background |
| `--color-sand` | `#F1E9DC` | card / panel surface |
| `--color-sand-soft` | `#F7F1E5` | softer alt panel |
| `--color-ink` | `#1F2A2E` | body text, primary button |
| `--color-ink-soft` | `#3D4E54` | body text hover, secondary text |
| `--color-teal` | `#1F635B` | primary medical accent, kicker, links |
| `--color-teal-soft` | `#2F857A` | teal hover |
| `--color-sage` | `#A8BFB4` | quiet supporting accent (borders, dots) |
| `--color-sage-soft` | `#C7D6CD` | softer sage |
| `--color-clay` | `#B5694A` | warm CTA accent — use sparingly |
| `--color-clay-soft` | `#C9876A` | clay hover |
| `--color-wa` | `#25D366` | WhatsApp green |

Aliases for back-compat with smooth-by-lau-style class names:
`--color-espresso` -> ink, `--color-gold` -> teal, `--color-blush` -> sand.
Tailwind utilities like `bg-espresso`, `text-gold`, `bg-blush` therefore still
render in the new palette without you changing component markup.

## Fonts

- Sans: **Inter** (300/400/500/600)
- Serif: **Fraunces** (300/400/500/600, italic 300/400) — applied to h1-h5
  via base layer, slightly grounded, opsz variable. Use `font-serif` to
  opt in elsewhere.

## Utility classes (component-facing API)

Class names kept compatible with smooth-by-lau components — just repainted:

- `.btn-primary` — ink fill, cream text. Use for the dominant on-page CTA.
- `.btn-gold` — **repainted to teal** (kept name for component back-compat).
- `.btn-teal` — semantic alias for `.btn-gold` if you prefer.
- `.btn-clay` — warm clay fill. Reserve for the single "afspraak maken" hero
  or sticky CTA so it carries weight; do not sprinkle.
- `.btn-outline` — ink border, transparent fill.
- `.btn-ghost` — text-only, padded hit area.
- `.btn-wa` — WhatsApp green fill. Pair with `MessageCircle` / WhatsApp icon.
- `.btn-call` — outlined teal, fills on hover. Pair with `Phone` icon.
- `.kicker` — uppercase 11px teal eyebrow above section titles.
- `.card` — white/75 + backdrop-blur, ink/5 border, subtle shadow.
- `.field` — form input, focuses to teal border.
- `.rule` — inline label with side ticks (used in Hero/section dividers).
- `.safe-bottom` — `padding-bottom: max(1rem, env(safe-area-inset-bottom))`.
- `.no-scrollbar` — hides scrollbars on horizontal scrollers.
- `.hp-field` — visually hidden honeypot input.

## Marquee (MediaMarquee component)

- `.marquee-viewport` — wrap, `overflow: hidden`.
- `.marquee-track` — inner flex track, animates `marquee-ltr` 60s linear.
- Hover pauses. Reduced-motion fully disables.
- Inside the track, duplicate the children once so the `-50% -> 0` loop
  reads as continuous (same pattern as mha-installaties).

## Accessibility / motion

- All buttons are >= 44px tall (call CTAs hit `min-height: 44px`).
- `*:focus-visible` -> 2px teal outline.
- `@media (prefers-reduced-motion: reduce)` disables marquee + transitions.

## i18n

NL-only. `useLang()` returns `{ lang: 'nl', setLang: () => {}, t }`. Any
existing LangToggle component will render but its clicks are no-ops — fine
to leave, or hide it. There is no `'en'` branch in translations.
