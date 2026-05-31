import { ArrowRight, Mail, Phone, MapPin, Clock } from 'lucide-react';
import Reveal from './Reveal';
import { SITE } from '../lib/site';

type Props = { t: (k: string) => string; onOpen: () => void };

export default function Contact({ t, onOpen }: Props) {
  return (
    <section id="contact" className="section relative overflow-hidden bg-sand">
      <div className="absolute inset-0 wash-rose pointer-events-none" aria-hidden />
      <div className="shell relative grid lg:grid-cols-[1fr_0.85fr] gap-10 lg:gap-16 items-center">
        {/* Left: invitation + CTA */}
        <div>
          <span className="kicker">{t('ct.eyebrow')}</span>
          <h2 className="mt-4 display-lg text-ink">{t('ct.title')}</h2>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-soft max-w-lg">{t('ct.intro')}</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button type="button" onClick={onOpen} className="btn-terra">
              {t('ct.openForm')}
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
            <a href={SITE.phoneHref} className="btn-outline">
              <Phone size={16} strokeWidth={2.2} />
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>

        {/* Right: contact details card */}
        <Reveal delay={1}>
          <div className="card p-6 sm:p-7 shadow-[0_30px_70px_-45px_rgba(58,33,24,0.45)]">
            <div className="flex flex-col gap-4">
              <Row icon={<Mail size={18} />} label={t('ct.emailLabel')}>
                <a href={`mailto:${SITE.email}`} className="text-[14px] sm:text-[15px] hover:text-terra transition-colors break-all">
                  {SITE.email}
                </a>
              </Row>
              <Row icon={<Phone size={18} />} label={t('ct.phoneLabel')}>
                <a href={SITE.phoneHref} className="hover:text-terra transition-colors tnum">
                  {SITE.phoneDisplay}
                </a>
              </Row>
              <Row icon={<MapPin size={18} />} label={t('ct.locationLabel')}>
                <span>{SITE.locationLine}</span>
              </Row>
              <Row icon={<Clock size={18} />} label={t('ct.hoursLabel')}>
                <span>{t('ct.hoursValue')}</span>
              </Row>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="mt-0.5 w-10 h-10 shrink-0 rounded-full bg-sand border border-line flex items-center justify-center text-terra">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-ink-mute">{label}</div>
        <div className="text-[16px] font-semibold text-ink mt-0.5">{children}</div>
      </div>
    </div>
  );
}
