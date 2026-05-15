import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type LightboxImage = { src: string; alt: string };

type Props = {
  images: LightboxImage[];
  index: number;
  open: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

/** Full-screen image lightbox: dark backdrop, arrows, keyboard nav, scroll lock. */
export default function Lightbox({ images, index, open, onClose, onPrev, onNext }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;
  const img = images[index];
  if (!img) return null;
  const multi = images.length > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={img.alt}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-cobalt-ink/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Sluiten"
        onClick={onClose}
        className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white hover:text-ink"
      >
        <X className="h-6 w-6" />
      </button>

      {multi && (
        <>
          <button
            type="button"
            aria-label="Vorige"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white hover:text-ink sm:left-6"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            aria-label="Volgende"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white hover:text-ink sm:right-6"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </>
      )}

      <figure
        className="flex max-h-[90vh] max-w-[92vw] flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.src}
          alt={img.alt}
          className="max-h-[80vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
          decoding="async"
        />
        <figcaption className="flex items-center gap-3 text-[13px] text-white/70">
          <span className="max-w-md text-center">{img.alt}</span>
          {multi && (
            <span className="tnum shrink-0 rounded-full border border-white/15 px-2.5 py-0.5 font-semibold text-white/85">
              {index + 1} / {images.length}
            </span>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
