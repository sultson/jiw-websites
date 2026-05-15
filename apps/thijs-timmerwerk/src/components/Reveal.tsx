import { useEffect, useRef, useState, type ReactNode, type ElementType } from 'react';

type Props = {
  children: ReactNode;
  /** stagger delay step: 0–4 maps to reveal-d1..d4 */
  delay?: 0 | 1 | 2 | 3 | 4;
  className?: string;
  as?: ElementType;
};

/**
 * Wraps content in a scroll-reveal. Adds `.is-in` once the element enters
 * the viewport (once only). Respects prefers-reduced-motion via CSS.
 */
export default function Reveal({ children, delay = 0, className = '', as }: Props) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  const delayClass = delay ? `reveal-d${delay}` : '';

  return (
    <Tag ref={ref} className={`reveal ${delayClass} ${shown ? 'is-in' : ''} ${className}`}>
      {children}
    </Tag>
  );
}
