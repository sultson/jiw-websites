import { content, ui, type GalerieWerk } from '../content';

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

  return (
    <section id="galerie" className="scroll-mt-20 border-t border-hair py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <header className="max-w-2xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="display mt-4 text-4xl md:text-6xl">{t.titel}</h2>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-muted">{t.lead}</p>
        </header>

        {werken.length === 0 ? (
          <div className="mt-10 max-w-xl border border-hair bg-wall p-7 md:p-9">
            <p className="text-[0.95rem] leading-relaxed text-bone">{t.leeg}</p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:mt-16 md:grid-cols-3 md:gap-x-8 md:gap-y-14 lg:grid-cols-4">
            {werken.map((work) => (
              <article key={work.id} className="flex flex-col">
                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-wall">
                  <img
                    src={work.img.grid}
                    alt={`${work.titel}, ${work.kunstenaar}`}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <h3 className="display mt-3 text-base leading-tight md:text-lg">{work.titel}</h3>
                {work.kunstenaar && <p className="mt-1 text-sm text-bone">{work.kunstenaar}</p>}
                {label(work) && (
                  <p className="mt-1 text-xs text-muted md:text-[0.8rem]">{label(work)}</p>
                )}

                {work.toelichting && (
                  <p className="mt-3 text-xs leading-relaxed text-muted md:text-[0.8rem]">
                    {work.toelichting}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        <a href="#contact" className="btn btn-solid mt-10">
          {ui.vraag.knop}
        </a>
      </div>
    </section>
  );
}
