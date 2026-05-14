import { Star, Phone, ArrowRight, BadgeCheck } from 'lucide-react';
import { hero, business } from '../content';
import { useOfferte } from '../contexts/OfferteContext';

const chips = [
  'Vaste prijs vooraf',
  'Garantie op het werk',
  'Strak afgewerkt',
];

function Stars({ size = 16 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className="text-geel"
          fill="currentColor"
          strokeWidth={0}
        />
      ))}
    </span>
  );
}

export default function Hero() {
  const { open: openOfferte } = useOfferte();
  return (
    <section
      id="top"
      className="relative bg-bone overflow-hidden pt-20 md:pt-28 pb-16 md:pb-24 md:min-h-[88vh] flex items-center"
    >
      {/* Subtle painterly blobs in brand colors */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-rood opacity-10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 -left-32 h-72 w-72 rounded-full bg-blauw opacity-10 blur-3xl"
      />

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
          {/* Text column */}
          <div className="md:col-span-7">
            <p className="eyebrow mb-5">{hero.eyebrow}</p>

            <h1 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-tight text-ink">
              {hero.titleStart}
              <em className="not-italic">
                <span className="italic text-rood">{hero.titleEm}</span>
              </em>
              {hero.titleEnd}
            </h1>

            <p className="mt-6 text-lg md:text-xl text-stone max-w-xl leading-relaxed">
              {hero.sub}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" onClick={openOfferte} className="btn btn-primary">
                {hero.ctaPrimary}
                <ArrowRight size={18} />
              </button>
              <a href={business.phone.href} className="btn btn-ghost">
                <Phone size={18} />
                {hero.ctaSecondary}
              </a>
              <a
                href={business.phone.href}
                className="hidden sm:inline-flex font-semibold text-ink hover:text-rood transition-colors"
              >
                {business.phone.display}
              </a>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-stone">
              <Stars size={16} />
              <span className="font-semibold text-ink">{business.reviewsScore}</span>
              <span className="text-line">|</span>
              <span>{business.reviewsCount > 0 ? `${business.reviewsCount} reviews` : 'Reviews op Trustoo'}</span>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {chips.map((chip) => (
                <li
                  key={chip}
                  className="inline-flex items-center gap-2 text-sm font-medium text-ink"
                >
                  <BadgeCheck size={18} className="text-rood" />
                  {chip}
                </li>
              ))}
            </ul>
          </div>

          {/* Image column */}
          <div className="md:col-span-5">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -bottom-5 -right-5 md:-bottom-6 md:-right-6 w-3/4 h-3/4 rounded-3xl bg-rood"
              />
              <div
                aria-hidden="true"
                className="absolute -top-4 -left-4 w-24 h-24 rounded-3xl bg-blauw hidden md:block"
              />

              <div className="relative rounded-3xl overflow-hidden bg-ink/5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] aspect-[3/4]">
                <img
                  src="/hero.webp"
                  alt="Schilder van Color's aan het werk in Rotterdam"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="absolute -bottom-6 -left-4 md:-left-8 bg-paper border border-line rounded-xl px-4 py-3 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.35)]">
                <div className="flex items-center gap-2">
                  <Stars size={14} />
                </div>
                <div className="mt-1 text-sm font-semibold text-ink">
                  {business.reviewsScore} / 10
                  <span className="mx-1.5 text-line">•</span>
                  <span className="font-normal text-stone">via Trustoo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
