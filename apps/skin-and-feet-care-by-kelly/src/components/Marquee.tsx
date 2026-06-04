import { useEffect, useRef } from 'react';
import { Instagram } from 'lucide-react';
import { site } from '../data/site';

type Props = { t: (k: string) => string };

type Tile = { src: string; alt: string };

/**
 * Each tile is unique to this strip. None of these photos appears anywhere
 * else on the page (hero, about, foot care and reviews use other media).
 */
const tiles: Tile[] = [
  { src: '/marquee-1.webp', alt: 'Belleza Violeta huidverzorging tussen verse sinaasappels' },
  { src: '/marquee-2.webp', alt: 'Verzorgend serum uit de salon' },
  { src: '/marquee-3.webp', alt: 'Huidverzorgingsproducten tussen paarse bloemen' },
  { src: '/marquee-4.webp', alt: 'Cadeauset met verzorgingsproducten en bloemen' },
  { src: '/marquee-5.webp', alt: 'Micellair water voor een milde reiniging' },
  { src: '/marquee-6.webp', alt: 'Serum met een gouden glow' },
  { src: '/marquee-7.webp', alt: 'Verzorgingsset als cadeau' },
  { src: '/marquee-8.webp', alt: 'Verzorgingsproducten met hotstone massagestenen' },
];

const SPEED = 0.5;         // px per frame (~30px/s)
const RESUME_AFTER = 2000; // ms of stillness before auto-scroll resumes

export default function Marquee({ t }: Props) {
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
    <section className="py-16 md:py-24 bg-blush-soft/50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 mb-9">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <span className="kicker">{t('marquee.kicker')}</span>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t('marquee.title')}</h2>
          </div>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-ink/55 hover:text-ink"
          >
            <Instagram size={15} /> {t('marquee.link')}
          </a>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-cream to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-cream to-transparent z-10" />

        <ul ref={trackRef} className="marquee-track no-scrollbar gap-4 md:gap-5 px-5 sm:px-8">
          {loop.map((tile, i) => (
            <li
              key={`${tile.src}-${i}`}
              className="shrink-0 w-[58vw] sm:w-[40vw] md:w-[26vw] lg:w-[19rem] aspect-[3/4] overflow-hidden rounded-2xl bg-blush border border-ink/5"
              aria-hidden={i >= tiles.length ? 'true' : undefined}
            >
              <img
                src={tile.src}
                alt={tile.alt}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="block w-full h-full object-cover pointer-events-none"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
