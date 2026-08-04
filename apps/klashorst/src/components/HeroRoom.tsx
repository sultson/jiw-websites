import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Pointer } from 'lucide-react';
import { roomWorks } from '../data/artworks';
import type { Copy, Lang } from '../translations';

const Room3D = lazy(() => import('./Room3D'));

function webglAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function HeroRoom({ t, lang }: { t: Copy; lang: Lang }) {
  const holder = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [live, setLive] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!holder.current || !webglAvailable()) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    observer.observe(holder.current);
    return () => observer.disconnect();
  }, []);

  const focused = focusIndex === null ? null : roomWorks[focusIndex];

  return (
    <section
      id="zaal"
      ref={holder}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink pt-16"
    >
      {/* Always present in the HTML, so the works are there before any script
          runs and regardless of WebGL support. Dropped once the canvas is
          actually live, so a phone does not hold both in memory. */}
      {!live && (
        <div className="absolute inset-0 flex items-center gap-4 overflow-hidden px-4 opacity-70 sm:gap-8">
          {roomWorks.map((work, i) => (
            <img
              key={work.slug}
              src={`/art/${work.slug}-room.webp`}
              alt={`${work.title}, ${work.medium[lang]}, ${work.size}`}
              loading={i < 2 ? 'eager' : 'lazy'}
              decoding="async"
              className="h-[46vh] w-auto max-w-none shrink-0 object-contain sm:h-[58vh]"
            />
          ))}
        </div>
      )}

      {mount && (
        <Suspense fallback={null}>
          <Room3D
            focusIndex={focusIndex}
            onSelect={setFocusIndex}
            onReady={() => setLive(true)}
            onFirstDrag={() => setDragged(true)}
          />
        </Suspense>
      )}

      {/* Scrims: keep the type legible over whatever is turning behind it. */}
      {/* Seats the nav against the room. Stays put even when a work is
          brought forward, or the links lose their ground. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/85 via-ink/45 to-transparent" />

      {/* Scrims keep the type legible, but they have to get out of the way
          once a work is brought forward to be looked at. */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-ink from-8% via-ink/55 to-ink/15 transition-opacity duration-500 ${
          focused ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-r from-ink from-16% via-ink/80 via-44% to-transparent to-74% transition-opacity duration-500 ${
          focused ? 'opacity-0' : 'opacity-100'
        }`}
      />

      <div className="pointer-events-none relative mt-auto w-full px-5 pb-14 md:px-10 md:pb-20">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div
            className={`max-w-xl transition-all duration-500 ${
              focused ? 'pointer-events-none translate-y-2 opacity-0' : 'opacity-100'
            }`}
          >
            <p className="eyebrow">{t.hero.years}</p>
            <h1 className="display mt-4 text-[clamp(2.75rem,10vw,7rem)]">{t.hero.title}</h1>
            <p className="display mt-1 text-[clamp(1.1rem,3.4vw,2rem)] text-red-soft">{t.hero.tagline}</p>
            <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-bone/85">{t.hero.lead}</p>
            <div className="pointer-events-auto mt-7 flex flex-wrap gap-3">
              <a href="#werk" className="btn btn-solid">
                {t.hero.collection}
              </a>
              <a href="#peter" className="btn">
                {t.nav.peter}
              </a>
            </div>
          </div>

          {/* Wall label for the work brought forward. */}
          <div
            className={`pointer-events-auto max-w-sm border-l-2 border-red bg-ink/85 px-5 py-4 transition-all duration-500 ${
              focused ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
            }`}
          >
            <h2 className="display text-xl md:text-2xl">{focused?.title}</h2>
            <p className="mt-1 text-sm text-muted">
              {focused ? `${focused.medium[lang]}, ${focused.size}` : ''}
            </p>
            {focused?.note && <p className="mt-2 text-sm leading-relaxed text-bone/80">{focused.note[lang]}</p>}
            <button type="button" onClick={() => setFocusIndex(null)} className="eyebrow mt-3 block hover:text-bone">
              {t.room.back}
            </button>
          </div>
        </div>

        {/* No words: the glyph shows the gesture, and the pulsing marker on the
            centred canvas shows that a work can be opened. Both retire once the
            visitor has turned the room themselves. */}
        {live && !focused && (
          <div
            className={`mt-10 flex justify-center transition-opacity duration-700 ${
              dragged ? 'opacity-0' : 'opacity-100'
            }`}
            aria-hidden="true"
          >
            <span className="drag-hint">
              <span>
                <Pointer size={22} strokeWidth={1.5} />
              </span>
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
