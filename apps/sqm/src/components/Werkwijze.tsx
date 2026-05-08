type Props = { t: (k: string) => string };

const steps = [
  { l: 'wk.s1.label', t: 'wk.s1.title', b: 'wk.s1.body' },
  { l: 'wk.s2.label', t: 'wk.s2.title', b: 'wk.s2.body' },
  { l: 'wk.s3.label', t: 'wk.s3.title', b: 'wk.s3.body' },
  { l: 'wk.s4.label', t: 'wk.s4.title', b: 'wk.s4.body' },
];

export default function Werkwijze({ t }: Props) {
  return (
    <section id="werkwijze" className="bg-cream-soft border-t border-b border-charcoal/8 relative">
      <div className="absolute inset-0 bg-blueprint opacity-30 pointer-events-none" aria-hidden />
      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-8 mb-12 lg:mb-16">
          <div className="lg:col-span-5">
            <span className="kicker">{t('wk.kicker')}</span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05]">
              {t('wk.title')}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 self-end">
            <p className="text-base sm:text-lg text-charcoal/75 leading-relaxed">{t('wk.intro')}</p>
          </div>
        </div>

        {/* connector line behind the steps */}
        <div className="relative">
          <div className="absolute left-0 right-0 top-12 h-px bg-charcoal/15 hidden lg:block" aria-hidden />

          <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
            {steps.map((s, i) => (
              <li key={s.l} className="flex flex-col relative">
                {/* numbered circle marker on the connector line */}
                <div className="hidden lg:flex items-center gap-3 mb-6 relative">
                  <span className="flex items-center justify-center w-7 h-7 bg-cream border border-orange text-orange font-display font-extrabold text-xs">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="h-px flex-1 bg-charcoal/15" />
                  <span className="font-mono text-[10px] tracking-[0.22em] text-charcoal/40 uppercase">step</span>
                </div>

                {/* mobile/tablet: keep label */}
                <span className="lg:hidden font-mono text-[11px] tracking-[0.22em] text-orange font-semibold">
                  {t(s.l)}
                </span>

                <span className="hidden lg:block font-mono text-[11px] tracking-[0.22em] text-orange font-semibold uppercase">
                  {t(s.l).split('·')[1]?.trim() || t(s.l)}
                </span>

                <h3 className="mt-2 text-xl font-extrabold tracking-tight text-charcoal-ink">
                  {t(s.t)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{t(s.b)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
