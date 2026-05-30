import { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { reviews } from '../data/reviews';
import type { Lang } from '../translations';
import { BrushUnderline, SectionNumber } from './Marks';

type Props = { lang: Lang; t: (k: string) => string };

const GMAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Salon+LaZoa+Beek+en+Donk&query_place_id=ChIJ_____xRb24c_F1QkecQfn';

function StarRow({ n }: { n: number }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-hinoki text-[14px] leading-none tracking-[0.05em]"
      aria-label={`${n} sterren`}
    >
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} aria-hidden>★</span>
      ))}
      <span className="ml-3 inline-block w-6 h-px bg-sumi/20 align-middle" aria-hidden />
      <span className="text-[10px] uppercase tracking-[0.28em] text-sumi/50 ml-2">
        {n},0
      </span>
    </span>
  );
}

export default function Reviews({ lang, t }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-review-card]');
    const amount = card ? card.offsetWidth + 24 : 360;
    el.scrollBy({ left: amount * dir, behavior: 'smooth' });
  };

  function text(r: { nl: string | null; en: string | null }) {
    if (lang === 'en') return r.en;
    return r.nl;
  }

  return (
    <section id="recensies" className="py-28 md:py-40 bg-washi">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-14">
          <div>
            <div className="flex items-center gap-4 mb-4 text-[10.5px] uppercase tracking-[0.34em] text-sumi-soft">
              <SectionNumber n={5} />
              <span className="block w-8 h-px bg-sumi/30" />
              <span>{t('reviews.kicker')}</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.06]">
              {t('reviews.title')}
            </h2>
            <BrushUnderline className="brush mt-5" />
            <p className="mt-5 text-[14.5px] text-sumi/65 max-w-md leading-relaxed">{t('reviews.sub')}</p>
          </div>
          <div className="hidden md:flex gap-1">
            <button
              onClick={() => scrollBy(-1)}
              className="w-11 h-11 inline-flex items-center justify-center border border-sumi/20 text-sumi/70 hover:text-sumi hover:border-sumi transition-colors"
              aria-label="Vorige"
              style={{ borderRadius: 1 }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="w-11 h-11 inline-flex items-center justify-center border border-sumi/20 text-sumi/70 hover:text-sumi hover:border-sumi transition-colors"
              aria-label="Volgende"
              style={{ borderRadius: 1 }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="no-scrollbar flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5 sm:mx-0 sm:px-0"
        >
          {reviews.map(r => {
            const body = text(r);
            return (
              <article
                key={r.id}
                data-review-card
                className="shrink-0 w-[85%] sm:w-[380px] bg-shoji border border-sumi/10 p-7 md:p-9 snap-start flex flex-col"
                style={{ borderRadius: 1 }}
              >
                <StarRow n={r.rating} />
                {body ? (
                  <p className="mt-5 font-display text-[1.3rem] md:text-[1.45rem] leading-[1.45] text-sumi flex-1 tracking-[-0.005em]">
                    <span className="text-sumi/30 mr-0.5">“</span>
                    {body}
                    <span className="text-sumi/30 ml-0.5">”</span>
                  </p>
                ) : (
                  <p className="mt-5 font-display italic text-base text-sumi/45 flex-1">
                    {t('reviews.noText')}
                  </p>
                )}
                <div className="mt-6 pt-5 border-t border-sumi/10 flex items-center justify-between text-[11px] uppercase tracking-[0.18em]">
                  <span className="text-sumi/85">{r.name}</span>
                  <span className="text-sumi/45">{r.source}</span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <a
            href={GMAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-sumi/75 hover:text-hinoki transition-colors group"
          >
            <span className="block w-8 h-px bg-sumi/40 group-hover:bg-hinoki transition-colors" />
            {t('reviews.all')}
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
