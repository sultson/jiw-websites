import { useMemo, useState } from 'react';
import Lightbox from './Lightbox';
import { galleryImages, type GalleryImage } from '../data/gallery';
import { BrushUnderline, SectionNumber } from './Marks';

type Props = { t: (k: string) => string };

type Tab = 'alle' | 'nails' | 'brows';

function spanClass(span: GalleryImage['span']) {
  if (span === 'wide') return 'col-span-2 md:col-span-2';
  if (span === 'tall') return 'md:row-span-2';
  return '';
}

export default function Gallery({ t }: Props) {
  const [tab, setTab] = useState<Tab>('alle');
  const [idx, setIdx] = useState<number | null>(null);

  const images = useMemo(
    () => tab === 'alle' ? galleryImages : galleryImages.filter(i => i.cat === tab),
    [tab],
  );

  return (
    <section id="werk" className="py-28 md:py-40 bg-shoji">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12 md:mb-14">
          <div className="inline-flex items-center gap-4 mb-4 text-[10.5px] uppercase tracking-[0.34em] text-sumi-soft">
            <SectionNumber n={4} />
            <span className="block w-8 h-px bg-sumi/30" />
            <span>{t('gallery.kicker')}</span>
            <span className="block w-8 h-px bg-sumi/30" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.06]">
            {t('gallery.title')}
          </h2>
          <BrushUnderline className="brush mx-auto mt-5" />
          <p className="mt-5 text-[13.5px] text-sumi/60 max-w-md mx-auto">{t('gallery.sub')}</p>
        </div>

        {/* Hairline tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-1 border-b border-sumi/15">
            {(['alle', 'nails', 'brows'] as Tab[]).map(key => (
              <button
                key={key}
                onClick={() => { setTab(key); setIdx(null); }}
                className={`px-5 md:px-6 py-3 text-[11px] uppercase tracking-[0.22em] transition-colors relative ${
                  tab === key ? 'text-sumi' : 'text-sumi/45 hover:text-sumi'
                }`}
              >
                {t(`gallery.${key}`)}
                {tab === key && (
                  <span className="absolute left-3 right-3 -bottom-px h-[2px] bg-sumi" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetric paper-mounted grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] sm:auto-rows-[200px] md:auto-rows-[220px] gap-3 md:gap-4">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setIdx(i)}
              className={`group relative bg-shoji p-1.5 border border-sumi/8 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.25)] overflow-hidden ${spanClass(img.span)} ${
                img.span === 'tall' ? 'row-span-2' : ''
              }`}
            >
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-sumi/0 group-hover:bg-sumi/10 transition-colors" />
              </div>
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
