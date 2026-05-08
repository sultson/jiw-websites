import { Star } from 'lucide-react';
import { reviews } from '../data/reviews';
import type { Lang } from '../translations';

type Props = { t: (k: string) => string; lang: Lang };

export default function Reviews({ t, lang }: Props) {
  const review = reviews[0];
  return (
    <section id="reviews" className="py-20 sm:py-24 lg:py-32">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="kicker">{t('rv.kicker')}</span>
            <h2 className="mt-4 font-bold tracking-[-0.025em] leading-[1.05]"
                style={{ fontSize: 'clamp(32px, 4.5vw, 52px)' }}>
              {t('rv.title')}
            </h2>
            <p className="mt-5 text-ink/75 leading-relaxed">{t('rv.intro')}</p>
          </div>

          <div className="lg:col-span-8">
            <blockquote className="font-display font-bold tracking-[-0.02em] leading-[1.15] text-ink"
                        style={{ fontSize: 'clamp(28px, 3.6vw, 44px)' }}>
              &ldquo;{lang === 'nl' ? review.textNl : review.textEn}&rdquo;
            </blockquote>
            <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-ink/15">
              <div>
                <div className="font-semibold text-ink text-base">{review.author}</div>
                <div className="text-sm text-ink/60 mt-0.5">{t('rv.viaGoogle')}</div>
              </div>
              <span className="inline-flex items-center gap-1.5">
                {Array.from({ length: review.stars }).map((_, i) => (
                  <Star key={i} size={18} className="text-ochre fill-ochre" />
                ))}
              </span>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
