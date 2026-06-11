import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { TEL_URL } from '../data/contact';

type Props = { t: (k: string) => string };

export default function StickyCallCta({ t }: Props) {
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
      <a
        href={TEL_URL}
        className="pointer-events-auto w-full bg-gold text-cream rounded-full py-3.5 font-medium flex items-center justify-center gap-2 shadow-[0_10px_30px_-8px_rgba(166,66,78,0.5)]"
      >
        <Phone size={18} />
        {t('nav.call')}
      </a>
    </div>
  );
}
