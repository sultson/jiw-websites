import { ArrowRight } from 'lucide-react';
import { SITE } from '../lib/site';

type Props = { t: (k: string) => string; onOpen: (subject?: string) => void };

export default function Hero({ t, onOpen }: Props) {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Edge-to-edge hero image */}
      <div className="absolute inset-0" aria-hidden>
        <img
          src="/img/hero-main.webp"
          alt=""
          className="w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/85 to-canvas/20 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas/70 via-transparent to-transparent" />
      </div>

      <div className="shell-wide relative">
        <div className="max-w-xl py-20 sm:py-28 lg:py-36">
          <span className="kicker">{t('hero.eyebrow')}</span>
          <h1 className="mt-5 display-xl text-ink">
            {t('hero.titleA')}{' '}
            <span className="serif-italic text-terra">{t('hero.titleB')}</span>
          </h1>
          <p className="mt-6 text-[18px] leading-relaxed text-ink-soft max-w-lg">{t('hero.intro')}</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#opleidingen" className="btn-terra">
              {t('hero.ctaPrimary')}
              <ArrowRight size={17} strokeWidth={2.5} />
            </a>
            <button type="button" onClick={() => onOpen('behandeling')} className="btn-outline">
              {t('hero.ctaSecondary')}
            </button>
          </div>
        </div>
      </div>

      <span className="sr-only">{SITE.name}</span>
    </section>
  );
}
