import type { ReactNode } from 'react';

/**
 * A text box from the Studio, laid out the way it was typed.
 *
 * The client writes these in a textarea, and they use a blank line to start a
 * new thought. Dropped into a single `<p>` those blank lines collapse and the
 * whole box arrives as one wall of text, which is the shape they did not ask
 * for. So: a blank line starts a new paragraph, a single line break stays a
 * line break, and a box with nothing in it renders nothing at all rather than
 * an empty element holding open a gap.
 *
 * `*zo*` is set in italics and `**zo**` in bold, because the museum was already
 * typing asterisks around the titles of works and books and reading them back
 * on the page as asterisks. A title wants italics and a textarea has no button
 * for it; these two are the whole of it, deliberately, so a box of copy can
 * never turn into a box of markup.
 */

const NADRUK = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;

/** One line, with its emphasis resolved into elements. */
function nadruk(regel: string, sleutel: string): ReactNode[] {
  const uit: ReactNode[] = [];
  let laatste = 0;

  for (const match of regel.matchAll(NADRUK)) {
    const index = match.index ?? 0;
    if (index > laatste) uit.push(regel.slice(laatste, index));

    const [heel, vet, cursief] = match;
    uit.push(
      vet ? (
        <strong key={`${sleutel}-${index}`}>{vet}</strong>
      ) : (
        <em key={`${sleutel}-${index}`}>{cursief}</em>
      ),
    );
    laatste = index + heel.length;
  }

  if (laatste < regel.length) uit.push(regel.slice(laatste));
  return uit;
}

export default function Paragraphs({
  value,
  className = '',
  /** Space between paragraphs. Overridden where a block sets its own rhythm. */
  gap = 'mt-4',
}: {
  value: string | undefined;
  className?: string;
  gap?: string;
}) {
  const alineas = (value ?? '')
    .split(/\n\s*\n/)
    .map((deel) => deel.trim())
    .filter(Boolean);

  if (!alineas.length) return null;

  return (
    <>
      {alineas.map((alinea, index) => (
        <p key={alinea.slice(0, 32) + index} className={`${className} ${index ? gap : ''}`}>
          {/* A single break inside a paragraph is a break, not a new paragraph:
              an address or an opening line is written that way on purpose. */}
          {alinea.split('\n').map((regel, i, regels) => (
            <span key={regel.slice(0, 24) + i}>
              {nadruk(regel.trim(), `${index}-${i}`)}
              {i < regels.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </>
  );
}
