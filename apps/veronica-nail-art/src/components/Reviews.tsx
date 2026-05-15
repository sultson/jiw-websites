import { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { reviews } from '../data/reviews';

export default function Reviews() {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-review-card]');
    const amount = card ? card.offsetWidth + 16 : 320;
    el.scrollBy({ left: amount * dir, behavior: 'smooth' });
  };

  return (
    <section id="recensies" className="py-20 md:py-28 bg-blush-soft/60">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <span className="kicker">Klanten vertellen</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">Recensies</h2>
            <p className="mt-3 flex items-center gap-2 text-sm text-ink/60">
              <span className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </span>
              5,0 gemiddeld uit 18 Google-recensies
            </p>
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
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="font-serif italic text-lg md:text-xl leading-snug text-ink flex-1">
                “{r.text}”
              </p>
              <div className="mt-5 pt-5 border-t border-ink/5 flex items-center justify-between text-xs">
                <span className="font-medium text-ink">{r.name}</span>
                <span className="text-ink/50 tracking-wider uppercase">Google</span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Veronica%20Nail%20Art&query_place_id=ChIJ-ydx-CyGyEcRSJlTfMMADw8"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex"
          >
            Bekijk alle recensies op Google
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
