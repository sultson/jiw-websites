import { Star, ExternalLink } from 'lucide-react';
import { reviews } from '../data/reviews';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/place/Just+by+Brigitte/@51.3517841,5.4420163,849m/data=!3m1!1e3!4m8!3m7!1s0x47c6d7ea75079cd7:0xa25920d7a34c3c4a!8m2!3d51.3517841!4d5.4445912!9m1!1b1!16s%2Fg%2F11f6nr3h_k';

export default function Reviews({ lang, t }: Props) {
  const withText = reviews.filter(r => r.nl || r.en);
  const ratingOnly = reviews.filter(r => !r.nl && !r.en);

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
              {lang === 'nl' ? 'Gemiddeld op Google' : 'Google average'}
            </p>
          </article>

          {withText.map(r => (
            <article key={r.id} className="card p-6 md:p-7 flex flex-col">
              <div className="flex gap-0.5 text-gold mb-3">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="font-serif italic text-lg md:text-xl leading-snug text-espresso">
                "{lang === 'nl' ? r.nl : (r.en ?? r.nl)}"
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

        {ratingOnly.length > 0 && (
          <div className="mt-6 grid sm:grid-cols-3 gap-3 md:gap-4">
            {ratingOnly.map(r => (
              <div
                key={r.id}
                className="card px-5 py-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-espresso truncate">{r.name}</p>
                  <p className="text-[11px] text-espresso/50 tracking-wider uppercase mt-0.5">
                    {r.source} · {r.date}
                  </p>
                </div>
                <div className="flex gap-0.5 text-gold shrink-0">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

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
