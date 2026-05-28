import { Phone, MessageCircle } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Hero({ t }: Props) {
  const title = t('hero.title');

  return (
    <section id="top" className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <picture>
          <source media="(min-width: 768px)" srcSet="/hero.webp" />
          <img
            src="/hero.webp"
            alt=""
            className="w-full h-full object-cover object-center"
            fetchPriority="high"
          />
        </picture>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(42,25,34,0.35) 0%, rgba(74,47,59,0.55) 45%, rgba(42,25,34,0.88) 100%)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-24 md:pt-32 md:pb-44 lg:pt-40 lg:pb-56">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] sm:tracking-[0.3em] text-champagne-soft font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne-soft" />
            {t('hero.kicker')}
          </span>

          <h1 className="mt-5 md:mt-6 font-serif text-[2.1rem] leading-[1.05] sm:text-5xl md:text-7xl text-cream drop-shadow-[0_1px_10px_rgba(0,0,0,0.6)] whitespace-pre-line">
            {title}
          </h1>

          <p className="mt-5 md:mt-6 text-cream/90 text-sm md:text-lg leading-relaxed max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]">
            {t('hero.sub')}
          </p>

          <div className="mt-7 md:mt-9 flex flex-wrap gap-3">
            <a href="tel:+31623800854" className="btn-rose">
              <Phone size={16} />
              {t('hero.ctaCall')}
            </a>
            <a
              href="https://wa.me/31623800854"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-light"
            >
              <MessageCircle size={16} />
              {t('hero.ctaWa')}
            </a>
          </div>

          <div className="mt-10 hidden md:flex flex-wrap items-center gap-x-5 gap-y-2 text-cream/75 text-[11px] tracking-[0.22em] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]">
            <span>5,0 ★ · Google</span>
            <span className="h-px w-8 bg-cream/30" />
            <span>Magnetic Ambassador</span>
            <span className="h-px w-8 bg-cream/30" />
            <span>Ter Apel</span>
          </div>
        </div>
      </div>
    </section>
  );
}
