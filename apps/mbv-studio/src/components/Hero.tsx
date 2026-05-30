import { ArrowRight, Star } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Hero({ t, onBook }: Props) {
  return (
    <section id="top" className="relative overflow-hidden bg-mocha-deep">
      <div className="absolute inset-0">
        <img
          src="/hero.webp"
          alt=""
          className="w-full h-full object-cover opacity-70"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mocha-deep/40 via-mocha-deep/55 to-mocha-deep/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-mocha-deep/70 via-transparent to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-24 md:pt-32 md:pb-40 lg:pt-40 lg:pb-48">
        <div className="max-w-2xl">
          <span className="rose-rule !text-rose-soft">{t('hero.kicker')}</span>
          <h1 className="mt-6 font-display text-[2.75rem] leading-[1.04] sm:text-6xl md:text-7xl text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] whitespace-pre-line">
            {t('hero.title')}
          </h1>
          <p className="mt-6 text-cream/85 text-base md:text-lg leading-relaxed max-w-xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
            {t('hero.sub')}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button onClick={onBook} className="btn-rose">
              {t('hero.ctaBook')}
              <ArrowRight size={16} />
            </button>
            <a href="#work" className="btn-cream">
              {t('hero.ctaWork')}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 text-cream/80 text-[11px] tracking-[0.18em] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="flex text-rose-soft">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </span>
              {t('hero.t1')}
            </span>
            <span className="h-3 w-px bg-cream/25" />
            <span>{t('hero.t2')}</span>
            <span className="h-3 w-px bg-cream/25" />
            <span>{t('hero.t3')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
