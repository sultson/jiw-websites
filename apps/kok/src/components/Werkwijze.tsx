type Props = { t: (k: string) => string };

const steps = ['s1', 's2', 's3', 's4'];

export default function Werkwijze({ t }: Props) {
  return (
    <section id="werkwijze" className="py-20 sm:py-24 lg:py-32">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          <div className="lg:col-span-7">
            <span className="kicker">{t('wk.kicker')}</span>
            <h2 className="mt-4 font-bold tracking-[-0.025em] leading-[1.05] max-w-2xl"
                style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              {t('wk.title')}
            </h2>
          </div>
          <p className="lg:col-span-4 lg:col-start-9 text-ink/75 leading-relaxed">
            {t('wk.intro')}
          </p>
        </div>

        <ol className="mt-14 lg:mt-20 space-y-0">
          {steps.map((s, idx) => (
            <li
              key={s}
              className="grid grid-cols-1 lg:grid-cols-12 gap-y-3 gap-x-10 py-8 lg:py-10 border-t border-ink/15 last:border-b last:border-b-ink/15"
            >
              <div className="lg:col-span-3 flex items-baseline gap-4">
                <span
                  className="font-display font-extrabold leading-none tracking-[-0.04em] text-ochre-deep"
                  style={{ fontSize: 'clamp(56px, 7vw, 96px)' }}
                >
                  {t(`wk.${s}.label`)}
                </span>
              </div>
              <h3 className="lg:col-span-3 font-display font-bold tracking-[-0.02em] leading-tight self-center"
                  style={{ fontSize: 'clamp(20px, 2.4vw, 28px)' }}>
                {t(`wk.${s}.title`)}
              </h3>
              <p className="lg:col-span-6 text-ink/75 leading-relaxed self-center max-w-2xl">
                {t(`wk.${s}.body`)}
              </p>
              {/* invisible spacer to maintain grid even on last */}
              {idx === -1 && null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
