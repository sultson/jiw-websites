import { useRef, type ReactNode, type CSSProperties } from 'react';

type Props = {
  children: ReactNode;
  /** max px the element travels toward the cursor */
  strength?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Magnetic hover wrapper — the element eases toward the pointer, clamped to
 * ±strength px (stuctopper's button-mousemove effect). Pointer-only; touch
 * devices never fire pointermove-over-hover so it's inert there.
 */
export default function Magnetic({ children, strength = 16, className = '', style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const clamp = (v: number) => Math.max(-strength, Math.min(strength, v));
    el.style.transform = `translate3d(${clamp(dx * 0.4)}px, ${clamp(dy * 0.4)}px, 0)`;
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = 'translate3d(0,0,0)';
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`inline-flex transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
