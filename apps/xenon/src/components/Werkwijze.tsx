type Props = {
  t: (key: string) => string;
};

const steps = [
  { titleKey: 'method.step1.title', bodyKey: 'method.step1.body' },
  { titleKey: 'method.step2.title', bodyKey: 'method.step2.body' },
  { titleKey: 'method.step3.title', bodyKey: 'method.step3.body' },
  { titleKey: 'method.step4.title', bodyKey: 'method.step4.body' },
];

export default function Werkwijze({ t }: Props) {
  return (
    <section id="werkwijze" className="relative py-20 sm:py-28 lg:py-32 bg-night-soft border-t border-mist">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="kicker !text-xenon-bright">{t('method.kicker')}</span>
          <h2 className="mt-4 text-[30px] sm:text-[40px] lg:text-[48px] leading-[1.08] text-silver font-display">
            {t('method.title')}
          </h2>
        </div>

        <ol className="mt-12 sm:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-mist border border-mist">
          {steps.map((step, i) => (
            <li key={step.titleKey} className="bg-night-soft p-6 sm:p-7 relative">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[11px] text-xenon-bright tracking-[0.22em]">[</span>
                <span className="font-display text-silver text-[36px] sm:text-[44px] leading-none font-bold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-[11px] text-xenon-bright tracking-[0.22em]">]</span>
              </div>
              <h3 className="mt-5 font-display text-silver text-[18px] tracking-wide uppercase">
                {t(step.titleKey)}
              </h3>
              <p className="mt-3 text-[14px] text-steel/85 leading-relaxed">
                {t(step.bodyKey)}
              </p>
              {i < steps.length - 1 && (
                <span
                  className="hidden lg:block absolute top-8 right-0 w-6 h-px bg-xenon-bright/40 translate-x-3"
                  aria-hidden
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
