import { useEffect, useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function StickyCallCta({ t }: Props) {
  const [show, setShow] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const io = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  if (!show || footerVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 safe-bottom pt-3 pointer-events-none">
      <div className="flex gap-2.5">
        <a
          href="tel:+31631674344"
          className="pointer-events-auto flex-1 bg-pink text-white rounded-full py-3.5 font-medium flex items-center justify-center gap-2 shadow-[0_12px_30px_-8px_rgba(229,88,120,0.6)]"
        >
          <Phone size={18} />
          {t('nav.call')}
        </a>
        <a
          href="https://wa.me/31631674344"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="pointer-events-auto w-14 bg-ink text-cream rounded-full py-3.5 flex items-center justify-center shadow-[0_12px_30px_-8px_rgba(12,61,82,0.6)]"
        >
          <MessageCircle size={18} />
        </a>
      </div>
    </div>
  );
}
