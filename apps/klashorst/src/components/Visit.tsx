import Newsletter from './Newsletter';
import { content } from '../content';

export default function Visit() {
  const t = content.teksten.bezoek;

  return (
    <section id="bezoek" className="scroll-mt-20 border-t border-hair py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* On a phone the newsletter leads: it is the only thing here that can
            actually be acted on until the opening details exist. */}
        <div className="flex flex-col gap-14 lg:grid lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="display mt-4 text-4xl md:text-6xl">{t.titel}</h2>
            <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-muted">{t.lead}</p>

            <dl className="mt-10 border-t border-hair">
              {t.rijen.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-6 border-b border-hair py-4">
                  <dt className="eyebrow text-muted">{row.label}</dt>
                  <dd className="text-sm text-muted">{row.waarde}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-sm leading-relaxed text-bone/75">{t.note}</p>
          </div>

          <div className="order-1 lg:order-2">
            <Newsletter />
          </div>
        </div>
      </div>
    </section>
  );
}
