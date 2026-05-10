import { ArrowRight } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Hero({ t, onBook }: Props) {
  return (
    <section id="top" className="relative">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10 pt-12 md:pt-20 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          <div className="lg:col-span-7 lg:pr-6">
            <span className="roman rise">I.</span>

            <h1 className="mt-6 font-display text-[44px] sm:text-[58px] md:text-[76px] lg:text-[88px] leading-[0.96] text-ink rise-1">
              <span className="block">{t('hero.tagline.line1')}</span>
              <span className="block">{t('hero.tagline.line2')}</span>
              <span className="block italic font-light text-copper-deep">{t('hero.tagline.line3')}</span>
            </h1>

            <p className="mt-8 max-w-[42ch] text-base md:text-lg text-ink-soft leading-relaxed rise-2">
              {t('hero.lede')}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5 rise-3">
              <button type="button" onClick={onBook} className="btn-copper">
                {t('hero.cta.book')}
                <ArrowRight size={14} strokeWidth={1.6} />
              </button>
              <a href="#behandelingen" className="btn-line">
                {t('hero.cta.see')}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 rise-2">
            <figure className="relative aspect-[4/5] overflow-hidden bg-paper-deep">
              <img
                src="/work/hero-portrait.webp"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                fetchPriority="high"
                loading="eager"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 ring-1 ring-ink/10 pointer-events-none" />
              <figcaption className="absolute bottom-4 left-4 text-[10px] tracking-[0.32em] uppercase text-paper/85 mix-blend-difference">
                Den Haag · Orveltestraat
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      <div className="rule mx-auto max-w-[1280px]" aria-hidden="true" />
    </section>
  );
}
