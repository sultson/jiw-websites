import { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { reviews, reviewText, rating } from '../data/reviews';
import type { Lang } from '../translations';
import { contact } from '../data/contact';

type Props = { lang: Lang; t: (k: string) => string };

export default function Reviews({ lang, t }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-review-card]');
    const amount = card ? card.offsetWidth + 16 : 320;
    el.scrollBy({ left: amount * dir, behavior: 'smooth' });
  };

  return (
    <section id="recensies" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <span className="kicker">{t('reviews.kicker')}</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('reviews.title')}</h2>
            <div className="mt-3 flex items-center gap-3 text-sm text-ink/70">
              <span className="flex gap-0.5 text-rose">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </span>
              <span className="font-serif text-base text-ink">{rating.overall.toFixed(1)}</span>
              <span className="text-ink/50">·</span>
              <span className="text-ink/60">{rating.source}</span>
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={() => scrollBy(-1)} className="btn-outline !px-3" aria-label="Vorige">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scrollBy(1)} className="btn-outline !px-3" aria-label="Volgende">
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
              className="card shrink-0 w-[85%] sm:w-[380px] p-6 md:p-7 snap-start flex flex-col"
            >
              <div className="flex gap-0.5 text-rose mb-3">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="font-serif italic text-lg md:text-xl leading-snug text-ink flex-1">
                "{reviewText(r, lang)}"
              </p>
              <div className="mt-5 pt-5 border-t border-ink/5 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <p className="font-medium text-ink truncate">{r.name}</p>
                  {r.service && <p className="text-ink/50 mt-0.5 truncate">{r.service}</p>}
                </div>
                <span className="text-ink/50 tracking-wider uppercase shrink-0">{r.source}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href={contact.mapsUrl}
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
