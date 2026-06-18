import { useEffect, useRef, useState } from 'react';
import { Phone, MessageCircle, Clock, CalendarCheck } from 'lucide-react';
import { site, hours } from '../data/site';

type Props = { t: (k: string) => string };

export default function Booking({ t }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMount(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="book" className="scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-start">
          {/* Left: intro + quick contact */}
          <div className="reveal lg:sticky lg:top-24">
            <span className="kicker">{t('book.kicker')}</span>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t('book.title')}</h2>
            <p className="mt-5 text-ink-soft leading-relaxed max-w-md">{t('book.sub')}</p>

            <div className="mt-8 flex flex-col gap-3 max-w-sm">
              <a
                href={`tel:${site.phoneE164}`}
                className="card-gloss px-5 py-4 flex items-center gap-3.5 hover:-translate-y-0.5 transition-transform"
              >
                <span className="grid place-items-center w-10 h-10 rounded-full bg-white ring-1 ring-wine/10 text-wine shrink-0">
                  <Phone size={18} />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-ink-faint">{t('book.call')}</span>
                  <span className="block font-medium text-ink">{site.phoneDisplay}</span>
                </span>
              </a>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="card-gloss px-5 py-4 flex items-center gap-3.5 hover:-translate-y-0.5 transition-transform"
              >
                <span className="grid place-items-center w-10 h-10 rounded-full bg-[#25D366]/12 text-[#1da851] shrink-0">
                  <MessageCircle size={18} />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-ink-faint">{t('book.whats')}</span>
                  <span className="block font-medium text-ink">{site.phoneDisplay}</span>
                </span>
              </a>
            </div>

            <div className="mt-6 flex items-start gap-2.5 text-sm text-ink-soft max-w-sm">
              <Clock size={16} className="text-wine shrink-0 mt-0.5" />
              <span>
                {hours.find((h) => h.key === 'visit.day.tue')?.value} ·{' '}
                {t('visit.day.tue')} t/m {t('visit.day.fri')}, {t('visit.day.sat')} {hours.find((h) => h.key === 'visit.day.sat')?.value}
              </span>
            </div>
          </div>

          {/* Right: Treatwell widget */}
          <div ref={ref} className="reveal">
            <div className="card-gloss p-2.5 overflow-hidden">
              <div className="relative rounded-[1.1rem] overflow-hidden bg-white">
                {!loaded && (
                  <div className="absolute inset-0 grid place-items-center text-ink-faint">
                    <span className="inline-flex items-center gap-2 text-sm">
                      <CalendarCheck size={18} className="text-wine animate-pulse" />
                      {t('book.loading')}…
                    </span>
                  </div>
                )}
                {mount && (
                  <iframe
                    src={site.treatwellWidget}
                    title="Treatwell"
                    className="w-full border-0 bg-white"
                    style={{ height: 'min(78vh, 720px)' }}
                    allow="payment"
                    onLoad={() => setLoaded(true)}
                  />
                )}
                {!mount && <div style={{ height: 'min(78vh, 720px)' }} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
