import { ArrowRight, Sparkles } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Hero({ t, onBook }: Props) {
  const title = t('hero.title');

  return (
    <section id="top" className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <img
          src="/hero.webp"
          alt=""
          className="w-full h-full object-cover object-center opacity-85"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.35) 35%, rgba(10,10,10,0.85) 100%)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-28 md:pt-36 md:pb-48 lg:pt-44 lg:pb-56">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-champagne-soft font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
            <Sparkles size={12} className="text-champagne-soft" />
            {t('hero.kicker')}
          </span>

          <h1 className="mt-6 font-display text-[2.7rem] leading-[1.02] sm:text-6xl md:text-7xl text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)] whitespace-pre-line">
            {title}
          </h1>

          <p className="mt-6 text-white/90 text-base md:text-lg leading-relaxed max-w-xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.55)]">
            {t('hero.sub')}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button onClick={onBook} className="btn-champagne">
              {t('hero.ctaBook')}
              <ArrowRight size={16} />
            </button>
            <a href="#werk" className="btn-outline-light">
              {t('hero.ctaSee')}
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 text-white/75 text-[10.5px] tracking-[0.28em] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]">
            <span>5,0 ★ Google</span>
            <span className="h-px w-8 bg-white/30" />
            <span>Urban Nails Diamond</span>
            <span className="h-px w-8 bg-white/30" />
            <span>#LASHTAG</span>
          </div>
        </div>
      </div>

      <a
        href="#over"
        aria-label="Scroll"
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center text-white/60 hover:text-white"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] mb-2">scroll</span>
        <span className="block w-px h-10 bg-current" />
      </a>
    </section>
  );
}
