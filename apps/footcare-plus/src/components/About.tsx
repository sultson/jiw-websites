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
          <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.1]">
            {t('about.title')}
          </h2>
          <p className="mt-6 text-ink/80 leading-relaxed max-w-prose">
            {t('about.body1')}
          </p>
          <p className="mt-4 text-ink/75 leading-relaxed max-w-prose">
            {t('about.body2')}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-sand text-ink/80 border border-ink/8"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4 text-sm text-ink/70">
            <div className="h-px flex-1 bg-ink/15 max-w-16" />
            <span className="font-serif italic text-lg">{t('about.owner')}</span>
            <div className="h-px flex-1 bg-ink/15 max-w-16" />
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative">
            <div className="rounded-2xl w-full aspect-[4/5] bg-sand flex items-center justify-center overflow-hidden shadow-[0_20px_60px_-30px_rgba(31,42,46,0.35)]">
              <img
                src="/gerda-portret.webp?v=20260526"
                alt="Gerda Haringsma in haar praktijk FootCare+"
                loading="lazy"
                className="w-full h-full object-cover"
                onError={e => {
                  // Graceful fallback if portrait isn't shipped: fade to sand.
                  const el = e.currentTarget as HTMLImageElement;
                  el.style.display = 'none';
                }}
              />
            </div>
            <div className="hidden md:block absolute -bottom-8 -left-8 w-40 h-44 rounded-2xl overflow-hidden shadow-[0_20px_60px_-30px_rgba(31,42,46,0.4)] ring-4 ring-cream bg-sand-soft">
              <img
                src="/service-medische.webp?v=20260526"
                alt="Medische pedicurebehandeling in de praktijk"
                loading="lazy"
                className="w-full h-full object-cover"
                onError={e => {
                  const el = e.currentTarget as HTMLImageElement;
                  el.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
