import { useState } from 'react';
import { Instagram } from 'lucide-react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

const images = [
  { src: '/werk-orange-french.webp', alt: 'Amandelnagels met een frisse oranje french tip', cls: 'aspect-[3/4]' },
  { src: '/werk-french-klassiek.webp', alt: 'Klassieke witte french op een nude basis', cls: 'aspect-[3/4]' },
  { src: '/werk-magenta.webp', alt: 'Korte ovale nagels in glanzend magenta', cls: 'aspect-square' },
  { src: '/werk-neon-art.webp', alt: 'Abstracte nail art in neonkleuren met goudfolie', cls: 'aspect-square' },
  { src: '/werk-blauwe-bloem.webp', alt: 'Melkwitte french met een kobaltblauw bloemaccent', cls: 'aspect-[3/4]' },
  { src: '/werk-browlamination-2.webp', alt: 'Resultaat van een browlamination, vol en strak gestyled', cls: 'aspect-[4/3]' },
  { src: '/werk-stippen-mix.webp', alt: 'Speelse nagelset met stippen en french in meerdere kleuren', cls: 'aspect-square' },
  { src: '/werk-rood-hart.webp', alt: 'Glanzend rode nagels met een nude accentnagel', cls: 'aspect-[3/4]' },
  { src: '/werk-butter-yellow.webp', alt: 'Lange amandelnagels in zacht boterkleurig geel', cls: 'aspect-[3/4]' },
  { src: '/werk-nude-french.webp', alt: 'Amandelnagels in een zachte nude tint met subtiele french', cls: 'aspect-[3/4]' },
  { src: '/werk-lila-bloem.webp', alt: 'Korte ovale nagels met lichtgele french en fijne lila bloemen', cls: 'aspect-square' },
];

export default function Gallery({ t }: Props) {
  const [idx, setIdx] = useState<number | null>(null);

  return (
    <section id="werk" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <span className="kicker">{t('gallery.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('gallery.title')}</h2>
          <p className="mt-3 text-sm text-espresso/60">{t('gallery.sub')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-auto">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setIdx(i)}
              className={`group relative overflow-hidden rounded-xl md:rounded-2xl ${img.cls} ${
                i === 0 ? 'col-span-2 row-span-2' : ''
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/10" />
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-espresso/60">
          {t('gallery.more')}{' '}
          <a
            href="https://www.instagram.com/nailtiquebylinn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-gold hover:underline"
          >
            <Instagram size={14} /> @nailtiquebylinn
          </a>
        </p>
      </div>

      <Lightbox
        images={images}
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
