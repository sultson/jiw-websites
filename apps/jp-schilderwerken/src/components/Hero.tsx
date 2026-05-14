import { Phone, ArrowRight, BadgeCheck } from 'lucide-react';
import { hero, business, heroImage } from '../content';
import { useOfferte } from '../contexts/OfferteContext';

const chips = [
  'Schildersschool niveau 3',
  'Gratis kennismaking',
  `Werkgebied ${business.address.city} e.o.`,
];

export default function Hero() {
  const { open: openOfferte } = useOfferte();
  return (
    <section
      id="top"
      className="relative bg-bone overflow-hidden pt-24 md:pt-32 pb-16 md:pb-24 md:min-h-[86vh] flex items-center"
    >
      {/* Brand orange blob for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-saffron opacity-15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 -left-32 h-72 w-72 rounded-full bg-saffron opacity-10 blur-3xl"
      />

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
          {/* Text column */}
          <div className="md:col-span-7">
            <p className="eyebrow mb-5">{hero.eyebrow}</p>

            <h1 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-tight text-ink">
              {hero.titleStart}
              <span className="italic text-saffron-deep">{hero.titleEm}</span>
              {hero.titleEnd}
            </h1>

            <p className="mt-6 text-lg md:text-xl text-stone max-w-xl leading-relaxed">
              {hero.sub}
            </p>

            {/* CTAs */}
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
                className="hidden sm:inline-flex font-semibold text-ink hover:text-saffron-deep transition-colors"
              >
                {business.phone.display}
              </a>
            </div>

            {/* Chips */}
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {chips.map((chip) => (
                <li
                  key={chip}
                  className="inline-flex items-center gap-2 text-sm font-medium text-ink"
                >
                  <BadgeCheck size={18} className="text-saffron-deep" />
                  {chip}
                </li>
              ))}
            </ul>
          </div>

          {/* Image column */}
          <div className="md:col-span-5">
            <div className="relative">
              {/* Color-block behind */}
              <div
                aria-hidden="true"
                className="absolute -bottom-5 -right-5 md:-bottom-6 md:-right-6 w-3/4 h-3/4 rounded-2xl bg-saffron"
              />
              <div
                aria-hidden="true"
                className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl bg-ink hidden md:block"
              />

              <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_60px_-30px_rgba(26,26,26,0.45)]">
                <img
                  src={heroImage}
                  alt="JP Schilderwerken — onderweg in Houten"
                  className="w-full h-full object-cover aspect-[3/4]"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
