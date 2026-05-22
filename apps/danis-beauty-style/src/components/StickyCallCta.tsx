import { useEffect, useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { business } from '../data/contact';

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
      <div className="pointer-events-auto flex gap-2">
        <a
          href={business.phone.href}
          className="flex-1 btn btn-gold !py-3"
        >
          <Phone size={16} aria-hidden="true" />
          {t('hero.ctaCall')}
        </a>
        <a
          href={business.phone.wa}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline bg-ink/95 backdrop-blur-md !py-3 !px-5"
          aria-label="WhatsApp"
        >
          <MessageCircle size={16} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
