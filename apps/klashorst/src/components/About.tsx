import { content } from '../content';

/**
 * What this is, said once, high on the page: a digital museum today and a
 * building being worked on. It sits directly under the room because it answers
 * the question the room raises, and it is the reason the visit block has no
 * address in it yet.
 */
export default function About() {
  const t = content.teksten.over;

  return (
    <section id="over" className="scroll-mt-20 border-t border-hair bg-wall py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <header>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="display mt-4 text-4xl md:text-5xl">{t.titel}</h2>
          </header>

          <div className="max-w-2xl space-y-5 text-[1.05rem] leading-relaxed text-bone/85">
            {t.alineas.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
