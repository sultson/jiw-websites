import { useState } from 'react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

type Img = { src: string; alt: string };

// Real client work — curated from Google Maps gallery.
const manicureImages: Img[] = [
  { src: '/photos/manicure-nude-gold-glitter.webp',  alt: 'Nude almond met goud glitter detail' },
  { src: '/photos/manicure-red-statement.webp',       alt: 'Klassiek rood, lange amandelvorm' },
  { src: '/photos/manicure-french-classic.webp',      alt: 'Klassieke French manicure' },
  { src: '/photos/manicure-pink-floral-art.webp',     alt: 'Roze met fijne bloem nail art' },
  { src: '/photos/manicure-nude-pearls-bridal.webp',  alt: 'Bridal nude met pareltjes en goud' },
  { src: '/photos/manicure-mint-matte.webp',          alt: 'Mintgroene matte gellak' },
  { src: '/photos/manicure-french-orchid.webp',       alt: 'French manicure met orchidee styling' },
  { src: '/photos/manicure-pink-rhinestones.webp',    alt: 'Hot pink met steentjes accent' },
  { src: '/photos/manicure-white-abstract-line.webp', alt: 'Wit met fijne abstracte lijn' },
  { src: '/photos/manicure-peach-shimmer.webp',       alt: 'Zachte perzik met shimmer' },
  { src: '/photos/manicure-nude-black-gold.webp',     alt: 'Nude met zwart en gouden glitter' },
  { src: '/photos/manicure-pink-gold-glitter.webp',   alt: 'Dusty pink met goud glitter accent' },
  { src: '/photos/manicure-white-gold-foil.webp',     alt: 'Wit met goud-foil bloemen' },
  { src: '/photos/manicure-french-natural.webp',      alt: 'Natural French amandelvorm' },
  { src: '/photos/manicure-pink-glitter-art.webp',    alt: 'Pink fade met glitter en lijn art' },
  { src: '/photos/manicure-pearl-champagne.webp',     alt: 'Pearl champagne shimmer' },
  { src: '/photos/manicure-barbie-pink.webp',         alt: 'Barbie pink met glitter spike' },
  { src: '/photos/manicure-french-crystals.webp',     alt: 'French met fijne crystal accents' },
  { src: '/photos/manicure-pink-rose.webp',           alt: 'Soft rose pink amandelvorm' },
  { src: '/photos/manicure-milky-line-art.webp',      alt: 'Milky white met line art' },
  { src: '/photos/manicure-lavender-french.webp',     alt: 'Lavender met witte French tip' },
  { src: '/photos/manicure-red-white-glam.webp',      alt: 'Rood met witte accent nagel' },
  { src: '/photos/manicure-peach-ombre.webp',         alt: 'Peach ombre amandelvorm' },
];

const pedicureImages: Img[] = [
  { src: '/photos/pedicure-white-orchid.webp',  alt: 'Witte pedicure met orchidee' },
  { src: '/photos/pedicure-coral.webp',         alt: 'Koraal rode pedicure' },
  { src: '/photos/pedicure-pure-white.webp',    alt: 'Stralend witte pedicure' },
  { src: '/photos/pedicure-soft-white.webp',    alt: 'Zachte witte pedicure met shimmer' },
];

type Tab = 'manicure' | 'pedicure';

export default function Gallery({ t }: Props) {
  const [tab, setTab] = useState<Tab>('manicure');
  const [idx, setIdx] = useState<number | null>(null);

  const images = tab === 'manicure' ? manicureImages : pedicureImages;
  const lbImages = images.map(i => ({ ...i, cls: 'aspect-[3/4]' }));

  return (
    <section id="fotos" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <span className="kicker">{t('gallery.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('gallery.title')}</h2>
          <p className="mt-3 text-sm text-espresso/60">{t('gallery.sub')}</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full border border-espresso/15 p-1 bg-cream shadow-sm">
            {(['manicure', 'pedicure'] as Tab[]).map(key => (
              <button
                key={key}
                onClick={() => { setTab(key); setIdx(null); }}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  tab === key
                    ? 'bg-espresso text-cream'
                    : 'text-espresso/60 hover:text-espresso'
                }`}
              >
                {t(`gallery.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setIdx(i)}
              className="group relative overflow-hidden rounded-xl md:rounded-2xl aspect-[3/4]"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/15 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        images={lbImages}
        index={idx}
        onClose={() => setIdx(null)}
        onNav={dir =>
          setIdx(i => {
            if (i === null) return i;
            return (i + dir + images.length) % images.length;
          })
        }
      />
    </section>
  );
}
