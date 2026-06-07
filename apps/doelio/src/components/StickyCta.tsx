import { useEffect, useState } from 'react';
import type { SiteContent } from '../i18n';
import { WHATSAPP_URL } from '../data/site';
import WhatsappIcon from './WhatsappIcon';

type Props = { c: SiteContent };

/** Mobile-only sticky WhatsApp CTA. Appears after the hero scrolls away. */
export default function StickyCta({ c }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`safe-bottom fixed inset-x-3 bottom-0 z-40 pb-3 transition-all duration-500 sm:hidden ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
    >
      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
        <WhatsappIcon className="h-[18px] w-[18px]" />
        {c.nav.cta}
      </a>
    </div>
  );
}
