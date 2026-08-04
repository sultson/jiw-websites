import Newsletter from './Newsletter';
import type { Copy } from '../translations';

export default function Visit({ t }: { t: Copy }) {
  return (
    <section id="bezoek" className="scroll-mt-16 border-t border-hair py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* On a phone the newsletter leads: it is the only thing here that can
            actually be acted on until the opening details exist. */}
        <div className="flex flex-col gap-14 lg:grid lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <p className="eyebrow">{t.visit.eyebrow}</p>
            <h2 className="display mt-4 text-4xl md:text-6xl">{t.visit.title}</h2>
            <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-muted">{t.visit.lead}</p>

            <dl className="mt-10 border-t border-hair">
              {t.visit.rows.map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-6 border-b border-hair py-4">
                  <dt className="eyebrow text-bone/70">{label}</dt>
                  <dd className="text-sm text-muted">{value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-sm leading-relaxed text-bone/75">{t.visit.note}</p>
          </div>

          <div className="order-1 lg:order-2">
            <Newsletter t={t} />
          </div>
        </div>
      </div>
    </section>
  );
}
