import { content } from '../content';
import Paragraphs from './Paragraphs';

export default function Peter() {
  const t = content.teksten.peter;
  const alineas = t.alineas.filter((alinea) => alinea.trim());
  // One column of photographs, in the order the Studio lists them. The museum
  // adds the second one when they have one; without it nothing changes.
  const fotos = [
    { img: t.portret, credit: t.portretCredit },
    { img: t.tweedeFoto, credit: t.tweedeFotoCredit },
  ].filter((foto): foto is { img: NonNullable<typeof foto.img>; credit: string } => Boolean(foto.img));

  // Nothing written and no photograph: the museum removed this section, so the
  // page does not keep a band of empty wall where it used to be.
  if (!t.eyebrow && !t.titel && !alineas.length && !fotos.length) return null;

  return (
    <section id="peter" className="scroll-mt-20 border-t border-hair bg-wall py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            {t.eyebrow && <p className="eyebrow">{t.eyebrow}</p>}
            {t.titel && (
              <h2 className={`display text-4xl md:text-6xl ${t.eyebrow ? 'mt-4' : ''}`}>{t.titel}</h2>
            )}

            {fotos.map((foto, index) => (
              <figure
                key={foto.img.grid}
                className={`w-full max-w-[30rem] ${index === 0 ? 'mt-10' : 'mt-8'}`}
              >
                <img
                  src={foto.img.grid}
                  srcSet={`${foto.img.grid} 700w, ${foto.img.full} 2200w`}
                  sizes="(min-width: 1024px) 480px, 100vw"
                  alt={t.titel}
                  loading="lazy"
                  decoding="async"
                  className="w-full grayscale"
                />
                {foto.credit && (
                  <figcaption className="mt-2 text-xs text-muted">{foto.credit}</figcaption>
                )}
              </figure>
            ))}
          </div>

          {/* Each line of the list in the Studio is a paragraph, and a blank
              line inside one starts another: the museum writes the biography
              the way it should read. */}
          <div className="space-y-5 text-[1rem] leading-relaxed text-bone">
            {alineas.map((alinea) => (
              <Paragraphs key={alinea.slice(0, 24)} value={alinea} gap="mt-5" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
