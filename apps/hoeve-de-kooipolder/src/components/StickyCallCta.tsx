import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function StickyCallCta({ t }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 pt-3 safe-bottom pointer-events-none">
      <a
        href="tel:+31628577711"
        className="btn-primary pointer-events-auto w-full py-3.5 shadow-[0_10px_30px_-8px_rgba(46,36,51,0.5)]"
      >
        <Phone size={18} />
        {t('sticky.call')}
      </a>
    </div>
  );
}
