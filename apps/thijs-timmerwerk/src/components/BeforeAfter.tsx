import { useCallback, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: 'before' | 'during';
  afterLabelKey?: string;
  orientation: 'portrait' | 'landscape';
  alt: string;
  t: (k: string) => string;
};

/**
 * Before/after image comparison slider. Two stacked images; the AFTER image is
 * clipped via clip-path inset driven by a 0–100 position. Pointer-drag handle
 * for smooth control, plus a visually-styled range input for keyboard a11y.
 */
export default function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabelKey,
  orientation,
  alt,
  t,
}: Props) {
  const [pos, setPos] = useState(50);
  const [touched, setTouched] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const beforeText = beforeLabel === 'during' ? t('pr.during') : t('pr.before');
  const afterText = afterLabelKey ? t(afterLabelKey) : t('pr.after');

  const setFromClientX = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const next = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, next)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    setTouched(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setFromClientX(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* capture may already be released */
    }
  };

  const aspect = orientation === 'portrait' ? '3 / 4' : '4 / 3';

  return (
    <div
      ref={wrapRef}
      className="relative w-full select-none overflow-hidden rounded-2xl border border-line-cool bg-bone-deep"
      style={{ aspectRatio: aspect, touchAction: 'pan-y' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* BEFORE — base layer */}
      <img
        src={beforeSrc}
        alt={`${alt} — ${beforeText}`}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
        loading="lazy"
      />

      {/* AFTER — clipped overlay, revealed on the right of the divider */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      >
        <img
          src={afterSrc}
          alt={`${alt} — ${afterText}`}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          loading="lazy"
        />
      </div>

      {/* corner labels */}
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white backdrop-blur-sm">
        {beforeText}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-cobalt/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white backdrop-blur-sm">
        {afterText}
      </span>

      {/* divider + grip */}
      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_0_1px_rgba(12,27,58,0.15)]"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-cobalt bg-white shadow-[0_4px_16px_rgba(12,27,58,0.3)]">
          <MoveHorizontal className="h-5 w-5 text-cobalt" strokeWidth={2.5} />
        </div>
      </div>

      {/* drag hint */}
      <span
        className={`pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm transition-opacity duration-500 ${
          touched ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {t('pr.drag')}
      </span>

      {/* range input — keyboard accessible control overlaid full-width */}
      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={pos}
        aria-label={t('pr.drag')}
        onChange={(e) => {
          setTouched(true);
          setPos(Number(e.target.value));
        }}
        className="ba-range absolute inset-0 z-20 h-full w-full opacity-0"
      />
    </div>
  );
}
