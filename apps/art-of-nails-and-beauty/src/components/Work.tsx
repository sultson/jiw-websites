import { useCallback, useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type Props = { t: (k: string) => string };

const ITEMS = [
  { src: '/work-french.webp', cap: 'work.cap2' },
  { src: '/work-natural-ring.webp', cap: 'work.cap3' },
  { src: '/work-mauve-glitter.webp', cap: 'work.cap5' },
  { src: '/work-lilac.webp', cap: 'work.cap1' },
  { src: '/work-natural-macro.webp', cap: 'work.cap4' },
] as const;

const GAP = 20; // matches gap-5

export default function Work({ t }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const pausedUntil = useRef(0);

  const step = useCallback((dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    const amount = card ? card.offsetWidth + GAP : el.clientWidth * 0.8;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    const atStart = el.scrollLeft <= 8;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir === -1 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    else el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }, []);

  // gentle auto-advance, paused on interaction or reduced-motion
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      if (active || Date.now() < pausedUntil.current) return;
      step(1);
    }, 4000);
    return () => window.clearInterval(id);
  }, [active, step]);

  const pause = () => {
    pausedUntil.current = Date.now() + 7000;
  };

  // lightbox
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active]);

  return (
    <section id="work" className="scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-20 md:pt-28">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-2xl reveal">
            <span className="kicker">{t('work.kicker')}</span>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t('work.title')}</h2>
            <p className="mt-5 text-ink-soft leading-relaxed">{t('work.sub')}</p>
          </div>
          {/* desktop chevrons */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0 pb-1">
            <button
              type="button"
              onClick={() => { pause(); step(-1); }}
              aria-label="Vorige"
              className="grid place-items-center w-11 h-11 rounded-full bg-white/70 ring-1 ring-wine/15 text-wine hover:bg-white hover:ring-wine/30 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => { pause(); step(1); }}
              aria-label="Volgende"
              className="grid place-items-center w-11 h-11 rounded-full bg-white/70 ring-1 ring-wine/15 text-wine hover:bg-white hover:ring-wine/30 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        onPointerDown={pause}
        onWheel={pause}
        onTouchStart={pause}
        className="mt-12 md:mt-14 pb-20 md:pb-28 flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-px-5 sm:scroll-px-8 px-5 sm:px-8 overscroll-x-contain"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        aria-label={t('work.title')}
      >
        {ITEMS.map((item) => (
          <button
            key={item.src}
            data-card
            type="button"
            onClick={() => setActive(item.src)}
            className="group relative w-[72vw] max-w-[300px] sm:w-[320px] shrink-0 snap-start overflow-hidden rounded-[1.5rem] ring-1 ring-white/60 shadow-[0_24px_50px_-30px_rgba(83,45,53,0.5)]"
            aria-label={t(item.cap)}
          >
            <img
              src={item.src}
              alt={t(item.cap)}
              loading="lazy"
              draggable={false}
              width={1000}
              height={1000}
              className="w-full h-full object-cover aspect-square transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/55 via-transparent to-transparent" />
            <div aria-hidden className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white/20 to-transparent" />
            <span className="absolute left-4 bottom-3.5 text-left text-sm font-medium text-white drop-shadow">
              {t(item.cap)}
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-wine-deep/85 backdrop-blur-sm p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label={t('close')}
            className="absolute top-4 right-4 grid place-items-center w-11 h-11 rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <X size={22} />
          </button>
          <img
            src={active}
            alt=""
            className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
