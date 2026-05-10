type Props = { t: (k: string) => string };

const steps = [
  { id: 's1', mark: 'I.' },
  { id: 's2', mark: 'II.' },
  { id: 's3', mark: 'III.' },
  { id: 's4', mark: 'IV.' },
];

export default function Method({ t }: Props) {
  return (
    <section id="werkwijze" className="bg-paper-soft section-pad">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14 md:mb-16">
          <div className="lg:col-span-7">
            <span className="roman">II.</span>
            <span className="kicker block mt-3">{t('method.kicker')}</span>
            <h2 className="mt-5 text-[36px] md:text-[52px] leading-[1.02]">
              {t('method.title')}
            </h2>
          </div>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink-line">
          {steps.map(s => (
            <li key={s.id} className="bg-paper-soft p-6 md:p-8">
              <div className="flex items-baseline justify-between border-b border-ink-line pb-4 mb-5">
                <span className="font-display text-[36px] md:text-[44px] text-copper-deep leading-none italic font-light">
                  {s.mark}
                </span>
              </div>
              <h3 className="font-display text-[22px] md:text-[26px] leading-tight">
                {t(`method.${s.id}.name`)}
              </h3>
              <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                {t(`method.${s.id}.body`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
