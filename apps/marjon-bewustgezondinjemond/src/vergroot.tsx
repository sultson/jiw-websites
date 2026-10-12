/* ---------- de vergrootglas-weergave ----------

   De meridianenkaart is een tekening met heel veel kleine tekst. Hij opende eerst
   als los bestand in een nieuw tabblad: je verliet de site en kwam terug op een
   kale pagina met een plaatje. Nu blijft de bezoeker op de pagina en komt de
   tekening er bovenop te liggen, met zoomen en slepen - net als de foto's op
   klashorstmuseum.nl, waar deze opzet vandaan komt (kleiner gehouden: hier is er
   maar een afbeelding, dus geen volgende/vorige).

   Het is een <dialog> met showModal(), geen eigen div met een hoge z-index. Dan
   regelt de browser zelf de bovenste laag, Escape sluiten en het buitensluiten
   van de rest van de pagina voor toetsenbord en schermlezer.

   Het bestand is een vector (svg), dus inzoomen blijft scherp - tot vier keer,
   daarboven is er niets meer bij te winnen. */

import {useCallback, useEffect, useRef, useState, type PointerEvent} from 'react';
import {createPortal} from 'react-dom';
import {Maximize, Minus, Plus, X} from 'lucide-react';

const MAX = 4;

export function Vergroot({
  src,
  alt,
  onderschrift,
  open,
  onSluit,
}: {
  src: string;
  alt: string;
  onderschrift?: string;
  open: boolean;
  onSluit: () => void;
}) {
  const venster = useRef<HTMLDialogElement>(null);
  const vlak = useRef<HTMLDivElement>(null);
  const plaat = useRef<HTMLImageElement>(null);
  const vingers = useRef(new Map<number, {x: number; y: number}>());
  const [stand, setStand] = useState({schaal: 1, x: 0, y: 0});

  const terug = useCallback(() => setStand({schaal: 1, x: 0, y: 0}), []);

  /* Slepen mag niet zo ver dat de tekening buiten beeld raakt: wat je verschuift
     is begrensd door wat er op dat moment meer is dan het venster. */
  const binnen = useCallback((schaal: number, x: number, y: number) => {
    schaal = Math.min(MAX, Math.max(1, schaal));
    const maxX = Math.max(0, ((plaat.current?.clientWidth ?? 0) * schaal - (vlak.current?.clientWidth ?? 0)) / 2);
    const maxY = Math.max(0, ((plaat.current?.clientHeight ?? 0) * schaal - (vlak.current?.clientHeight ?? 0)) / 2);
    return {schaal, x: Math.max(-maxX, Math.min(maxX, x)), y: Math.max(-maxY, Math.min(maxY, y))};
  }, []);

  const zoom = useCallback((keer: number) => setStand(s => binnen(s.schaal * keer, s.x, s.y)), [binnen]);

  useEffect(() => {
    if (!open) return;
    terug();
    vingers.current.clear();
    const vorige = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    venster.current?.showModal();
    return () => {
      venster.current?.close();
      document.body.style.overflow = overflow;
      if (vorige instanceof HTMLElement && vorige.isConnected) vorige.focus();
    };
  }, [open, terug]);

  useEffect(() => {
    if (!open) return;
    const el = vlak.current;
    /* passive: false, anders mag preventDefault niet en scrollt de pagina eronder mee. */
    const wiel = (e: WheelEvent) => {
      e.preventDefault();
      zoom(Math.exp(-e.deltaY * 0.002));
    };
    const maat = () => terug();
    el?.addEventListener('wheel', wiel, {passive: false});
    window.addEventListener('resize', maat);
    return () => {
      el?.removeEventListener('wheel', wiel);
      window.removeEventListener('resize', maat);
    };
  }, [open, zoom, terug]);

  function neer(e: PointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest('button') || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    vingers.current.set(e.pointerId, {x: e.clientX, y: e.clientY});
  }

  function beweeg(e: PointerEvent<HTMLDivElement>) {
    const oud = vingers.current.get(e.pointerId);
    if (!oud) return;
    const nu = {x: e.clientX, y: e.clientY};
    const ander = [...vingers.current.entries()].find(([id]) => id !== e.pointerId)?.[1];
    vingers.current.set(e.pointerId, nu);
    if (ander) {
      /* twee vingers: de afstand ertussen bepaalt hoeveel er bij komt */
      const voor = Math.hypot(oud.x - ander.x, oud.y - ander.y);
      const na = Math.hypot(nu.x - ander.x, nu.y - ander.y);
      if (voor > 0) setStand(s => binnen((s.schaal * na) / voor, s.x + (nu.x - oud.x) / 2, s.y + (nu.y - oud.y) / 2));
    } else if (stand.schaal > 1) {
      setStand(s => binnen(s.schaal, s.x + nu.x - oud.x, s.y + nu.y - oud.y));
    }
  }

  function op(e: PointerEvent<HTMLDivElement>) {
    vingers.current.delete(e.pointerId);
  }

  if (!open) return null;

  return createPortal(
    <dialog
      ref={venster}
      className="vergroot-venster"
      aria-label={onderschrift || alt}
      onCancel={e => {
        e.preventDefault();
        onSluit();
      }}
      onKeyDown={e => {
        if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          zoom(1.5);
        }
        if (e.key === '-') {
          e.preventDefault();
          zoom(1 / 1.5);
        }
        if (e.key === '0') terug();
      }}
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/15 px-4 py-2.5 sm:px-6">
        <p className="min-w-0 flex-1 text-xs text-room/70 sm:text-sm">{onderschrift}</p>
        <div className="flex items-center gap-1 text-room">
          <button
            type="button"
            onClick={() => zoom(1 / 1.5)}
            disabled={stand.schaal <= 1}
            aria-label="Uitzoomen"
            className="rounded-full p-2 transition hover:bg-white/10 disabled:opacity-30"
          >
            <Minus className="h-5 w-5" />
          </button>
          <span className="w-12 text-center text-xs tabular-nums" aria-live="polite">
            {Math.round(stand.schaal * 100)}%
          </span>
          <button
            type="button"
            onClick={() => zoom(1.5)}
            disabled={stand.schaal >= MAX}
            aria-label="Inzoomen"
            className="rounded-full p-2 transition hover:bg-white/10 disabled:opacity-30"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={terug}
            aria-label="Passend in beeld"
            className="rounded-full p-2 transition hover:bg-white/10"
          >
            <Maximize className="h-5 w-5" />
          </button>
          <button
            type="button"
            autoFocus
            onClick={onSluit}
            aria-label="Sluiten"
            className="rounded-full p-2 transition hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div
        ref={vlak}
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-2 sm:p-4"
        style={{touchAction: 'none', cursor: stand.schaal > 1 ? 'grab' : 'zoom-in'}}
        onPointerDown={neer}
        onPointerMove={beweeg}
        onPointerUp={op}
        onPointerCancel={op}
        onDoubleClick={() => (stand.schaal > 1 ? terug() : zoom(2))}
      >
        <img
          ref={plaat}
          src={src}
          alt={alt}
          draggable={false}
          className="block max-h-full max-w-full rounded-lg bg-white object-contain select-none"
          style={{transform: `translate(${stand.x}px, ${stand.y}px) scale(${stand.schaal})`}}
        />
      </div>

      <p className="shrink-0 px-5 py-2 text-center text-xs text-room/60">
        Zoom met + en &minus;, het muiswiel of twee vingers. Sleep om de kaart te bekijken. Escape sluit.
      </p>
    </dialog>,
    document.body,
  );
}
