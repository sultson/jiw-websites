import { Facebook, FileText, Instagram } from 'lucide-react';
import { MENU } from './Nav';
import { VERANTWOORDING } from '../documenten';
import { IPSO, KVK, MAIL, PLAATS, POSTCODE, RSIN, STRAAT, TEL, TEL_LINK } from '../ui';

export default function Voet() {
  return (
    <footer className="bg-groen-diep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 md:px-8 lg:grid-cols-[1.2fr_0.8fr_0.9fr_1.1fr]">
        <div>
          <div className="inline-block rounded-2xl bg-white/95 px-5 py-4">
            <img src="/img/logo-vol.png" alt="Toon over Leven" className="h-24 w-auto" loading="lazy" />
          </div>
          <p className="mt-5 max-w-sm text-white/65">
            Inloophuis voor iedereen in en om Zeewolde die met kanker te maken heeft of heeft gehad.
            Aangesloten bij{' '}
            <a href={IPSO} target="_blank" rel="noreferrer" className="font-semibold text-salie hover:underline">
              IPSO
            </a>
            .
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="https://www.facebook.com/ToonHermansHuisZeewolde"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/25 transition hover:bg-white/10"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://www.instagram.com/toon_over_leven_zeewolde/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/25 transition hover:bg-white/10"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-salie">Contact</h2>
          <address className="mt-4 space-y-1 not-italic text-white/75">
            <p>{STRAAT}</p>
            <p>
              {POSTCODE} {PLAATS}
            </p>
            <p className="pt-2">
              <a href={TEL_LINK} className="hover:underline">
                {TEL}
              </a>
            </p>
            <p>
              <a href={`mailto:${MAIL}`} className="hover:underline">
                {MAIL}
              </a>
            </p>
          </address>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-salie">Op deze site</h2>
          <ul className="mt-4 space-y-2 text-white/75">
            {[...MENU, { pad: '/verantwoording', label: 'Verantwoording en ANBI' }].map((m) => (
              <li key={m.pad}>
                <a href={m.pad} className="hover:underline">
                  {m.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Een ANBI hoort haar beleidsplan en jaarstukken openbaar te maken, en
            een bezoeker hoort ze te kunnen vinden zonder te hoeven zoeken. */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-salie">
            Beleid en jaarstukken
          </h2>
          <ul className="mt-4 space-y-2 text-white/75">
            {VERANTWOORDING.map((d) => (
              <li key={d.bestand}>
                <a
                  href={d.bestand}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-start gap-2 hover:underline"
                >
                  <FileText className="mt-1 h-3.5 w-3.5 flex-none" />
                  {d.naam}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/12">
        {/* Extra ruimte onderaan: anders legt de zwevende berichtknop zich over
            de laatste regel heen. */}
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 pb-24 text-sm text-white/45 md:px-8 sm:pb-5">
          <p>
            Stichting Toon Hermans Huis Zeewolde, sinds 1 juli 2026 Toon over Leven. KvK {KVK}, RSIN
            en ANBI-nummer {RSIN}.
          </p>
          <p>ANBI-erkend</p>
        </div>
      </div>
    </footer>
  );
}
