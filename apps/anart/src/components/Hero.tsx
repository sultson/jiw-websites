import { ArrowRight } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Hero({ t, onBook }: Props) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-espresso">
        <img
          src="/salon_massagebed_handdoeken.webp"
          alt=""
          className="w-full h-full object-cover opacity-70"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/20 via-espresso/45 to-espresso/85" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-28 md:pt-32 md:pb-44 lg:pt-40 lg:pb-52">
        <div className="max-w-2xl">
          <span className="inline-block text-[11px] uppercase tracking-[0.28em] text-gold-soft font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
            {t('hero.kicker')}
          </span>
          <h1 className="mt-5 font-serif text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl text-cream drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
            {t('hero.title')}
          </h1>
          <p className="mt-6 text-cream/90 text-base md:text-lg leading-relaxed max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            {t('hero.sub')}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button onClick={onBook} className="btn-gold">
              {t('hero.ctaBook')}
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="mt-10 flex items-center gap-5 text-cream/80 text-xs tracking-widest uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            <span>5 ★ · Treatwell</span>
            <span className="h-px w-8 bg-cream/30" />
            <span>5 ★ · Google</span>
            <span className="h-px w-8 bg-cream/30" />
            <span>Kaatsheuvel</span>
          </div>
        </div>
      </div>
    </section>
  );
}
