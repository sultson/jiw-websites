import { useEffect, useRef, useState } from 'react';
import { X, Play } from 'lucide-react';
import { gallery, sectionTitles } from '../content';

type GalleryItem = (typeof gallery)[number];

function MediaTile({
  item,
  className,
  onClick,
}: {
  item: GalleryItem;
  className: string;
  onClick: () => void;
}) {
  if (item.type === 'video') {
    return (
      <figure
        onClick={onClick}
        className={`group relative rounded-2xl overflow-hidden bg-bone-soft cursor-pointer ${className}`}
      >
        <img
          src={item.poster}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-saffron text-paper shadow-[0_10px_24px_-6px_rgba(249,123,28,0.6)] transition-transform duration-300 group-hover:scale-110">
            <Play size={22} strokeWidth={2} fill="currentColor" />
          </span>
        </div>
        <figcaption className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-ink/85 text-bone text-sm font-medium px-4 py-3">
          {item.caption}
        </figcaption>
      </figure>
    );
  }
  return (
    <figure
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden bg-bone-soft cursor-pointer ${className}`}
    >
      <img
        src={item.src}
        alt={item.alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <figcaption className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-ink/85 text-bone text-sm font-medium px-4 py-3">
        {item.caption}
      </figcaption>
    </figure>
  );
}

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [activeIndex]);

  const placement = [
    'md:col-span-7 md:row-span-2 aspect-[4/5] md:aspect-auto',
    'md:col-span-5 aspect-[4/3]',
    'md:col-span-5 aspect-[4/3]',
    'md:col-span-6 aspect-[4/3]',
    'md:col-span-6 aspect-[4/3]',
  ];

  const active = activeIndex !== null ? gallery[activeIndex] : null;

  return (
    <section id="werk" className="section bg-bone">
      <div className="container-page">
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="eyebrow mb-3">{sectionTitles.gallery.eyebrow}</p>
          <h2 className="text-4xl md:text-5xl">{sectionTitles.gallery.title}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-6">
          {gallery.map((item, i) => (
            <MediaTile
              key={item.type === 'video' ? item.src : item.src}
              item={item}
              className={placement[i] ?? 'aspect-[4/3]'}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      </div>

      {active && (
        <div
          onClick={() => setActiveIndex(null)}
          className="fixed inset-0 z-50 bg-ink/90 flex items-center justify-center p-4 md:p-10"
        >
          <button
            type="button"
            aria-label="Sluiten"
            onClick={() => setActiveIndex(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-bone hover:text-saffron transition-colors"
          >
            <X size={32} strokeWidth={1.5} />
          </button>
          <figure
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full max-h-full"
          >
            {active.type === 'video' ? (
              <video
                ref={videoRef}
                src={active.src}
                poster={active.poster}
                controls
                autoPlay
                playsInline
                className="w-full h-auto max-h-[85vh] rounded-2xl bg-ink"
              />
            ) : (
              <img
                src={active.src}
                alt={active.alt}
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
              />
            )}
            <figcaption className="text-bone/80 text-center text-sm mt-4">
              {active.caption}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
