import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { ui, lang } from '../content';
import Paragraphs from './Paragraphs';

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

export default function Lightbox({ fotos, index, onIndex }: {
  fotos: LightboxFoto[];
  index: number | null;
  onIndex: (index: number | null) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const swipe = useRef<number | null>(null);
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const current = index === null ? null : fotos[index];
  const open = !!current;
  const labels = lang === 'nl'
    ? { in: 'Inzoomen', out: 'Uitzoomen', reset: 'Passend in beeld', hint: 'Zoom met + en −, het muiswiel of twee vingers. Sleep om de foto te bekijken.' }
    : { in: 'Zoom in', out: 'Zoom out', reset: 'Fit to screen', hint: 'Zoom with + and −, the mouse wheel or two fingers. Drag to explore the photo.' };
  const reset = () => setView({ scale: 1, x: 0, y: 0 });
  const step = useCallback((delta: number) => {
    if (index !== null && fotos.length > 1) onIndex((index + delta + fotos.length) % fotos.length);
  }, [index, fotos.length, onIndex]);

  // Clamp panning to the enlarged image so it cannot be lost off screen.
  const bounded = useCallback((scale: number, x: number, y: number) => {
    scale = Math.min(4, Math.max(1, scale));
    const maxX = Math.max(0, ((photo.current?.clientWidth ?? 0) * scale - (stage.current?.clientWidth ?? 0)) / 2);
    const maxY = Math.max(0, ((photo.current?.clientHeight ?? 0) * scale - (stage.current?.clientHeight ?? 0)) / 2);
    return { scale, x: Math.max(-maxX, Math.min(maxX, x)), y: Math.max(-maxY, Math.min(maxY, y)) };
  }, []);
  const zoom = useCallback((factor: number) => setView(v => bounded(v.scale * factor, v.x, v.y)), [bounded]);

  useEffect(() => { reset(); pointers.current.clear(); swipe.current = null; }, [index]);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    return () => {
      dialog.current?.close();
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const element = stage.current;
    const wheel = (event: WheelEvent) => { event.preventDefault(); zoom(Math.exp(-event.deltaY * 0.002)); };
    const resize = () => reset();
    element?.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('resize', resize);
    return () => { element?.removeEventListener('wheel', wheel); window.removeEventListener('resize', resize); };
  }, [open, zoom]);

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('button') || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    swipe.current = pointers.current.size === 1 && view.scale === 1 ? event.clientX : null;
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const old = pointers.current.get(event.pointerId);
    if (!old) return;
    const next = { x: event.clientX, y: event.clientY };
    const other = [...pointers.current.entries()].find(([id]) => id !== event.pointerId)?.[1];
    pointers.current.set(event.pointerId, next);
    if (other) {
      const before = Math.hypot(old.x - other.x, old.y - other.y);
      const after = Math.hypot(next.x - other.x, next.y - other.y);
      if (before > 0) setView(v => bounded(v.scale * after / before, v.x + (next.x - old.x) / 2, v.y + (next.y - old.y) / 2));
    } else if (view.scale > 1) {
      setView(v => bounded(v.scale, v.x + next.x - old.x, v.y + next.y - old.y));
    }
  }
  function pointerUp(event: PointerEvent<HTMLDivElement>) {
    if (event.type !== 'pointercancel' && swipe.current !== null && view.scale === 1) {
      const dx = event.clientX - swipe.current;
      if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);
    }
    pointers.current.delete(event.pointerId);
    swipe.current = null;
  }

  if (!current) return null;
  return createPortal(
    <dialog ref={dialog} className="photo-dialog" aria-label={current.titel || current.onderschrift || current.alt || ui.werk.vergroot}
      onCancel={() => onIndex(null)}
      onKeyDown={event => {
        if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
        if (event.key === '+' || event.key === '=') { event.preventDefault(); zoom(1.5); }
        if (event.key === '-') { event.preventDefault(); zoom(1 / 1.5); }
        if (event.key === '0') reset();
      }}>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-hair px-4 py-3 md:px-8">
        <div className="min-w-0 flex-1">
          {current.titel && <h3 className="display text-lg md:text-xl">{current.titel}</h3>}
          {current.onderschrift && <p className="text-xs text-muted md:text-sm">{current.onderschrift}</p>}
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => zoom(1 / 1.5)} disabled={view.scale <= 1} aria-label={labels.out} className="p-2 disabled:opacity-30"><ZoomOut size={22} /></button>
          <span className="w-12 text-center text-xs" aria-live="polite">{Math.round(view.scale * 100)}%</span>
          <button type="button" onClick={() => zoom(1.5)} disabled={view.scale >= 4} aria-label={labels.in} className="p-2 disabled:opacity-30"><ZoomIn size={22} /></button>
          <button type="button" onClick={reset} aria-label={labels.reset} className="p-2"><RotateCcw size={20} /></button>
          <button type="button" autoFocus onClick={() => onIndex(null)} aria-label={ui.lightbox.sluiten} className="p-2"><X size={26} /></button>
        </div>
      </div>
      <div ref={stage} className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden"
        style={{ touchAction: 'none', cursor: view.scale > 1 ? 'grab' : 'zoom-in' }}
        onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}
        onDoubleClick={() => view.scale > 1 ? reset() : zoom(2)}>
        <img ref={photo} src={current.src} alt={current.alt} draggable={false}
          className="block max-h-full max-w-full select-none object-contain"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }} />
        {fotos.length > 1 && <>
          <button type="button" onClick={() => step(-1)} aria-label={ui.lightbox.vorige} className="absolute left-2 rounded bg-ink/80 p-3 md:left-6"><ChevronLeft size={30} /></button>
          <button type="button" onClick={() => step(1)} aria-label={ui.lightbox.volgende} className="absolute right-2 rounded bg-ink/80 p-3 md:right-6"><ChevronRight size={30} /></button>
        </>}
      </div>
      <div className="max-h-[20vh] shrink-0 overflow-auto px-5 py-3 text-center">
        <p className="text-xs text-muted">{labels.hint}</p>
        {current.toelichting && <Paragraphs value={current.toelichting} className="mx-auto mt-2 max-w-2xl text-sm text-bone" gap="mt-3" />}
      </div>
    </dialog>, document.body,
  );
}
