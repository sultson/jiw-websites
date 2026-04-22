import { useEffect, useRef, useState } from 'react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

/**
 * Voeg je foto's toe aan /public en zet ze hier in de lijst.
 * Geef elke foto een beschrijvende alt-tekst.
 * De eerste foto wordt groter weergegeven (col-span-2 / row-span-2).
 *
 * Voorbeeld:
 *   { src: '/nails-1.webp', alt: 'BIAB resultaat', cls: 'row-span-2 aspect-[3/4]' },
 *   { src: '/nails-2.webp', alt: 'Gel extensions', cls: 'aspect-square' },
 */
const images: { src: string; alt: string; cls: string }[] = [
  { src: '/nagels_amandelvorm_nude_gel_extensies.webp',    alt: 'Nude gel extensions amandelvorm',        cls: 'aspect-[3/4]' },
  { src: '/nagels_holografisch_glitter_steentjes.webp',   alt: 'Holografisch glitter met steentjes',     cls: 'aspect-square' },
  { src: '/wimperextensie_closeup_volume.webp',           alt: 'Volume wimperextensions',                cls: 'aspect-square' },
{ src: '/wenkbrauwen_henna_behandeling.webp',          alt: 'Henna wenkbrauwen behandeling',          cls: 'aspect-square' },
  { src: '/nagels_wit_bloemtjes_kerst_art.webp',         alt: 'Witte kerst nail art met bloemtjes',     cls: 'aspect-square' },
  { src: '/nagels_rood_gel_zebraprint_art.webp',         alt: 'Rood gel met zebraprint nail art',       cls: 'aspect-square' },
  { src: '/wimperextensies_spiegel_closeup.webp',        alt: 'Wimperextensions closeup spiegeleffect', cls: 'aspect-square' },
  { src: '/nagels_roze_gel_met_ring.webp',               alt: 'Roze gel manicure',                      cls: 'aspect-square' },
  { src: '/nagels_beige_gel_met_nail_art.webp',          alt: 'Beige gel met nail art details',         cls: 'aspect-square' },
  { src: '/wimperextensie_vergelijking_light_2_3d.webp', alt: 'Vergelijking light vs 2-3D wimpers',     cls: 'aspect-[4/3]' },
  { src: '/nagels_koraalrood_glitter_kort.webp',         alt: 'Koraalrood glitter korte nagels',        cls: 'aspect-square' },
  { src: '/nagels_bordeaux_chrome_amandelvorm.webp',     alt: 'Bordeaux chrome amandelvorm nagels',     cls: 'aspect-[4/3]' },
  { src: '/nagels_roze_french_tips_vierkant.webp',       alt: 'Roze french tips vierkante nagels',      cls: 'aspect-[4/3]' },
  { src: '/nagels_blauw_holografisch_shimmer.webp',      alt: 'Blauw holografisch shimmer nagels',      cls: 'aspect-[4/3]' },
  { src: '/nagels_klassieke_french_manicure.webp',       alt: 'Klassieke french manicure',              cls: 'aspect-[4/3]' },
  { src: '/nagels_nude_bloem_accent.webp',               alt: 'Nude nagels met bloem accent',           cls: 'aspect-[4/3]' },
  { src: '/nagels_roze_parel_chrome.webp',               alt: 'Roze parel chrome nagels',               cls: 'aspect-[4/3]' },
  { src: '/nagels_pastel_gespikkeld_paasei.webp',        alt: 'Pastel gespikkelde paasei nagels',       cls: 'aspect-[4/3]' },
  { src: '/nagels_neon_roze_french_tips.webp',           alt: 'Neon roze french tips',                  cls: 'aspect-[4/3]' },
  { src: '/nagels_confetti_glitter_closeup.webp',        alt: 'Confetti glitter closeup',               cls: 'aspect-[4/3]' },
];

export default function Gallery({ t }: Props) {
  const [idx, setIdx] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  if (images.length === 0) {
    return (
      <section id="fotos" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 text-center">
          <span className="kicker">{t('gallery.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('gallery.title')}</h2>
          <p className="mt-6 text-espresso/40 italic">Foto's worden binnenkort toegevoegd.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="fotos" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <span className="kicker">{t('gallery.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('gallery.title')}</h2>
          <p className="mt-3 text-sm text-espresso/60">{t('gallery.sub')}</p>
        </div>

        <div className="mb-6 md:mb-8 max-w-3xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-espresso/5 shadow-[0_20px_60px_-30px_rgba(30,26,24,0.4)]">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src="/nagels_holografisch_boomerang.webm" type="video/webm" />
              <source src="/nagels_holografisch_boomerang.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-auto">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setIdx(i)}
              className={`group relative overflow-hidden rounded-xl md:rounded-2xl ${img.cls} ${
                i === 0 ? 'col-span-2 md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/10" />
            </button>
          ))}
        </div>
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
