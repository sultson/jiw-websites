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

  function text(r: { nl: string; en: string }) {
    return lang === 'en' ? r.en : r.nl;
  }

  return (
    <section id="recensies" className="py-20 md:py-32 bg-ivory-soft/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="gold-rule">{t('reviews.kicker')}</span>
            <h2 className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              {t('reviews.title')}
            </h2>
            <p className="mt-4 text-sm text-ink-mute">{t('reviews.sub')}</p>
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
          className="no-scrollbar flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5 sm:mx-0 sm:px-0"
        >
          {reviews.map(r => (
            <article
              key={r.id}
              data-review-card
              className="card shrink-0 w-[86%] sm:w-[400px] p-7 md:p-8 snap-start flex flex-col"
            >
              <div className="flex gap-0.5 text-gold mb-4">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="font-serif italic text-lg md:text-xl leading-relaxed text-ink/90 flex-1">
                &ldquo;{text(r)}&rdquo;
              </p>
              <div className="mt-6 pt-5 border-t border-ink/8 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <p className="font-medium text-ink truncate">{r.name}</p>
                  {r.service && <p className="text-ink-mute mt-0.5 text-[11px]">{r.service}</p>}
                </div>
                <span className="text-ink-mute tracking-[0.18em] uppercase text-[10px] shrink-0">{r.source}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
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
