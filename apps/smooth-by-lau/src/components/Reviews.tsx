import { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { reviews } from '../data/reviews';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

export default function Reviews({ lang, t }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-review-card]');
    const amount = card ? card.offsetWidth + 16 : 320;
    el.scrollBy({ left: amount * dir, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  function text(r: { nl: string; en: string }) {
    return lang === 'en' ? r.en : r.nl;
  }

  return (
    <section id="recensies" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <span className="kicker">{t('reviews.kicker')}</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('reviews.title')}</h2>

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
              className="shrink-0 w-[88%] sm:w-[360px] p-6 snap-start flex flex-col rounded-2xl bg-white border border-espresso/10 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-5">
                <span aria-hidden="true" className="w-10 h-10 shrink-0 rounded-full bg-blush flex items-center justify-center text-espresso font-medium">
                  {r.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-espresso">{r.name}</p>
                  <p className="mt-0.5 text-xs text-espresso/65">Google review</p>
                </div>
                <img src="/brand/google-g.png" alt="Google" width="24" height="24" loading="lazy" />
              </div>
              <div className="self-start inline-flex gap-1 rounded-full bg-espresso px-3 py-2 text-white mb-4" role="img" aria-label={`${r.rating} / 5`}>
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                ))}
              </div>
              <p className="font-sans text-[15px] leading-7 text-espresso/85 flex-1">
                {text(r)}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://www.google.com/maps/place/Smooth+By+Lau/@51.674239,4.95817,843m/data=!3m1!1e3!4m8!3m7!1s0x47c6910f0ccc297f:0xcac4d246f0b7562b!8m2!3d51.674239!4d4.95817!9m1!1b1!16s%2Fg%2F11y6npt717"
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
