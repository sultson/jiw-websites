import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

export default function StickyBookCta({ t, onBook }: Props) {
  const [show, setShow] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const io = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { rootMargin: '0px 0px -20% 0px' },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  if (!show || footerVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 safe-bottom pt-3 pointer-events-none">
      <button
        onClick={onBook}
        className="pointer-events-auto w-full bg-gold text-cream rounded-full py-3.5 font-medium flex items-center justify-center gap-2 shadow-[0_10px_30px_-8px_rgba(107,59,94,0.5)]"
      >
        <Calendar size={18} />
        {t('nav.book')}
      </button>
    </div>
  );
}
