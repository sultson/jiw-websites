import type { Copy } from '../translations';

export default function Peter({ t }: { t: Copy }) {
  return (
    <section id="peter" className="scroll-mt-16 border-t border-hair bg-wall py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <p className="eyebrow">{t.peter.eyebrow}</p>
            <h2 className="display mt-4 text-4xl md:text-6xl">{t.peter.title}</h2>

            <figure className="mt-10 max-w-[260px]">
              <img
                src="/art/peter-portrait.webp"
                alt="Peter Klashorst"
                loading="lazy"
                decoding="async"
                width={512}
                height={512}
                className="w-full grayscale"
              />
              <figcaption className="mt-2 text-xs text-muted">{t.peter.portraitCredit}</figcaption>
            </figure>
          </div>

          <div>
            <div className="space-y-5 text-[1rem] leading-relaxed text-bone/85">
              {t.peter.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>

            <h3 className="eyebrow mt-12 text-bone/60">{t.peter.factsTitle}</h3>
            <dl className="mt-5 border-t border-hair">
              {t.peter.facts.map(([year, what]) => (
                <div key={year} className="flex gap-6 border-b border-hair py-3.5">
                  <dt className="display w-32 shrink-0 text-sm text-red-soft md:text-base">{year}</dt>
                  <dd className="text-sm text-bone/85 md:text-[0.95rem]">{what}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
