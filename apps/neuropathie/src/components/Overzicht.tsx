import { MapPin, Phone, ArrowUpRight, ArrowRight, Mail } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { therapeuten } from '../data/content';
import { SITE } from '../lib/site';
import type { SubjectKey } from './ContactModal';

type Props = { onOpen: (subject?: SubjectKey) => void };

/**
 * The therapist overview. The network list is still empty — until the client supplies it
 * this section routes people to Lydia directly instead of showing an empty page.
 */
export default function Overzicht({ onOpen }: Props) {
  const gevuld = therapeuten.length > 0;

  return (
    <section id="overzicht" className="section bg-canvas">
      <div className="shell-wide">
        <SectionHeader
          eyebrow="Een therapeut vinden"
          title="Gespecialiseerde voetreflextherapeuten"
          intro={
            gevuld
              ? 'Deze therapeuten zijn speciaal opgeleid om de behandeling voetreflexologie bij neuropathie te geven. Neem direct contact met hen op voor een afspraak.'
              : 'Juist voor mensen met neuropathie is het belangrijk dat zij een gespecialiseerde voetreflextherapeut in hun eigen omgeving kunnen vinden. Het netwerk is in opbouw.'
          }
        />

        {gevuld ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {therapeuten.map((th) => (
              <div key={`${th.naam}-${th.plaats}`} className="card p-6 flex flex-col">
                <h3 className="font-display text-[21px] text-ink">{th.naam}</h3>
                <div className="mt-1.5 flex items-center gap-1.5 text-[14px] text-ink-mute">
                  <MapPin size={14} strokeWidth={2.2} />
                  {th.plaats}
                  <span className="text-ink-mute/60">·</span>
                  {th.provincie}
                </div>
                <div className="mt-5 pt-5 border-t border-line flex flex-col gap-2.5 text-[15px]">
                  {th.telefoon && (
                    <a
                      href={`tel:${th.telefoon.replace(/\s/g, '')}`}
                      className="inline-flex items-center gap-2 font-semibold text-ink hover:text-terra transition-colors"
                    >
                      <Phone size={15} strokeWidth={2.2} className="text-terra" />
                      <span className="tnum">{th.telefoon}</span>
                    </a>
                  )}
                  {th.site && (
                    <a
                      href={th.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-terra hover:text-terra-deep transition-colors"
                    >
                      Naar de praktijk
                      <ArrowUpRight size={14} strokeWidth={2.4} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 card p-7 sm:p-9 max-w-2xl">
            <span className="chip chip-sage">Netwerk in opbouw</span>
            <p className="mt-5 text-[16.5px] leading-relaxed text-ink-soft">
              Het overzicht per plaats komt hier zodra het netwerk daar groot genoeg voor is. Zoekt u
              nu een behandeling? Laat weten in welke plaats u woont, dan kijkt Lydia van der Bie of er
              iemand in uw omgeving is.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={() => onOpen('behandeling')} className="btn-terra">
                <Mail size={16} strokeWidth={2.3} />
                Vraag naar een therapeut
              </button>
              <a href={SITE.phoneHref} className="btn-outline">
                <Phone size={16} strokeWidth={2.2} />
                {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-ink-soft">
          <span>Bent u voetreflexzonetherapeute en wilt u deze behandeling leren geven?</span>
          <a
            href="#therapeuten"
            className="inline-flex items-center gap-1.5 font-bold text-terra hover:text-terra-deep transition-colors"
          >
            Bekijk de specialisatiecursus
            <ArrowRight size={14} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </section>
  );
}
