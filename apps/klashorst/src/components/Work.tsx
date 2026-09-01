import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { content, ui, type Werk } from '../content';
import Paragraphs from './Paragraphs';

/**
 * The collection. Nothing here is on offer: the museum shows the work, and a
 * card is a way to look at it larger rather than a way to buy it.
 */
export default function Work() {
  const t = content.teksten.werk;
  const werken = content.werk;
  const [index, setIndex] = useState<number | null>(null);
  /** How far the finger has carried the enlarged work, while it is carrying it. */
  const [shift, setShift] = useState(0);
  const swipe = useRef<{ x: number; y: number; dx: number; sideways: boolean | null } | null>(null);

  const step = useCallback(
    (delta: number) => {
      setIndex((current) => (current === null ? null : (current + delta + werken.length) % werken.length));
    },
    [werken.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIndex(null);
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [index, step]);

  const current = index === null ? null : werken[index];
  const label = (work: Werk) => [work.techniek, work.afmetingen].filter(Boolean).join(', ');
  /**
   * What to call a work out loud. Not every work is named, and one that isn't
   * still needs a name for the button that opens it and for a screen reader.
   */
  const describe = (work: Werk) =>
    [work.titel, label(work)].filter(Boolean).join(', ') || ui.werk.zonderTitel;

  /**
   * Swiping between works, because on a phone the chevrons are a small target
   * and a photograph is something you expect to be able to push aside. The
   * work follows the finger so the gesture answers, and a swipe that does not
   * carry far enough simply slides back.
   */
  const touchStart = (event: TouchEvent) => {
    // A finger that lands on a chevron is pressing it, not swiping.
    if ((event.target as HTMLElement).closest('button')) return;
    const touch = event.touches[0];
    swipe.current = { x: touch.clientX, y: touch.clientY, dx: 0, sideways: null };
  };

  const touchMove = (event: TouchEvent) => {
    const start = swipe.current;
    if (!start || event.touches.length > 1) return;
    const touch = event.touches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    // Decided once, on the first few pixels: the gesture is either sideways
    // between works or it belongs to the page, and it never changes its mind.
    if (start.sideways === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      start.sideways = Math.abs(dx) > Math.abs(dy);
    }
    if (!start.sideways) return;
    start.dx = dx;
    setShift(dx);
  };

  const touchEnd = () => {
    const start = swipe.current;
    swipe.current = null;
    setShift(0);
    if (!start?.sideways) return;
    // Far enough to be meant, measured against the screen so the gesture asks
    // the same of a phone as of a tablet.
    const enough = Math.min(90, Math.max(40, window.innerWidth * 0.12));
    if (Math.abs(start.dx) >= enough) step(start.dx < 0 ? 1 : -1);
  };

  return (
    <section id="werk" className="scroll-mt-20 border-t border-hair py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <header className="max-w-5xl">
          {t.eyebrow && <p className="eyebrow">{t.eyebrow}</p>}
          <div className={`flex flex-wrap items-center gap-x-7 gap-y-3 md:gap-x-10 ${t.eyebrow ? 'mt-4' : ''}`}>
            {t.titel && <h2 className="display text-4xl md:text-6xl">{t.titel}</h2>}
            <span className="klashorst-signature" aria-hidden="true" />
          </div>
          <div className="mt-5 max-w-2xl">
            <Paragraphs value={t.lead} className="text-[0.98rem] leading-relaxed text-muted" />
          </div>
        </header>

        {/* A collection emptied in the Studio is an empty collection here. The
            section says so rather than quietly falling back to the works this
            build shipped with, which is what made deleting them look broken. */}
        {werken.length === 0 ? (
          <div className="mt-10 max-w-xl">
            <Paragraphs value={t.leeg} className="text-[0.95rem] leading-relaxed text-muted" />
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:mt-16 md:grid-cols-3 md:gap-x-8 md:gap-y-14 lg:grid-cols-4">
            {werken.map((work, i) => (
              <article key={work.id} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className="group text-left"
                  aria-label={`${ui.werk.vergroot}: ${describe(work)}`}
                >
                  {/* One fixed box for every card, so the titles underneath sit
                      on a single baseline across the row. The work is contained
                      rather than cropped: an art site must not recrop the art. */}
                  <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-wall">
                    <img
                      src={work.img.grid}
                      alt={describe(work)}
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full object-contain transition-opacity duration-300 group-hover:opacity-85"
                    />
                  </div>
                  {/* A work without a title gets no title line: the technique
                      moves up into its place rather than a placeholder. */}
                  {work.titel && (
                    <h3 className="display mt-3 text-base leading-tight md:text-lg">{work.titel}</h3>
                  )}
                  {label(work) && (
                    <p className={`text-xs text-muted md:text-[0.8rem] ${work.titel ? 'mt-1' : 'mt-3'}`}>
                      {label(work)}
                    </p>
                  )}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-ink"
          role="dialog"
          aria-modal="true"
          aria-label={describe(current)}
        >
          <div className="flex items-center justify-between gap-5 border-b border-hair px-5 py-3 md:px-8">
            <div>
              {current.titel && <h3 className="display text-lg md:text-xl">{current.titel}</h3>}
              {/* Without a title this line is what names the work, so it is
                  read at full strength rather than as a caption under one. */}
              <p
                className={
                  current.titel ? 'text-xs text-muted md:text-sm' : 'text-sm text-bone md:text-base'
                }
              >
                {label(current)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIndex(null)}
              aria-label={ui.lightbox.sluiten}
              className="p-2"
            >
              <X size={26} />
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center overflow-hidden p-4 md:p-8"
            style={{ touchAction: 'pan-y' }}
            onTouchStart={touchStart}
            onTouchMove={touchMove}
            onTouchEnd={touchEnd}
            onTouchCancel={touchEnd}
          >
            <img
              src={current.img.full}
              alt={describe(current)}
              draggable={false}
              className="max-h-full max-w-full select-none object-contain"
              style={{
                transform: shift ? `translateX(${shift}px)` : undefined,
                transition: shift ? 'none' : 'transform 220ms ease-out',
              }}
            />
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={ui.lightbox.vorige}
              className="absolute left-2 p-3 text-bone/60 hover:text-bone md:left-6"
            >
              <ChevronLeft size={34} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={ui.lightbox.volgende}
              className="absolute right-2 p-3 text-bone/60 hover:text-bone md:right-6"
            >
              <ChevronRight size={34} />
            </button>
          </div>

          {current.toelichting && (
            <div className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-6">
              <Paragraphs
                value={current.toelichting}
                className="text-center text-sm leading-relaxed text-bone"
                gap="mt-3"
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
