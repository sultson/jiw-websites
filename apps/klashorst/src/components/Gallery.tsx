import { useState } from 'react';
import { beschikbaarLabel, content, teVragen, ui, type GalerieWerk } from '../content';
import QuoteDialog from './QuoteDialog';

/**
 * The part of the museum reserved for other artists. Work here is for hire and
 * for sale, but there is no webshop: a quote is a message to the museum, and
 * the museum takes it from there. The same form and the same labels as the
 * collection, because from the visitor's side it is the same question.
 */
export default function Gallery() {
  const t = content.teksten.galerie;
  const werken = content.galerie;
  /** null when closed, '' for a general enquiry, otherwise the work's title. */
  const [asking, setAsking] = useState<string | null>(null);

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
            <p className="text-[0.95rem] leading-relaxed text-bone/80">{t.leeg}</p>
            <button type="button" onClick={() => setAsking('')} className="btn mt-6">
              {ui.offerte.algemeen}
            </button>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:mt-16 md:grid-cols-3 md:gap-x-8 md:gap-y-14 lg:grid-cols-4">
            {werken.map((work) => {
              const status = beschikbaarLabel(work, ui);
              return (
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
                  {work.kunstenaar && <p className="mt-1 text-sm text-bone/80">{work.kunstenaar}</p>}
                  {label(work) && (
                    <p className="mt-1 text-xs text-muted md:text-[0.8rem]">{label(work)}</p>
                  )}

                  {status && (
                    <p className="mt-3">
                      <span className={`badge ${work.verkocht ? 'badge-sold' : ''}`}>{status}</span>
                    </p>
                  )}

                  {(work.prijs || work.huurprijs) && !work.verkocht && (
                    <dl className="mt-3 space-y-1 text-xs text-bone/75 md:text-[0.8rem]">
                      {work.prijs && (
                        <div className="flex gap-2">
                          <dt className="text-muted">{ui.galerie.prijs}</dt>
                          <dd>{work.prijs}</dd>
                        </div>
                      )}
                      {work.huurprijs && (
                        <div className="flex gap-2">
                          <dt className="text-muted">{ui.galerie.huurprijs}</dt>
                          <dd>{work.huurprijs}</dd>
                        </div>
                      )}
                    </dl>
                  )}

                  {work.toelichting && (
                    <p className="mt-3 text-xs leading-relaxed text-muted md:text-[0.8rem]">
                      {work.toelichting}
                    </p>
                  )}

                  {teVragen(work) && (
                    <button
                      type="button"
                      onClick={() => setAsking(work.titel)}
                      className="eyebrow mt-4 self-start border-b border-red pb-1 text-bone transition-colors hover:text-red-soft"
                    >
                      {ui.offerte.knop}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {asking !== null && <QuoteDialog werk={asking} onClose={() => setAsking(null)} />}
    </section>
  );
}
