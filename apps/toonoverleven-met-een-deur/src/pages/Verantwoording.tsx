import { Download } from 'lucide-react';
import type { Teksten } from '../content/types';
import { VERANTWOORDING } from '../documenten';
import { KVK, Kop, MAIL, PLAATS, POSTCODE, RSIN, STRAAT, Sectie, TEL, TEL_LINK } from '../ui';

export default function Verantwoording({ teksten }: { teksten: Teksten }) {
  return (
    <Sectie>
      <Kop
        kicker={teksten.verantwoording.kicker}
        titel={teksten.verantwoording.titel}
        intro={teksten.verantwoording.lead}
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-lijn bg-white p-7 md:p-9">
          <h2 className="text-xl">Stukken om te lezen</h2>
          <ul className="mt-6 divide-y divide-lijn">
            {VERANTWOORDING.map((d) => (
              <li key={d.bestand}>
                <a
                  href={d.bestand}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-4 py-4"
                >
                  <span className="mt-0.5 grid h-10 w-10 flex-none place-items-center rounded-full bg-salie/45 transition group-hover:bg-salie">
                    <Download className="h-4 w-4 text-groen" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold group-hover:underline">{d.naam}</span>
                    <span className="mt-0.5 block text-[15px] text-groen/65">{d.over}</span>
                  </span>
                  <span className="mt-1 flex-none text-sm text-groen/45">PDF, {d.grootte}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-6">
          <div className="rounded-3xl border border-lijn bg-white p-7 md:p-8">
            <h2 className="text-lg">Gegevens van de stichting</h2>
            <dl className="mt-5 space-y-3 text-[15px]">
              <Gegeven kop="Statutaire naam">Stichting Toon Hermans Huis Zeewolde</Gegeven>
              <Gegeven kop="Handelsnaam sinds 1 juli 2026">Toon over Leven</Gegeven>
              <Gegeven kop="KvK-nummer">{KVK}</Gegeven>
              <Gegeven kop="RSIN en ANBI-nummer">{RSIN}</Gegeven>
              <Gegeven kop="Adres">
                {STRAAT}, {POSTCODE} {PLAATS}
              </Gegeven>
              <Gegeven kop="Contact">
                <a href={TEL_LINK} className="text-teal-tekst hover:underline">
                  {TEL}
                </a>
                {' · '}
                <a href={`mailto:${MAIL}`} className="text-teal-tekst hover:underline">
                  {MAIL}
                </a>
              </Gegeven>
              <Gegeven kop="Medewerkers">0 betaalde krachten, ongeveer 20 vrijwilligers</Gegeven>
            </dl>
          </div>

          <div className="rounded-3xl border border-lijn bg-white p-7 md:p-8">
            <h2 className="text-lg">Beloningsbeleid</h2>
            <p className="mt-3 leading-relaxed text-groen/75">{teksten.verantwoording.beloning}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-lijn bg-white p-7 md:p-8">
          <h2 className="text-lg">Wat de stichting wil bereiken</h2>
          <p className="mt-3 leading-relaxed text-groen/75">{teksten.verantwoording.doel}</p>
        </div>

        <div className="rounded-3xl border border-lijn bg-white p-7 md:p-8">
          <h2 className="text-lg">Bestuur en raad van advies</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-teal-tekst">
                Bestuur
              </h3>
              <ul className="mt-3 space-y-2">
                {teksten.verantwoording.bestuur.map((b) => (
                  <li key={b.naam}>
                    <span className="font-semibold">{b.naam}</span>
                    <span className="block text-[15px] text-groen/60">{b.rol}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-teal-tekst">
                Raad van advies
              </h3>
              <ul className="mt-3 space-y-2">
                {teksten.verantwoording.advies.map((a) => (
                  <li key={a.naam}>
                    <span className="font-semibold">{a.naam}</span>
                    <span className="block text-[15px] text-groen/60">{a.rol}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Sectie>
  );
}

function Gegeven({ kop, children }: { kop: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-x-3">
      <dt className="w-full font-semibold sm:w-52 sm:flex-none">{kop}</dt>
      <dd className="text-groen/75">{children}</dd>
    </div>
  );
}
