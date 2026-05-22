import { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { reviews, ratingMeta } from '../data/reviews';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/place/Clinic+22+Huidtherapie/@51.998608,4.390592,17z/data=!4m8!3m7!1s0x47c5cbe665fec0bf:0x8336bc3a321c8af7!8m2!3d51.998608!4d4.390592!9m1!1b1';

export default function Reviews({ lang, t }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-review-card]');
    const amount = card ? card.offsetWidth + 16 : 320;
    el.scrollBy({ left: amount * dir, behavior: 'smooth' });
  };

  function text(r: { nl: string; en: string }) {
    return lang === 'en' ? r.en : r.nl;
  }

  return (
    <section id="recensies" className="py-20 md:py-28 bg-bone/55">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="md:flex md:items-end md:justify-between gap-6 mb-10">
          <div>
            <span className="kicker">{t('reviews.kicker')}</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('reviews.title')}</h2>
            <p className="mt-3 text-sm text-ink/65 max-w-md">{t('reviews.sub')}</p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-ink/75">
              <span className="flex gap-0.5 text-ink">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              <span className="tabular-nums">{ratingMeta.average.toFixed(1)}</span>
              <span className="text-ink/45">·</span>
              <span className="text-ink/60">{ratingMeta.count} Google {t('reviews.rating')}</span>
            </div>
          </div>
          <div className="hidden md:flex gap-2 mt-6 md:mt-0">
            <button onClick={() => scrollBy(-1)} className="btn-outline !px-3 !py-3" aria-label="Vorige">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scrollBy(1)} className="btn-outline !px-3 !py-3" aria-label="Volgende">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5 sm:mx-0 sm:px-0"
        >
          {reviews.map(r => (
            <article
              key={r.id}
              data-review-card
              className="card shrink-0 w-[85%] sm:w-[360px] p-6 md:p-7 snap-start flex flex-col"
            >
              <div className="flex gap-0.5 text-ink mb-3">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="font-serif italic text-lg md:text-xl leading-snug text-ink flex-1">
                “{text(r)}”
              </p>
              <div className="mt-5 pt-5 border-t border-ink/5 flex items-center justify-between text-xs">
                <span className="font-medium text-ink">{r.name}</span>
                <span className="text-ink/50 tracking-wider uppercase">{r.source}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href={GOOGLE_REVIEWS_URL}
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
