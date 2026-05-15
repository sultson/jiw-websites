# Kwast Exact analysis — patterns to replicate for tp-totaal

Source: `/Users/alfred/Projects/jiw-websites/apps/kwast-exact/`

## 1. Project structure

```
apps/kwast-exact/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ wrangler.jsonc
├─ scripts/optimize-images.ts
├─ public/             (favicon-64.png, apple-touch-icon.png, og.webp, logo-mark.png, *.webp imagery, robots.txt)
└─ src/
   ├─ main.tsx
   ├─ App.tsx
   ├─ index.css
   ├─ vite-env.d.ts
   ├─ content.ts             ← all copy + data (NL-only)
   ├─ contexts/
   │   └─ OfferteContext.tsx
   └─ components/
       ├─ Nav.tsx
       ├─ Hero.tsx
       ├─ About.tsx
       ├─ Services.tsx
       ├─ Gallery.tsx
       ├─ Reviews.tsx
       ├─ Footer.tsx         (contains <Contact /> inline + <footer>)
       ├─ OfferteFab.tsx
       ├─ OfferteModal.tsx
       └─ OfferteForm.tsx
```

Naming:
- Components are PascalCase single files (no per-component folders, no `index.ts` re-exports).
- Section IDs in DOM: `#top`, `#over`, `#diensten`, `#werk`, `#reviews`, `#contact`. Nav links reference these.
- `OfferteFab` + `OfferteModal` are siblings of `Footer` rendered at the App root.

## 2. package.json — deps, ports, scripts

```json
{
  "name": "@jiw/kwast-exact",
  "scripts": {
    "dev": "vite --port=3019 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit",
    "optimize-images": "tsx scripts/optimize-images.ts",
    "ship:dry-run": "pnpm build && wrangler deploy --dry-run --outdir=dist-worker",
    "ship": "pnpm build && wrangler deploy"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "lucide-react": "^0.546.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "vite": "^6.2.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "sharp": "^0.34.5",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
    "wrangler": "^4.0.0"
  }
}
```

Pick a fresh unused port for tp-totaal (kwast-exact uses `3019`).

## 3. vite.config.ts

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 3019, host: '0.0.0.0' },
});
```

## 4. tsconfig.json — verbatim (strict + bundler resolution)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "types": ["node"]
  },
  "include": ["src", "vite.config.ts", "scripts"]
}
```

## 5. index.html — SEO + meta pattern

