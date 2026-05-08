type Props = { t: (k: string) => string };

const pillars: Array<{ titleKey: string; bodyKey: string }> = [
  { titleKey: 'usp.craft',  bodyKey: 'usp.craftSub' },
  { titleKey: 'usp.spray',  bodyKey: 'usp.spraySub' },
  { titleKey: 'usp.honest', bodyKey: 'usp.honestSub' },
];

export default function Pillars({ t }: Props) {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="kicker">{t('usp.kicker')}</span>
          <h2 className="mt-4 font-bold tracking-[-0.025em] leading-[1.05]"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
            {t('usp.title')}
          </h2>
        </div>

        {/* Three type columns separated by hairlines. Not cards. */}
        <div className="mt-14 grid md:grid-cols-3 md:divide-x md:divide-ink/15 border-y border-ink/15">
          {pillars.map(({ titleKey, bodyKey }) => (
            <article key={titleKey} className="py-10 md:px-8 md:first:pl-0 md:last:pr-0 border-b border-ink/15 md:border-b-0 last:border-b-0">
              <h3 className="font-display font-bold tracking-[-0.02em] leading-tight"
                  style={{ fontSize: 'clamp(24px, 3vw, 32px)' }}>
                {t(titleKey)}
              </h3>
              <p className="mt-4 text-ink/75 leading-relaxed max-w-md">
                {t(bodyKey)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
