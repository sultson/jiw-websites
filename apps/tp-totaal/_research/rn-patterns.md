# rn-schilders patterns to reuse in tp-totaal

Both patterns live as inline components inside the single-file
`apps/rn-schilders/src/App.tsx` (no separate component files exist).

- `ProjectCarousel` — autoplaying horizontal-fade image carousel (used for
  service cards + project slideshows)
- `StageSlider` — drag-to-reveal "voor / tijdens / na" stages, backed by a
  native `<input type="range">` (used for the `DoorRenovationSlider` and
  `DakraamhoekSlider`)

No third-party carousel libs. Only `lucide-react` is needed for the
`ChevronLeft` / `ChevronRight` icons (rn-schilders already depends on
`lucide-react@^0.546.0`). Everything else is plain React 19 + Tailwind v4.

Slider thumb/track styling lives in `src/index.css` under the `.door-slider`
class — copy that block verbatim (or rename to a tp-totaal-specific class).

> Note: rn-schilders has new image batches in
> `apps/rn-schilders/new-picture-batch-1-20260514/` and
> `apps/rn-schilders/new-pictures-batch-2-20260514/` for future reference,
> not needed for adapting these components.

---

## 1. `ProjectCarousel` — service / project image strip

Autoplay every 5s by default, pauses for 10s after manual interaction.
Cross-fades via opacity (no JS transform animation, so it's GPU-cheap).
First image loads `lazy` by default — pass `loadingFirst="eager"` for
above-the-fold hero use.

### Required imports

```tsx
import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
```

### Component (full source, lines 1722–1823 of rn-schilders App.tsx)

```tsx
function ProjectCarousel({
  slides,
  alt = '',
  className = 'absolute inset-0',
  imageWidth,
  imageHeight,
  autoplayMs = 5000,
  loadingFirst = 'lazy',
}: {
  slides: string[];
  alt?: string;
  className?: string;
  imageWidth?: number;
  imageHeight?: number;
  autoplayMs?: number;
  loadingFirst?: 'eager' | 'lazy';
}) {
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  const pauseTemporarily = useCallback(() => {
    setPaused(true);
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => setPaused(false), 10000);
  }, []);

  useEffect(() => {
    if (paused || total < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [paused, total, autoplayMs]);

  useEffect(() => () => {
    if (resumeRef.current) clearTimeout(resumeRef.current);
  }, []);

  if (total === 0) return null;

  const stop = (event: ReactMouseEvent | ReactKeyboardEvent) => {
    event.stopPropagation();
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      {slides.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          width={imageWidth}
          height={imageHeight}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          loading={i === 0 ? loadingFirst : 'lazy'}
          decoding="async"
          draggable={false}
        />
      ))}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => { stop(event); prev(); pauseTemporarily(); }}
            onKeyDown={stop}
            aria-label="Vorige beeld"
            className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md bg-navy/65 text-white backdrop-blur-sm transition hover:bg-navy/90 focus-visible:bg-navy/90"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={(event) => { stop(event); next(); pauseTemporarily(); }}
            onKeyDown={stop}
            aria-label="Volgende beeld"
            className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md bg-navy/65 text-white backdrop-blur-sm transition hover:bg-navy/90 focus-visible:bg-navy/90"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
            {slides.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={(event) => { stop(event); setIndex(i); pauseTemporarily(); }}
                onKeyDown={stop}
                aria-label={`Beeld ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/55 hover:bg-white/85'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

### Tailwind tokens used

`bg-navy`, `bg-navy/65`, `bg-navy/90` — site-specific colors defined in
`index.css` via `@theme`. Substitute with tp-totaal's palette (or use
`bg-slate-900/65` etc. as a temporary stand-in).

### `ProjectSlideshow` wrapper (text-side layout, lines 1825–1849)

```tsx
function ProjectSlideshow({
  slides,
  imageWidth,
  imageHeight,
  title,
  text,
}: {
  slides: string[];
  imageWidth: number;
  imageHeight: number;
  title: string;
  text: string;
}) {
  return (
    <article className="grid overflow-hidden rounded-lg border border-white/10 bg-white/8 md:grid-cols-[0.72fr_1fr]">
      <div className="relative aspect-[4/5] bg-navy md:aspect-auto md:h-full">
        <ProjectCarousel slides={slides} imageWidth={imageWidth} imageHeight={imageHeight} />
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl font-extrabold">{title}</h3>
        <p className="mt-3 leading-7 text-white/88">{text}</p>
      </div>
    </article>
  );
}
```

