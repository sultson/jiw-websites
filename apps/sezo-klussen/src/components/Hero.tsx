import { Star, Phone, ArrowRight, BadgeCheck } from 'lucide-react';
import { site } from '../data/site';
import { useOfferte } from '../contexts/OfferteContext';

const chips = [
  `${site.yearsActive}+ jaar ervaring`,
  'Met garantie',
  'Snelle reactie',
];

function Stars({ size = 16 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className="text-gold"
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
      className="relative bg-bone overflow-hidden pt-28 md:pt-36 pb-16 md:pb-24 md:min-h-[88vh] flex items-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-gold opacity-20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 -left-32 h-72 w-72 rounded-full bg-gold opacity-10 blur-3xl"
      />

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
          <div className="md:col-span-7">
            <p className="eyebrow mb-5">Klussenbedrijf in Rotterdam</p>

            <h1 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-tight text-ink">
              Vakwerk.{' '}
              <em className="not-italic">
                <span className="italic text-gold-deep">Strak resultaat.</span>
              </em>{' '}
              Goed bereikbaar.
            </h1>

            <p className="mt-6 text-lg md:text-xl text-stone max-w-xl leading-relaxed">
              Stucwerk, schilderwerk, tegelwerk en renovaties in Rotterdam. Van kleine klus tot
              complete badkamer.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" onClick={openOfferte} className="btn btn-primary">
                Offerte aanvragen
                <ArrowRight size={18} />
              </button>
              <a href={`tel:${site.phoneRaw}`} className="btn btn-ghost">
                <Phone size={18} />
                Bel direct
              </a>
              <a
                href={`tel:${site.phoneRaw}`}
                className="hidden sm:inline-flex font-semibold text-ink hover:text-gold-deep transition-colors"
              >
                {site.phone}
              </a>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-stone">
              <Stars size={16} />
              <span className="font-semibold text-ink">{site.rating}</span>
              <span className="text-line">|</span>
              <span>
                {site.reviewCount} reviews op {site.reviewSource}
              </span>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {chips.map((chip) => (
                <li
                  key={chip}
                  className="inline-flex items-center gap-2 text-sm font-medium text-ink"
                >
                  <BadgeCheck size={18} className="text-gold-deep" />
                  {chip}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-5">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -bottom-5 -right-5 md:-bottom-6 md:-right-6 w-3/4 h-3/4 rounded-2xl bg-gold"
              />
              <div
                aria-hidden="true"
                className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl bg-ink hidden md:block"
              />

              <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_60px_-30px_rgba(20,24,29,0.45)]">
                <img
                  src="/work-08.webp"
                  alt="Recent uitgevoerde badkamerrenovatie door Sezo Klussen"
                  className="w-full h-full object-cover aspect-[3/4]"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <div className="absolute -bottom-6 -left-4 md:-left-8 bg-paper border border-line rounded-xl px-4 py-3 shadow-[0_20px_40px_-20px_rgba(20,24,29,0.35)]">
                <div className="flex items-center gap-2">
                  <Stars size={14} />
                </div>
                <div className="mt-1 text-sm font-semibold text-ink">
                  {site.rating} / 5
                  <span className="mx-1.5 text-line">•</span>
                  <span className="font-normal text-stone">
                    {site.reviewCount} reviews
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
