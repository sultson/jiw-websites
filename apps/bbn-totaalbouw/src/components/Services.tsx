import { Check } from 'lucide-react';
import { services } from '../data/services';

export default function Services() {
  return (
    <section id="diensten" className="bg-bbn-ink py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-bbn-red">
            Wat wij doen
          </p>
          <h2 className="headline text-4xl text-white sm:text-5xl lg:text-6xl">
            Alles onder één dak
          </h2>
          <p className="mt-4 text-lg text-zinc-300">
            Van het strakste stucwerk tot een complete renovatie. Vijf vakmensen, één
            aanspreekpunt.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <article
              key={s.key}
              className="group relative overflow-hidden rounded-xl border border-bbn-line bg-bbn-ash p-6 transition hover:border-bbn-red/60"
            >
              <div className="absolute right-0 top-0 h-16 w-16 -translate-y-8 translate-x-8 rounded-full bg-bbn-red/20 blur-2xl transition group-hover:bg-bbn-red/40" />
              <p className="text-xs font-bold text-bbn-red">0{i + 1}</p>
              <h3 className="mt-2 text-2xl font-bold uppercase tracking-wide text-white">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-400">{s.blurb}</p>
              <ul className="mt-5 space-y-2">
                {s.bullets.map(b => (
                  <li key={b} className="flex items-start gap-2 text-sm text-zinc-200">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-bbn-red" />
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
