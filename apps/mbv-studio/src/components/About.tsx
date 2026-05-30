type Props = { t: (k: string) => string };

export default function About({ t }: Props) {
  const tags = [t('about.tag1'), t('about.tag2'), t('about.tag3'), t('about.tag4')];

  return (
    <section id="studio" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="order-1 md:order-1">
          <div className="relative">
            <div className="rounded-2xl w-full aspect-[4/5] bg-sand overflow-hidden shadow-[0_30px_70px_-35px_rgba(42,34,29,0.5)]">
              <img
                src="/about-portrait.webp"
                alt="Valeriia, founder of MBV Studio"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block absolute -bottom-7 -right-6 w-36 h-44 md:w-44 md:h-52 rounded-2xl overflow-hidden shadow-[0_24px_60px_-30px_rgba(42,34,29,0.55)] ring-4 ring-cream">
              <img
                src="/about-detail.webp"
                alt="Inside MBV Studio"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="order-2 md:order-2">
          <span className="kicker">{t('about.kicker')}</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl leading-[1.08]">{t('about.title')}</h2>
          <p className="mt-6 text-ink-soft leading-relaxed max-w-prose">{t('about.body1')}</p>
          <p className="mt-4 text-ink-soft leading-relaxed max-w-prose">{t('about.body2')}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-sand-soft text-ink-soft border border-ink/8"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4 text-sm text-ink-mute">
            <div className="h-px flex-1 bg-ink/15 max-w-16" />
            <span className="font-display italic text-lg text-ink">{t('about.signature')}</span>
            <div className="h-px flex-1 bg-ink/15 max-w-16" />
          </div>
        </div>
      </div>
    </section>
  );
}
