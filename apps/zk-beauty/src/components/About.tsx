type Props = { t: (k: string) => string };

export default function About({ t }: Props) {
  const tags = [
    t('about.tag1'),
    t('about.tag2'),
    t('about.tag3'),
    t('about.tag4'),
  ];

  return (
    <section id="over" className="py-20 md:py-32 bg-ivory-soft/60">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 grid md:grid-cols-12 gap-10 md:gap-16 items-center">
        <div className="md:col-span-7 order-2 md:order-1">
          <span className="gold-rule">{t('about.kicker')}</span>
          <h2 className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
            {t('about.title')}
          </h2>

          <p className="mt-7 font-serif text-lg md:text-xl text-ink-soft leading-relaxed max-w-prose">
            {t('about.body')}
          </p>
          <p className="mt-4 text-base text-ink-mute leading-relaxed max-w-prose">
            {t('about.body2')}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-[0.16em] uppercase bg-ivory text-ink-soft border border-ink/10"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-4 text-sm text-ink/70">
            <div className="h-px flex-1 bg-ink/15 max-w-16" />
            <span className="font-display italic text-xl tracking-wide">{t('about.signature')}</span>
            <div className="h-px flex-1 bg-ink/15 max-w-16" />
          </div>
        </div>

        <div className="md:col-span-5 order-1 md:order-2">
          <figure className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-ivory border border-gold/25 shadow-[0_24px_60px_-30px_rgba(26,24,22,0.35)] flex flex-col items-center justify-center px-6 text-center">
            <img
              src="/zk-logo.png"
              alt="ZK Beauty monogram"
              loading="lazy"
              decoding="async"
              className="w-40 md:w-52 h-auto"
            />
            <div className="mt-10 h-px w-24 bg-gold/70" />
            <figcaption className="mt-5 text-[10px] tracking-[0.34em] uppercase text-ink/70">
              Grotestraat 63 · Borne
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
