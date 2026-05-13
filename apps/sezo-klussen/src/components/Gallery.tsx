import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { categories, projects, type FilterId } from '../data/projects';

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterId>('alles');

  const visible = useMemo(
    () => (filter === 'alles' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  const counts = useMemo(() => {
    const map = new Map<FilterId, number>();
    map.set('alles', projects.length);
    for (const p of projects) {
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    }
    return map;
  }, []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active]);

  const current = active !== null ? visible[active] : null;

  return (
    <section id="werk" className="section bg-bone">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-14">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">Recent werk</p>
            <h2 className="text-4xl md:text-5xl">Projecten in beeld.</h2>
          </div>
          <p className="text-sm text-stone">Tik op een foto voor groot.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Categorieën">
          {categories.map((c) => {
            const isActive = filter === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setFilter(c.id);
                  setActive(null);
                }}
                className={
                  'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ' +
                  (isActive
                    ? 'border-ink bg-ink text-bone'
                    : 'border-line bg-bone text-ink hover:border-gold hover:text-gold-deep')
                }
              >
                <span>{c.label}</span>
                <small className="text-[10px] font-normal opacity-70">
                  {counts.get(c.id) ?? 0}
                </small>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-5">
          {visible.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setActive(i)}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-bone-soft"
            >
              <img
                src={p.src}
                alt={p.label}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/0 to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 text-left text-xs font-semibold uppercase tracking-wider text-bone">
                {p.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {current && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 bg-ink/90 flex items-center justify-center p-4 md:p-10"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Sluiten"
            onClick={() => setActive(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-bone hover:text-gold transition-colors"
          >
            <X size={32} strokeWidth={1.5} />
          </button>
          <figure
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full max-h-full"
          >
            <img
              src={current.src}
              alt={current.label}
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
            />
            <figcaption className="text-bone/80 text-center text-sm mt-4">
              {current.label}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
