import { Star, ArrowRight } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';
import { SITE } from '../lib/site';
import { reviews } from '../data/reviews';
import type { Lang } from '../translations';

type Props = {
  t: (k: string) => string;
  lang: Lang;
};

const GOLD = '#F4B400';

/** A row of 5 stars, `count` of them filled gold. */
function Stars({ count, size = 16 }: { count: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} / 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={0}
          fill={i < count ? GOLD : '#D8DCE2'}
          className="shrink-0"
        />
      ))}
    </div>
  );
}

export default function Reviews({ t, lang }: Props) {
  return (
    <section id="reviews" className="section bg-white">
      <div className="shell">
        <SectionHeader
          eyebrow={t('rv.eyebrow')}
          title={t('rv.title')}
          intro={t('rv.intro')}
          dot="cobalt"
        />

        {/* Big rating display */}
        <Reveal delay={1}>
          <div className="mt-12 flex items-center gap-5 sm:gap-7 border-y border-line-cool py-8">
            <div className="display-xl text-cobalt leading-none tnum">
              {SITE.ratingValue}
            </div>
            <div className="flex flex-col gap-2">
              <Stars count={5} size={24} />
              <span className="text-[14px] font-semibold text-ink-mute">
                {t('rv.ratingLabel')}
              </span>
            </div>
          </div>
        </Reveal>

        {/* Review cards — snap-scroll on mobile, grid on desktop */}
        <div className="mt-10 flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0">
          {reviews.map((r, i) => (
            <Reveal
              key={`${r.name}-${i}`}
              delay={(Math.min(i, 3) + 1) as 1 | 2 | 3 | 4}
              className="min-w-[82%] sm:min-w-0 snap-start"
            >
              <article className="h-full flex flex-col bg-bone border border-line rounded-2xl p-6 sm:p-7">
                <Stars count={r.rating} />
                <blockquote className="mt-4 flex-1 text-[15.5px] leading-relaxed text-ink-soft">
                  &ldquo;{lang === 'en' ? r.quoteEn : r.quoteNl}&rdquo;
                </blockquote>
                <div className="mt-5 pt-5 border-t border-line">
                  <div className="font-bold text-ink">{r.name}</div>
                  <div className="text-[13px] text-ink-mute">
                    {r.city} &middot; {r.date}
                  </div>
                  <span className="mt-3 inline-flex chip-cobalt max-w-full">
                    <span className="truncate">{lang === 'en' ? r.jobEn : r.jobNl}</span>
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Marktplaats link */}
        <Reveal delay={2}>
          <div className="mt-12">
            <a
              href={SITE.marktplaats}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[15px] font-bold text-cobalt hover:text-cobalt-deep transition-colors"
            >
              {t('pr.viewAll')}
              <ArrowRight
                size={17}
                strokeWidth={2.5}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
