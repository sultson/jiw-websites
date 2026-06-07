type Props = {
  className?: string;
  withWordmark?: boolean;
};

/**
 * Doelio mark: a target / aim ("doel" = goal in Dutch). A glass ring with an
 * off-centre luminous core, rendered so it reads as a small piece of the same
 * Liquid Glass material as the rest of the chrome.
 */
export default function Logo({ className = '', withWordmark = true }: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true" className="shrink-0">
        <defs>
          <linearGradient id="doelio-ring" x1="3" y1="3" x2="23" y2="23" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0.95" />
            <stop offset="1" stopColor="white" stopOpacity="0.35" />
          </linearGradient>
          <radialGradient id="doelio-core" cx="0.4" cy="0.35" r="0.75">
            <stop stopColor="oklch(0.86 0.12 210)" />
            <stop offset="1" stopColor="oklch(0.64 0.2 280)" />
          </radialGradient>
        </defs>
        <circle cx="13" cy="13" r="10.5" stroke="url(#doelio-ring)" strokeWidth="1.5" />
        <circle cx="13" cy="13" r="6" stroke="white" strokeOpacity="0.28" strokeWidth="1.25" />
        <circle cx="13" cy="13" r="3" fill="url(#doelio-core)" />
      </svg>
      {withWordmark && (
        <span className="text-[1.15rem] font-semibold tracking-tight text-ink lowercase">doelio</span>
      )}
    </span>
  );
}
