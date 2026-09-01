import Newsletter from './Newsletter';
import { content } from '../content';
import Paragraphs from './Paragraphs';

export default function Visit() {
  const t = content.teksten.bezoek;

  return (
    <section id="bezoek" className="scroll-mt-20 border-t border-hair py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* On a phone the newsletter leads: it is the only thing here that can
            actually be acted on until the opening details exist. */}
        <div className="flex flex-col gap-14 lg:grid lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            {t.eyebrow && <p className="eyebrow">{t.eyebrow}</p>}
            {t.titel && (
              <h2 className={`display text-4xl md:text-6xl ${t.eyebrow ? 'mt-4' : ''}`}>{t.titel}</h2>
            )}
            <div className="mt-5 max-w-md">
              <Paragraphs value={t.lead} className="text-[0.98rem] leading-relaxed text-muted" />
            </div>

            {/* Rows the museum deleted are rows the museum deleted: the address
                and the opening hours are not known yet, and an empty list says
                that more honestly than three lines reading "Volgt". */}
            {t.rijen.length > 0 && (
              <dl className="mt-10 border-t border-hair">
                {t.rijen.map((row) => (
                  <div key={row.label + row.waarde} className="flex items-baseline justify-between gap-6 border-b border-hair py-4">
                    <dt className="eyebrow text-muted">{row.label}</dt>
                    <dd className="text-sm text-muted">{row.waarde}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-6 max-w-md">
              <Paragraphs value={t.note} className="text-sm leading-relaxed text-bone" gap="mt-3" />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <Newsletter />
          </div>
        </div>
      </div>
    </section>
  );
}
