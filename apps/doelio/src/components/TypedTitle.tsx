import { useEffect, useState } from 'react';

type Props = { titleA: string; titleB: string };

/**
 * Types the hero title on intro. `titleA` keeps the default ink colour, `titleB`
 * the dimmed accent — the same two-tone split as the static heading. An invisible
 * copy of the full title reserves the final box so nothing below reflows as the
 * text grows, and an `sr-only` copy keeps it readable to assistive tech. Honours
 * prefers-reduced-motion by rendering the whole title immediately.
 */
export default function TypedTitle({ titleA, titleB }: Props) {
  const full = `${titleA} ${titleB}`;
  const headLen = titleA.length + 1; // include the trailing space

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [count, setCount] = useState(reduced ? full.length : 0);

  useEffect(() => {
    if (reduced) return;
    let i = 0;
    let timer = 0;
    const tick = () => {
      i += 1;
      setCount(i);
      if (i < full.length) {
        // a touch longer after a space so the two words feel deliberate
        const delay = full[i - 1] === ' ' ? 150 : 62;
        timer = window.setTimeout(tick, delay);
      }
    };
    const start = window.setTimeout(tick, 420);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(timer);
    };
  }, [full, reduced]);

  const typed = full.slice(0, count);
  const head = typed.slice(0, Math.min(count, headLen));
  const tail = count > headLen ? typed.slice(headLen) : '';
  const done = count >= full.length;

  return (
    <span className="relative block">
      {/* reserves the full wrapped box so the page below never jumps */}
      <span aria-hidden="true" className="invisible">
        {full}
      </span>
      <span className="absolute inset-0" aria-hidden="true">
        {head}
        <span className="text-ink-dim">{tail}</span>
        <span className={`type-caret${done ? ' type-caret--done' : ''}`} />
      </span>
      <span className="sr-only">{full}</span>
    </span>
  );
}
