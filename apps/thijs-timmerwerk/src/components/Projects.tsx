import { useMemo, useState } from 'react';
import { MapPin, Maximize2 } from 'lucide-react';
import { projects } from '../data/projects';
import type { Project } from '../data/projects';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import BeforeAfter from './BeforeAfter';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string; lang: 'nl' | 'en' };

/** Projects — warm bone background. Compare projects get a before/after slider,
 * others render as alternating image+text layouts with a lightbox gallery. */
export default function Projects({ t, lang }: Props) {
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });

  // combined image list across all galleries — index map lets thumbnails open the right slide
  const { images, startIndex } = useMemo(() => {
    const flat: { src: string; alt: string }[] = [];
    const start: Record<string, number> = {};
    for (const p of projects) {
      start[p.id] = flat.length;
      for (const g of p.gallery) {
        flat.push({ src: g.src, alt: lang === 'nl' ? g.altNl : g.altEn });
      }
    }
    return { images: flat, startIndex: start };
  }, [lang]);

  const openAt = (i: number) => setLightbox({ open: true, index: i });
  const close = () => setLightbox((s) => ({ ...s, open: false }));
  const prev = () =>
    setLightbox((s) => ({ ...s, index: (s.index - 1 + images.length) % images.length }));
  const next = () => setLightbox((s) => ({ ...s, index: (s.index + 1) % images.length }));

  const title = (p: Project) => (lang === 'nl' ? p.titleNl : p.titleEn);
  const type = (p: Project) => (lang === 'nl' ? p.typeNl : p.typeEn);
  const desc = (p: Project) => (lang === 'nl' ? p.descNl : p.descEn);

  return (
    <section id="projecten" className="section bg-bone">
      <div className="shell">
        <SectionHeader
          eyebrow={t('pr.eyebrow')}
          title={t('pr.title')}
          dot="spark"
          intro={t('pr.intro')}
          align="center"
        />

        <div className="mt-16 space-y-16 lg:space-y-24">
          {projects.map((p, i) => {
            const flip = i % 2 === 1;
            const base = startIndex[p.id];

            const meta = (
              <div className={flip ? 'lg:order-1' : ''}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="chip-cobalt">{type(p)}</span>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-mute">
                    <MapPin className="h-4 w-4 text-cobalt" strokeWidth={2.2} />
                    {p.location}
                  </span>
                </div>
                <h3 className="mt-5 display-md text-ink">{title(p)}</h3>
                <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">{desc(p)}</p>

                {/* thumbnail strip */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {p.gallery.map((g, gi) => (
                    <button
                      key={g.src}
                      type="button"
                      onClick={() => openAt(base + gi)}
                      aria-label={t('pr.openImage')}
                      className="group relative h-20 w-24 overflow-hidden rounded-xl border border-line bg-bone-deep transition-colors hover:border-cobalt"
                    >
                      <img
                        src={g.src}
                        alt={lang === 'nl' ? g.altNl : g.altEn}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="absolute inset-0 grid place-items-center bg-cobalt-ink/0 transition-colors group-hover:bg-cobalt-ink/35">
                        <Maximize2 className="h-4 w-4 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );

            // featured before/after layout
            if (p.compare) {
              const c = p.compare;
              return (
                <Reveal key={p.id}>
                  <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                    <div className={flip ? 'lg:order-2' : ''}>
                      <div
                        className={
                          c.orientation === 'portrait' ? 'mx-auto max-w-sm lg:max-w-md' : ''
                        }
                      >
                        <BeforeAfter
                          beforeSrc={c.beforeSrc}
                          afterSrc={c.afterSrc}
                          beforeLabel={c.beforeLabel}
                          orientation={c.orientation}
                          alt={lang === 'nl' ? c.altNl : c.altEn}
                          t={t}
                        />
                      </div>
                    </div>
                    {meta}
                  </article>
                </Reveal>
              );
            }

            // standalone gallery layout — lead image + text
            const lead = p.gallery[0];
            return (
              <Reveal key={p.id}>
                <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                  <div className={flip ? 'lg:order-2' : ''}>
                    <button
                      type="button"
                      onClick={() => openAt(base)}
                      aria-label={t('pr.openImage')}
                      className="group block w-full overflow-hidden rounded-2xl border border-line bg-bone-deep"
                    >
                      <div className="relative" style={{ aspectRatio: '4 / 3' }}>
                        <img
                          src={lead.src}
                          alt={lang === 'nl' ? lead.altNl : lead.altEn}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-cobalt opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                          <Maximize2 className="h-4 w-4" strokeWidth={2.4} />
                        </span>
                      </div>
                    </button>
                  </div>
                  {meta}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      <Lightbox
        images={images}
        index={lightbox.index}
        open={lightbox.open}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    </section>
  );
}
