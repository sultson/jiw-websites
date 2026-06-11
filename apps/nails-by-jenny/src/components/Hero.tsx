import { Phone, MessageCircle } from 'lucide-react';
import { TEL_URL, WA_URL } from '../data/contact';

type Props = { t: (k: string) => string };

export default function Hero({ t }: Props) {
  const title = t('hero.title');

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-espresso">
        <img
          src="/hero.webp"
          alt=""
          className="w-full h-full object-cover opacity-55"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/15 via-espresso/50 to-espresso/88" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-28 md:pt-32 md:pb-44 lg:pt-40 lg:pb-52">
        <div className="max-w-2xl">
          <span className="inline-block text-[11px] uppercase tracking-[0.28em] text-gold-soft font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
            {t('hero.kicker')}
          </span>
          <h1 className="mt-5 font-serif text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl text-cream drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] whitespace-pre-line">
            {title}
          </h1>
          <p className="mt-6 text-cream/90 text-base md:text-lg leading-relaxed max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            {t('hero.sub')}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href={TEL_URL} className="btn-gold">
              <Phone size={16} />
              {t('hero.ctaCall')}
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="btn-outline-light">
              <MessageCircle size={16} />
              {t('hero.ctaWa')}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 text-cream/75 text-xs tracking-widest uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            <span>{t('hero.m1')}</span>
            <span className="h-px w-6 bg-cream/30" />
            <span>{t('hero.m2')}</span>
            <span className="h-px w-6 bg-cream/30" />
            <span>{t('hero.m3')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
