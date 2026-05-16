import { useCallback, useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, MoveHorizontal, ZoomIn } from 'lucide-react';
import { sectionTitles, beforeAfters, gallery } from '../content';

/* ------------------------------------------------------------------ */
/* Before / after comparison slider                                   */
/* ------------------------------------------------------------------ */

type BeforeAfterData = (typeof beforeAfters)[number];

function BeforeAfter({ data }: { data: BeforeAfterData }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const clamp = (n: number) => Math.min(100, Math.max(0, n));

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    setPos(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  // Pointer events cover both mouse and touch with a single API.
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      updateFromClientX(e.clientX);
    };
    const stop = () => {
      draggingRef.current = false;
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, [updateFromClientX]);

  const startDrag = (e: React.PointerEvent) => {
    draggingRef.current = true;
    updateFromClientX(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setPos((p) => clamp(p - step));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setPos((p) => clamp(p + step));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setPos(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setPos(100);
    }
  };

  return (
    <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Copy */}
      <div className="lg:col-span-4">
        <h3 className="text-2xl md:text-3xl">{data.title}</h3>
        <p className="mt-4 text-bone-soft">{data.body}</p>
        <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-mute">
          <MoveHorizontal size={16} className="text-gold" aria-hidden="true" />
          Sleep om voor en na te vergelijken
        </p>
      </div>

      {/* Slider */}
      <div className="lg:col-span-8">
        <div
          ref={containerRef}
          className={`relative w-full select-none overflow-hidden rounded-2xl border border-line bg-ink-3 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7)] ${data.frame}`}
        >
          {/* Before (base layer) */}
          <img
            src={data.before.src}
            alt={data.before.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* After (clipped top layer) */}
          <div
            className="absolute inset-0 h-full w-full overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            <img
              src={data.after.src}
              alt={data.after.alt}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          {/* Corner labels */}
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-bright backdrop-blur-sm">
            {data.afterLabel}
          </span>
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-bone-soft backdrop-blur-sm">
            {data.beforeLabel}
          </span>

          {/* Divider + handle */}
          <div
            className="absolute inset-y-0 z-10 w-px bg-gold-bright/80"
            style={{ left: `${pos}%` }}
          >
            <div
              role="slider"
              tabIndex={0}
              aria-label={`Vergelijk ${data.afterLabel.toLowerCase()} en ${data.beforeLabel.toLowerCase()}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              aria-valuetext={`${Math.round(pos)}% ${data.afterLabel.toLowerCase()} zichtbaar`}
              onPointerDown={startDrag}
              onKeyDown={onKeyDown}
              className="absolute top-1/2 left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none place-items-center rounded-full bg-gradient-to-br from-[#c89e48] via-[#f2e394] to-[#b98c41] text-ink shadow-[0_8px_24px_-6px_rgba(0,0,0,0.7)] transition-transform duration-150 hover:scale-105"
            >
              <MoveHorizontal size={20} strokeWidth={2.5} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Lightbox                                                            */
/* ------------------------------------------------------------------ */

type GalleryItem = (typeof gallery)[number];

function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: readonly GalleryItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [handleKey]);

  const img = items[index];
  if (!img) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={img.caption}
    >
      <button
        type="button"
        className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full border border-line bg-ink-2/80 text-bone-soft transition-colors hover:border-gold hover:text-gold-bright sm:right-6 sm:top-6"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Sluiten"
      >
        <X size={22} />
      </button>

      <button
        type="button"
        className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-ink-2/80 text-bone-soft transition-colors hover:border-gold hover:text-gold-bright sm:left-6"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Vorige afbeelding"
      >
        <ChevronLeft size={24} />
      </button>

      <figure
        className="flex max-h-full max-w-3xl flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.src}
          alt={img.alt}
          loading="eager"
          decoding="async"
          className="max-h-[78vh] w-auto rounded-xl object-contain"
        />
        <figcaption className="mt-4 flex items-center gap-3 text-sm text-bone-soft">
          <span className="font-medium text-bone">{img.caption}</span>
          <span className="text-mute">
            {index + 1} / {items.length}
          </span>
        </figcaption>
      </figure>

      <button
        type="button"
        className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-ink-2/80 text-bone-soft transition-colors hover:border-gold hover:text-gold-bright sm:right-6"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Volgende afbeelding"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery tile                                                        */
/* ------------------------------------------------------------------ */

// Desktop bento spans for the 6 tiles over a 12-col grid.
const tileSpans = [
  'md:col-span-7 md:row-span-2',
  'md:col-span-5 md:row-span-1',
  'md:col-span-5 md:row-span-1',
  'md:col-span-4 md:row-span-1',
  'md:col-span-4 md:row-span-1',
  'md:col-span-4 md:row-span-1',
];

function GalleryTile({
  item,
  index,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  onOpen: (i: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className={`group relative overflow-hidden rounded-xl border border-line bg-ink-3 sm:rounded-2xl ${tileSpans[index] ?? ''}`}
      aria-label={`Bekijk: ${item.caption}`}
    >
      <img
        src={item.src}
        alt={item.alt}
        loading="lazy"
        decoding="async"
        className="h-full min-h-[9rem] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />

      {/* Bottom gradient + caption */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-4">
        <span className="translate-y-1 text-sm font-semibold text-bone transition-transform duration-300 group-hover:translate-y-0 sm:text-base">
          {item.caption}
        </span>
        <span className="grid h-8 w-8 shrink-0 translate-y-1 place-items-center rounded-full bg-gradient-to-br from-[#c89e48] via-[#f2e394] to-[#b98c41] text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ZoomIn size={15} strokeWidth={2.5} aria-hidden="true" />
        </span>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function Work() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const close = useCallback(() => setOpenIdx(null), []);
  const prev = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length)),
    [],
  );
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i + 1) % gallery.length)),
    [],
  );

  return (
    <section id="werk" className="section bg-ink-2">
      <div className="container-page">
        {/* Header */}
        <div className="max-w-2xl">
          <span className="eyebrow">{sectionTitles.work.eyebrow}</span>
          <h2 className="mt-4 text-4xl md:text-5xl">
            <span className="text-gradient-gold">Recent</span> uitgevoerd werk.
          </h2>
        </div>

        {/* Part A — before/after sliders */}
        <div className="mt-12 space-y-14 md:mt-16 md:space-y-20">
          {beforeAfters.map((item) => (
            <BeforeAfter key={item.title} data={item} />
          ))}
        </div>

        <div className="hairline my-12 md:my-16" />

        {/* Part B — gallery bento grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:auto-rows-[200px] md:grid-cols-12">
          {gallery.map((item, i) => (
            <GalleryTile key={item.src} item={item} index={i} onOpen={setOpenIdx} />
          ))}
        </div>
      </div>

      {openIdx !== null && (
        <Lightbox
          items={gallery}
          index={openIdx}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  );
}
