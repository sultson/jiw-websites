import { content } from '../content';
import Paragraphs from './Paragraphs';

export default function Peter() {
  const t = content.teksten.peter;
  const alineas = t.alineas.filter((alinea) => alinea.trim());

  // Nothing written and no photograph: the museum removed this section, so the
  // page does not keep a band of empty wall where it used to be.
  if (!t.eyebrow && !t.titel && !alineas.length && !t.portret && !t.tweedeFoto) return null;

  return (
    <section id="peter" className="scroll-mt-20 border-t border-hair bg-wall py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            {t.eyebrow && <p className="eyebrow">{t.eyebrow}</p>}
            {t.titel && (
              <h2 className={`display text-4xl md:text-6xl ${t.eyebrow ? 'mt-4' : ''}`}>{t.titel}</h2>
            )}

            {/* The portrait: black and white, the way the museum uses it. */}
            {t.portret && (
              <figure className="mt-10 w-full max-w-[30rem]">
                <img
                  src={t.portret.grid}
                  srcSet={`${t.portret.gridSet}, ${t.portret.full} 2200w`}
                  sizes="(min-width: 1024px) 480px, 100vw"
                  alt={t.titel}
                  width={Math.round(1200 * t.portret.ratio)}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full grayscale"
                />
                {t.portretCredit && (
                  <figcaption className="mt-2 text-xs text-muted">{t.portretCredit}</figcaption>
                )}
              </figure>
            )}
          </div>

          {/* Each line of the list in the Studio is a paragraph, and a blank
              line inside one starts another: the museum writes the biography
              the way it should read. */}
          <div>
            <div className="space-y-5 text-[1rem] leading-relaxed text-bone">
              {alineas.map((alinea) => (
                <Paragraphs key={alinea.slice(0, 24)} value={alinea} gap="mt-5" />
              ))}
            </div>

            {/* The second photograph closes the biography off. In colour, not
                grey like the portrait: it is a photograph of the painting
                being made, and the paint is the whole point of it. */}
            {t.tweedeFoto && (
              <figure className={alineas.length ? 'mt-10' : ''}>
                <img
                  src={t.tweedeFoto.grid}
                  srcSet={`${t.tweedeFoto.gridSet}, ${t.tweedeFoto.full} 2200w`}
                  sizes="(min-width: 1024px) 660px, 100vw"
                  alt={t.titel}
                  width={Math.round(1200 * t.tweedeFoto.ratio)}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full"
                />
                {t.tweedeFotoCredit && (
                  <figcaption className="mt-2 text-xs text-muted">{t.tweedeFotoCredit}</figcaption>
                )}
              </figure>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
