import { ArrowRight, ExternalLink } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Hero({ t }: Props) {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Achtergrondafbeelding — vervang /hero.webp door je eigen foto */}
      <div className="absolute inset-0 bg-espresso">
        <img
          src="/hero.webp"
          alt=""
          className="w-full h-full object-cover opacity-60"
          fetchPriority="high"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/20 via-espresso/40 to-espresso/80" />
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
            <a
              href="https://anart-studio.salonized.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
            >
              {t('hero.ctaBook')}
              <ArrowRight size={16} />
            </a>
            <a
              href="https://www.treatwell.nl/salon/anart-studio/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-cream/30 text-cream px-6 py-3 rounded-full text-sm font-medium tracking-wide hover:bg-cream/10"
              style={{ minHeight: 44 }}
            >
              <ExternalLink size={16} />
              {t('hero.ctaTreat')}
            </a>
          </div>

          <div className="mt-10 flex items-center gap-5 text-cream/80 text-xs tracking-widest uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            <span>5 ★ · Treatwell</span>
            <span className="h-px w-8 bg-cream/30" />
            <span>Kaatsheuvel</span>
          </div>
        </div>
      </div>
    </section>
  );
}