```html
<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0f1a2e" />
    <title>Kwast Exact | Schilder Hellevoetsluis</title>
    <meta name="description" content="..." />
    <link rel="canonical" href="https://kwast-exact.jouwidealewebsite.nl/" />
    <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="nl_NL" />
    <meta property="og:site_name" content="Kwast Exact" />
    <meta property="og:title" content="Kwast Exact | Schilder Hellevoetsluis" />
    <meta property="og:description" content="..." />
    <meta property="og:url" content="https://kwast-exact.jouwidealewebsite.nl/" />
    <meta property="og:image" content="/og.webp" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "HomeAndConstructionBusiness",
        "name": "Kwast Exact",
        "image": "https://kwast-exact.jouwidealewebsite.nl/og.webp",
        "url": "https://kwast-exact.jouwidealewebsite.nl/",
        "priceRange": "€€",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Hellevoetsluis",
          "addressRegion": "Zuid-Holland",
          "addressCountry": "NL"
        },
        "areaServed": [
          { "@type": "City", "name": "Hellevoetsluis" },
          ...
        ],
        "openingHoursSpecification": [...]
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- `<html lang="nl">` — site is NL-only.
- `theme-color` matches `--color-ink` (#0f1a2e).
- OG image is `/og.webp` in `public/`.
- Schema.org type: `HomeAndConstructionBusiness` (correct for painting trade).

## 6. wrangler.jsonc

```jsonc
{
  "$schema": "../../node_modules/wrangler/config-schema.json",
  "name": "kwast-exact",
  "account_id": "aec64586d4d04a644f4f9b8225d7ca28",
  "compatibility_date": "2026-04-24",
  "observability": { "enabled": true },
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  },
  "routes": [
    { "pattern": "kwast-exact.jouwidealewebsite.nl", "custom_domain": true }
  ]
}
```

NOTE: kwast-exact's wrangler.jsonc is **static-assets only — no Worker/forms backend**. INFO.md for tp-totaal specifies "offerte specific setup -> see sqm's wrangler jsonc and worker config" — i.e. for the offerte backend, model after `apps/sqm/wrangler.jsonc`, not this one. The OfferteForm here just opens a `mailto:` (no API call).

## 7. src/main.tsx & App.tsx

```tsx
// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
);
```

```tsx
// App.tsx
export default function App() {
  return (
    <OfferteProvider>
      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Reviews />
      </main>
      <Footer />          {/* renders Contact + footer */}
      <OfferteFab />      {/* mobile-only sticky CTA */}
      <OfferteModal />    {/* portal-like fixed modal */}
    </OfferteProvider>
  );
}
```

No router, no Suspense, no lazy imports. Entire site is one route.

## 8. Theme & styling — src/index.css

Tailwind v4 with `@theme {}` design tokens (no `tailwind.config.js`). Fonts are loaded from Google Fonts via `@import url(...)` at the top of `index.css`.

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Fraunces", Georgia, serif;

  /* Brand: deep midnight blue + warm bone + saffron accent */
  --color-ink: #0f1a2e;
  --color-ink-soft: #1a2742;
  --color-bone: #f5f0e6;
  --color-bone-soft: #ece4d3;
  --color-paper: #ffffff;
  --color-saffron: #d68a1e;
  --color-saffron-deep: #b3711a;
  --color-clay: #b7472a;
  --color-stone: #4a4f5c;
  --color-line: #d8cfb9;
}
```

Token usage in JSX: tokens become Tailwind utilities automatically — `bg-ink`, `text-bone`, `border-line`, `text-saffron-deep`, `bg-saffron/15`, etc. The `font-display` and `font-sans` tokens map to `font-display`/`font-sans` utilities.

Custom component classes (defined in `@layer components`):
- `.container-page` — max-w-1240, centered, responsive padding.
- `.eyebrow` — small caps tracked label in `--color-saffron-deep`.
- `.btn`, `.btn-primary` (saffron), `.btn-dark` (ink), `.btn-ghost` (outlined ink). Pill-shaped (`border-radius: 999px`).
- `.hairline` — 1px line at `--color-line`.
- `.section` — `padding-block: 5rem` (mobile) / `7rem` (md+).

Base layer: `h1-h4` are auto-styled with `font-display`, `font-weight: 600`, tight letter-spacing. So most headings just need size classes (`text-4xl md:text-5xl`).

For tp-totaal: **swap the color palette** (Rotterdam paint co — likely different brand colors based on `colors-full/compact/mono` logos in `/Users/alfred/Projects/jiw-websites/apps/colors/`). Token *names* (`--color-ink`, `--color-saffron`, etc.) can stay or be renamed; if names are kept, the components work unchanged. Easier: keep the token names, just change the hex values. Or rename to brand-neutral tokens (`--color-primary`, `--color-accent`).

## 9. content.ts pattern — single source of truth, NL-only

This is the key file. **No translations, no `useLang`, no `t()` calls.** All strings live here and are imported directly.

