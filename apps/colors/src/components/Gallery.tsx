import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryImages, sectionTitles } from '../content';

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i === null ? null : (i - 1 + galleryImages.length) % galleryImages.length));
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i === null ? null : (i + 1) % galleryImages.length));
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [activeIndex]);

  if (galleryImages.length === 0) return null;

  const active = activeIndex !== null ? galleryImages[activeIndex] : null;

  // sqm-style editorial 12-col bento grid
  const layouts = [
    { col: 6, row: 3 },
    { col: 3, row: 2 },
    { col: 3, row: 2 },
    { col: 3, row: 1 },
    { col: 3, row: 1 },
    { col: 4, row: 2 },
    { col: 4, row: 2 },
    { col: 4, row: 2 },
    { col: 3, row: 2 },
    { col: 6, row: 2 },
    { col: 3, row: 2 },
    { col: 4, row: 1 },
    { col: 4, row: 1 },
    { col: 4, row: 1 },
    { col: 6, row: 2 },
    { col: 3, row: 2 },
    { col: 3, row: 2 },
    { col: 4, row: 2 },
    { col: 4, row: 2 },
    { col: 4, row: 2 },
  ];

  return (
    <section id="werk" className="section bg-bone">
      <div className="container-page">
        <div className="grid lg:grid-cols-12 gap-8 mb-10 lg:mb-14 items-end">
          <div className="lg:col-span-5">
            <span className="eyebrow">{sectionTitles.gallery.eyebrow}</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-[1.05]">
              {sectionTitles.gallery.title}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-stone text-base md:text-lg leading-relaxed">
              Een doorsnede van het werk: binnen en buiten, klein en groot. Klik op een foto
              om groter te bekijken.
            </p>
            <div className="mt-5 hidden lg:flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-stone font-semibold">
              <span className="font-mono">{galleryImages.length} foto&apos;s</span>
              <span className="inline-block w-12 h-px bg-stone/30" />
              <span>Rotterdam en omgeving</span>
            </div>
          </div>
        </div>

        {/* Mobile: simple grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 lg:hidden">
          {galleryImages.map((p, idx) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className="group relative overflow-hidden bg-bone-soft cursor-zoom-in focus:outline-none aspect-square rounded-xl"
              aria-label="Foto vergroten"
            >
              <img
                src={p.src}
                alt={p.alt}
                loading={idx < 6 ? 'eager' : 'lazy'}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </button>
          ))}
        </div>

        {/* Desktop: bento grid */}
        <div className="hidden lg:grid grid-cols-12 auto-rows-[160px] gap-3">
          {galleryImages.map((p, idx) => {
            const l = layouts[idx % layouts.length];
            return (
              <button
                key={p.src}
                type="button"
                onClick={() => setActiveIndex(idx)}
                style={{
                  gridColumn: `span ${l.col} / span ${l.col}`,
                  gridRow: `span ${l.row} / span ${l.row}`,
                }}
                className="group relative overflow-hidden bg-bone-soft cursor-zoom-in focus:outline-none rounded-xl"
                aria-label="Foto vergroten"
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  loading={idx < 6 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {p.caption && (
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[11px] uppercase tracking-[0.22em] text-bone font-semibold drop-shadow">
                      {p.caption}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {active && activeIndex !== null && (
        <div
          onClick={() => setActiveIndex(null)}
          className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-4 md:p-10"
        >
          <button
            type="button"
            aria-label="Sluiten"
            onClick={() => setActiveIndex(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-bone hover:text-rood transition-colors"
          >
            <X size={32} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Vorige"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((i) => (i === null ? null : (i - 1 + galleryImages.length) % galleryImages.length));
            }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-bone hover:text-rood transition-colors"
          >
            <ChevronLeft size={36} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Volgende"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((i) => (i === null ? null : (i + 1) % galleryImages.length));
            }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-bone hover:text-rood transition-colors"
          >
            <ChevronRight size={36} strokeWidth={1.5} />
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-w-5xl w-full max-h-full">
            <img
              src={active.src}
              alt={active.alt}
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
            />
            {active.caption && (
              <figcaption className="text-bone/80 text-center text-sm mt-4">
                {active.caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </section>
  );
}
