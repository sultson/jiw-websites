import type { ReactNode } from 'react';
import { Facebook, Instagram } from 'lucide-react';
import type { Bericht } from '../content/types';
import { bron } from '../content/image';
import { vindPagina } from '../inhoud';
import RijkeTekst from '../components/RijkeTekst';
import NieuwsStrook from '../components/NieuwsStrook';
import { ContactKaart, Kruimels, PaginaHero, Schil, schrijfNaam } from '../ui';

/**
 * Eén bericht, op een adres van zichzelf.
 *
 * Dat is het hele punt van de verhuizing van de socialstrook naar het beheer:
 * een kaart op de voorpagina opent nu het hele verhaal op deze site, en deze
 * pagina is te delen, te openen in een nieuw tabblad en te vinden via Google.
 *
 * De pagina heeft dezelfde vorm als de andere pagina's van de site: waar je
 * bent, waar het over gaat, de tekst links en de uitnodiging rechts. Een
 * bericht is geen apart eiland.
 */

/** De uitnodiging naast de pagina staat in de vastgestelde tekst van de rubriek. */
const ZIJKAART = vindPagina('/ervaringen')?.zijkaart;

export default function NieuwsBericht({
  bericht,
  berichten,
}: {
  bericht: Bericht;
  berichten: Bericht[];
}) {
  const verder = berichten.filter((ander) => ander.id !== bericht.id).slice(0, 2);

  return (
    <>
      <Schil>
        <Kruimels
          pad={[
            { label: 'Home', href: '/' },
            { label: 'Ervaringen', href: '/ervaringen' },
            { label: 'Nieuws en verhalen', href: '/nieuws' },
            { label: schrijfNaam(bericht.titel) },
          ]}
        />
      </Schil>

      <PaginaHero
        kicker={bericht.datum || 'Nieuws en verhalen'}
        titel={schrijfNaam(bericht.titel)}
        lead={bericht.intro ? schrijfNaam(bericht.intro) : undefined}
        smal
      />

      <Schil className="grid items-start gap-10 pb-20 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16 xl:gap-[5.5rem]">
        <article className="min-w-0">
          <section className="py-9 md:py-11">
            {/* Hun eigen aankondigingen staan vaak rechtop. Op de volle breedte
                zou zo'n staande poster de halve pagina zijn, dus de hoogte is
                begrensd en het beeld staat gecentreerd. */}
            {bericht.img && (
              <img
                src={bron(bericht.img, 'vol')}
                alt=""
                className="mx-auto mb-8 max-h-[30rem] w-auto rounded-[1.25rem] object-cover"
                loading="eager"
                decoding="async"
              />
            )}
            <RijkeTekst blokken={bericht.body} />
          </section>

          {(bericht.instagram || bericht.facebook) && (
            <section className="border-t border-lijn py-9 md:py-11">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[0.9rem] text-grijs">Dit bericht staat ook op</p>
                {bericht.instagram && (
                  <Deellink href={bericht.instagram} naam="Instagram">
                    <Instagram className="h-4 w-4" aria-hidden="true" />
                  </Deellink>
                )}
                {bericht.facebook && (
                  <Deellink href={bericht.facebook} naam="Facebook">
                    <Facebook className="h-4 w-4" aria-hidden="true" />
                  </Deellink>
                )}
              </div>
            </section>
          )}

          {verder.length > 0 && (
            <section className="border-t border-lijn py-9 md:py-11">
              <h2 className="mb-5 max-w-[22ch] text-[1.75rem] md:text-[2.15rem]">Meer berichten</h2>
              <NieuwsStrook berichten={verder} />
            </section>
          )}
        </article>

        {ZIJKAART && (
          <aside className="lg:sticky lg:top-[7.2rem]">
            <ContactKaart
              kicker={ZIJKAART.kicker}
              kop={ZIJKAART.kop}
              tekst={ZIJKAART.tekst}
              acties={ZIJKAART.acties}
            />
          </aside>
        )}
      </Schil>
    </>
  );
}

/** De verwijzing naar hetzelfde bericht op de socials. */
function Deellink({
  href,
  naam,
  children,
}: {
  href: string;
  naam: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-lijn bg-white px-4 py-2 text-[0.82rem] font-extrabold text-inkt-zacht no-underline transition hover:border-blos-diep hover:text-wijn"
    >
      {children}
      {naam}
      <span aria-hidden="true">↗</span>
      <span className="sr-only">(opent in een nieuw tabblad)</span>
    </a>
  );
}
