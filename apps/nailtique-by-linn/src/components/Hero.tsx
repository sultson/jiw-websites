import { Phone, MessageCircle } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Hero({ t }: Props) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-espresso">
        <img
          src="/hero.webp"
          alt=""
          className="w-full h-full object-cover object-center opacity-90"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(43,36,33,0.30) 0%, rgba(43,36,33,0.55) 50%, rgba(43,36,33,0.90) 100%)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-28 md:pt-32 md:pb-44 lg:pt-40 lg:pb-52">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold-soft font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-soft" />
            {t('hero.kicker')}
          </span>

          <h1 className="mt-6 font-serif text-[2.6rem] leading-[1.04] sm:text-6xl md:text-7xl text-cream drop-shadow-[0_1px_10px_rgba(0,0,0,0.55)] whitespace-pre-line">
            {t('hero.title')}
          </h1>

          <p className="mt-6 text-cream/90 text-base md:text-lg leading-relaxed max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]">
            {t('hero.sub')}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="tel:+31628428339" className="btn-gold">
              <Phone size={16} />
              {t('hero.ctaCall')}
            </a>
            <a
              href="https://wa.me/31628428339"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-cream/30 text-cream px-6 py-3 rounded-full text-sm font-medium tracking-wide hover:bg-cream/10"
              style={{ minHeight: 44 }}
            >
              <MessageCircle size={16} />
              {t('hero.ctaWa')}
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4 text-cream/75 text-xs tracking-[0.2em] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            <span>{t('hero.stat1')}</span>
            <span className="h-px w-7 bg-cream/30" />
            <span>{t('hero.stat2')}</span>
            <span className="h-px w-7 bg-cream/30" />
            <span>{t('hero.stat3')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
