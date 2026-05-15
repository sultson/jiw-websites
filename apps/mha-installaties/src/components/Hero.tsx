import { Phone, Star, Check } from 'lucide-react';
import { useOfferte } from '../contexts/OfferteContext';
import { business, hero, heroChips, reviewsMeta } from '../content';

function Stars({ size = 16 }: { size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className="fill-gold text-gold" />
      ))}
    </div>
  );
}

export default function Hero() {
  const { open } = useOfferte();

  return (
    <section
      id="top"
      className="relative flex min-h-[88vh] items-center overflow-hidden bg-ink pt-28 pb-20 md:pt-36 md:pb-28"
    >
      {/* Gold radial glow blobs */}
      <div
        className="pointer-events-none absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-gold/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 -left-32 h-[24rem] w-[24rem] rounded-full bg-gold-deep/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-10">
          {/* Left */}
          <div className="md:col-span-7">
            <span className="eyebrow">{hero.eyebrow}</span>

            <h1 className="mt-5 text-5xl font-bold tracking-tight md:text-7xl">
              {hero.titleStart}
              <span className="text-gradient-gold">{hero.titleEm}</span>
              {hero.titleEnd}
            </h1>

            <p className="mt-6 max-w-xl text-base text-bone-soft md:text-lg">{hero.sub}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={open} className="btn btn-gold">
                {hero.ctaPrimary}
              </button>
              <a href={business.phone.href} className="btn btn-outline">
                <Phone size={17} aria-hidden="true" />
                {hero.ctaSecondary}
              </a>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <Stars size={17} />
              <p className="text-sm text-bone-soft">
                <span className="font-semibold text-bone">{reviewsMeta.score}</span>
                {' · '}
                {reviewsMeta.count} Google-reviews
              </p>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {heroChips.map((chip) => (
                <li key={chip} className="flex items-center gap-2">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full gold-gradient"
                    aria-hidden="true"
                  >
                    <Check size={14} strokeWidth={3} className="text-ink" />
                  </span>
                  <span className="text-sm font-medium text-bone-soft">{chip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right */}
          <div className="md:col-span-5">
            <div className="relative">
              <div
                className="absolute -bottom-5 -right-5 h-40 w-40 rounded-2xl gold-gradient opacity-90 md:h-48 md:w-48"
                aria-hidden="true"
              />

              <div className="relative overflow-hidden rounded-2xl border border-line shadow-2xl shadow-black/50">
                <img
                  src={hero.image}
                  alt={hero.imageAlt}
                  loading="eager"
                  className="aspect-[4/5] w-full object-cover object-[38%_center]"
                />
              </div>

              {/* Floating rating badge */}
              <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-xl border border-line bg-ink-3/95 px-4 py-3 shadow-xl shadow-black/40 backdrop-blur-sm md:-left-8">
                <span className="text-2xl font-bold text-bone">{reviewsMeta.score}</span>
                <span className="h-8 w-px bg-line" aria-hidden="true" />
                <div>
                  <Stars size={14} />
                  <p className="mt-1 text-xs text-mute">{reviewsMeta.count} reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
