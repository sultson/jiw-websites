type Props = { t: (k: string) => string };

const items = [
  { titleKey: 'usp.discreet.title', bodyKey: 'usp.discreet.body' },
  { titleKey: 'usp.tech.title', bodyKey: 'usp.tech.body' },
  { titleKey: 'usp.hygiene.title', bodyKey: 'usp.hygiene.body' },
  { titleKey: 'usp.safe.title', bodyKey: 'usp.safe.body' },
];

export default function UspStrip({ t }: Props) {
  return (
    <section aria-label="Vertrouwensmerken">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <li
              key={it.titleKey}
              className={`py-8 md:py-10 ${
                i > 0 ? 'sm:border-l border-ink-line' : ''
              } ${i === 2 ? 'lg:border-l border-ink-line' : ''} sm:px-6 lg:px-8`}
            >
              <p className="font-display text-[22px] md:text-[26px] text-ink leading-tight">
                {t(it.titleKey)}
              </p>
              <p className="mt-2 text-sm text-ink-mute leading-relaxed max-w-[28ch]">
                {t(it.bodyKey)}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="rule mx-auto max-w-[1280px]" aria-hidden="true" />
    </section>
  );
}
