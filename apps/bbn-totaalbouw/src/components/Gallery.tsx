import { useMemo, useState } from 'react';
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

  return (
    <section id="werk" className="bg-bbn-ash py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-bbn-red">
              Recent werk
            </p>
            <h2 className="headline text-4xl text-zinc-900 sm:text-5xl lg:text-6xl">
              Projecten in beeld
            </h2>
          </div>
          <p className="text-sm text-zinc-500">Tik op een foto voor groot.</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Categorieën">
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
                    ? 'border-bbn-red bg-bbn-red text-white'
                    : 'border-bbn-line bg-bbn-ink text-zinc-700 hover:border-bbn-red hover:text-bbn-red')
                }
              >
                <span>{c.label}</span>
                <small className="text-[10px] font-normal opacity-70">{counts.get(c.id) ?? 0}</small>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setActive(i)}
              className="group relative aspect-square overflow-hidden rounded-lg border border-bbn-line bg-bbn-ink"
            >
              <img
                src={p.src}
                alt={p.label}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent" />
              <span className="absolute bottom-2 left-2 right-2 text-left text-xs font-semibold uppercase tracking-wider text-white">
                {p.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {active !== null && visible[active] && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 p-2 text-white"
            aria-label="Sluiten"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={visible[active].src}
            alt={visible[active].label}
            className="max-h-[88vh] max-w-full rounded-lg"
          />
        </div>
      )}
    </section>
  );
}
