import { ArrowRight, ChevronDown } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Hero({ t, onBook }: Props) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/photo-1.webp"
          alt=""
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/25 via-espresso/40 to-espresso/75" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-24 md:pt-28 md:pb-40 lg:pt-36 lg:pb-48">
        <div className="max-w-2xl">
          <div className="relative inline-block max-w-full">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-2 -inset-y-2 md:-inset-x-3 md:-inset-y-3 -z-0"
              style={{
                backdropFilter: 'blur(3px)',
                WebkitBackdropFilter: 'blur(3px)',
                maskImage:
                  'radial-gradient(ellipse 75% 70% at 30% 50%, black 0%, rgba(0,0,0,0.5) 55%, transparent 90%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 75% 70% at 30% 50%, black 0%, rgba(0,0,0,0.5) 55%, transparent 90%)',
              }}
            />
            <div className="relative">
              <span className="inline-block text-[11px] uppercase tracking-[0.28em] text-gold-soft font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
                {t('hero.kicker')}
              </span>
              <h1 className="mt-5 font-serif text-[2.25rem] leading-[1.05] sm:text-6xl md:text-7xl text-cream drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">
                {t('hero.title')}
              </h1>
              <p className="mt-6 text-cream/90 text-base md:text-lg leading-relaxed max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]">
                {t('hero.sub')}
              </p>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <button onClick={onBook} className="btn-gold">
              {t('hero.ctaBook')}
              <ArrowRight size={16} />
            </button>
            <a href="#behandelingen" className="inline-flex items-center justify-center gap-2 border border-cream/30 text-cream px-6 py-3 rounded-full text-sm font-medium tracking-wide hover:bg-cream/10" style={{ minHeight: 44 }}>
              {t('hero.ctaMore')}
              <ChevronDown size={16} />
            </a>
          </div>

          <div className="mt-10 flex items-center gap-5 text-cream/80 text-xs tracking-widest uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            <span>4,9 ★ · Google</span>
            <span className="h-px w-8 bg-cream/30" />
            <span>Amsterdam-West</span>
          </div>
        </div>
      </div>
    </section>
  );
}
