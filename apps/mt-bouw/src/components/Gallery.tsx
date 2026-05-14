import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { gallery, sectionTitles } from '../content';

function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

  if (gallery.length === 0) return null;

  const active = activeIndex !== null ? gallery[activeIndex] : null;

  return (
    <section id="werk" className="section bg-bone-soft relative overflow-hidden">
      {/* Sky: soft cloud blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-[8%] h-56 w-80 rounded-full bg-bone opacity-80 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 right-[14%] h-48 w-72 rounded-full bg-bone opacity-70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[42%] left-[-4%] h-40 w-64 rounded-full bg-bone opacity-60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-[6%] h-44 w-72 rounded-full bg-bone opacity-50 blur-3xl"
      />

      {/* Saffron warm light blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-[-8rem] h-80 w-80 rounded-full bg-saffron opacity-10 blur-3xl"
      />

      {/* Ladder accent — vertical right edge */}
      <svg
        aria-hidden="true"
        viewBox="0 0 60 800"
        preserveAspectRatio="none"
        className="pointer-events-none absolute right-2 md:right-8 top-0 h-full w-8 md:w-12 text-ink opacity-[0.07]"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <line x1="14" y1="0" x2="14" y2="800" />
        <line x1="46" y1="0" x2="46" y2="800" />
        {Array.from({ length: 18 }, (_, i) => {
          const y = 30 + i * 44;
          return <line key={i} x1="14" y1={y} x2="46" y2={y} />;
        })}
      </svg>

      <div className="container-page relative z-10">
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="eyebrow mb-3">{sectionTitles.gallery.eyebrow}</p>
          <h2 className="text-4xl md:text-5xl">{sectionTitles.gallery.title}</h2>
          <p className="mt-5 text-stone text-base md:text-lg leading-relaxed">
            Steigers, hoogwerkers en ladders. Dakkapellen, gevels en kozijnen op hoogte, met
            veilig en gecertificeerd materieel.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto md:mx-0">
          {gallery.map((item, i) => (
            <figure
              key={item.src}
              onClick={() => setActiveIndex(i)}
              className="group relative rounded-2xl overflow-hidden bg-bone cursor-pointer aspect-[3/4] shadow-[0_20px_40px_-25px_rgba(15,26,46,0.35)]"
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
            <img
              src={active.src}
              alt={active.alt}
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
            />
            <figcaption className="text-bone/80 text-center text-sm mt-4">
              {active.caption}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}

export default Gallery;
