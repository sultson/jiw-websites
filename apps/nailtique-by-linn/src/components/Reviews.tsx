import { Star, ExternalLink } from 'lucide-react';
import { reviews } from '../data/reviews';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

const GOOGLE_REVIEWS_URL = 'https://maps.google.com/?cid=14591839085104193649';

export default function Reviews({ lang, t }: Props) {
  return (
    <section id="recensies" className="py-20 md:py-28 bg-blush-soft/50">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <span className="kicker">{t('reviews.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('reviews.title')}</h2>
          <p className="mt-3 text-sm text-espresso/60 max-w-md mx-auto">{t('reviews.sub')}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          <article className="card p-6 md:p-8 flex flex-col items-center text-center justify-center bg-white/60">
            <p className="font-serif text-5xl md:text-6xl text-espresso leading-none">5,0</p>
            <div className="flex gap-0.5 text-gold my-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-espresso/55 tracking-wider uppercase">
              {t('reviews.average')}
            </p>
          </article>

          {reviews.map(r => (
            <article key={r.id} className="card p-6 md:p-7 flex flex-col">
              <div className="flex gap-0.5 text-gold mb-3">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="font-serif italic text-lg md:text-xl leading-snug text-espresso">
                &ldquo;{lang === 'nl' ? r.nl : (r.en ?? r.nl)}&rdquo;
              </p>
              <div className="mt-auto pt-5 flex items-center justify-between text-xs">
                <span className="font-medium text-espresso">{r.name}</span>
                <span className="text-espresso/50 tracking-wider uppercase">
                  {r.source} · {r.date}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
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
