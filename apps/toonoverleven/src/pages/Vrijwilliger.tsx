import { FileText, GraduationCap, HeartHandshake, Mail, Phone, Users } from 'lucide-react';
import type { Teksten } from '../content/types';
import { VRIJWILLIGERSBELEID } from '../documenten';
import { Knop, MAIL, PaginaHero, Sectie, TEL, TEL_LINK } from '../ui';

export default function Vrijwilliger({ teksten }: { teksten: Teksten }) {
  return (
    <>
      <PaginaHero
        kruimels={[{ label: 'Vrijwilliger worden' }]}
        titel={teksten.vrijwilliger.titel}
        lead={teksten.vrijwilliger.lead}
        foto={{
          src: '/img/vrijwilligers.webp',
          alt: 'Twee vrijwilligers bij de kraam van Toon over Leven',
        }}
        merkjes={[
          { icoon: GraduationCap, tekst: 'Training van ons' },
          { icoon: Users, tekst: 'Geen zorgachtergrond' },
          { icoon: HeartHandshake, tekst: 'Altijd samen' },
        ]}
        knoppen={
          <>
            <Knop href={`mailto:${MAIL}?subject=Vrijwilliger%20worden%20bij%20Toon%20over%20Leven`}>
              <Mail className="h-4 w-4" /> Stuur ons een mail
            </Knop>
            <Knop href={TEL_LINK} soort="rand">
              <Phone className="h-4 w-4" /> {TEL}
            </Knop>
          </>
        }
      />

      <Sectie>
        <div className="grid gap-6 lg:grid-cols-2">
          {teksten.vrijwilliger.rollen.map((rol) => (
            <article
              key={rol.kop}
              className="flex flex-col rounded-3xl border border-lijn bg-white p-7 md:p-8"
            >
              <h2 className="text-2xl">{rol.kop}</h2>
              <p className="mt-4 leading-relaxed text-inkt/75">{rol.tekst}</p>
              {rol.punten.length > 0 && (
                <ul className="mt-6 grid gap-2">
                  {rol.punten.map((punt) => (
                    <li key={punt} className="flex items-start gap-2.5 text-inkt/75">
                      <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-salie-diep" />
                      {punt}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-6 flex-1 leading-relaxed text-inkt/75">{rol.slot}</p>
            </article>
          ))}
        </div>
      </Sectie>

      <Sectie kleur="wijn">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <h2 className="text-3xl text-white md:text-4xl">{teksten.vrijwilliger.uitnodigingTitel}</h2>
            <p className="mt-5 max-w-xl leading-relaxed text-white/80">
              {teksten.vrijwilliger.uitnodiging}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${MAIL}?subject=Vrijwilliger%20worden%20bij%20Toon%20Overleven`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-wijn transition hover:bg-blos"
              >
                <Mail className="h-4 w-4" /> Stuur ons een mail
              </a>
              <a
                href={TEL_LINK}
                className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                <Phone className="h-4 w-4" /> {TEL}
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 p-7 md:p-8">
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-blos-diep">
              Ons vrijwilligersbeleid
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">
              Alles wat we met en voor vrijwilligers hebben afgesproken staat op papier. Lees het
              gerust door voordat je iets tekent.
            </p>
            <ul className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {VRIJWILLIGERSBELEID.map((d) => (
                <li key={d.bestand}>
                  <a
                    href={d.bestand}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-start gap-2 text-[15px] text-white/80 hover:text-white hover:underline"
                  >
                    <FileText className="mt-1 h-3.5 w-3.5 flex-none" />
                    {d.naam}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Sectie>
    </>
  );
}
