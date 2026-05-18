import { Phone, Star, Check } from 'lucide-react';
import { useSite } from '../contexts/SiteContext';
import { useOfferte } from '../contexts/OfferteContext';
import { hero, heroChips, reviewsMeta, business } from '../content';

function Stars({ size = 16 }: { size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className="fill-orange text-orange" />
      ))}
    </div>
  );
}

export default function Hero() {
  const { t } = useSite();
  const { open } = useOfferte();

  return (
    <section
      id="top"
      className="relative flex min-h-[92vh] items-center overflow-hidden bg-ink pt-36 pb-20 md:pt-44 md:pb-28"
    >
      {/* Orange glow accents */}
      <div
        className="pointer-events-none absolute -top-40 -right-24 h-[30rem] w-[30rem] rounded-full bg-orange/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 -left-40 h-[26rem] w-[26rem] rounded-full bg-orange-deep/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-10">
          {/* Left */}
          <div className="md:col-span-7">
            <span className="eyebrow">{t(hero.eyebrow)}</span>

            <h1 className="mt-5 text-[2.65rem] leading-[1.04] font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              {t(hero.titleStart)}
              <span className="text-orange">{t(hero.titleEm)}</span>
              {t(hero.titleEnd)}
            </h1>

            <p className="mt-6 max-w-xl text-base text-bone-soft md:text-lg">{t(hero.sub)}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={open} className="btn btn-orange">
                {t(hero.ctaPrimary)}
              </button>
              <a href={business.phone.href} className="btn btn-outline">
                <Phone size={17} aria-hidden="true" />
                {t(hero.ctaSecondary)}
              </a>
            </div>

            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
              {heroChips.map((chip) => (
                <li key={chip.nl} className="flex items-center gap-2">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-orange"
                    aria-hidden="true"
                  >
                    <Check size={14} strokeWidth={3} className="text-bone" />
                  </span>
                  <span className="text-sm font-semibold text-bone-soft">{t(chip)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right */}
          <div className="md:col-span-5">
            <div className="relative">
              <div
                className="absolute -bottom-5 -right-5 h-40 w-40 rounded-xl bg-orange md:h-48 md:w-48"
                aria-hidden="true"
              />
              <div
                className="absolute -top-4 -left-4 h-20 w-20 diag-stripes opacity-80"
                aria-hidden="true"
              />

              <div className="relative overflow-hidden rounded-xl border border-line shadow-2xl shadow-black/50">
                <img
                  src={hero.image}
                  alt={t(hero.imageAlt)}
                  loading="eager"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>

              {/* Floating rating badge */}
              <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-xl border border-line bg-ink-3/95 px-4 py-3 shadow-xl shadow-black/40 backdrop-blur-sm md:-left-8">
                <span className="text-2xl font-extrabold text-bone">{reviewsMeta.score}</span>
                <span className="h-8 w-px bg-line" aria-hidden="true" />
                <div>
                  <Stars size={14} />
                  <p className="mt-1 text-xs text-mute">{t(reviewsMeta.source)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
