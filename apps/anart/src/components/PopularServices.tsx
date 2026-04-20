import { formatPrice } from '../data/services';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

type PopularItem = {
  icon: string;
  nameNl: string; nameEn: string; namePl: string;
  descNl: string; descEn: string; descPl: string;
  price: number;
  durationMin: number;
};

const popular: PopularItem[] = [
  {
    icon: '✨',
    nameNl: 'BIAB manicure',      nameEn: 'BIAB manicure',      namePl: 'Manicure BIAB',
    descNl: 'Builder in a Bottle — versterkt je natuurlijke nagel terwijl je kleur draagt.',
    descEn: 'Builder in a Bottle — strengthens your natural nail while wearing colour.',
    descPl: 'Builder in a Bottle — wzmacnia naturalną płytkę przy zachowaniu koloru.',
    price: 47.5, durationMin: 60,
  },
  {
    icon: '💅',
    nameNl: 'Gel extensions',     nameEn: 'Gel extensions',     namePl: 'Przedłużanie żelem',
    descNl: 'Perfecte lengte en vorm, direct resultaat voor elke gelegenheid.',
    descEn: 'Perfect length and shape, immediate result for any occasion.',
    descPl: 'Idealna długość i kształt, natychmiastowy efekt na każdą okazję.',
    price: 60, durationMin: 120,
  },
  {
    icon: '👁️',
    nameNl: 'Wimperextensions',   nameEn: 'Lash extensions',    namePl: 'Przedłużanie rzęs',
    descNl: 'Volume en lengte voor elke dag — naturel tot dramatisch.',
    descEn: 'Volume and length for every day — natural to dramatic.',
    descPl: 'Objętość i długość na każdy dzień — od naturalnych do dramatycznych.',
    price: 55, durationMin: 120,
  },
  {
    icon: '🌿',
    nameNl: 'Kobido massage',     nameEn: 'Kobido massage',     namePl: 'Masaż Kobido',
    descNl: 'Natuurlijke facelift — zichtbaar resultaat na één behandeling.',
    descEn: 'Natural facelift — visible results after one treatment.',
    descPl: 'Naturalny lifting twarzy — widoczny efekt po jednym zabiegu.',
    price: 50, durationMin: 60,
  },
  {
    icon: '🦶',
    nameNl: 'Pedicure met gellak', nameEn: 'Pedicure with gel', namePl: 'Pedicure z hybrydą',
    descNl: 'Volledige voetbehandeling inclusief gellak voor weken lang mooie nagels.',
    descEn: 'Full foot treatment including gel polish for weeks of beautiful nails.',
    descPl: 'Pełny zabieg pedicure z hybrydą — piękne paznokcie na tygodnie.',
    price: 55, durationMin: 85,
  },
];

export default function PopularServices({ lang, t }: Props) {
  function name(item: PopularItem) {
    if (lang === 'en') return item.nameEn;
    if (lang === 'pl') return item.namePl;
    return item.nameNl;
  }
  function desc(item: PopularItem) {
    if (lang === 'en') return item.descEn;
    if (lang === 'pl') return item.descPl;
    return item.descNl;
  }

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <span className="kicker">{t('popular.kicker')}</span>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">{t('popular.title')}</h2>
          </div>
          <a href="#behandelingen" className="hidden sm:inline text-sm text-gold hover:underline shrink-0">
            {t('popular.all')} →
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {popular.map(item => (
            <div key={item.nameNl} className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="mt-2 font-serif text-xl leading-tight">{name(item)}</h3>
                  <p className="mt-1 text-xs text-espresso/55 leading-relaxed">{desc(item)}</p>
                </div>
              </div>
              <div className="mt-auto pt-3 border-t border-espresso/5">
                <p className="font-serif text-xl text-espresso">{formatPrice(item.price)}</p>
                <p className="text-xs text-espresso/45">{item.durationMin} {t('services.min')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
