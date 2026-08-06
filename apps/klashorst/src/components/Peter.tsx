import { content } from '../content';

export default function Peter() {
  const t = content.teksten.peter;

  return (
    <section id="peter" className="scroll-mt-16 border-t border-hair bg-wall py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="display mt-4 text-4xl md:text-6xl">{t.titel}</h2>

            {t.portret && (
              <figure className="mt-10 max-w-[260px]">
                <img
                  src={t.portret.grid}
                  alt={t.titel}
                  loading="lazy"
                  decoding="async"
                  className="w-full grayscale"
                />
                <figcaption className="mt-2 text-xs text-muted">{t.portretCredit}</figcaption>
              </figure>
            )}
          </div>

          <div>
            <div className="space-y-5 text-[1rem] leading-relaxed text-bone/85">
              {t.alineas.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>

            <h3 className="eyebrow mt-12 text-bone/60">{t.feitenTitel}</h3>
            <dl className="mt-5 border-t border-hair">
              {t.feiten.map((row) => (
                <div key={row.jaar + row.wat} className="flex gap-6 border-b border-hair py-3.5">
                  <dt className="display w-32 shrink-0 text-sm text-red-soft md:text-base">{row.jaar}</dt>
                  <dd className="text-sm text-bone/85 md:text-[0.95rem]">{row.wat}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
