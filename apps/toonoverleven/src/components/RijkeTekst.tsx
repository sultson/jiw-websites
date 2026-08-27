import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { RichBlock } from '../content/types';
import { bron } from '../content/image';
import { schrijfNaam } from '../ui';

/**
 * Een bericht of een verhaal zoals het in het beheer geschreven is.
 *
 * Alleen wat de tekstverwerker daar aanbiedt komt hier terug, want wat er niet
 * ingetypt kan worden hoeft ook niet getekend te worden. De maten en de kleuren
 * zijn die van de rest van de site, zodat een bericht geen eigen typografie
 * krijgt.
 */
const onderdelen: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-5 max-w-[68ch] leading-relaxed text-inkt-zacht">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 max-w-[22ch] text-[1.6rem] md:text-[1.95rem]">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="mt-8 max-w-[26ch] text-[1.16rem]">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="mt-6 max-w-[62ch] rounded-[1.25rem] bg-blos px-6 py-5 font-display text-[1.15rem] leading-relaxed text-wijn-diep">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-5 grid max-w-[68ch] gap-2.5">{children}</ul>,
    number: ({ children }) => (
      <ol className="mt-5 grid max-w-[68ch] list-decimal gap-2.5 pl-5">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-6 leading-relaxed text-inkt-zacht">
        <span
          aria-hidden="true"
          className="absolute left-0.5 top-[0.65em] h-2 w-2 rounded-full bg-salie"
        />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => <li className="leading-relaxed text-inkt-zacht">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-inkt">{children}</strong>,
    link: ({ children, value }) => {
      const href = typeof value?.href === 'string' ? value.href : '#';
      const extern = /^https?:/i.test(href);
      return (
        <a
          href={href}
          {...(extern ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="font-semibold text-wijn underline decoration-blos-diep decoration-1 underline-offset-2 transition hover:decoration-wijn"
        >
          {children}
          {extern && <span aria-hidden="true"> ↗</span>}
          {extern && <span className="sr-only"> (opent in een nieuw tabblad)</span>}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.img) return null;
      return (
        <figure className="mt-8">
          <img
            src={bron(value.img, 'breed')}
            alt={value.alt ?? ''}
            className="w-full rounded-[1.25rem] object-cover"
            loading="lazy"
            decoding="async"
          />
          {value.bijschrift && (
            <figcaption className="mt-2.5 text-[0.82rem] text-grijs">{value.bijschrift}</figcaption>
          )}
        </figure>
      );
    },
  },
};

export default function RijkeTekst({ blokken }: { blokken: RichBlock[] }) {
  if (!blokken.length) return null;
  return (
    <div className="[&>*:first-child]:mt-0">
      <PortableText value={schrijfNamenIn(blokken) as never} components={onderdelen} />
    </div>
  );
}

/**
 * Hun eigen berichten schrijven de naam nog vaak als drie woorden. Op de site
 * staat hij overal hetzelfde, dus we schrijven hem recht op het moment dat we
 * hem tonen in plaats van hun tekst te verbouwen.
 */
function schrijfNamenIn(blokken: RichBlock[]): RichBlock[] {
  return blokken.map((blok) => {
    if (blok._type !== 'block' || !Array.isArray((blok as any).children)) return blok;
    return {
      ...blok,
      children: (blok as any).children.map((kind: any) =>
        typeof kind?.text === 'string' ? { ...kind, text: schrijfNaam(kind.text) } : kind,
      ),
    };
  });
}
