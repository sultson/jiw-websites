type Props = { t: (k: string) => string };

export default function About({ t }: Props) {
  const tags = [t('about.tag1'), t('about.tag2'), t('about.tag3')];

  return (
    <section id="over-jenny" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <span className="kicker">{t('about.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.1]">{t('about.title')}</h2>
          <p className="mt-6 text-espresso/75 leading-relaxed max-w-prose">{t('about.p1')}</p>
          <p className="mt-4 text-espresso/75 leading-relaxed max-w-prose">{t('about.p2')}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blush text-espresso/80 border border-espresso/8"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4 text-sm text-espresso/70">
            <div className="h-px flex-1 bg-espresso/15 max-w-16" />
            <span className="font-serif italic text-lg">{t('about.owner')}</span>
            <div className="h-px flex-1 bg-espresso/15 max-w-16" />
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative">
            <div className="rounded-2xl w-full aspect-[4/5] bg-blush flex items-center justify-center overflow-hidden shadow-[0_20px_60px_-30px_rgba(55,30,28,0.35)]">
              <img
                src="/studio-eigen-nagels.webp"
                alt={t('about.imgAlt')}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
