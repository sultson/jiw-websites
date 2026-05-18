import { useSite } from '../contexts/SiteContext';
import { about, sectionTitles, business } from '../content';

export default function About() {
  const { t } = useSite();

  return (
    <section id="over" className="section bg-ink-2">
      <div className="container-page">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Left: header + paragraphs */}
          <div>
            <span className="eyebrow">{t(sectionTitles.about.eyebrow)}</span>
            <h2 className="mt-4 text-4xl md:text-5xl">
              {t(sectionTitles.about.titleStart)}
              <span className="text-orange">{t(sectionTitles.about.titleEm)}</span>
              {t(sectionTitles.about.titleEnd)}
            </h2>

            <div className="mt-6 space-y-4">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.nl} className="text-bone-soft">
                  {t(paragraph)}
                </p>
              ))}
            </div>

            <div className="mt-7 flex items-center gap-3">
              <span
                className="grid h-11 w-11 place-items-center rounded-lg bg-orange text-sm font-extrabold text-bone"
                aria-hidden="true"
              >
                A
              </span>
              <div>
                <p className="font-bold text-bone">{business.owner}</p>
                <p className="text-sm text-mute">{t(about.signature)}</p>
              </div>
            </div>
          </div>

          {/* Right: image with accent */}
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute -right-4 -top-4 h-28 w-28 rounded-xl bg-orange md:-right-6 md:-top-6 md:h-36 md:w-36"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-4 -left-4 h-20 w-20 diag-stripes opacity-80"
            />

            <div className="relative overflow-hidden rounded-xl border border-line shadow-2xl shadow-black/40">
              <img
                src={about.image}
                alt={t(about.imageAlt)}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
