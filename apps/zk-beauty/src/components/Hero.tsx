import { ArrowUpRight } from 'lucide-react';
import { contact } from '../data/contact';

type Props = { t: (k: string) => string };

export default function Hero({ t }: Props) {
  const title = t('hero.title');

  return (
    <section id="top" className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <img
          src="/hero.webp"
          alt=""
          aria-hidden
          className="w-full h-full object-cover opacity-70"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/50 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/0 to-ink/70" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-24 pb-32 md:pt-36 md:pb-44 lg:pt-44 lg:pb-56">
        <div className="max-w-2xl">
          <span className="gold-rule text-gold-soft">
            {t('hero.kicker')}
          </span>
          <h1 className="mt-6 font-display text-[3rem] leading-[0.95] sm:text-7xl md:text-[5.5rem] lg:text-[6.5rem] text-ivory whitespace-pre-line drop-shadow-[0_2px_18px_rgba(0,0,0,0.4)]">
            {title}
          </h1>
          <p className="mt-7 text-ivory/85 text-base md:text-lg leading-relaxed max-w-xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
            {t('hero.sub')}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={contact.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
            >
              {t('hero.ctaBook')}
              <ArrowUpRight size={14} />
            </a>
            <a
              href="#werk"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-medium tracking-[0.18em] uppercase text-ivory/85 hover:text-ivory border border-ivory/25 hover:border-ivory/55 transition-colors"
            >
              {t('hero.ctaWork')}
            </a>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-5 gap-y-3 text-[11px] tracking-[0.28em] uppercase text-ivory/65">
            <span>Lashes</span>
            <span className="h-px w-6 bg-ivory/30" />
            <span>Brows</span>
            <span className="h-px w-6 bg-ivory/30" />
            <span>Hair</span>
            <span className="h-px w-6 bg-ivory/30" />
            <span>Teeth Whitening</span>
          </div>
        </div>
      </div>
    </section>
  );
}
