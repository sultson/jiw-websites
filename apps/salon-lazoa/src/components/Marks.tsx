type MarkProps = { className?: string };

/* Quiet hand-drawn brush stroke — used under display headings */
export function BrushUnderline({ className = '' }: MarkProps) {
  return (
    <svg viewBox="0 0 120 24" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path
        d="M2 14 C 22 8, 46 6, 72 10 S 102 18, 118 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M10 17 C 30 13, 58 11, 84 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

/* Enso — incomplete brushed circle, classic japandi mark */
export function Enso({ className = '' }: MarkProps) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path
        d="M 50 8
           C 25 8, 8 28, 8 50
           S 25 92, 50 92
           C 72 92, 90 75, 92 52"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M 92 52 C 92 47, 91 42, 89 38"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

/* Thin vertical line for asymmetric kicker stacks */
export function VerticalRule({ className = '', length = 48 }: MarkProps & { length?: number }) {
  return (
    <span
      className={className}
      style={{ display: 'inline-block', width: 1, height: length, background: 'currentColor', opacity: 0.65 }}
      aria-hidden
    />
  );
}

/* Section number — used as a quiet japandi cadence cue: 〇一 〇二 〇三 */
export function SectionNumber({ n, className = '' }: { n: number; className?: string }) {
  const label = String(n).padStart(2, '0');
  return (
    <span
      className={`font-display tracking-[0.06em] text-sumi/55 ${className}`}
      aria-hidden
    >
      —{' '}{label}
    </span>
  );
}

/* Tatami divider — three thin lines with breathing space */
export function TatamiDivider({ className = '' }: MarkProps) {
  return (
    <span className={`inline-flex items-center gap-[3px] ${className}`} aria-hidden>
      <span className="block w-7 h-px bg-current opacity-50" />
      <span className="block w-1 h-px bg-current opacity-50" />
      <span className="block w-7 h-px bg-current opacity-50" />
    </span>
  );
}
