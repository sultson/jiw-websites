import { behangBand } from '../data/work';

type Props = { t: (key: string) => string };

export default function Behang({ t }: Props) {
  return (
    <section className="bg-ink text-paper py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <header className="max-w-[60ch] mb-10 lg:mb-14">
          <span className="kicker text-orange-soft" style={{ color: 'var(--color-orange-soft)' }}>
            {t('behang.kicker')}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display leading-[1.08] text-paper">
            {t('behang.title')}
          </h2>
          <p className="mt-5 text-base sm:text-lg text-paper/70 leading-relaxed">
            {t('behang.lede')}
          </p>
        </header>
      </div>

      {/* Edge-to-edge band, 4-up at lg, 2-up tablet, horizontal scroll on mobile */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-4 lg:gap-3 lg:max-w-[1240px] lg:mx-auto">
          {behangBand.map((b, i) => (
            <figure
              key={b.src}
              className="flex-shrink-0 w-[78%] sm:w-[42%] lg:w-auto bg-ink-soft overflow-hidden"
            >
              <div className="aspect-[3/4] lg:aspect-[4/5] relative">
                <img
                  src={b.src}
                  alt={b.alt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="px-3 py-3 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-paper/60">
                <span>Behang · {String(i + 1).padStart(2, '0')}</span>
                <span>De Vest</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 mt-10 lg:mt-12 grid lg:grid-cols-12 gap-6">
        <ul className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-3 gap-x-6 text-paper/85">
          {['Arte', 'Elitis', 'Casamance', 'Vescom', 'Koroseal'].map((b) => (
            <li
              key={b}
              className="font-display text-base sm:text-lg tracking-tight"
              style={{ fontVariationSettings: '"opsz" 96, "SOFT" 0' }}
            >
              {b}
            </li>
          ))}
        </ul>
        <div className="lg:col-span-4 flex lg:justify-end items-end">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/45">
            № III · de_vest_schilderwerken
          </span>
        </div>
      </div>
    </section>
  );
}
