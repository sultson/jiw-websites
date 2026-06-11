# BUILD BRIEF — Nails by Jenny (Etten-Leur)

Nail salon site for **Nails by Jenny**, Jagershof 25, 4871 KG Etten-Leur, tel **+31 6 27034206**.
Design template: clone the look and architecture of `apps/smooth-by-lau` as closely as possible, with the deltas in section 5. Add the horizontal marquee from `apps/mha-installaties` (section 4).

Source-of-truth files referenced throughout (all paths repo-relative):

- `apps/smooth-by-lau/src/index.css` — the entire design system
- `apps/smooth-by-lau/src/App.tsx` — page composition
- `apps/smooth-by-lau/src/components/*` — section components
- `apps/smooth-by-lau/src/data/{services,reviews,hours}.ts` — data shapes
- `apps/mha-installaties/src/components/Werkzaamheden.tsx` + marquee CSS in `apps/mha-installaties/src/index.css`
- Client facts: `apps/nails-by-jenny/INFO.md`, prices in `apps/nails-by-jenny/prijslist.png`, scraped media in `apps/nails-by-jenny/{gmaps,facebook}/`

---

## 1. Design system (smooth-by-lau)

### 1.1 Fonts

Google Fonts via CSS `@import` at the top of `index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');
```

- **Serif (display):** Cormorant Garamond — weights 300/400/500/600 + italic 300/400. All `h1–h5` are serif at **weight 400** (explicitly set, not bold). Italic serif is used for quotes, owner signature, and review bodies.
- **Sans (body/UI):** Inter — weights 300/400/500/600. Buttons and labels are `font-medium` (500), never bolder than 600.

```css
@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Cormorant Garamond", Georgia, serif;
}
```

Headings get `letter-spacing: -0.01em`. Hero `h1` is `text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl`; section `h2` is `text-4xl md:text-5xl leading-[1.1]`.

For Jenny: keep the same Cormorant Garamond + Inter pairing. It is the identity of this template.

### 1.2 Color tokens (Tailwind v4 `@theme`)

```css
@theme {
  /* Warm raw-sugar white */
  --color-cream: #FAF7F2;
  --color-blush: #F0E6D9;
  --color-blush-soft: #F6EEE6;

  /* Warm dark, like tree bark */
  --color-espresso: #2C1A10;
  --color-espresso-soft: #4A2E1E;

  /* Honey amber, the signature color */
  --color-gold: #B87135;
  --color-gold-soft: #CF9B6A;
}
```

