import { useSite } from '../contexts/SiteContext';
import { sectionTitles, werkwijze } from '../content';

export default function Werkwijze() {
  const { t } = useSite();

  return (
    <section id="werkwijze" className="section bg-ink">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">{t(sectionTitles.werkwijze.eyebrow)}</span>
          <h2 className="mt-4 text-4xl md:text-5xl">
            {t(sectionTitles.werkwijze.titleStart)}
            <span className="text-orange">{t(sectionTitles.werkwijze.titleEm)}</span>
            {t(sectionTitles.werkwijze.titleEnd)}
          </h2>
        </div>

        {/* Desktop: connected 4-column timeline */}
        <ol className="mt-14 hidden lg:grid lg:grid-cols-4 lg:gap-8">
          {werkwijze.map((item) => (
            <li key={item.step} className="relative pt-10">
              <span aria-hidden="true" className="absolute left-0 right-0 top-[1.4rem] h-px bg-line" />
              <span
                aria-hidden="true"
                className="absolute left-7 top-[1.4rem] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-orange bg-ink"
              />
              <span className="block text-5xl font-extrabold leading-none text-orange">
                {item.step}
              </span>
              <h3 className="mt-5 text-lg font-bold">{t(item.title)}</h3>
              <p className="mt-2 text-bone-soft">{t(item.body)}</p>
            </li>
          ))}
        </ol>

        {/* Mobile: vertical stacked list */}
        <ol className="mt-10 space-y-8 lg:hidden">
          {werkwijze.map((item, i) => (
            <li key={item.step} className="relative pl-16">
              {i < werkwijze.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[1.4rem] top-12 bottom-[-2rem] w-px bg-line"
                />
              )}
              <span className="absolute left-0 top-0 inline-flex h-12 w-12 items-center justify-center rounded-full border border-orange/30 bg-orange/10 text-lg font-extrabold text-orange">
                {item.step}
              </span>
              <h3 className="text-lg font-bold">{t(item.title)}</h3>
              <p className="mt-2 text-bone-soft">{t(item.body)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
