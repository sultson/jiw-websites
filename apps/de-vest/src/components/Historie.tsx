import { generations } from '../data/history';

type Props = { t: (key: string) => string };

export default function Historie({ t }: Props) {
  return (
    <section id="historie" className="bg-paper-deep border-y border-ink/8 py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <header className="grid lg:grid-cols-12 gap-x-12 gap-y-6 mb-16 lg:mb-24">
          <div className="lg:col-span-5">
            <span className="kicker">{t('history.kicker')}</span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display leading-[1.08]">
              {t('history.title')}
            </h2>
          </div>
          <p className="lg:col-span-6 lg:col-start-7 text-base sm:text-lg text-ink-soft leading-relaxed self-end max-w-[58ch]">
            {t('history.lede')}
          </p>
        </header>

        <div className="relative">
          {/* Vertical hairline connecting generations on lg */}
          <div
            className="hidden lg:block absolute left-[calc(41.66%+1rem)] top-2 bottom-12 w-px bg-ink/12"
            aria-hidden
          />
          <ol className="space-y-20 lg:space-y-28">
            {generations.map((gen, i) => (
              <li
                key={gen.number}
                className="grid lg:grid-cols-12 gap-x-12 gap-y-4 items-start"
              >
                <div className="lg:col-span-5 flex flex-col">
                  <span className="gen-mark mb-3">{t(gen.markKey)}</span>
                  <span
                    className="font-display font-bold text-[4rem] sm:text-[5rem] lg:text-[7rem] leading-[0.95] text-ink"
                    style={{ fontVariationSettings: '"opsz" 144, "SOFT" 0' }}
                  >
                    {t(gen.yearKey)}
                  </span>
                </div>
                <div className="lg:col-span-6 lg:col-start-7 lg:pt-6">
                  <h3 className="font-display text-2xl sm:text-3xl text-ink mb-4">
                    {t(gen.nameKey)}
                  </h3>
                  <p className="text-base sm:text-lg text-ink-soft leading-relaxed max-w-[60ch]">
                    {t(gen.bodyKey)}
                  </p>
                  {/* small step counter */}
                  <span className="block mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-mute">
                    {String(i + 1).padStart(2, '0')} / 03
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