### How `ProjectCarousel` is integrated in the Services grid (lines ~1392–1447)

The service card uses `ProjectCarousel` when a service has multiple images,
falling back to a single static `<img>` otherwise. The whole card is a
click-to-open-modal target, so the carousel's inner buttons call
`event.stopPropagation()` (via the `stop` helper) to avoid bubbling.

```tsx
<div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
  {services.map((service) => {
    const open = () => setSelectedService(service);
    const slides = service.images && service.images.length > 1 ? service.images : null;
    return (
      <div
        key={service.title}
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            open();
          }
        }}
        className="group cursor-pointer overflow-hidden rounded-lg border border-line bg-white text-left transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-30px_rgba(13,30,61,0.65)] focus-visible:-translate-y-0.5"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {slides ? (
            <ProjectCarousel
              slides={slides}
              className="absolute inset-0 h-full w-full bg-navy"
              imageWidth={service.width}
              imageHeight={service.height}
            />
          ) : (
            <img
              src={service.image}
              alt=""
              width={service.width}
              height={service.height}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-md bg-navy p-3 text-white">
            <service.icon size={22} />
          </div>
        </div>
        {/* ...title, bullets, CTA... */}
      </div>
    );
  })}
</div>
```

And inside the project showcase section (lines 1586–1601):

```tsx
<div className="mt-12 grid gap-5 md:grid-cols-2">
  <ProjectSlideshow
    slides={['/interieur-slide-1.webp', '/interieur-slide-2.webp', '/interieur-slide-3.webp']}
    imageWidth={720}
    imageHeight={880}
    title="Interieur renovatie"
    text="Donkere luxe tint, strak afgewerkt en direct klaar voor gebruik."
  />
  <ProjectSlideshow
    slides={['/kantoor-slide-1.webp', '/kantoor-slide-2.webp', '/kantoor-slide-3.webp']}
    imageWidth={720}
    imageHeight={1072}
    title="Casco naar kantoor"
    text="Systeemwanden, isolatie, plafonds, stuc- en schilderwerk in één traject."
  />
</div>
```

### Service type (relevant fields, line 76+)

```tsx
type Service = {
  title: string;
  slug: string;
  text: string;
  seoTitle: string;
  seoDescription: string;
  pageLead: string;
  image: string;        // fallback single image
  images?: string[];    // when present and length > 1 -> ProjectCarousel
  width: number;
  height: number;
  icon: typeof PaintRoller;
  // ...rest unrelated to carousel
};
```

### Accessibility / perf notes

- Native `<button aria-label>` on prev/next + dots; `aria-current` on the
  active dot.
- All images get `width` + `height` (CLS), `decoding="async"`,
  `draggable={false}`, and `loading="lazy"` except optionally the first
  slide.
- Autoplay is paused for 10s after user interaction (no permanent kill,
  no autoplay toggle).
- No keyboard arrow handling — relies on dot/prev/next buttons being
  focusable. Add `onKeyDown` arrow handling on the outer `<div>` if you
  need it.
- No `prefers-reduced-motion` guard on autoplay; consider adding one for
  tp-totaal (e.g. `if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;`
  inside the autoplay `useEffect`).

---

## 2. `StageSlider` — voor / tijdens / na drag-to-reveal

This is the "dakraamhoek slider" mentioned in the latest commit. It is
**not** a classic split-screen wipe slider — it's a 3-stage cross-fade
driven by a styled `<input type="range">` plus per-stage stage buttons.
Each stage occupies 100 units on the range; dragging fades stages in/out
proportionally and snaps to the nearest stage on release.

### Required imports

```tsx
import { useState } from 'react';
```

### Stage type + sample data (lines 1609–1621)