```ts
// All Kwast Exact site copy + data. Dutch only.
export const business = {
  name: 'Kwast Exact',
  tagline: 'Schilder Hellevoetsluis',
  owner: 'Arnold',
  partner: 'Maria',
  founded: '2022',
  yearsExperience: 15,
  reviewsCount: 13,
  reviewsScore: '9,1',
  reviewsScoreNumeric: 9.1,
  address: { street, postalCode, city, province },
  phone: { display, href },
  mobile: { display, href, whatsapp },
  email: { display, href },
  kvk: '86180614',
  trustoo: 'https://trustoo.nl/...',
  hours: [{ day, time }, ...],
  serviceArea: ['Hellevoetsluis', ...],
  certificates: [...],
};

export const usps = [{ title, body }, ...];   // 4 items, paired with iconByIndex in About
export const services = [{ key, title, body }, ...];  // 8 items, paired with iconByKey in Services
export const reviews = [{ name, date, text }, ...];   // ~13
export const gallery = [{ src, alt, caption }, ...];  // 4 — positioned in 12-col grid via placement[]
export const ownerImage = '/owner-arnold.webp';

export const hero = {
  eyebrow, titleStart, titleEm, titleEnd, sub, ctaPrimary, ctaSecondary
};

export const sectionTitles = {
  about:    { eyebrow, title },
  services: { eyebrow, title },
  gallery:  { eyebrow, title },
  reviews:  { eyebrow, title },
  offerte:  { eyebrow, title },
  contact:  { eyebrow, title },
};
```

Components import what they need: `import { business, reviews, sectionTitles } from '../content';` — no prop drilling.

## 10. Component patterns

### Nav.tsx
- `sticky top-0 z-50` header. Background fades in from transparent to `bg-bone` once `window.scrollY > 8`.
- Wordmark = `/logo-mark.png` + two-line typographic logo ("Kwast" big in `font-display`, "Exact" small letter-spaced in `font-sans`).
- Desktop: nav links + phone link + saffron "Offerte" button.
- Mobile: hamburger opens a fullscreen `bg-bone` overlay with `font-display text-4xl` nav links and CTAs. Sets `document.body.style.overflow = 'hidden'` while open.
- "Offerte" buttons call `openOfferte()` from `useOfferte()` — no anchor jump.

### Hero.tsx — anatomy
```tsx
<section id="top" className="relative bg-bone overflow-hidden pt-28 md:pt-36 pb-16 md:pb-24 md:min-h-[88vh] flex items-center">
  {/* 2 absolutely-positioned saffron blurred blobs for depth */}
  <div className="container-page relative z-10">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
      {/* Text col: md:col-span-7 */}
      <div className="md:col-span-7">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-tight">
          {hero.titleStart}
          <em className="not-italic">
            <span className="italic text-saffron-deep">{hero.titleEm}</span>
          </em>
          {hero.titleEnd}
        </h1>
        <p>{hero.sub}</p>
        {/* CTAs: openOfferte button + tel: ghost button + visible phone number on sm+ */}
        {/* Reviews row: <Stars> + "9,1 | 13 reviews" */}
        {/* Chips list: BadgeCheck + label, 3 items */}
      </div>
      {/* Image col: md:col-span-5, portrait aspect-[3/4] */}
      <div className="md:col-span-5">
        <div className="relative">
          {/* Saffron color-block behind: absolute -bottom-5 -right-5 w-3/4 h-3/4 */}
          {/* Ink color-block top-left, md+ only */}
          <div className="relative rounded-2xl overflow-hidden shadow-...">
            <img loading="eager" decoding="async" className="aspect-[3/4]" />
          </div>
          {/* Floating reviews badge: absolute -bottom-6 -left-4 */}
        </div>
      </div>
    </div>
  </div>
</section>
```

Hero is the only image with `loading="eager"`. All others use `loading="lazy" decoding="async"`.

### About.tsx
- 2-col grid (text + portrait image with offset ink card overlay).
- 4-up USP grid below with `lucide-react` icons mapped by index (`Clock`, `Shield`, `Coffee`, `GraduationCap`).

