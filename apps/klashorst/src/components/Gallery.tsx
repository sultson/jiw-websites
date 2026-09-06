import { content, ui, type GalerieWerk } from '../content';
import { GRID_SIZES } from '../content/image';
import Paragraphs from './Paragraphs';

/**
 * The part of the museum reserved for other artists. Nothing here is on offer:
 * the works hang, and the one thing a visitor can do is ask the museum
 * something, which is also how an artist offers work for this wall. That ask
 * has a section of its own at the foot of the page; this points at it.
 */
export default function Gallery() {
  const t = content.teksten.galerie;
  const werken = content.galerie;
  const label = (work: GalerieWerk) =>
    [work.techniek, work.afmetingen, work.jaar].filter(Boolean).join(', ');
  /**
   * What to call a work out loud. Neither the title nor the maker is demanded
   * by the Studio, so a photograph still has to describe itself to a screen
   * reader when the museum hung it without either.
   */
  const describe = (work: GalerieWerk) =>
    [work.titel, work.kunstenaar].filter(Boolean).join(', ') || ui.werk.zonderTitel;

  return (
    <section id="galerie" className="scroll-mt-20 border-t border-hair py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <header className="max-w-2xl">
          {t.eyebrow && <p className="eyebrow">{t.eyebrow}</p>}
          {t.titel && (
            <h2 className={`display text-4xl md:text-6xl ${t.eyebrow ? 'mt-4' : ''}`}>{t.titel}</h2>
          )}
          <div className="mt-5">
            <Paragraphs value={t.lead} className="text-[0.98rem] leading-relaxed text-muted" />
          </div>
        </header>

        {werken.length === 0 ? (
          t.leeg && (
            <div className="mt-10 max-w-xl border border-hair bg-wall p-7 md:p-9">
              <Paragraphs value={t.leeg} className="text-[0.95rem] leading-relaxed text-bone" />
            </div>
          )
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:mt-16 md:grid-cols-3 md:gap-x-8 md:gap-y-14 lg:grid-cols-4">
            {werken.map((work) => (
              <article key={work.id} className="flex flex-col">
                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-wall">
                  <img
                    src={work.img.grid}
                    srcSet={work.img.gridSet}
                    sizes={GRID_SIZES}
                    alt={describe(work)}
                    width={Math.round(1200 * work.img.ratio)}
                    height={1200}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* A work without a title gets no title line: the maker moves
                    up into its place rather than a placeholder. */}
                {work.titel && (
                  <h3 className="display mt-3 text-base leading-tight md:text-lg">{work.titel}</h3>
                )}
                {work.kunstenaar && (
                  <p className={`text-sm text-bone ${work.titel ? 'mt-1' : 'mt-3'}`}>
                    {work.kunstenaar}
                  </p>
                )}
                {label(work) && (
                  <p
                    className={`text-xs text-muted md:text-[0.8rem] ${
                      work.titel || work.kunstenaar ? 'mt-1' : 'mt-3'
                    }`}
                  >
                    {label(work)}
                  </p>
                )}

                <div className="mt-3">
                  <Paragraphs
                    value={work.toelichting}
                    className="text-xs leading-relaxed text-muted md:text-[0.8rem]"
                    gap="mt-2"
                  />
                </div>
              </article>
            ))}
          </div>
        )}

        {content.teksten.contact.titel && (
          <a href="#contact" className="btn btn-solid mt-10">
            {content.teksten.contact.titel}
          </a>
        )}
      </div>
    </section>
  );
}
