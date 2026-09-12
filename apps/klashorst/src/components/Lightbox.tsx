import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ui } from '../content';
import Paragraphs from './Paragraphs';

/**
 * A photograph, enlarged.
 *
 * The one way this site has of looking at an image properly: the page behind it
 * goes still, the work fills the screen, and the arrow keys, the chevrons or a
 * finger move to the next one. Used by the collection and by an article on the
 * blog, so that clicking a photograph does the same thing wherever a visitor
 * happens to be.
 */

export type LightboxFoto = {
  /** How the page that opened this viewer names the photograph. */
  key: string;
  /** The large version. */
  src: string;
  alt: string;
  /** The line at the top. Absent for a photograph that carries no title. */
  titel?: string;
  /** Under the title, or in its place when there is no title. */
  onderschrift?: string;
  /** A longer note, centred under the photograph. */
  toelichting?: string;
};

export default function Lightbox({
  fotos,
  index,
  onIndex,
}: {
  fotos: LightboxFoto[];
  /** Which photograph is open, or null for none. */
  index: number | null;
  onIndex: (index: number | null) => void;
}) {
  /** How far the finger has carried the enlarged photograph, while it carries it. */
  const [shift, setShift] = useState(0);
  const swipe = useRef<{ x: number; y: number; dx: number; sideways: boolean | null } | null>(null);

  const aantal = fotos.length;
  const open = index !== null;
  const sluiten = useCallback(() => onIndex(null), [onIndex]);

  const step = useCallback(
    (delta: number) => {
      if (index === null || aantal < 2) return;
      onIndex((index + delta + aantal) % aantal);
    },
    [index, aantal, onIndex],
  );

  /**
   * While a photograph is open the page behind it does not scroll, and closing
   * it hands the keyboard back to the image that was clicked rather than to the
   * top of the document.
   */
  useEffect(() => {
    if (!open) return;
    const vorige = document.activeElement;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      if (vorige instanceof HTMLElement && vorige.isConnected) vorige.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') sluiten();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, step, sluiten]);

  /**
   * Swiping between photographs, because on a phone the chevrons are a small
   * target and a photograph is something you expect to be able to push aside.
   * The image follows the finger so the gesture answers, and a swipe that does
   * not carry far enough simply slides back.
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
    // between photographs or it belongs to the page, and it never changes its
    // mind.
    if (start.sideways === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      start.sideways = Math.abs(dx) > Math.abs(dy);
    }
    if (!start.sideways) return;
    start.dx = dx;
    setShift(aantal > 1 ? dx : 0);
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

  const current = index === null ? null : fotos[index];
  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-ink"
      role="dialog"
      aria-modal="true"
      aria-label={current.titel || current.onderschrift || current.alt || ui.werk.vergroot}
    >
      <div className="flex items-center justify-between gap-5 border-b border-hair px-5 py-3 md:px-8">
        <div>
          {current.titel && <h3 className="display text-lg md:text-xl">{current.titel}</h3>}
          {/* Without a title this line is what names the photograph, so it is
              read at full strength rather than as a caption under one. */}
          {current.onderschrift && (
            <p
              className={
                current.titel ? 'text-xs text-muted md:text-sm' : 'text-sm text-bone md:text-base'
              }
            >
              {current.onderschrift}
            </p>
          )}
        </div>
        <button type="button" onClick={sluiten} aria-label={ui.lightbox.sluiten} className="p-2">
          <X size={26} />
        </button>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden p-4 md:p-8"
        style={{ touchAction: 'pan-y' }}
        // The dark around the photograph closes it, which is what a visitor
        // tries before they look for the cross.
        onClick={(event) => {
          if (event.target === event.currentTarget) sluiten();
        }}
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        onTouchEnd={touchEnd}
        onTouchCancel={touchEnd}
      >
        <img
          src={current.src}
          alt={current.alt}
          draggable={false}
          className="max-h-full max-w-full select-none object-contain"
          style={{
            transform: shift ? `translateX(${shift}px)` : undefined,
            transition: shift ? 'none' : 'transform 220ms ease-out',
          }}
        />
        {/* A single photograph has nowhere to go: it is opened and closed, and
            the chevrons would be two buttons that do nothing. */}
        {aantal > 1 && (
          <>
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
          </>
        )}
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
  );
}
