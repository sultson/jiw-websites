import { Star, Quote, ArrowUpRight } from 'lucide-react';
import { reviews } from '../data/reviews';
import { site } from '../data/site';

type Props = { t: (k: string) => string };

export default function Reviews({ t }: Props) {
  return (
    <section id="reviews" className="scroll-mt-20 bg-petal/50 border-y border-wine/8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto reveal">
          <span className="kicker kicker-center justify-center">{t('rev.kicker')}</span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t('rev.title')}</h2>
          <div className="mt-4 inline-flex items-center gap-2">
            <span className="inline-flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className="fill-rosegold text-rosegold" />
              ))}
            </span>
            <span className="text-sm text-ink-soft">
              {site.rating} · {site.reviewCount} reviews
            </span>
          </div>
          <p className="mt-4 text-ink-soft leading-relaxed">{t('rev.sub')}</p>
        </div>

        <div className="mt-12 columns-1 md:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="reveal card-gloss p-6 mb-5 break-inside-avoid"
            >
              <Quote size={26} className="text-rose/40" />
              <blockquote className="mt-3 text-[0.95rem] text-ink-soft leading-relaxed">
                {r.text}
              </blockquote>
              <figcaption className="mt-4 flex items-center justify-between">
                <span className="font-serif text-lg text-ink">{r.name}</span>
                <span className="inline-flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className="fill-rosegold text-rosegold" />
                  ))}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-wine hover:gap-2.5 transition-all"
          >
            {t('rev.gmaps')}
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
