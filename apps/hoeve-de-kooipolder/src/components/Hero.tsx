import { MapPin, MessageCircle, Phone } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Hero({ t }: Props) {
  const titleLines = t('hero.title').split('\n');

  return (
    <section id="top" className="relative overflow-hidden min-h-[88dvh] flex items-end">
      <div className="absolute inset-0 bg-ink">
        <picture>
          <source media="(min-width: 768px)" srcSet="/hero-bg.webp" />
          <img
            src="/hero-bg-mobile.webp"
            alt=""
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-ink/30 to-ink/75" />
        <div className="absolute inset-0 bg-lilac-deep/15" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-8 pt-32 pb-16 md:pt-44 md:pb-24">
        <div className="max-w-3xl">
          <span className="inline-block text-[11px] uppercase tracking-[0.28em] text-lilac-mist font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
            {t('hero.kicker')}
          </span>

          <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.05] sm:text-5xl md:text-6xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
            {titleLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-6 text-white/90 text-base md:text-lg leading-relaxed max-w-xl drop-shadow-[0_1px_5px_rgba(0,0,0,0.5)]">
            {t('hero.sub')}
          </p>

          <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-4 py-2 text-sm text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            <MapPin size={15} className="shrink-0" />
            <span>Zeedijk 16, Dordrecht</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="tel:+31628577711" className="btn-lilac">
              <Phone size={16} />
              {t('hero.ctaCall')}
            </a>
            <a
              href="https://wa.me/31628577711"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/60 text-white px-6 py-3 rounded-full text-sm font-medium tracking-wide hover:bg-white/10 min-h-[44px]"
            >
              <MessageCircle size={16} />
              {t('hero.ctaApp')}
            </a>
          </div>

          <p className="mt-6 text-white/70 text-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            {t('hero.note')}
          </p>
        </div>
      </div>
    </section>
  );
}
