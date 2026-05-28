type Props = { t: (k: string) => string };

type Tile =
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'video'; src: string; poster?: string; alt: string };

/**
 * Marquee tiles are dedicated to this section — none of these files appears
 * elsewhere on the page (hero / about / services / gallery all use other media).
 */
const tiles: Tile[] = [
  { kind: 'video', src: '/marquee-brow.mp4',     alt: 'Brow lamination boomerang — ZK Beauty' },
  { kind: 'video', src: '/marquee-lashlift.mp4', alt: 'Lashlift behandeling — ZK Beauty' },
  { kind: 'image', src: '/marquee-hybrid.webp',  alt: 'Hybrid brows + brow lamination resultaat — ZK Beauty' },
  { kind: 'video', src: '/marquee-brows.mp4',    alt: 'Hybrid brows in actie — ZK Beauty' },
  { kind: 'video', src: '/marquee-tinting.mp4',  alt: 'Lashlift met tinting — ZK Beauty' },
];

function Item({ tile }: { tile: Tile }) {
  if (tile.kind === 'video') {
    return (
      <video
        src={tile.src}
        poster={tile.poster}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        aria-label={tile.alt}
        className="block w-full h-full object-cover"
      />
    );
  }
  return (
    <img
      src={tile.src}
      alt={tile.alt}
      loading="lazy"
      decoding="async"
      className="block w-full h-full object-cover"
    />
  );
}

export default function Marquee({ t }: Props) {
  // Duplicate the run so the CSS translate from 0 → -50% wraps seamlessly.
  const loop = [...tiles, ...tiles];

  return (
    <section className="py-20 md:py-28 bg-ivory">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 mb-10">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <span className="gold-rule">{t('marquee.kicker')}</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">{t('marquee.title')}</h2>
          </div>
          <a
            href="https://www.instagram.com/zkbeautynl/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.22em] uppercase text-ink/60 hover:text-ink"
          >
            @zkbeautynl →
          </a>
        </div>
      </div>

      <div className="marquee-viewport relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-ivory to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-ivory to-transparent z-10" />

        <ul className="marquee-track gap-4 md:gap-5">
          {loop.map((tile, i) => (
            <li
              key={`${tile.src}-${i}`}
              className="shrink-0 w-[62vw] sm:w-[44vw] md:w-[28vw] lg:w-[20rem] aspect-[3/4] overflow-hidden rounded-2xl bg-ink/5 border border-ink/5"
              aria-hidden={i >= tiles.length ? 'true' : undefined}
            >
              <Item tile={tile} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
