import { ArrowRight, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { SITE } from '../lib/site';

import type { SubjectKey } from './ContactModal';

type Props = { onOpen: (subject?: SubjectKey) => void };

export default function Contact({ onOpen }: Props) {
  return (
    <section id="contact" className="section relative overflow-hidden bg-sand">
      <div className="absolute inset-0 wash-sage pointer-events-none" aria-hidden />
      <div className="shell relative grid lg:grid-cols-[1fr_0.85fr] gap-10 lg:gap-16 items-center">
        <div>
          <span className="kicker">Contact</span>
          <h2 className="mt-4 display-lg text-ink">Een vraag stellen</h2>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-soft max-w-lg">
            Vraagt u zich af of deze behandeling iets voor u kan betekenen, of wilt u als therapeut
            meer weten over de specialisatie? Stel uw vraag, u krijgt persoonlijk antwoord.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button type="button" onClick={() => onOpen()} className="btn-terra">
              Stel uw vraag
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
            <a href={SITE.phoneHref} className="btn-outline">
              <Phone size={16} strokeWidth={2.2} />
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="card p-6 sm:p-7">
          <div className="flex flex-col gap-4">
            <Row icon={<Phone size={18} />} label="Telefoon">
              <a href={SITE.phoneHref} className="hover:text-terra transition-colors tnum">
                {SITE.phoneDisplay}
              </a>
            </Row>
            <Row icon={<MapPin size={18} />} label="Praktijk">
              <span>{SITE.locationLine}</span>
            </Row>
          </div>
          <a
            href={SITE.mainSite}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 pt-5 border-t border-line flex items-center gap-1.5 text-[14.5px] font-bold text-terra hover:text-terra-deep transition-colors"
          >
            Alle opleidingen en behandelingen
            <ArrowUpRight size={15} strokeWidth={2.4} />
          </a>
        </div>
      </div>
    </section>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="mt-0.5 w-10 h-10 shrink-0 rounded-lg bg-sand border border-line flex items-center justify-center text-terra">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-ink-mute">{label}</div>
        <div className="text-[16px] font-semibold text-ink mt-0.5">{children}</div>
      </div>
    </div>
  );
}
