type Props = { t: (k: string) => string };

export default function About({ t }: Props) {
  const tags = [
    t('about.tag1'),
    t('about.tag2'),
    t('about.tag3'),
    t('about.tag4'),
  ];

  return (
    <section id="over" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <span className="kicker">{t('about.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.08]">{t('about.title')}</h2>
          <p className="mt-6 text-ink/75 leading-relaxed max-w-prose">{t('about.body')}</p>
          <p className="mt-4 text-ink/75 leading-relaxed max-w-prose">{t('about.body2')}</p>

          <div className="mt-7 flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-bone text-ink/80 border border-ink/8"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-9 flex items-center gap-4 text-sm text-ink/65">
            <div className="h-px flex-1 bg-ink/15 max-w-16" />
            <span className="font-serif italic text-lg">Nadia · Clinic 22</span>
            <div className="h-px flex-1 bg-ink/15 max-w-16" />
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="rounded-2xl w-full aspect-[4/5] bg-bone overflow-hidden shadow-[0_24px_70px_-32px_rgba(30,29,27,0.38)]">
            <img
              src="/about-interior.webp"
              alt="Behandelkamer Clinic 22 Huidtherapie in Delfgauw"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
