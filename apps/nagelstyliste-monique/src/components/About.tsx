type Props = { t: (k: string) => string };

export default function About({ t }: Props) {
  const tags = [t('about.tag1'), t('about.tag2'), t('about.tag3'), t('about.tag4')];

  return (
    <section id="over" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <span className="kicker">{t('about.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.1]">{t('about.title')}</h2>
          <p className="mt-6 text-ink/72 leading-relaxed">{t('about.body1')}</p>
          <p className="mt-4 text-ink/72 leading-relaxed">{t('about.body2')}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blush text-ink/75 border border-ink/8"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4 text-ink/70">
            <div className="h-px w-10 bg-ink/15" />
            <span className="script text-2xl text-pink">{t('about.owner')}</span>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative">
            <div className="rounded-2xl w-full aspect-[4/5] overflow-hidden shadow-[0_24px_64px_-32px_rgba(12,61,82,0.4)]">
              <img
                src="/gallery/marble-green.webp"
                alt="Nailart door Nagelstyliste Monique"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block absolute -bottom-8 -left-6 md:-left-10 w-36 h-44 md:w-44 md:h-52 rounded-2xl overflow-hidden shadow-[0_24px_64px_-30px_rgba(12,61,82,0.5)] ring-4 ring-cream">
              <img
                src="/gallery/biab-red.webp"
                alt="BIAB-behandeling door Monique"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-5 -right-4 md:-right-6 bg-white rounded-2xl px-5 py-4 shadow-[0_18px_44px_-22px_rgba(12,61,82,0.5)] border border-ink/5 text-center">
              <p className="font-serif text-3xl text-pink leading-none">5,0</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-ink/55 mt-1">Google</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