Usage grammar (keep this, even if hue values shift for Jenny's brand):

- `cream` = page background; `html` itself gets the **dark** color (`background-color: var(--color-espresso)`) so overscroll never flashes white.
- `blush` / `blush-soft` = soft tinted surfaces: icon circles, tag pills, image placeholders, alternating section backgrounds (`bg-blush-soft/50`).
- `espresso` = all text and the dark footer/dark feature section. Text opacity scale instead of grays: `text-espresso/75` body, `/60–/65` secondary, `/50` meta-labels, `/40` placeholders.
- `gold` = accent only: kickers, icons, prices, primary CTA. `gold-soft` is the on-dark variant of gold.
- `::selection { background: var(--color-gold); color: white; }` and gold `focus-visible` outlines.

For Nails by Jenny derive an analogous palette from her branding/photos (check `gmaps/` + `facebook/` media and the logo before choosing) but **keep the same token names and roles** (`cream/blush/espresso/gold`) so every pasted class works unchanged. If her brand is pink-leaning, shift blush/gold toward rose/champagne; do not introduce extra tokens.

### 1.3 Spacing rhythm

- Every section: `py-20 md:py-28` (no exceptions).
- Container: `max-w-6xl mx-auto px-5 sm:px-8` for content sections; `max-w-7xl` for Nav/Hero/Footer; `max-w-5xl` for Services; `max-w-3xl` for FAQ.
- Section header to content: header block has `mb-10`/`mb-12`; kicker → `h2` is `mt-3`; `h2` → sub/body is `mt-3`–`mt-6`.
- Two-column feature sections: `grid md:grid-cols-2 gap-10 md:gap-16 items-center` (some use `gap-12 md:gap-20`).
- Alternate backgrounds per section to create rhythm: cream → `bg-blush-soft/50` → cream → dark (`bg-[#3A2418] text-cream`) → cream …

### 1.4 Radius, shadows, cards

- Radius scale: `rounded-full` (buttons/pills/icon circles), `rounded-2xl` (cards, images, modals), `rounded-xl` (small images, form fields). Nothing square.
- Shadows are large, soft, **espresso-tinted**, used only on images and floating elements:

```
shadow-[0_20px_60px_-30px_rgba(44,26,16,0.35)]   /* portrait images */
shadow-[0_30px_80px_-30px_rgba(58,36,24,0.45)]   /* hero-adjacent imagery */
shadow-[0_10px_40px_-20px_rgba(44,26,16,0.25)]   /* UspStrip white panel */
shadow-[0_10px_30px_-8px_rgba(184,113,53,0.5)]   /* gold sticky CTA glow */
```

- The `.card` component class:

```css
.card {
  @apply bg-white/70 backdrop-blur-sm rounded-2xl border border-espresso/5 shadow-[0_1px_2px_rgba(44,26,16,0.04)];
}
```

- Borders are near-invisible: `border-espresso/5` to `/15` max.

### 1.5 Buttons (component classes in `@layer components`)

```css
.btn-primary { @apply inline-flex items-center justify-center gap-2 bg-espresso text-cream px-6 py-3 rounded-full text-sm font-medium tracking-wide hover:bg-espresso-soft; min-height: 44px; }
.btn-gold    { @apply inline-flex items-center justify-center gap-2 bg-gold text-cream px-6 py-3 rounded-full text-sm font-medium tracking-wide hover:opacity-90; min-height: 44px; }
.btn-outline { @apply inline-flex items-center justify-center gap-2 border border-espresso/20 text-espresso px-6 py-3 rounded-full text-sm font-medium tracking-wide hover:border-espresso/40 hover:bg-white; min-height: 44px; }
.btn-ghost   { @apply inline-flex items-center justify-center gap-2 text-espresso px-4 py-2 rounded-full text-sm font-medium hover:bg-black/5; min-height: 40px; }
```

`btn-gold` is THE conversion button (hero, nav, section CTAs), always paired with a 16px lucide icon (`<ArrowRight size={16} />`). `btn-outline` for secondary actions (review prev/next, "view all on Google").

### 1.6 Section header pattern (eyebrow / title / sub)

The `.kicker` class:

```css
.kicker { @apply inline-block text-[11px] uppercase tracking-[0.22em] text-gold font-medium; }
```

Centered variant (Services, Gallery, FAQ, Visit):

```tsx
<div className="text-center mb-12">
  <span className="kicker">{t('services.kicker')}</span>
  <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('services.title')}</h2>
  <p className="mt-4 text-espresso/60 text-sm max-w-lg mx-auto">{t('services.sub')}</p>
</div>
```

Left-aligned variant (About, two-column sections):

```tsx
<span className="kicker">{t('about.kicker')}</span>
<h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.1]">{t('about.title')}</h2>
<p className="mt-6 text-espresso/75 leading-relaxed max-w-prose">{t('about.body')}</p>
```

On-dark sections inline the kicker with `text-gold-soft` instead of the class.

### 1.7 Images

- Containers: `rounded-2xl overflow-hidden` + tinted-shadow + `bg-blush` placeholder behind the img.
- Aspect ratios: portraits `aspect-[4/5]`; feature imagery `aspect-[5/4] md:aspect-[3/4]`; gallery tiles `aspect-square`; marquee cards (new) `aspect-[4/3]`.
- Always `className="w-full h-full object-cover"`, `loading="lazy"` (+ `decoding="async"` on heavy ones); hero image alone gets `fetchPriority="high"` and NO lazy.
- Hover on gallery tiles is a tint, not a zoom:

```tsx
<div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/10 transition-colors" />
```

- Decorative depth: offset overlap cards (`absolute -bottom-8 -left-8 … ring-4 ring-cream`) and blurred gold orbs:

```tsx
<div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
```

- The "rule" ornament (hairline dashes flanking gold text) exists as `.rule` in index.css; the About signature uses an inline version (`h-px flex-1 bg-espresso/15 max-w-16` either side of italic serif text).

### 1.8 Animation / reveal patterns — IMPORTANT

**smooth-by-lau has NO scroll-reveal animations.** No IntersectionObserver reveals, no keyframes, no fade-ins on scroll. Motion is limited to:

- CSS `transition-colors` / `transition-transform` on hover and state (chevron `rotate-180`, FAQ plus `rotate-45`, nav background swap on scroll).
- `scroll-behavior` default (anchor links jump via `#id` on `<section>`s).
- JS scroll listeners only for **state**, not animation: Nav `scrolled` flag (`window.scrollY > 20`) and StickyBookCta show/hide.

Do not add a reveal system "because templates have them" — matching the template means calm, static sections. The only continuous animation on the new site will be the marquee (section 4), which already ships a `prefers-reduced-motion` kill-switch in mha's CSS.

Misc base CSS to copy verbatim: `.safe-bottom { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }` and `.no-scrollbar` (hides review scroller scrollbar).

---

## 2. Page architecture (App.tsx order)

```tsx
export default function App() {
  const { lang, setLang, t } = useLang();
  const [bookingOpen, setBookingOpen] = useState(false);   // ← replaced for Jenny, see §5

  return (
    <div className="min-h-[100dvh] flex flex-col bg-cream">
      <Nav lang={lang} setLang={setLang} t={t} onBook={openBooking} />
      <main className="flex-1">
        <Hero t={t} onBook={openBooking} />
        <UspStrip t={t} />
        <About t={t} />
        <PromiseSection t={t} />
        <SugarWax t={t} onBook={openBooking} />   {/* dark specialty section */}
        <Brows t={t} onBook={openBooking} />      {/* second specialty */}
        <Services lang={lang} t={t} />
        <Gallery t={t} />
        <Reviews lang={lang} t={t} />
        <Visit lang={lang} t={t} />
        <Faq t={t} onBook={openBooking} />
      </main>
      <Footer t={t} />
      <StickyBookCta t={t} onBook={openBooking} hidden={bookingOpen} />
      <BookingModal open={bookingOpen} onClose={closeBooking} t={t} />
    </div>
  );
}
```

Every component takes `t: (k: string) => string`; the ones that read bilingual data objects also take `lang`. There is no router, no context: `t`, `lang`, and `onBook` are passed as plain props from App. Keep that.

### Nav (`components/Nav.tsx`)

Sticky translucent header: `sticky top-0 z-50`, swaps `bg-cream/60 backdrop-blur-sm` → `bg-cream/90 backdrop-blur-md border-b border-espresso/5` once `window.scrollY > 20` (passive scroll listener in `useEffect`). Left: serif wordmark with gold accent word (`Smooth by <span className="text-gold">Lau</span>`). Center (`hidden lg:flex`): 6 anchor links from a `links` array of `{ href: '#id', key: 'nav.x' }`. Right: compact `LangToggle`, `btn-gold` book button (`hidden md:inline-flex`), and hamburger (`lg:hidden`, lucide `Menu`/`X`).

**Mobile menu approach:** not a drawer — a simple conditional block rendered `absolute top-full left-0 w-full bg-cream border-b shadow-xl` below the bar, full-width list of serif links (`block py-3 text-lg font-serif … border-b border-espresso/5 last:border-0`), each `onClick={() => setOpen(false)}`, then a full-width `btn-gold` CTA. Because it's positioned off the sticky nav itself there are no portal/backdrop-filter clipping issues.

### Hero (`components/Hero.tsx`)

Full-bleed photo background: absolute `inset-0 bg-espresso` wrapper containing `<img src="/hero.webp" className="w-full h-full object-cover opacity-55" fetchPriority="high" />` plus a gradient scrim `bg-gradient-to-b from-espresso/15 via-espresso/50 to-espresso/88` (dark at bottom so the UspStrip overlap reads). Content: `relative max-w-7xl … pt-20 pb-28 md:pt-32 md:pb-44 lg:pt-40 lg:pb-52`, `max-w-2xl` text column with tracking-wide gold kicker (city name), `whitespace-pre-line` serif h1 (title contains `\n`), sub paragraph in `text-cream/90`, one `btn-gold` CTA, and a bottom row of uppercase micro-credentials separated by `<span className="h-px w-6 bg-cream/30" />`. All text carries `drop-shadow-[…]` utilities for legibility.

### UspStrip (`components/UspStrip.tsx`)

A white panel that overlaps the hero: section is `relative -mt-12 md:-mt-16 z-10`; inside, `grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 bg-white rounded-2xl p-3 md:p-4 shadow-[0_10px_40px_-20px_rgba(44,26,16,0.25)] border border-espresso/5`. Each cell: 40px `rounded-full bg-blush` circle with gold lucide icon + title (`text-sm font-medium`) + sub (`text-xs text-espresso/60`). The hero's bottom padding exists to make room for this overlap — change one and you must change the other.

### About

Two-column `md:grid-cols-2 items-center`. Text col: kicker/h2/body + pill tags (`px-3 py-1 rounded-full text-xs bg-blush border border-espresso/8`) + italic serif owner signature flanked by hairlines. Image col: `aspect-[4/5] rounded-2xl` portrait with a smaller offset photo `absolute -bottom-8 -left-8 w-40 h-48 … ring-4 ring-cream` (desktop only). `order-2 md:order-1` flips so the image is first on mobile.

### Promise / SugarWax / Brows (feature sections)

- **Promise:** `bg-blush-soft/50`, asymmetric grid `md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]`; image with floating quote card; 4 pillar cards (`bg-white rounded-2xl p-5 border border-espresso/5`, icon circle + serif title + small body) driven by an array of `{ i, Icon }` and keys `promise.p${i}.t/.b`.
- **SugarWax:** the dark statement section — `bg-[#3A2418] text-cream`, gold-soft kicker, benefits list with tiny `bg-gold/20 border-gold/30` leaf chips, image with gold blur orbs, then a 2-column comparison table (`rounded-2xl border border-cream/10 bg-espresso-soft/40`, rows from a `[1..10]` index array, `Check` gold vs `X` muted). For Jenny: same skeleton repurposed (e.g. gel vs acryl/BIAB explainer, or "waarom Nails by Jenny" benefits) — keep ONE dark section for rhythm.
- **Brows:** mirror-image two-column with a 3-item iconed treatment list (`brows.t${i}.t/.b` keys) + `btn-gold` CTA. Template for Jenny's second specialty (e.g. nail art / pedicure).

### Services (`components/Services.tsx` + `data/services.ts`)

Accordion of category cards (`.card overflow-hidden`, `space-y-3`), one open at a time: `const [open, setOpen] = useState<string | null>('wenkbrauwen')` (first category open by default). Header button = icon circle + serif `h3` + `ChevronDown` rotating 180°, `aria-expanded`. Open body = `<ul className="divide-y divide-espresso/5 border-t border-espresso/5">` rows: name (`text-sm md:text-base font-medium`), optional desc (`text-xs text-espresso/55`), optional duration (`{s.durationMin} {t('services.min')}`, hidden when 0), price right-aligned in `font-serif text-lg tabular-nums`.

Data shape — bilingual fields live **in the data**, not translations.ts:

```ts
export type Service = {
  id: string;
  nameNl: string; nameEn: string;
  price: number; durationMin: number;
  descNl?: string; descEn?: string;
};
export type ServiceCategory = {
  id: string;
  titleNl: string; titleEn: string;
  icon: 'sparkles' | 'leaf' | 'flower';   // mapped to lucide via iconMap in the component
  services: Service[];
};
export function formatPrice(p: number): string {
  return '€ ' + p.toFixed(2).replace('.', ',');
}
```

Components pick the language with tiny helpers: `lang === 'en' ? s.nameEn : s.nameNl`. Jenny's categories/prices come from `prijslist.png` — transcribe exactly, omit nothing, set `durationMin: 0` where unknown.

### Gallery + Lightbox

Gallery holds two hardcoded `Img[]` arrays (`{ src, alt, cls }`, `cls` always `aspect-square`) and a pill-tab filter (`useState<Tab>('alle')`, tabs rendered in a `rounded-full border p-1` segmented control, active = `bg-espresso text-cream`). Grid: `grid-cols-2 md:grid-cols-3 gap-2 md:gap-3`; first tile spans 2 cols on mobile (`i === 0 … 'col-span-2 md:col-span-1'`). Click sets `idx` state → `<Lightbox images index onClose onNav />`.

Lightbox: renders `null` until `index !== null`; fixed `z-[100] bg-espresso/95` overlay; `useEffect` binds Escape/ArrowLeft/ArrowRight and sets `document.body.style.overflow = 'hidden'` (restored on cleanup); prev/next via `onNav(dir)` with wrap-around `(i + dir + images.length) % images.length`; image `max-h-[85vh] object-contain rounded-xl`; `stopPropagation` on the image and buttons, overlay click closes.

### Reviews (`components/Reviews.tsx` + `data/reviews.ts`)

```ts
export type Review = { id: number; name: string; rating: number; nl: string; en: string; source: 'Google' };
```

Rendered as a horizontal snap scroller: `ref` div with `no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5 sm:mx-0 sm:px-0` (negative margins = edge-bleed on mobile). Cards: `.card shrink-0 w-[85%] sm:w-[360px] p-6 md:p-7 snap-start flex flex-col` with gold `Star fill="currentColor"` row, italic serif quote (`flex-1`), and name/source footer. Desktop arrows (`btn-outline !px-3`) scroll by one card width via `el.scrollBy({ left: card.offsetWidth + 16, behavior: 'smooth' })` using a `[data-review-card]` query. Below: `btn-outline` link to the Google Maps reviews URL. For Jenny use the real Google reviews scraped into `gmaps/`; translate to EN yourself for the `en` field.

### Visit (`components/Visit.tsx` + `data/hours.ts`)

Two-column: info `.card` (address + directions link, phone + WhatsApp link, email, opening hours) and an embedded Google Map iframe (`rounded-2xl overflow-hidden border min-h-[360px]`, plain `maps.google.com/maps?q=…&output=embed` URL, `loading="lazy"`). Hours data:

```ts
export type DayHours = { dayIndex: number; nl: string; en: string; open: string | null; close: string | null };
export function formatHoursShort(d: DayHours): string {
  if (!d.open || !d.close) return '–';
  return `${d.open} – ${d.close}`;
}
```

`const today = new Date().getDay()` highlights the current row (`font-semibold` when `h.dayIndex === today`). Get Jenny's hours from the Google Maps listing data in `gmaps/`. Map query: `Jagershof+25,+4871+KG+Etten-Leur`; directions link uses `https://www.google.com/maps/dir/?api=1&destination=…`.

### Faq

`max-w-3xl`, `useState<number | null>(0)` (first item open), items `[1..5]` keyed `faq.q${i}`/`faq.a${i}`, border-bottom rows, `Plus` icon rotating 45° when open, `aria-expanded`. Item 2 is special-cased: a rich answer with inline tel/WhatsApp pill links (`rounded-full border border-espresso/20 … hover:bg-espresso hover:text-cream`). For Jenny that pattern becomes the primary "Hoe maak ik een afspraak?" answer (call + WhatsApp, no booking button).

### Footer

`bg-espresso text-cream/85`, 3-column grid: wordmark + tagline / contact (gold-soft icons) / socials + anchor quicklinks in `text-cream/40`. Bottom: rights bar, then the JIW credit block (`/jiw-logo.png` + "Gemaakt met liefde door jouwidealewebsite.nl" linking to jouwidealewebsite.nl) — copy this verbatim.

### StickyBookCta + BookingModal (replaced for Jenny — see §5)

For reference, the template behavior: StickyBookCta is mobile-only (`md:hidden`), fixed bottom full-width gold pill, shows after `window.scrollY > 400`, hides while the booking modal is open (`hidden` prop) and when the footer is on screen (IntersectionObserver on `document.querySelector('footer')` with `rootMargin: '0px 0px -20% 0px'`). Wrapper is `pointer-events-none` with `pointer-events-auto` on the button, and uses `.safe-bottom`. BookingModal is a `z-[100]` overlay around a Salonized iframe: full-screen on mobile, centered `md:w-[520px] md:h-[88vh]` card on desktop, Escape-to-close + body scroll lock in `useEffect`.

---

## 3. i18n pattern

`src/translations.ts`:

```ts
export type Lang = 'nl' | 'en';
type Dict = Record<string, string>;
export const translations: Record<Lang, Dict> = {
  nl: { 'nav.services': 'Behandelingen', 'hero.title': 'Naturally smooth,\nconfidently you.', /* … flat dot-keys … */ },
  en: { /* same keys */ },
};
```

`src/hooks/useLang.ts` — copy verbatim, change only the storage key:

```ts
import { useCallback, useEffect, useState } from 'react';
import { translations, type Lang } from '../translations';

const KEY = 'nails-by-jenny.lang';   // was 'smooth-by-lau.lang'

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'nl';
  const stored = window.localStorage.getItem(KEY);
  if (stored === 'nl' || stored === 'en') return stored;
  return 'nl';
}

export function useLang() {
  const [lang, setLangState] = useState<Lang>(initialLang);
  useEffect(() => {
    window.localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const t = useCallback(
    (key: string): string => translations[lang][key] ?? translations.nl[key] ?? key,
    [lang],
  );
  return { lang, setLang, t };
}
```

Consumption rules:

- UI strings: components receive `t` as a prop and call `t('section.key')`. Indexed content uses template keys: `t(\`promise.p${i}.t\`)`, `t(\`faq.q${i}\`)`.
- Structured data (services, reviews, hours): bilingual fields on the objects (`nameNl/nameEn`, `nl/en`) selected with `lang`, so those components take both `lang` and `t`.
- Fallback chain `en → nl → raw key` means missing EN keys degrade gracefully; still, keep dictionaries key-identical.
- `LangToggle` (`components/LangToggle.tsx`) is a `role="group"` pill with `aria-pressed`, `compact` prop variant used in Nav.

Copy rules from memory/INFO.md: **no em dashes anywhere in site copy, no filler phrases**, straight-forward NL; never repeat the same fact or the same photo twice on the page.

---

## 4. The mha-installaties marquee (adopt for Jenny)

### 4.1 CSS (from `apps/mha-installaties/src/index.css`) — copy as-is

```css
/* Edge-to-edge auto-scrolling carousel */
@keyframes marquee-ltr {
  from { transform: translate3d(-50%, 0, 0); }
  to { transform: translate3d(0, 0, 0); }
}
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-ltr 60s linear infinite;
}
.marquee-viewport:hover .marquee-track {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

(mha animates -50% → 0, i.e. cards drift left-to-right; flip `from`/`to` if right-to-left feels better. Keep the `prefers-reduced-motion` block — index.css of smooth-by-lau does not have one yet, so add it.)

### 4.2 How it loops

The component duplicates the items array once — `const loop = [...items, ...items]` — and the track is `width: max-content`, so the track is exactly **2× the content width**. Animating `translate3d` between `-50%` and `0` therefore moves it by exactly one copy-length; when the animation wraps, frame N and frame 0 are pixel-identical, producing a seamless infinite loop. Two invariants:

1. The track must contain **exactly two copies** of the same sequence (gap included — note `gap-5 pl-5` on the track: the leading `pl-5` stands in for the gap before the first card so both halves measure the same).
2. Cards must have deterministic widths (`w-[78vw] max-w-[340px] sm:w-[360px] shrink-0`), no responsive reflow mid-card.

The viewport (`.marquee-viewport` = plain `overflow: hidden` via the section's `overflow-hidden`) sits **outside** the page container so it bleeds edge-to-edge, while the heading above stays in the container. Hover pauses the animation.

### 4.3 Structural JSX (from `Werkzaamheden.tsx`, trimmed to what Jenny needs)

```tsx
export default function WorkMarquee({ t }: { t: (k: string) => string }) {
  const loop = [...items, ...items];

  return (
    <section id="werk" className="py-20 md:py-28 overflow-hidden bg-cream">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <span className="kicker">{t('marquee.kicker')}</span>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('marquee.title')}</h2>
      </div>

      <div className="marquee-viewport mt-12 w-full md:mt-16" aria-label={t('marquee.aria')}>
        <div className="marquee-track gap-5 pl-5">
          {loop.map((item, i) => (
            <Card key={`${item.src}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

mha's card (for reference — restyle to smooth-by-lau tokens: swap `border-line bg-ink-3` for `bg-blush border-espresso/5`, caption scrim `from-espresso/80`):

```tsx
const base = 'relative w-[78vw] max-w-[340px] shrink-0 overflow-hidden rounded-2xl border border-espresso/5 bg-blush sm:w-[360px]';

<figure className={base}>
  <div className="aspect-[4/3] w-full overflow-hidden">
    <img src={item.src} alt={item.label} width={360} height={270} loading="lazy"
         className="h-full w-full object-cover" />
  </div>
  <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent" />
  <figcaption className="absolute inset-x-3 bottom-3 text-sm font-medium text-cream">
    {item.label}
  </figcaption>
</figure>
```

(mha also has a video-card variant that opens a TikTok iframe lightbox with body-scroll-lock + Escape handling — `VideoLightbox` in Werkzaamheden.tsx — not needed if videos autoplay inline, but its scroll-lock pattern matches smooth-by-lau's Lightbox.)

### 4.4 Adapting to a mixed image/video strip with 1–2s boomerang videos

Item model:

```ts
type MarqueeItem =
  | { type: 'image'; src: string; label: string }
  | { type: 'video'; src: string; poster: string; label: string };
```

Video card — same `base` wrapper, video instead of img:

```tsx
<div className="aspect-[4/3] w-full overflow-hidden">
  <video
    src={item.src}
    poster={item.poster}
    autoPlay muted loop playsInline
    preload="metadata"
    aria-label={item.label}
    className="h-full w-full object-cover"
  />
</div>
```

- `muted` + `playsInline` are mandatory for mobile autoplay (iOS refuses otherwise). `loop` makes the 1–2s boomerang run forever.
- Make the boomerang files themselves with ffmpeg (forward + reversed concat, no audio, capped size):

```bash
ffmpeg -i clip.mp4 -filter_complex \
  "[0:v]trim=0:1.5,setpts=PTS-STARTPTS,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1" \
  -an -vf "scale=720:-2" -c:v libx264 -crf 26 -pix_fmt yuv420p -movflags +faststart boom.mp4
```

  Target ≤ 300–500 KB per clip; 3–4 video cards max among ~8–10 items, the rest photos. Source material: frames/clips from `gmaps/` + `facebook/` scrapes (rename files semantically before use, per INFO.md).
- Remember the duplication: every `<video>` exists **twice** in the DOM. 3–4 clips → 6–8 playing videos; that is fine at these sizes, but don't put 10 videos in the strip. Optional polish: an IntersectionObserver on the section to `play()`/`pause()` all videos when the marquee scrolls in/out of view.
- `prefers-reduced-motion` already freezes the track via the global media query; autoplaying videos keep playing, which is acceptable since they're ambient, or pause them in the same media query check if you want to be thorough.
- Place the marquee between Gallery and Reviews (or instead of part of the gallery) — it must not also repeat photos used in the static gallery grid (no duplicate media on the page).

---

## 5. Deltas for Nails by Jenny

### 5.1 Contact model: call first, WhatsApp second, NO online booking

- **Delete** `BookingModal.tsx` and the `bookingOpen` state in App. There is no Salonized/iframe/booking system.
- Every `onBook` prop and `btn-gold` "Boek afspraak" button becomes a **call CTA**: `<a href="tel:+31627034206" className="btn-gold"><Phone size={16} /> {t('cta.call')}</a>`. Secondary actions (where the template had two buttons or pill links) use WhatsApp: `https://wa.me/31627034206?text=…`.
- Prefilled WhatsApp message (URL-encode it once, reuse the constant):

```ts
export const PHONE_DISPLAY = '06 27034206';
export const PHONE_E164 = '+31627034206';
export const WA_URL =
  'https://wa.me/31627034206?text=' +
  encodeURIComponent('Hoi Jenny, ik wil graag een afspraak maken. Wanneer heb je plek?');
```

  Put these in `src/data/contact.ts` so the number lives in one place (it appears in Nav CTA, Hero, section CTAs, FAQ, Visit, Footer, JSON-LD).
- `StickyBookCta` → `StickyCallCta`: identical show/hide mechanics (scroll > 400, footer IntersectionObserver, `safe-bottom`, `md:hidden`), but the button is `<a href="tel:+31627034206">` with `<Phone size={18} />` and label `t('nav.call')` ("Bel Jenny" / "Call Jenny"). The `hidden` prop tied to the modal disappears.
- UspStrip 4th item: replace "Online boeken / Salonized" with e.g. "Afspraak via telefoon of WhatsApp / Snel geregeld" (icon `Phone` or `MessageCircle`).
- FAQ "Hoe maak ik een afspraak?" reuses the template's pill-links answer (tel + wa.me) minus the inline book-button sentence.

### 5.2 Floating WhatsApp bubble (desktop AND mobile)

New component `WhatsAppBubble.tsx`, rendered in App after `<StickyCallCta />`. Tasteful = template-toned, not WhatsApp-green-default-widget:

```tsx
import { useEffect, useState } from 'react';
import { WA_URL } from '../data/contact';

function WhatsAppGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5v-.5c0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3a3 3 0 0 0-1 2.2c0 1.3 1 2.6 1.1 2.8.1.2 1.9 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

export default function WhatsAppBubble({ t }: { t: (k: string) => string }) {
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const io = new IntersectionObserver(([e]) => setFooterVisible(e.isIntersecting));
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  if (footerVisible) return null;

  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('wa.aria')}
      className="group fixed right-4 md:right-6 z-40 flex items-center justify-center
                 w-13 h-13 md:w-14 md:h-14 rounded-full bg-[#25D366] text-white
                 shadow-[0_10px_30px_-8px_rgba(37,211,102,0.55)]
                 transition-transform hover:scale-105
                 bottom-20 md:bottom-6"
      style={{ bottom: undefined }}  /* bottom set via classes; see note below */
    >
      <WhatsAppGlyph className="w-6 h-6 md:w-7 md:h-7" />
      <span className="pointer-events-none absolute right-full mr-3 hidden md:block whitespace-nowrap
                       rounded-full bg-espresso text-cream text-xs font-medium px-3 py-1.5
                       opacity-0 translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0">
        {t('wa.tooltip')}
      </span>
    </a>
  );
}
```

Placement rules:

- **Fixed bottom-right**: `right-4 md:right-6`. On desktop `bottom-6` (no sticky bar exists there). On mobile the sticky call bar occupies the bottom edge (`md:hidden`, ~60px + safe area), so the bubble sits **above it**: `bottom-20` plus safe-area, e.g. `style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom))' }}` applied only below `md` (or a `max-md:` class with the calc via an arbitrary value: `max-md:bottom-[calc(5rem+env(safe-area-inset-bottom))] md:bottom-6`). Never let the two overlap.
- `z-40` — same layer as the sticky bar, below the Lightbox `z-[100]` and Nav `z-50` dropdown.
- Brand-green circle is the one deliberate off-palette element (recognizability beats palette purity for WhatsApp); the espresso tooltip pill ("App Jenny" / "Message Jenny") ties it back to the design system. Keep it an `<a>` (not a script widget), `min` 52px hit target, hide alongside the sticky bar when the footer is visible so the credit line stays clean.
- Visit section: phone first ("Bel mij" with tel link), WhatsApp link next to it (template already does exactly this pattern), email only if Jenny has one.

### 5.3 Content mapping

- Sections: keep Hero → UspStrip → About (Jenny) → Promise-style values → one **dark specialty section** (SugarWax slot: e.g. gelnagels/BIAB explainer or "waarom vaste handen winnen") → second feature (Brows slot: nail art or pedicure) → Services accordion from `prijslist.png` → Gallery (real work photos) → **Marquee** (§4) → Reviews (real Google reviews from `gmaps/`) → Visit (Jagershof 25 map, real hours) → FAQ → Footer.
- Wordmark: `Nails by <span className="text-gold">Jenny</span>`. Hero kicker: `Etten-Leur`.
- Socials: Facebook page `https://www.facebook.com/people/Nails-by-Jenny/61577923244099/` (Instagram only if found during research).
- Fresh copy throughout — do not transplant Smooth By Lau's voice or claims (no ROYX, no suikerontharing). No em dashes, no repeated facts, no duplicate media.

### 5.4 App scaffolding

Scaffold per CLAUDE.md: Vite React-TS template in `apps/nails-by-jenny`, `"name": "@jiw/nails-by-jenny"`, pick an unused dev port, `pnpm install` from root. Copy `scripts/optimize-images.ts` and the `optimize-images` package script from smooth-by-lau verbatim (`sharp` is already in the root `onlyBuiltDependencies`). Wrangler: Workers Static Assets `wrangler.jsonc` modeled on `apps/smooth-by-lau/wrangler.jsonc` (static site, no API routes), `ship`/`ship:dry-run` scripts, target subdomain `nails-by-jenny.jouwidealewebsite.nl`.

---

## 6. Build-time conventions checklist (from monorepo CLAUDE.md + template)

- [ ] **pnpm only**, no per-app lockfile, no per-app `.gitignore`.
- [ ] **Images → webp** via `pnpm --filter @jiw/nails-by-jenny optimize-images` (sharp; q82 normal / q70 `hero*`, max edge 2000px, logos stay PNG ≤512px, originals deleted after conversion). Run it on everything dropped into `public/` before referencing.
- [ ] **Cache-busting:** when *replacing* a `public/` asset in place, append `?v=YYYYMMDD` to **every** reference — component `src`/`srcSet`, `og:image`, preloads, schema.org image fields — so browsers and Cloudflare's edge refetch.
- [ ] **index.html head** (mirror smooth-by-lau's):
  - `<html lang="nl">`, `viewport-fit=cover`, `theme-color` = cream token value.
  - Title pattern: `Nails by Jenny — Etten-Leur | Nagelstudio` + meta description with city and key treatments.
  - OG tags: `og:type=website`, `og:title`, `og:description`, **plus `og:image`** (smooth-by-lau omitted it; lydiavanderbie has `public/og-preview.jpg` as precedent — ship a 1200×630 `og-preview.jpg`), `twitter:card=summary_large_image`.
  - **JSON-LD `@type: "NailSalon"`** (schema.org subtype of BeautySalon — use the specific one):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NailSalon",
  "name": "Nails by Jenny",
  "priceRange": "€€",
  "telephone": "+31627034206",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jagershof 25",
    "postalCode": "4871 KG",
    "addressLocality": "Etten-Leur",
    "addressCountry": "NL"
  },
  "openingHoursSpecification": [ /* fill from gmaps data, omit closed days */ ],
  "sameAs": ["https://www.facebook.com/people/Nails-by-Jenny/61577923244099/"]
}
</script>
```

- [ ] Hours in JSON-LD, `data/hours.ts`, and the Visit card must agree (single source: the gmaps scrape).
- [ ] Hero image: `fetchPriority="high"`, not lazy; everything else `loading="lazy"`.
- [ ] Deploy: `set -a && source .env && set +a` first, then `pnpm --filter @jiw/nails-by-jenny ship:dry-run` → `ship` (never `deploy`); account `aec64586d4d04a644f4f9b8225d7ca28`; export `CLOUDFLARE_ACCOUNT_ID` if membership lookup fails.
- [ ] Footer JIW credit block (`/jiw-logo.png` + link) included.
- [ ] Lint passes: `pnpm -r lint` (tsc --noEmit).
- [ ] No commits unless asked.
