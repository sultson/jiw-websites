import { Hand, Footprints, Palette, Flower2, ArrowRight, Info } from 'lucide-react';
import { serviceCategories } from '../data/services';

type Props = { t: (k: string) => string; onBook: () => void };

const iconMap = {
  hand:       Hand,
  footprints: Footprints,
  palette:    Palette,
  flower:     Flower2,
};

export default function Services({ t, onBook }: Props) {
  return (
    <section id="services" className="py-20 md:py-28 bg-cream-soft">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12 md:mb-14">
          <span className="kicker">{t('services.kicker')}</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">{t('services.title')}</h2>
          <p className="mt-4 text-ink-soft text-sm md:text-base max-w-xl mx-auto">{t('services.sub')}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
          {serviceCategories.map(cat => {
            const Icon = iconMap[cat.icon];
            return (
              <article
                key={cat.id}
                className="group card overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-sand">
                  <img
                    src={cat.image}
                    alt={cat.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
                  <div className="absolute top-4 left-4 w-11 h-11 rounded-full bg-cream/90 backdrop-blur flex items-center justify-center text-rose-deep shadow">
                    <Icon size={19} />
                  </div>
                  <h3 className="absolute bottom-3 left-5 font-display text-3xl text-cream drop-shadow">
                    {t(cat.titleKey)}
                  </h3>
                </div>

                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <p className="text-sm text-ink-soft leading-relaxed">{t(cat.bodyKey)}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {cat.itemKeys.map(k => (
                      <li
                        key={k}
                        className="text-[11px] tracking-wide px-2.5 py-1 rounded-full bg-sand-soft text-ink-soft border border-ink/8"
                      >
                        {t(k)}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={onBook}
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.16em] uppercase text-rose-deep hover:text-ink self-start"
                  >
                    {t('services.book')} <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-ink-mute">
          <Info size={14} className="shrink-0" />
          {t('services.priceNote')}
        </p>
      </div>
    </section>
  );
}