```tsx
type Stage = { src: string; label: string; sub: string; alt: string };

const doorStages: readonly Stage[] = [
  { src: '/voordeur-voor.webp',    label: 'Voor',    sub: 'Verweerd hout, peelende verflagen.',                  alt: 'Voordeur voor behandeling' },
  { src: '/voordeur-tijdens.webp', label: 'Tijdens', sub: 'Schuren, plamuren, gronden.',                         alt: 'Voordeur tijdens behandeling' },
  { src: '/voordeur-na.webp',      label: 'Na',      sub: 'Hoogglans afwerking, weer jarenlang beschermd.',      alt: 'Voordeur na behandeling' },
] as const;

const dakraamStages: readonly Stage[] = [
  { src: '/showcase-roof-window-before.webp',       label: 'Voor',   sub: 'Versleten dakkapel met losse verflagen en houtwerk dat aandacht vraagt.', alt: 'Dakkapel en dakraamhoek voor afwerking' },
  { src: '/showcase-roof-window-after.webp',        label: 'Na',     sub: 'Strakke afwerking, herstelde naden en duurzaam beschermd hout.',          alt: 'Dakkapel en dakraamhoek na afwerking' },
  { src: '/showcase-roof-window-after-detail.webp', label: 'Detail', sub: 'Vanaf straatniveau valt op hoe schoon de aansluitingen zijn afgewerkt.',  alt: 'Afgewerkte dakkapel vanaf straatniveau' },
] as const;
```

### Component (full source, lines 1623–1712)

```tsx
function StageSlider({
  stages,
  ariaLabel,
  imageWidth,
  imageHeight,
}: {
  stages: readonly Stage[];
  ariaLabel: string;
  imageWidth: number;
  imageHeight: number;
}) {
  const max = (stages.length - 1) * 100;
  const [pos, setPos] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const active = Math.min(stages.length - 1, Math.round(pos / 100));

  const release = () => {
    setScrubbing(false);
    setPos((value) => Math.round(value / 100) * 100);
  };

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white/8 ring-1 ring-white/10">
      <div className="relative aspect-[4/5] w-full bg-navy">
        {stages.map((stage, i) => {
          const opacity = Math.max(0, 1 - Math.abs(pos / 100 - i));
          return (
            <img
              key={stage.src}
              src={stage.src}
              alt={stage.alt}
              width={imageWidth}
              height={imageHeight}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity, transition: scrubbing ? 'none' : 'opacity 240ms ease-out' }}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          );
        })}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-4">
          <span className="rounded-md bg-navy/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-roller-soft backdrop-blur-sm">
            {stages[active].label}
          </span>
          <span className="rounded-md bg-navy/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
            {active + 1} / {stages.length}
          </span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/95 via-navy/55 to-transparent px-5 pb-5 pt-14">
          <p className="text-sm font-semibold leading-snug text-white/92">{stages[active].sub}</p>
        </div>
      </div>

      <div className="px-4 pt-4 pb-5">
        <div className="flex gap-2">
          {stages.map((stage, i) => (
            <button
              key={stage.label}
              type="button"
              onClick={() => setPos(i * 100)}
              aria-pressed={active === i}
              className={`flex-1 rounded-md px-2 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${active === i ? 'bg-roller text-white shadow-[0_8px_18px_-8px_rgba(255,106,0,0.9)]' : 'bg-white/8 text-white/70 hover:bg-white/15 hover:text-white'}`}
            >
              {stage.label}
            </button>
          ))}
        </div>

        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={pos}
          onChange={(event) => setPos(Number(event.currentTarget.value))}
          onPointerDown={() => setScrubbing(true)}
          onPointerUp={release}
          onPointerCancel={release}
          onTouchStart={() => setScrubbing(true)}
          onTouchEnd={release}
          onBlur={release}
          aria-label={ariaLabel}
          aria-valuetext={`${stages[active].label}: ${stages[active].sub}`}
          className="door-slider mt-4"
        />
      </div>
    </div>
  );
}

function DoorRenovationSlider() {
  return (
    <StageSlider
      stages={doorStages}
      ariaLabel="Sleep om voor, tijdens en na te vergelijken"
      imageWidth={451}
      imageHeight={590}
    />
  );
}

function DakraamhoekSlider() {
  return (
    <StageSlider
      stages={dakraamStages}
      ariaLabel="Sleep om dakraamhoek voor, na en detail te vergelijken"
      imageWidth={1024}
      imageHeight={1280}
    />
  );
}
```

### Integration (lines ~1583 and ~1880)

`DoorRenovationSlider` sits in a 2-column hero/showcase row alongside copy:

