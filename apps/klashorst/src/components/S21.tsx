import { content, s21Werken } from '../content';

export default function S21() {
  const t = content.teksten.s21;
  if (!s21Werken.length) return null;

  return (
    <section id="s21" className="scroll-mt-20 border-t border-hair py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
          <header className="lg:sticky lg:top-24">
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="display mt-4 text-5xl md:text-7xl">{t.titel}</h2>
            <p className="mt-6 text-[1rem] leading-relaxed text-bone/85">{t.lead}</p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{t.body}</p>
            <a href="#werk" className="btn mt-8">
              {t.knop}
            </a>
          </header>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {s21Werken.map((work) => (
              <figure key={work.id}>
                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-wall">
                  <img
                    src={work.img.grid}
                    alt={`${work.titel}, ${work.techniek}, ${work.afmetingen}`}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                {/* Same label format as the collection grid. */}
                <figcaption className="mt-3">
                  <span className="display block text-base leading-tight">{work.titel}</span>
                  <span className="mt-1 block text-xs text-muted">
                    {[work.techniek, work.afmetingen].filter(Boolean).join(', ')}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
