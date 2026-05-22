import { ArrowRight, ArrowDown } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Hero({ t, onBook }: Props) {
  const title = t('hero.title');

  return (
    <section id="top" className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <img
          src="/hero.webp"
          alt=""
          className="w-full h-full object-cover opacity-70"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/55 to-ink/92" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-20 pb-28 md:pt-32 md:pb-44 lg:pt-40 lg:pb-52">
        <div className="max-w-2xl">
          <span className="inline-block text-[11px] uppercase tracking-[0.32em] text-ivory/85 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
            {t('hero.kicker')}
          </span>
          <h1 className="mt-6 font-serif text-[2.4rem] leading-[1.06] sm:text-6xl md:text-7xl text-ivory drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)] whitespace-pre-line">
            {title}
          </h1>
          <p className="mt-7 text-ivory/85 text-base md:text-lg leading-relaxed max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            {t('hero.sub')}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              onClick={onBook}
              className="inline-flex items-center gap-2 bg-ivory text-ink px-7 py-3.5 rounded-full text-sm font-medium tracking-wide hover:bg-bone transition-colors"
            >
              {t('hero.ctaBook')}
              <ArrowRight size={16} />
            </button>
            <a
              href="#behandelingen"
              className="inline-flex items-center gap-2 border border-ivory/35 text-ivory px-7 py-3.5 rounded-full text-sm font-medium tracking-wide hover:bg-ivory/10 transition-colors"
            >
              {t('hero.ctaServices')}
              <ArrowDown size={16} />
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4 text-ivory/65 text-[11px] tracking-[0.22em] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            <span>{t('hero.tag1')}</span>
            <span className="h-px w-6 bg-ivory/30" />
            <span>{t('hero.tag2')}</span>
            <span className="h-px w-6 bg-ivory/30" />
            <span>{t('hero.tag3')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
