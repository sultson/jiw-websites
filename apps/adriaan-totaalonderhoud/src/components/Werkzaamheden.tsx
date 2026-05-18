import { useSite } from '../contexts/SiteContext';
import { werkzaamheden } from '../content';

export default function Werkzaamheden() {
  const { t } = useSite();
  const items = werkzaamheden.items;
  const loop = [...items, ...items];

  return (
    <section id="werkzaamheden" className="section overflow-hidden bg-ink">
      <div className="container-page">
        <span className="eyebrow">{t(werkzaamheden.eyebrow)}</span>
        <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
          <h2 className="max-w-xl text-4xl md:text-5xl">
            {t(werkzaamheden.titleStart)}
            <span className="text-orange">{t(werkzaamheden.titleEm)}</span>
            {t(werkzaamheden.titleEnd)}
          </h2>
          <p className="max-w-md text-bone-soft md:pb-1">{t(werkzaamheden.intro)}</p>
        </div>
      </div>

      <div className="marquee-viewport mt-12 w-full md:mt-14" aria-label={t(werkzaamheden.intro)}>
        <div className="marquee-track gap-5 pl-5">
          {loop.map((item, i) => (
            <figure
              key={`${item.src}-${i}`}
              className="relative w-[78vw] max-w-[340px] shrink-0 overflow-hidden rounded-xl border border-line bg-ink-3 sm:w-[360px]"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={item.src}
                  alt={t(item.label)}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-4 bottom-3.5 flex items-center gap-2 text-sm font-bold text-bone">
                <span className="h-3.5 w-1 rounded-full bg-orange" aria-hidden="true" />
                {t(item.label)}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