### Services.tsx
- 4-col responsive grid (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`).
- Icons mapped by service `key` via `iconByKey: Record<string, LucideIcon>`.
- Hover effect: `hover:-translate-y-1`, border + shadow shift to saffron.

### Gallery.tsx
- Custom asymmetric 12-col grid via `placement[]` array (col-spans + aspect ratios per index).
- Click opens an inline lightbox (no separate component) — fixed `inset-0 bg-ink/90`, ESC closes, `body.overflow=hidden` while open.
- All gallery images `loading="lazy"`.

### Reviews.tsx
- Dark section (`bg-ink text-bone`). Masonry-style columns via Tailwind: `columns-1 md:columns-2 lg:columns-3` + `[&>*]:break-inside-avoid`.
- Each review card: `Quote` icon + text + saffron hairline + name + date.
- Trustoo link at the bottom in `.btn btn-primary`.

### Footer.tsx
- Exports `Footer` but **internally renders `<Contact />` + `<footer>`**. So `App.tsx` only mounts `<Footer />`, which produces both Contact and footer sections.
- Contact: 2-col grid. Left = address/phone/mobile/whatsapp/email/KVK list with saffron `MapPin`/`Phone`/etc icons. Right = hours table + service area chips + certificates.
- Embedded Google Maps iframe at bottom (`output=embed`).
- Footer (dark `bg-ink`): 3-col grid — logo+tagline / nav links / contact info. Copyright + "Site door jouwidealewebsite.nl" + Trustoo link.

### OfferteFab.tsx (sticky mobile CTA)
```tsx
export default function OfferteFab() {
  const { open, isOpen } = useOfferte();
  const [visible, setVisible] = useState(false);
  // Appears after scrolling 60% of first viewport height
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const show = visible && !isOpen;
  return (
    <button onClick={open}
      className={`md:hidden fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-saffron text-ink font-semibold pl-5 pr-6 py-3.5 shadow-[...] transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}>
      <Paintbrush size={18} />
      <span>Offerte</span>
    </button>
  );
}
```
- **Mobile-only** (`md:hidden`). Appears after 60vh scroll, hides while modal is open.
- INFO.md says for tp-totaal: take inspiration from **jp-schilderwerken** for floating bubbles (gratis prijsindicatie + whatsapp on mobile) and **rename CTA to "Gratis prijsindicatie" / "prijsindicatie"** instead of "Offerte".

### OfferteContext.tsx — lang/modal context
**There is no lang context.** The only context is `OfferteContext` (modal open/close state):
```tsx
export function OfferteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // ESC key closes modal
  useEffect(() => { /* keydown handler */ }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Open from #offerte hash (then clean URL)
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#offerte') {
        setIsOpen(true);
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  return <OfferteContext.Provider value={{ isOpen, open, close }}>{children}</OfferteContext.Provider>;
}

export function useOfferte(): OfferteContextValue {
  const ctx = useContext(OfferteContext);
  if (!ctx) throw new Error('useOfferte must be used within OfferteProvider');
  return ctx;
}
```

Consumed in: `Nav`, `Hero`, `OfferteFab`, `OfferteModal`, `Footer` (Contact CTA + footer offerte link).

### OfferteModal.tsx
- Full-screen overlay: `fixed inset-0 z-[100]`, opacity-transitioned.
- Dim layer = `<button>` with `bg-ink/60 backdrop-blur-sm` (clickable to close).
- Dialog: mobile = bottom sheet (`inset-x-0 bottom-0`, slides up), md+ = centered card (`md:inset-0 md:m-auto md:max-w-3xl md:rounded-2xl`).
- Sticky header with eyebrow + title + X close.
- 2-col body on md+: aside (intro + USP checklist) | form. Mobile = form only.
- Focuses first focusable element on open; restores previous focus on close.

### OfferteForm.tsx
- Fields: `naam` (req), `email` (req), `telefoon`, `adres`, multi-select services checkboxes (req, min 1), single-select start timing (radio), `bericht`.
- Honeypot field `company` hidden off-screen (`position: absolute; left: -9999px`).
- Submission = `mailto:` link with prefilled subject + body. **No API call.** Per INFO.md, tp-totaal should integrate with `@jiw/cloudflare-forms` (see `docs/cloudflare-forms.md`) modeled on `apps/sqm/`.
- Success state replaces form: green check + "Stuur nog een aanvraag" / "Sluiten".

## 11. Cache-busting / image conventions

- All site imagery is `.webp` (converted by `scripts/optimize-images.ts`).
- Max edge 1800px, quality 82, effort 6, smartSubsample. Removes the source JPG/PNG after conversion.
- Public assets referenced with absolute paths (`/owner-arnold.webp`) — no Vite imports.
- Per repo CLAUDE.md: when replacing a `public/` asset in place, append `?v=YYYYMMDD` to every reference (component `src`/`srcSet`, og:image, preload, schema.org).
- `loading="eager"` only on hero image, everything else `loading="lazy" decoding="async"`.

## 12. Build/ship

- `pnpm --filter @jiw/tp-totaal dev` (single app) or `pnpm dev` from root for all.
- `pnpm --filter @jiw/tp-totaal build` — Vite build to `dist/`.
- `pnpm --filter @jiw/tp-totaal lint` — `tsc --noEmit`.
- `pnpm --filter @jiw/tp-totaal optimize-images` — sharp pass over `public/`.
- `pnpm --filter @jiw/tp-totaal ship:dry-run` — `pnpm build && wrangler deploy --dry-run --outdir=dist-worker`.
- `pnpm --filter @jiw/tp-totaal ship` — `pnpm build && wrangler deploy`.
- Before any wrangler command from the repo root: `set -a && source .env && set +a` (loads `CLOUDFLARE_API_TOKEN`).

## 13. Quirks worth noting

- **No `useLang`** — kwast-exact diverges from `my-kim-nails`/`nail-it-rosmalen`. NL-only via direct `content.ts` imports. INFO.md for tp-totaal does not mention multilingual, so stay NL-only.
- **Footer.tsx contains the Contact section.** Easy to miss — only `<Footer />` is mounted in App.
- **Hero `<em>` wraps a `<span>` for the italic accent word** — keeps semantic emphasis but applies styling via the inner span (`className="italic text-saffron-deep"`).
- **Modal opens via `#offerte` hash** — useful for direct links / email signatures.
- **Honeypot** is the only spam protection in `OfferteForm` — when integrating cloudflare-forms, keep this too.
- **Mailto submission** is the kwast-exact pattern; replace with `@jiw/cloudflare-forms` POST for tp-totaal per INFO.md.
- **Reviews use masonry via CSS columns**, not flex/grid — handles variable-height review cards cleanly without JS.
- **Gallery placement is hand-tuned per index** (`placement[i]`) — only works for exactly the configured number of items. If tp-totaal has more photos, consider rn-schilders carousel approach (INFO.md hint).
- **Section IDs are Dutch** (`#diensten`, `#werk`) — keep this convention.
- **`HomeAndConstructionBusiness` schema.org type** is correct for painting trade — use the same for tp-totaal.
- **Theme color `#0f1a2e`** matches `--color-ink`. Update in both `index.html` `<meta name="theme-color">` and the token.
- **Owner first-name signature** at end of About (`<p className="mt-8 font-display italic text-lg text-ink">Arnold</p>`) — personal touch worth replicating.

## 14. tp-totaal-specific deviations (from INFO.md)

1. **CTA wording**: use "Gratis prijsindicatie" / "prijsindicatie" instead of "Offerte" (jp-schilderwerken inspiration). Keep state hook name `useOfferte` internally if you like; just change copy.
2. **Floating bubbles**: add a WhatsApp bubble alongside the price-indication FAB on mobile (jp-schilderwerken pattern).
3. **Logo**: use one of `/Users/alfred/Projects/jiw-websites/apps/colors/colors-full.png` / `colors-compact.png` / `colors-mono.png` per context (full = footer/hero, compact/mono = nav).
4. **Form backend**: wire into `@jiw/cloudflare-forms` per `docs/cloudflare-forms.md`, model `wrangler.jsonc` after `apps/sqm/wrangler.jsonc` (Worker + R2 + email service). Use default jouwidealewebsite address for from/to integration.
5. **Project layout**: arrange gallery photos under project groupings / ensembles (sqm "Een greep uit recente projecten" inspiration). Consider before/after sliders from rn-schilders for restoration shots.
6. **Content depth**: deep-scrape Trustoo for reviews + photos, review the reviews to extract "work way" themes for the About copy.
7. **Address**: Bottelroos 13, Rotterdam. Phone: 010 321 0928. Schema.org addressLocality = Rotterdam, addressRegion = Zuid-Holland.
