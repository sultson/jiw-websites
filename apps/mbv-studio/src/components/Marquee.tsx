import { useEffect, useRef } from 'react';
import { Instagram } from 'lucide-react';

type Props = { t: (k: string) => string };

type Tile = { src: string; poster: string; alt: string };

/**
 * Marquee clips are dedicated to this section. None of these reels appears
 * anywhere else on the page (hero, about, services and gallery use other media).
 */
const tiles: Tile[] = [
  { src: '/marquee-1.mp4', poster: '/marquee-1.webp', alt: 'Manicure in progress at MBV Studio' },
  { src: '/marquee-2.mp4', poster: '/marquee-2.webp', alt: 'Inside MBV Studio in Breda' },
  { src: '/marquee-3.mp4', poster: '/marquee-3.webp', alt: 'Nail design being created' },
  { src: '/marquee-4.mp4', poster: '/marquee-4.webp', alt: 'The MBV Studio mirror corner' },
  { src: '/marquee-5.mp4', poster: '/marquee-5.webp', alt: 'A day at MBV Studio' },
];

function Clip({ tile }: { tile: Tile }) {
  return (
    <video
      src={tile.src}
      poster={tile.poster}
      muted
      autoPlay
      loop
      playsInline
      preload="metadata"
      aria-label={tile.alt}
      draggable={false}
      className="block w-full h-full object-cover pointer-events-none"
    />
  );
}

const SPEED = 0.5;        // px per frame (~30px/s)
const RESUME_AFTER = 2000; // ms of stillness before auto-scroll picks back up

export default function Marquee({ t }: Props) {
  // Duplicate the run so wrapping the scroll position looks seamless.
  const loop = [...tiles, ...tiles];
  const trackRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hovering = { current: false };
    const pausedUntil = { current: 0 };
    let raf = 0;

    const half = () => el.scrollWidth / 2;
    const wrap = () => {
      const h = half();
      if (h <= 0) return;
      if (el.scrollLeft >= h) el.scrollLeft -= h;
      else if (el.scrollLeft <= 0) el.scrollLeft += h;
    };

    const tick = () => {
      if (!reduce && !hovering.current && Date.now() > pausedUntil.current) {
        el.scrollLeft += SPEED;
      }
      wrap();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const bump = () => { pausedUntil.current = Date.now() + RESUME_AFTER; };

    // Mouse drag-to-scroll (touch + trackpad already scroll natively).
    let dragging = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e: PointerEvent) => {
      bump();
      if (e.pointerType !== 'mouse') return;
      dragging = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      el.scrollLeft = startLeft - (e.clientX - startX);
      bump();
    };
    const onUp = () => { dragging = false; bump(); };

    const onEnter = () => { hovering.current = true; };
    const onLeave = () => { hovering.current = false; };

    el.addEventListener('wheel', bump, { passive: true });
    el.addEventListener('touchstart', bump, { passive: true });
    el.addEventListener('touchmove', bump, { passive: true });
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('wheel', bump);
      el.removeEventListener('touchstart', bump);
      el.removeEventListener('touchmove', bump);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 mb-9">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <span className="rose-rule">{t('marquee.kicker')}</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">{t('marquee.title')}</h2>
          </div>
          <a
            href="https://www.instagram.com/studio.mbv/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-ink-mute hover:text-ink"
          >
            <Instagram size={15} /> {t('marquee.link')}
          </a>
        </div>
      </div>

      <div className="marquee-viewport relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-cream to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-cream to-transparent z-10" />

        <ul ref={trackRef} className="marquee-track no-scrollbar gap-4 md:gap-5">
          {loop.map((tile, i) => (
            <li
              key={`${tile.src}-${i}`}
              className="shrink-0 w-[58vw] sm:w-[40vw] md:w-[26vw] lg:w-[19rem] aspect-[3/4] overflow-hidden rounded-2xl bg-sand border border-ink/5"
              aria-hidden={i >= tiles.length ? 'true' : undefined}
            >
              <Clip tile={tile} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
