import { Star, BadgeCheck, ArrowUpRight, Quote } from 'lucide-react';
import { reviews } from '../data/reviews';
import type { Lang } from '../translations';

type Props = { t: (k: string) => string; lang: Lang };

export default function Reviews({ t, lang }: Props) {
  return (
    <section id="reviews" className="bg-charcoal-ink text-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] bg-blueprint pointer-events-none" aria-hidden />

      {/* glow accent - top-right */}
      <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full pointer-events-none" aria-hidden style={{ background: 'radial-gradient(circle at center, rgba(220,90,30,0.18), transparent 60%)' }} />

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-8 mb-14 lg:mb-16">
          <div className="lg:col-span-7">
            <span className="kicker text-orange-soft">{t('rv.kicker')}</span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05] text-cream">
              {t('rv.title')}
            </h2>
            <p className="mt-5 text-base sm:text-lg text-cream/70 leading-relaxed max-w-2xl">
              {t('rv.intro')}
            </p>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 flex flex-col gap-3 self-end">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={22} className="text-orange-soft fill-orange-soft" />
              ))}
              <span className="ml-2 font-display font-extrabold text-3xl text-cream">4,8</span>
              <span className="text-cream/60 text-sm">/ 5</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-cream/65">
              <BadgeCheck size={16} className="text-orange-soft" />
              {t('rv.proof')} · Werkspot · 267 reviews
            </div>
          </div>
        </div>

        {/* horizontal scroll on mobile, grid on desktop */}
        <div className="flex lg:grid lg:grid-cols-3 gap-4 sm:gap-5 overflow-x-auto no-scrollbar -mx-4 sm:-mx-6 lg:mx-0 px-4 sm:px-6 lg:px-0 snap-x snap-mandatory">
          {reviews.slice(0, 9).map((r, i) => (
            <article
              key={`${r.name}-${r.city}-${r.date}`}
              className="snap-start shrink-0 w-[85%] sm:w-[55%] lg:w-auto bg-gradient-to-br from-charcoal-soft/60 to-charcoal/40 border border-cream/12 p-7 flex flex-col relative hover:border-orange-soft/40 transition-colors"
            >
              {/* quote mark */}
              <Quote size={32} className="text-orange-soft/35 absolute top-5 right-5" strokeWidth={1.5} />

              <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={15} className="text-orange-soft fill-orange-soft" />
                ))}
                <span className="ml-2 font-mono text-[10px] tracking-[0.22em] text-cream/35 uppercase">
                  №{String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <p className="text-cream/90 text-base leading-relaxed flex-1 font-display font-medium">
                {lang === 'en' ? r.quoteEn : r.quoteNl}
              </p>

              <footer className="mt-6 pt-5 border-t border-cream/15">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-cream">{r.name}</div>
                    <div className="text-[11px] text-cream/55 uppercase tracking-[0.18em] mt-1">
                      {r.city} · {r.date}
                    </div>
                  </div>
                  <BadgeCheck size={16} className="text-orange-soft/80 shrink-0" />
                </div>
                <div className="text-[11px] text-orange-soft mt-3 uppercase tracking-[0.2em] font-semibold">
                  {lang === 'en' ? r.workEn : r.workNl}
                </div>
              </footer>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="https://www.werkspot.nl/profiel/sqm-bouwmanagement/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cream hover:text-orange-soft transition-colors"
          >
            {t('show.viewAll')}
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </section>
  );
}
