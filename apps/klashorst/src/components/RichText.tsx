import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { Img, RichBlock } from '../content';

/**
 * An article as it was written in the Studio.
 *
 * The editor there offers exactly what is rendered here: paragraphs, two levels
 * of heading, bold and italic, links, lists, quotes and photographs. Anything it
 * cannot produce cannot arrive, so there is no styling here for cases the client
 * has no way of creating.
 */

type ImageValue = { img: Img; alt?: string; bijschrift?: string };

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-5 first:mt-0">{children}</p>,
    h2: ({ children }) => <h2 className="display mt-12 text-2xl md:text-3xl">{children}</h2>,
    h3: ({ children }) => (
      <h3 className="display mt-9 text-lg tracking-[0.04em] md:text-xl">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-9 border-l-2 border-red pl-5 text-[1.05rem] italic text-bone/85 md:pl-7">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-5 marker:text-red-soft">{children}</ul>,
    number: ({ children }) => <ol className="mt-5 list-decimal space-y-2 pl-5 marker:text-muted">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },

  marks: {
    strong: ({ children }) => <strong className="font-medium text-bone">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = typeof value?.href === 'string' ? value.href : '';
      // A link the client pasted from elsewhere leaves the museum, and says so
      // by opening beside it rather than replacing it.
      const external = /^https?:\/\//i.test(href) && !href.includes('klashorst');
      return (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
          className="border-b border-red text-bone transition-colors hover:text-red-soft"
        >
          {children}
        </a>
      );
    },
  },

  types: {
    image: ({ value }) => {
      const { img, alt, bijschrift } = value as ImageValue;
      if (!img) return null;
      return (
        <figure className="my-10">
          <img
            src={img.grid}
            srcSet={`${img.grid} 700w, ${img.full} 2200w`}
            sizes="(min-width: 768px) 760px, 100vw"
            alt={alt ?? ''}
            loading="lazy"
            decoding="async"
            // Same reasoning as the photograph at the top: an upright painting
            // should not push the rest of the piece off the screen.
            className="max-h-[80svh] w-auto max-w-full bg-wall"
          />
          {bijschrift && <figcaption className="mt-3 text-xs text-muted">{bijschrift}</figcaption>}
        </figure>
      );
    },
  },
};

export default function RichText({ value }: { value: RichBlock[] }) {
  if (!value.length) return null;
  return (
    <div className="text-[1.02rem] leading-[1.8] text-bone/85">
      {/* The blocks are Portable Text as Sanity stores it; the images inside
          them have had their asset reference resolved into URLs already. */}
      <PortableText value={value as never} components={components} />
    </div>
  );
}
