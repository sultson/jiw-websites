import { useCallback, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { content, ui } from '../content';

export default function Work() {
  const t = content.teksten.werk;
  const werken = content.werk;
  const [index, setIndex] = useState<number | null>(null);

  const step = useCallback(
    (delta: number) => {
      setIndex((current) => (current === null ? null : (current + delta + werken.length) % werken.length));
    },
    [werken.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIndex(null);
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [index, step]);

  const current = index === null ? null : werken[index];
  const label = (work: (typeof werken)[number]) =>
    [work.techniek, work.afmetingen].filter(Boolean).join(', ');

  return (
    <section id="werk" className="scroll-mt-16 border-t border-hair py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <header className="max-w-2xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="display mt-4 text-4xl md:text-6xl">{t.titel}</h2>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-muted">{t.lead}</p>
        </header>

        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:mt-16 md:grid-cols-3 md:gap-x-8 md:gap-y-14 lg:grid-cols-4">
          {werken.map((work, i) => (
            <button
              key={work.id}
              type="button"
              onClick={() => setIndex(i)}
              className="group text-left"
              aria-label={`${ui.werk.vergroot}: ${work.titel}`}
            >
              {/* One fixed box for every card, so the titles underneath sit on
                  a single baseline across the row. The work is contained rather
                  than cropped: an art site must not recrop the art. */}
              <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-wall">
                <img
                  src={work.img.grid}
                  alt={`${work.titel}, ${label(work)}`}
                  loading="lazy"
                  decoding="async"
                  className="max-h-full max-w-full object-contain transition-opacity duration-300 group-hover:opacity-85"
                />
              </div>
              <h3 className="display mt-3 text-base leading-tight md:text-lg">{work.titel}</h3>
              <p className="mt-1 text-xs text-muted md:text-[0.8rem]">{label(work)}</p>
            </button>
          ))}
        </div>
      </div>

      {current && (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-ink/97"
          role="dialog"
          aria-modal="true"
          aria-label={current.titel}
        >
          <div className="flex items-center justify-between border-b border-hair px-5 py-3 md:px-8">
            <div>
              <h3 className="display text-lg md:text-xl">{current.titel}</h3>
              <p className="text-xs text-muted md:text-sm">{label(current)}</p>
            </div>
            <button type="button" onClick={() => setIndex(null)} aria-label={ui.lightbox.sluiten} className="p-2">
              <X size={26} />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4 md:p-8">
            <img
              src={current.img.full}
              alt={`${current.titel}, ${label(current)}`}
              className="max-h-full max-w-full object-contain"
            />
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={ui.lightbox.vorige}
              className="absolute left-2 p-3 text-bone/70 hover:text-bone md:left-6"
            >
              <ChevronLeft size={34} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={ui.lightbox.volgende}
              className="absolute right-2 p-3 text-bone/70 hover:text-bone md:right-6"
            >
              <ChevronRight size={34} />
            </button>
          </div>

          {current.toelichting && (
            <p className="mx-auto max-w-2xl px-5 pb-6 text-center text-sm leading-relaxed text-bone/75">
              {current.toelichting}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
