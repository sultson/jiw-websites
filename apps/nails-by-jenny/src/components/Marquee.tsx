import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

type MarqueeItem =
  | { type: 'image'; src: string; labelNl: string; labelEn: string }
  | { type: 'video'; src: string; poster: string; labelNl: string; labelEn: string };

const items: MarqueeItem[] = [
  {
    type: 'video',
    src: '/marquee-clip-1.mp4',
    poster: '/marquee-klassiek-rood.webp',
    labelNl: 'Klassiek rood',
    labelEn: 'Classic red',
  },
  { type: 'image', src: '/marquee-nude-glans.webp', labelNl: 'Nude met glans', labelEn: 'Glossy nude' },
  { type: 'image', src: '/marquee-grijslila.webp', labelNl: 'Grijslila', labelEn: 'Grey lilac' },
  {
    type: 'video',
    src: '/marquee-clip-2.mp4',
    poster: '/marquee-naturel-amandel.webp',
    labelNl: 'Naturel amandel',
    labelEn: 'Natural almond',
  },
  { type: 'image', src: '/marquee-biab-naturel.webp', labelNl: 'Biab naturel', labelEn: 'Natural BIAB' },
  { type: 'image', src: '/marquee-parelroze.webp', labelNl: 'Parelroze shimmer', labelEn: 'Pearl pink shimmer' },
  {
    type: 'video',
    src: '/marquee-clip-3.mp4',
    poster: '/marquee-lila.webp',
    labelNl: 'Zacht lila',
    labelEn: 'Soft lilac',
  },
  { type: 'image', src: '/marquee-perzik-mat.webp', labelNl: 'Mat perzik', labelEn: 'Matte peach' },
  { type: 'image', src: '/marquee-nude-rond.webp', labelNl: 'Nude rond', labelEn: 'Round nude' },
];

function Card({ item, label }: { item: MarqueeItem; label: string }) {
  return (
    <figure className="relative w-[78vw] max-w-[340px] shrink-0 overflow-hidden rounded-2xl border border-espresso/5 bg-blush sm:w-[360px]">
      <div className="aspect-[4/3] w-full overflow-hidden">
        {item.type === 'video' ? (
          <video
            src={item.src}
            poster={item.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={label}
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={item.src}
            alt={label}
            width={360}
            height={270}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent pointer-events-none" />
      <figcaption className="absolute inset-x-3 bottom-3 text-sm font-medium text-cream">
        {label}
      </figcaption>
    </figure>
  );
}

export default function Marquee({ lang, t }: Props) {
  const loop = [...items, ...items];

  return (
    <section className="pb-20 md:pb-28 overflow-hidden bg-cream" aria-label={t('marquee.aria')}>
      <div className="marquee-viewport w-full">
        <div className="marquee-track gap-5 pl-5">
          {loop.map((item, i) => (
            <Card
              key={`${item.labelNl}-${i}`}
              item={item}
              label={lang === 'en' ? item.labelEn : item.labelNl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
