import type { Route } from '../hooks/useRoute';
import CalButton from './CalButton';

type Props = {
  t: (k: string) => string;
  go: (r: Route) => void;
};

export default function Hero({ t, go }: Props) {
  const title = t('hero.title');
  const lines = title.split('\n');

  return (
    <section className="relative w-full overflow-hidden h-[100svh] min-h-[640px] max-h-[920px]">
      <picture className="absolute inset-0">
        <source media="(max-width: 768px)" srcSet="/hero-mobile.webp?v=20260520" />
        <img
          src="/hero-desktop.webp?v=20260520-2"
          alt=""
          className="w-full h-full object-cover"
          style={{ objectPosition: '50% 50%' }}
          loading="eager"
          fetchPriority="high"
          width={1672}
          height={941}
        />
      </picture>

      {/* Mobile: full top-to-bottom dark fade so headline at the bottom and nav at top both stay legible */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          background:
            'linear-gradient(to bottom, rgba(42,34,32,0.55) 0%, rgba(42,34,32,0.35) 35%, rgba(42,34,32,0.85) 100%)',
        }}
        aria-hidden
      />
      {/* Desktop: stronger left-to-right scrim plus a vertical floor for the headline */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            'linear-gradient(to right, rgba(42,34,32,0.78) 0%, rgba(42,34,32,0.45) 45%, rgba(42,34,32,0.10) 80%)',
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            'linear-gradient(to top, rgba(42,34,32,0.55) 0%, rgba(42,34,32,0) 45%)',
        }}
        aria-hidden
      />

      <div className="relative h-full flex flex-col justify-end pb-12 sm:pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl w-full px-6 lg:px-10">
          <div className="max-w-3xl">
            <h1 className="display-xl text-bone rise rise-2 drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">
              {lines.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
              <span className="block italic font-display text-sand-soft mt-1 text-[0.55em] tracking-wide">
                {t('hero.title.script')}
              </span>
            </h1>
            <p className="mt-6 lg:mt-8 text-bone text-base lg:text-lg max-w-xl rise rise-3 font-medium drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              {t('hero.lead')}
            </p>
            <div className="mt-8 lg:mt-10 flex flex-wrap items-center gap-3 sm:gap-4 rise rise-4">
              <CalButton className="inline-flex items-center justify-center gap-2 bg-bone text-coffee px-7 py-3.5 rounded-full text-[12px] uppercase tracking-[0.22em] font-semibold hover:bg-sand-soft transition min-h-[48px] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]">
                {t('hero.cta')}
              </CalButton>
              <button
                type="button"
                onClick={() => go('services')}
                className="inline-flex items-center justify-center gap-2 text-bone px-2 py-3 text-[12px] uppercase tracking-[0.22em] font-semibold underline-offset-4 hover:underline transition"
              >
                {t('hero.cta.secondary')} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
