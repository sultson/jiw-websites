import { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { reviews, reviewText } from '../data/reviews';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

const GOOGLE_URL = 'https://www.google.com/maps?cid=15328144667062321359';

export default function Reviews({ lang, t }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-review-card]');
    const amount = card ? card.offsetWidth + 16 : 340;
    el.scrollBy({ left: amount * dir, behavior: 'smooth' });
  };

  return (
    <section id="reviews" className="py-20 md:py-28 bg-cream-soft">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <span className="kicker">{t('reviews.kicker')}</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">{t('reviews.title')}</h2>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex text-rose">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </span>
              <span className="text-sm text-ink-soft">{t('reviews.sub')}</span>
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={() => scrollBy(-1)} className="btn-outline !px-3" aria-label="Previous">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scrollBy(1)} className="btn-outline !px-3" aria-label="Next">
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
              <div className="flex gap-0.5 text-rose mb-3">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="font-serif italic text-lg md:text-xl leading-snug text-ink flex-1">
                {reviewText(r, lang)}
              </p>
              <div className="mt-5 pt-5 border-t border-ink/8 flex items-center justify-between text-xs">
                <span className="font-medium text-ink">{r.name}</span>
                <span className="text-ink-mute tracking-wider uppercase">{r.origin}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href={GOOGLE_URL}
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
