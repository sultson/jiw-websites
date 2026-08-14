import { ArrowLeft, Facebook, Instagram } from 'lucide-react';
import type { Bericht } from '../content/types';
import { bron } from '../content';
import RijkeTekst from '../components/RijkeTekst';
import BerichtKaart from '../components/BerichtKaart';
import { schrijfNaam } from '../ui';

/**
 * Eén bericht, op een adres van zichzelf.
 *
 * Dat is het hele punt van de verhuizing van de socialstrook naar het beheer:
 * een kaart op de voorpagina opent nu het hele verhaal op deze site, en deze
 * pagina is te delen, te openen in een nieuw tabblad en te vinden via Google.
 */
export default function NieuwsBericht({
  bericht,
  berichten,
}: {
  bericht: Bericht;
  berichten: Bericht[];
}) {
  const verder = berichten.filter((b) => b.id !== bericht.id).slice(0, 3);

  return (
    <>
      <article className="bg-room">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
          <a
            href="/nieuws"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-tekst hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Alle berichten
          </a>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.16em] text-teal-tekst">
            {bericht.datum}
          </p>
          <h1 className="mt-3 text-[2.1rem] leading-tight md:text-[2.8rem]">
            {schrijfNaam(bericht.titel)}
          </h1>
          {bericht.intro && (
            <p className="mt-5 text-lg leading-relaxed text-groen/75">
              {schrijfNaam(bericht.intro)}
            </p>
          )}
        </div>

        {/* Hun eigen aankondigingen staan vaak rechtop. Op de volle breedte zou
            zo'n staande poster de halve pagina zijn, dus de hoogte is begrensd
            en het beeld staat gecentreerd. */}
        {bericht.img && (
          <div className="mx-auto max-w-5xl px-5 md:px-8">
            <img
              src={bron(bericht.img, 'vol')}
              alt=""
              className="mx-auto max-h-[32rem] w-auto rounded-3xl object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        )}

        <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
          <RijkeTekst blokken={bericht.body} />

          {(bericht.instagram || bericht.facebook) && (
            <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-lijn pt-8">
              <p className="text-[15px] text-groen/65">Dit bericht staat ook op</p>
              {bericht.instagram && (
                <a
                  href={bericht.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-groen/25 px-4 py-2 text-sm font-semibold text-groen transition hover:border-groen/60"
                >
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              )}
              {bericht.facebook && (
                <a
                  href={bericht.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-groen/25 px-4 py-2 text-sm font-semibold text-groen transition hover:border-groen/60"
                >
                  <Facebook className="h-4 w-4" /> Facebook
                </a>
              )}
            </div>
          )}
        </div>
      </article>

      {verder.length > 0 && (
        <section className="bg-room-diep py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h2 className="text-2xl">Meer berichten</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {verder.map((ander) => (
                <li key={ander.id}>
                  <BerichtKaart bericht={ander} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
