import { useState } from 'react';
import { Instagram } from 'lucide-react';
import { galleryImages } from '../data/gallery';
import Lightbox from './Lightbox';

export default function Gallery() {
  const [idx, setIdx] = useState<number | null>(null);

  return (
    <section id="werk" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <span className="kicker">Het werk</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Een kijkje in de studio</h2>
          <p className="mt-3 text-sm text-ink/60">Tik op een foto voor een grotere weergave.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {galleryImages.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setIdx(i)}
              className="group relative overflow-hidden rounded-xl md:rounded-2xl aspect-[4/5]"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors" />
            </button>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://www.instagram.com/veronica_nailsalon/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex"
          >
            <Instagram size={16} />
            Meer op Instagram
          </a>
        </div>
      </div>

      <Lightbox
        images={galleryImages}
        index={idx}
        onClose={() => setIdx(null)}
        onNav={dir =>
          setIdx(i => {
            if (i === null) return i;
            return (i + dir + galleryImages.length) % galleryImages.length;
          })
        }
      />
    </section>
  );
}