```tsx
<div className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
  <div>
    <p className="eyebrow text-roller-soft">Recent werk</p>
    <h2 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
      Van versleten voordeur naar hoogglans visitekaartje.
    </h2>
    {/* ...steps + CTA... */}
  </div>

  <DoorRenovationSlider />
</div>
```

`DakraamhoekSlider` is dropped into the work showcase block in a similar
way (line ~1880).

### Required CSS (paste into tp-totaal's `src/index.css`)

The thumb / track styling lives outside Tailwind because pseudo-elements
like `::-webkit-slider-thumb` can't be expressed in utility classes.
Source: `apps/rn-schilders/src/index.css` lines 195–252.

```css
.door-slider {
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  cursor: pointer;
  width: 100%;
  height: 28px;
}

.door-slider:focus { outline: none; }

.door-slider::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255, 176, 115, 0.55) 0%, rgba(255, 106, 0, 0.95) 50%, rgba(255, 176, 115, 0.55) 100%);
}

.door-slider::-moz-range-track {
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255, 176, 115, 0.55) 0%, rgba(255, 106, 0, 0.95) 50%, rgba(255, 176, 115, 0.55) 100%);
}

.door-slider::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: #fff;
  border: 3px solid var(--color-roller); /* tp-totaal: swap for own accent var */
  box-shadow: 0 8px 18px -6px rgba(0, 0, 0, 0.7);
  margin-top: -10px;
  cursor: grab;
  transition: transform 120ms ease-out;
}

.door-slider::-moz-range-thumb {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: #fff;
  border: 3px solid var(--color-roller);
  box-shadow: 0 8px 18px -6px rgba(0, 0, 0, 0.7);
  cursor: grab;
  transition: transform 120ms ease-out;
}

.door-slider:active::-webkit-slider-thumb { cursor: grabbing; transform: scale(1.08); }
.door-slider:active::-moz-range-thumb     { cursor: grabbing; transform: scale(1.08); }

.door-slider:focus-visible::-webkit-slider-thumb {
  box-shadow: 0 0 0 4px rgba(255, 106, 0, 0.35), 0 8px 18px -6px rgba(0, 0, 0, 0.7);
}
.door-slider:focus-visible::-moz-range-thumb {
  box-shadow: 0 0 0 4px rgba(255, 106, 0, 0.35), 0 8px 18px -6px rgba(0, 0, 0, 0.7);
}
```

Rename the class (e.g. `.stage-slider`) for tp-totaal so the visual
language is its own. Update the `border` color, gradient stops, and focus
ring to tp-totaal's accent color.

### Accessibility / UX notes

- The range input owns keyboard a11y for free: arrow keys move 1 unit,
  Page Up/Down jump 10. Since 100 units = one stage, arrow keys give
  smooth scrubbing and Page keys roughly hop between stages.
- `aria-label` is required; `aria-valuetext` reads back the active
  stage's label + subtitle to screen readers instead of the raw number.
- The stage chips are real `<button aria-pressed>` toggles so screen
  reader users can jump straight to a stage.
- On pointer/touch release the position snaps to the nearest stage —
  prevents a half-faded "stuck" state.
- All stage images render at all times stacked on top of each other —
  fine for 2–4 stages, would need rethinking for larger sets.
- No `prefers-reduced-motion` guard; the 240ms opacity transition is
  short enough that this is usually OK, but consider gating with
  `@media (prefers-reduced-motion: reduce) { .door-slider + img { transition: none; } }`.

---

## Suggested adaptation order for tp-totaal

1. Copy the `.door-slider` CSS block into `src/index.css` and rename to
   `.stage-slider` (or keep — it works fine as-is).
2. Paste `ProjectCarousel`, `ProjectSlideshow`, `StageSlider`, the `Stage`
   type, and the `Service`-style data shape into `App.tsx` (or extract
   them into `src/components/Carousel.tsx` + `StageSlider.tsx` from day 1
   — they have no rn-schilders-specific business logic).
3. Replace `bg-navy`, `text-roller-soft`, `bg-roller`, `--color-roller`,
   `text-white/92` etc. with tp-totaal palette tokens.
4. Drop `ProjectCarousel` into the services grid (multi-image services)
   and `StageSlider` into a "voor / na" recent-work block.
