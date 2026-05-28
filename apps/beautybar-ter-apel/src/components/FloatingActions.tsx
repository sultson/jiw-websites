import { useEffect, useState } from 'react';
import { MessageCircle, Phone } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function FloatingActions({ t }: Props) {
  const [show, setShow] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
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
    <div className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-40 flex flex-col items-end gap-3 safe-bottom">
      <a
        href="https://wa.me/31623800854"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Beautybar Ter Apel"
        title={t('hero.ctaWa')}
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.55)] ring-1 ring-white/40 transition-transform hover:scale-105"
      >
        <MessageCircle size={26} strokeWidth={2} fill="currentColor" className="text-white" />
      </a>
      <a
        href="tel:+31623800854"
        aria-label={t('hero.ctaCall')}
        title={t('hero.ctaCall')}
        className="grid h-12 w-12 place-items-center rounded-full bg-ink text-cream shadow-[0_12px_30px_-10px_rgba(42,25,34,0.55)] ring-1 ring-cream/20 transition-transform hover:scale-105 md:hidden"
      >
        <Phone size={20} />
      </a>
    </div>
  );
}
