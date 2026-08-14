import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { RichBlock } from '../content/types';
import { bron } from '../content';
import { schrijfNaam } from '../ui';

/**
 * Een bericht zoals het in het beheer geschreven is.
 *
 * Alleen wat de tekstverwerker daar aanbiedt komt hier terug, want wat er niet
 * ingetypt kan worden hoeft ook niet getekend te worden.
 */
const onderdelen: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-5 leading-relaxed text-groen/80">{children}</p>,
    h2: ({ children }) => <h2 className="mt-10 text-2xl leading-snug">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 text-xl leading-snug">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-salie-diep pl-5 text-lg italic text-groen/75">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-5 grid gap-2">{children}</ul>,
    number: ({ children }) => <ol className="mt-5 grid list-decimal gap-2 pl-5">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-2.5 leading-relaxed text-groen/80">
        <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-salie-diep" />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => <li className="leading-relaxed text-groen/80">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-groen">{children}</strong>,
    link: ({ children, value }) => {
      const href = typeof value?.href === 'string' ? value.href : '#';
      const extern = /^https?:/i.test(href);
      return (
        <a
          href={href}
          {...(extern ? { target: '_blank', rel: 'noreferrer' } : {})}
          className="font-semibold text-teal-tekst underline underline-offset-2 hover:text-groen"
        >
          {children}
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
            className="w-full rounded-2xl object-cover"
            loading="lazy"
            decoding="async"
          />
          {value.bijschrift && (
            <figcaption className="mt-2.5 text-sm text-groen/55">{value.bijschrift}</figcaption>
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
 * staat hij overal aan elkaar, dus we schrijven hem recht op het moment dat we
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
