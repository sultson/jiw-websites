import { useState } from 'react';
import { content, ui, type Werk } from '../content';
import { GRID_SIZES } from '../content/image';
import Lightbox, { type LightboxFoto } from './Lightbox';
import Paragraphs from './Paragraphs';

/**
 * The collection. Nothing here is on offer: the museum shows the work, and a
 * card is a way to look at it larger rather than a way to buy it.
 */
export default function Work() {
  const t = content.teksten.werk;
  const werken = content.werk;
  const [index, setIndex] = useState<number | null>(null);

  const label = (work: Werk) => [work.techniek, work.afmetingen].filter(Boolean).join(', ');
  /**
   * What to call a work out loud. Not every work is named, and one that isn't
   * still needs a name for the button that opens it and for a screen reader.
   */
  const describe = (work: Werk) =>
    [work.titel, label(work)].filter(Boolean).join(', ') || ui.werk.zonderTitel;

  const fotos: LightboxFoto[] = werken.map((work) => ({
    key: work.id,
    src: work.img.full,
    alt: describe(work),
    titel: work.titel || undefined,
    onderschrift: label(work) || undefined,
    toelichting: work.toelichting,
  }));

  return (
    <section id="werk" className="scroll-mt-20 border-t border-hair py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <header className="max-w-5xl">
          {t.eyebrow && <p className="eyebrow">{t.eyebrow}</p>}
          <div className={`flex flex-wrap items-center gap-x-7 gap-y-3 md:gap-x-10 ${t.eyebrow ? 'mt-4' : ''}`}>
            {t.titel && <h2 className="display text-4xl md:text-6xl">{t.titel}</h2>}
            <span className="klashorst-signature" aria-hidden="true" />
          </div>
          <div className="mt-5 max-w-2xl">
            <Paragraphs value={t.lead} className="text-[0.98rem] leading-relaxed text-muted" />
          </div>
        </header>

        {/* A collection emptied in the Studio is an empty collection here. The
            section says so rather than quietly falling back to the works this
            build shipped with, which is what made deleting them look broken. */}
        {werken.length === 0 ? (
          <div className="mt-10 max-w-xl">
            <Paragraphs value={t.leeg} className="text-[0.95rem] leading-relaxed text-muted" />
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:mt-16 md:grid-cols-3 md:gap-x-8 md:gap-y-14 lg:grid-cols-4">
            {werken.map((work, i) => (
              <article key={work.id} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className="group text-left"
                  aria-label={`${ui.werk.vergroot}: ${describe(work)}`}
                >
                  {/* One fixed box for every card, so the titles underneath sit
                      on a single baseline across the row. The work is contained
                      rather than cropped: an art site must not recrop the art. */}
                  <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-wall">
                    <img
                      src={work.img.grid}
                      srcSet={work.img.gridSet}
                      sizes={GRID_SIZES}
                      alt={describe(work)}
                      // The photograph's own proportion. The box above is a
                      // fixed 3:4 either way, but without these the browser has
                      // no size for the image inside it until the bytes land.
                      width={Math.round(1200 * work.img.ratio)}
                      height={1200}
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full object-contain transition-opacity duration-300 group-hover:opacity-85"
                    />
                  </div>
                  {/* A work without a title gets no title line: the technique
                      moves up into its place rather than a placeholder. */}
                  {work.titel && (
                    <h3 className="display mt-3 text-base leading-tight md:text-lg">{work.titel}</h3>
                  )}
                  {label(work) && (
                    <p className={`text-xs text-muted md:text-[0.8rem] ${work.titel ? 'mt-1' : 'mt-3'}`}>
                      {label(work)}
                    </p>
                  )}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      <Lightbox fotos={fotos} index={index} onIndex={setIndex} />
    </section>
  );
}
