type Props = { t: (k: string) => string };

export default function Hendrien({ t }: Props) {
  return (
    <section id="over" className="section-pad-lg">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <figure className="lg:col-span-5">
            <div className="aspect-[4/5] bg-paper-soft border border-ink-line relative overflow-hidden">
              <img
                src="/work/hendrien.webp"
                alt="Hendrien — Manly Clinic"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-[10px] tracking-[0.32em] uppercase text-white/85">
                <span>est.</span>
                <span>Den Haag</span>
              </div>
              <div className="absolute top-6 left-6 text-[10px] tracking-[0.32em] uppercase text-white/85">
                MC.
              </div>
            </div>
            <figcaption className="mt-3 text-[11px] tracking-[0.28em] uppercase text-ink-mute">
              {t('about.tag')}
            </figcaption>
          </figure>

          <div className="lg:col-span-6 lg:col-start-7 lg:pt-8">
            <span className="roman">IV.</span>
            <span className="kicker block mt-3">{t('about.kicker')}</span>
            <h2 className="mt-5 text-[36px] md:text-[52px] leading-[1.04]">
              {t('about.title')}
            </h2>
            <div className="mt-8 space-y-5 text-base md:text-lg text-ink-soft leading-relaxed max-w-[52ch]">
              <p>{t('about.body1')}</p>
              <p>{t('about.body2')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
