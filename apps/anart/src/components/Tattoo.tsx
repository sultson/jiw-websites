import { useState } from 'react';
import { Phone, Instagram, MessageCircle } from 'lucide-react';
import Lightbox from './Lightbox';

const PHONE = '+31633890157';

type Props = { t: (k: string) => string };

const tattooImages = [
  { src: '/tattoo_feniks_waterverf_kleurrijk.webp',        alt: 'Feniks waterverf tattoo, kleurrijk' },
  { src: '/tattoo_kleurrijke_tulpen_waterverf.webp',       alt: 'Kleurrijke tulpen waterverf tattoo' },
  { src: '/tattoo_biddende_handen_roos_zwart_grijs.webp',  alt: 'Biddende handen met roos, zwart-grijs' },
{ src: '/tattoo_artist_schouder_conventie.webp',         alt: 'Tattoo op schouder' },
];

export default function Tattoo({ t }: Props) {
  const [idx, setIdx] = useState<number | null>(null);

  return (
    <section id="tattoo" className="py-20 md:py-28 bg-espresso text-cream">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Tekst */}
          <div>
            <span className="inline-block text-[11px] uppercase tracking-[0.22em] text-gold-soft font-medium">
              {t('tattoo.kicker')}
            </span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl text-cream leading-[1.1]">
              {t('tattoo.title')}
            </h2>
            <p className="mt-6 text-cream/75 leading-relaxed max-w-prose">
              {t('tattoo.body')}
            </p>

            <ul className="mt-8 space-y-2 text-cream/70 text-sm">
              {(['s1','s2','s3','s4'] as const).map(k => (
                <li key={k} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-soft shrink-0" />
                  {t(`tattoo.${k}`)}
                </li>
              ))}
            </ul>

            {/* Callout */}
            <div className="mt-10 rounded-2xl border border-cream/15 p-5 bg-cream/5">
              <p className="font-serif text-lg text-cream">{t('tattoo.callout')}</p>
              <p className="mt-2 text-sm text-cream/60 leading-relaxed">{t('tattoo.calloutSub')}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`tel:${PHONE}`}
                  className="inline-flex items-center gap-2 border border-cream/25 text-cream px-4 py-2.5 rounded-full text-sm font-medium hover:bg-cream/10"
                >
                  <Phone size={15} />
                  {t('tattoo.ctaCall')}
                </a>
                <a
                  href={`https://wa.me/${PHONE.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-cream/25 text-cream px-4 py-2.5 rounded-full text-sm font-medium hover:bg-cream/10"
                >
                  <MessageCircle size={15} />
                  WhatsApp
                </a>
                <a
                  href="https://ig.me/m/annart.nl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-cream/25 text-cream px-4 py-2.5 rounded-full text-sm font-medium hover:bg-cream/10"
                >
                  <Instagram size={15} />
                  {t('tattoo.ctaDm')}
                </a>
              </div>
            </div>
          </div>

          {/* Fotogrid */}
          <div className="grid grid-cols-2 gap-2">
            {tattooImages.map((img, i) => (
              <button
                key={img.src}
                onClick={() => setIdx(i)}
                className={`group relative overflow-hidden rounded-xl ${
                  i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/15 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <Lightbox
        images={tattooImages}
        index={idx}
        onClose={() => setIdx(null)}
        onNav={dir =>
          setIdx(i => {
            if (i === null) return i;
            return (i + dir + tattooImages.length) % tattooImages.length;
          })
        }
      />
    </section>
  );
}
