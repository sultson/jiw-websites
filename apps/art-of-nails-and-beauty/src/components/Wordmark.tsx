type Props = { tone?: 'dark' | 'light' };

/** Typographic logo: italic serif "A" monogram in a lacquer disc + wordmark. */
export default function Wordmark({ tone = 'dark' }: Props) {
  const ink = tone === 'light' ? 'text-white' : 'text-ink';
  const sub = tone === 'light' ? 'text-white/70' : 'text-wine';
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="grid place-items-center w-9 h-9 rounded-[0.7rem] text-[1.15rem] font-serif italic text-[#f3e4e4] shrink-0"
        style={{
          background: 'linear-gradient(150deg,#a4596a,#7d3a48 60%,#6a2f3c)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 6px 14px -8px rgba(106,47,60,0.6)',
        }}
        aria-hidden="true"
      >
        A
      </span>
      <span className="leading-none">
        <span className={`block font-serif text-[1.02rem] tracking-tight ${ink}`}>
          Art of Nails
        </span>
        <span className={`block text-[0.6rem] uppercase tracking-[0.34em] mt-0.5 ${sub}`}>
          &amp; Beauty
        </span>
      </span>
    </span>
  );
}
