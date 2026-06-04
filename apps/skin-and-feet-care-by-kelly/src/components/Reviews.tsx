import { Star, ExternalLink, Quote, CalendarHeart, Users } from 'lucide-react';
import { site } from '../data/site';

type Props = { t: (k: string) => string };

export default function Reviews({ t }: Props) {
  return (
    <section id="ervaringen" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="kicker">{t('reviews.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('reviews.title')}</h2>
          <p className="mt-4 text-sm text-ink/60">{t('reviews.sub')}</p>
        </div>

        <div className="grid md:grid-cols-[1.3fr_1fr] gap-5 md:gap-6 items-stretch">
          <article className="card p-8 md:p-10 flex flex-col justify-center relative">
            <Quote size={40} className="text-plum/15 absolute top-6 left-6" />
            <div className="flex gap-0.5 text-plum mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <p className="font-serif italic text-2xl md:text-3xl leading-snug text-ink">
              {t('reviews.quote')}
            </p>
            <div className="mt-6 pt-5 border-t border-ink/5 flex items-center justify-between text-sm">
              <span className="font-medium text-ink">{t('reviews.quoteName')}</span>
              <span className="text-ink/45 tracking-wider uppercase text-xs">{t('reviews.quoteSource')}</span>
            </div>
          </article>

          <div className="grid gap-5 md:gap-6">
            <div className="rounded-2xl bg-plum text-cream p-7 flex flex-col justify-center shadow-[0_20px_50px_-24px_rgba(108,63,160,0.6)]">
              <div className="flex items-end gap-2">
                <span className="font-serif text-5xl leading-none">5,0</span>
                <div className="flex gap-0.5 text-plum-soft mb-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" className="text-amber-300" />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm text-cream/80">{t('reviews.statScore')}</p>
            </div>

            <div className="card p-6 flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-plum">
                <CalendarHeart size={18} />
              </div>
              <div>
                <p className="font-medium text-ink leading-tight">{t('reviews.statSince')}</p>
                <p className="text-sm text-ink/60 mt-0.5">{t('reviews.statSinceSub')}</p>
              </div>
            </div>

            <div className="card p-6 flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-plum">
                <Users size={18} />
              </div>
              <div>
                <p className="font-medium text-ink leading-tight">{t('reviews.statRepeat')}</p>
                <p className="text-sm text-ink/60 mt-0.5">{t('reviews.statRepeatSub')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <a
            href={site.mapsReviews}
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
