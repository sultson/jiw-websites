import { Star, Quote } from 'lucide-react';
import { reviews, ratingScore, reviewCount } from '../data/reviews';

export default function Reviews() {
  return (
    <section id="reviews" className="bg-bbn-ash py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-bbn-red">
              Wat klanten zeggen
            </p>
            <h2 className="headline text-4xl text-white sm:text-5xl lg:text-6xl">
              {ratingScore} / 10 op Trustoo
            </h2>
            <p className="mt-4 text-lg text-zinc-300">
              {reviewCount} reviews. Allemaal 5 sterren. Hier een greep.
            </p>
          </div>
          <a
            href="https://trustoo.nl/zuid-holland/rotterdam/stukadoor/bbn-totaalbouw/"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold uppercase tracking-wider text-bbn-red hover:underline"
          >
            Lees alle reviews →
          </a>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 9).map((r, i) => (
            <article
              key={i}
              className="relative rounded-xl border border-bbn-line bg-bbn-ink p-6"
            >
              <Quote className="absolute right-5 top-5 h-6 w-6 text-bbn-red/30" />
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-bbn-red text-bbn-red" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-200">"{r.text}"</p>
              <div className="mt-5 flex items-center justify-between border-t border-bbn-line pt-4">
                <p className="text-sm font-semibold text-white">{r.name}</p>
                <p className="text-xs text-zinc-500">{r.date}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
