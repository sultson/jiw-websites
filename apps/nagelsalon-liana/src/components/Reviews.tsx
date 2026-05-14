import { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { reviews } from '../data/reviews';
import { contact } from '../data/contact';
import type { Lang } from '../translations';

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

  function text(r: { nl: string; en: string; hy?: string }) {
    if (lang === 'hy' && r.hy) return r.hy;
    if (lang === 'en') return r.en;
    return r.nl;
  }

  return (
    <section id="recensies" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <span className="kicker">{t('reviews.kicker')}</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('reviews.title')}</h2>
            <p className="mt-3 text-sm text-espresso/60 max-w-md">{t('reviews.sub')}</p>
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
              className="card shrink-0 w-[85%] sm:w-[360px] p-6 md:p-7 snap-start flex flex-col"
            >
              <div className="flex gap-0.5 text-gold mb-3">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="font-serif italic text-lg md:text-xl leading-snug text-espresso flex-1">
                "{text(r)}"
              </p>
              <div className="mt-5 pt-5 border-t border-espresso/5 flex items-center justify-between text-xs">
                <span className="font-medium text-espresso">{r.name}</span>
                <span className="text-espresso/50 tracking-wider uppercase">{r.source}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href={contact.mapsReviewsUrl}
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
