import { Facebook, FileText, Instagram } from 'lucide-react';
import { CONTACT, MENU } from './Nav';
import { VERANTWOORDING } from '../documenten';
import {
  FACEBOOK,
  INSTAGRAM,
  IPSO,
  KVK,
  MAIL,
  ONDERTITEL,
  PLAATS,
  POSTCODE,
  RSIN,
  STRAAT,
  TEL,
  TEL_LINK,
} from '../ui';

/**
 * De voettekst staat in dezelfde room als de rest van de pagina.
 *
 * Hij was eerst een donkergroen blok, en dat werkte als een streep onder de
 * site: alles erboven warm, en dan opeens een muur. Nu loopt de pagina gewoon
 * door en is het onderste stuk waar je iets opzoekt: het adres, de tijden, de
 * stukken die een ANBI openbaar hoort te maken.
 */
export default function Voet() {
  return (
    <footer className="border-t border-lijn bg-room-diep">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 md:px-8 lg:grid-cols-[1.3fr_0.8fr_0.9fr_1.1fr]">
        <div>
          <img src="/img/logo-vol.png" alt="Toon over Leven" className="h-24 w-auto" loading="lazy" />
          <p className="mt-5 max-w-sm leading-relaxed text-inkt/70">
            {ONDERTITEL}. Voor iedereen in en om {PLAATS} die met kanker te maken heeft of heeft
            gehad, en voor hun naasten. Aangesloten bij{' '}
            <a href={IPSO} target="_blank" rel="noreferrer" className="font-semibold text-wijn hover:underline">
              IPSO
            </a>
            .
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={FACEBOOK}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="grid h-10 w-10 place-items-center rounded-full border border-wijn/20 text-wijn transition hover:bg-blos"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full border border-wijn/20 text-wijn transition hover:bg-blos"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-wijn-licht">Contact</h2>
          <address className="mt-4 space-y-1 not-italic text-inkt/75">
            <p>{STRAAT}</p>
            <p>
              {POSTCODE} {PLAATS}
            </p>
            <p className="pt-2">
              <a href={TEL_LINK} className="hover:text-wijn hover:underline">
                {TEL}
              </a>
            </p>
            <p>
              <a href={`mailto:${MAIL}`} className="hover:text-wijn hover:underline">
                {MAIL}
              </a>
            </p>
          </address>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-wijn-licht">
            Op deze site
          </h2>
          <ul className="mt-4 space-y-2 text-inkt/75">
            {[...MENU, CONTACT, { pad: '/verantwoording', label: 'Verantwoording en ANBI' }].map(
              (m) => (
                <li key={m.pad}>
                  <a href={m.pad} className="hover:text-wijn hover:underline">
                    {m.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Een ANBI hoort haar beleidsplan en jaarstukken openbaar te maken, en
            een bezoeker hoort ze te kunnen vinden zonder te hoeven zoeken. */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-wijn-licht">
            Beleid en jaarstukken
          </h2>
          <ul className="mt-4 space-y-2 text-inkt/75">
            {VERANTWOORDING.map((d) => (
              <li key={d.bestand}>
                <a
                  href={d.bestand}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-start gap-2 hover:text-wijn hover:underline"
                >
                  <FileText className="mt-1 h-3.5 w-3.5 flex-none text-wijn/60" />
                  {d.naam}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-lijn">
        {/* Extra ruimte onderaan: anders legt de zwevende berichtknop zich over
            de laatste regel heen. */}
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 pb-24 text-sm text-inkt/50 md:px-8 sm:pb-5">
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
