import {useCallback, useEffect, useRef, useState} from 'react';
import {MoveHorizontal} from 'lucide-react';

/**
 * Schuifvergelijking tussen twee foto's van dezelfde kamer. Sleep de greep of
 * gebruik de pijltjestoetsen; het rechterbeeld wordt afgesneden op de stand van
 * de schuif. Werkt met muis, vinger en toetsenbord.
 */
export default function Voorna({
  voor, na, voorAlt, naAlt,
}: {
  voor: string;
  na: string;
  voorAlt: string;
  naAlt: string;
}) {
  const [stand, setStand] = useState(50);
  const [sleept, setSleept] = useState(false);
  const kader = useRef<HTMLDivElement>(null);

  const zet = useCallback((clientX: number) => {
    const el = kader.current;
    if (!el) return;
    const {left, width} = el.getBoundingClientRect();
    setStand(Math.min(100, Math.max(0, ((clientX - left) / width) * 100)));
  }, []);

  useEffect(() => {
    if (!sleept) return;
    const beweeg = (e: PointerEvent) => zet(e.clientX);
    const los = () => setSleept(false);
    window.addEventListener('pointermove', beweeg);
    window.addEventListener('pointerup', los);
    return () => {
      window.removeEventListener('pointermove', beweeg);
      window.removeEventListener('pointerup', los);
    };
  }, [sleept, zet]);

  return (
    <div
      ref={kader}
      onPointerDown={(e) => {setSleept(true); zet(e.clientX);}}
      className="relative aspect-[4/3] w-full touch-none select-none overflow-hidden rounded-2xl border border-white/12 sm:aspect-[16/10]"
    >
      <img src={voor} alt={voorAlt} className="absolute inset-0 h-full w-full object-cover" />

      <div className="absolute inset-0 overflow-hidden" style={{clipPath: `inset(0 0 0 ${stand}%)`}}>
        <img src={na} alt={naAlt} className="absolute inset-0 h-full w-full object-cover" />
      </div>

      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-ink/75 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
        Voor
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink">
        Na
      </span>

      {/* Greep */}
      <div className="pointer-events-none absolute inset-y-0" style={{left: `${stand}%`}}>
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-gold" />
        <button
          type="button"
          role="slider"
          aria-label="Vergelijk voor en na"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(stand)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setStand((s) => Math.max(0, s - 4));
            if (e.key === 'ArrowRight') setStand((s) => Math.min(100, s + 4));
          }}
          className="pointer-events-auto absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-gold text-ink shadow-lg outline-none ring-gold/50 focus-visible:ring-4"
        >
          <MoveHorizontal className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
