import { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { reviews } from '../data/reviews';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

const GMAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Salon+LaZoa+Beek+en+Donk&query_place_id=ChIJ_____xRb24c_F1QkecQfn';

export default function Reviews({ lang, t }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-review-card]');
    const amount = card ? card.offsetWidth + 16 : 320;
    el.scrollBy({ left: amount * dir, behavior: 'smooth' });
  };

  function text(r: { nl: string | null; en: string | null }) {
    if (lang === 'en') return r.en;
    return r.nl;
  }

  return (
    <section id="recensies" className="py-24 md:py-28 bg-paper-soft/60">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="kicker">{t('reviews.kicker')}</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('reviews.title')}</h2>
            <p className="mt-3 text-sm text-mute max-w-md">{t('reviews.sub')}</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scrollBy(-1)}
              className="btn-outline !px-3"
              aria-label="Vorige"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="btn-outline !px-3"
              aria-label="Volgende"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5 sm:mx-0 sm:px-0"
        >
          {reviews.map(r => {
            const body = text(r);
            return (
              <article
                key={r.id}
                data-review-card
                className="card shrink-0 w-[85%] sm:w-[360px] p-6 md:p-7 snap-start flex flex-col"
              >
                <div className="flex gap-0.5 text-champagne mb-3">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                {body ? (
                  <p className="font-serif italic text-lg md:text-xl leading-snug text-ink flex-1">
                    “{body}”
                  </p>
                ) : (
                  <p className="font-serif italic text-base md:text-lg leading-snug text-ink/55 flex-1">
                    — {t('reviews.noText')}
                  </p>
                )}
                <div className="mt-5 pt-5 border-t border-ink/6 flex items-center justify-between text-xs">
                  <span className="font-medium text-ink">{r.name}</span>
                  <span className="text-mute tracking-wider uppercase">{r.source}</span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <a
            href={GMAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex"
          >
            {t('reviews.all')}
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
