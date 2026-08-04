import { artworks } from '../data/artworks';
import type { Copy, Lang } from '../translations';

const series = artworks.filter((work) => work.series === 's21');

export default function S21({ t, lang }: { t: Copy; lang: Lang }) {
  return (
    <section id="s21" className="scroll-mt-16 border-t border-hair py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
          <header className="lg:sticky lg:top-24">
            <p className="eyebrow">{t.s21.eyebrow}</p>
            <h2 className="display mt-4 text-5xl md:text-7xl">{t.s21.title}</h2>
            <p className="mt-6 text-[1rem] leading-relaxed text-bone/85">{t.s21.lead}</p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{t.s21.body}</p>
            <a href="#werk" className="btn mt-8">
              {t.s21.view}
            </a>
          </header>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {series.map((work) => (
              <figure key={work.slug}>
                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-wall">
                  <img
                    src={`/art/${work.slug}.webp`}
                    alt={`${work.title}, ${work.medium[lang]}, ${work.size}`}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                {/* Same label format as the collection grid. */}
                <figcaption className="mt-3">
                  <span className="display block text-base leading-tight">{work.title}</span>
                  <span className="mt-1 block text-xs text-muted">
                    {work.medium[lang]}, {work.size}
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
