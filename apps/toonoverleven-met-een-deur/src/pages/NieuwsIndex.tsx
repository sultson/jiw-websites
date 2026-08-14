import { ArrowRight, Facebook, Instagram } from 'lucide-react';
import type { Bericht, Teksten } from '../content/types';
import { bron } from '../content';
import BerichtKaart from '../components/BerichtKaart';
import { FACEBOOK, INSTAGRAM, Kop, Sectie, schrijfNaam } from '../ui';

/**
 * Alle berichten.
 *
 * Het bovenste bericht krijgt de grote plek: dat is het vastgezette bericht als
 * er een is, en anders gewoon het nieuwste. Zo heeft de pagina een begin in
 * plaats van een raster dat meteen op volle sterkte staat.
 */
export default function NieuwsIndex({
  teksten,
  berichten,
}: {
  teksten: Teksten;
  berichten: Bericht[];
}) {
  const [eerste, ...rest] = berichten;

  return (
    <Sectie>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Kop
          kicker={teksten.nieuwsBlok.kicker}
          titel={teksten.nieuwsBlok.titel}
          intro={teksten.nieuwsBlok.lead}
        />
        <div className="flex gap-3">
          <a
            href={FACEBOOK}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="grid h-11 w-11 place-items-center rounded-full border border-groen/20 text-groen transition hover:border-groen/50"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="grid h-11 w-11 place-items-center rounded-full border border-groen/20 text-groen transition hover:border-groen/50"
          >
            <Instagram className="h-4 w-4" />
          </a>
        </div>
      </div>

      {!eerste && (
        <p className="mt-10 rounded-2xl border border-lijn bg-white p-6 text-groen/70">
          Er staat nog geen bericht. Kijk zolang op onze Facebook of Instagram.
        </p>
      )}

      {eerste && (
        <a
          href={`/nieuws/${eerste.slug}`}
          className="group mt-12 grid overflow-hidden rounded-3xl border border-lijn bg-white transition hover:border-teal/40 hover:shadow-lg md:grid-cols-2"
        >
          {eerste.img && (
            <img
              src={bron(eerste.img, 'breed')}
              alt=""
              className="h-full min-h-64 w-full object-cover"
              loading="eager"
              decoding="async"
            />
          )}
          <div className="flex flex-col justify-center p-7 md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-tekst">
              {eerste.vastgezet ? 'Blijft even staan' : eerste.datum}
            </p>
            <h2 className="mt-3 text-2xl leading-snug md:text-3xl">{schrijfNaam(eerste.titel)}</h2>
            <p className="mt-4 leading-relaxed text-groen/75">{schrijfNaam(eerste.samenvatting)}</p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-teal-tekst">
              Lees verder
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </div>
        </a>
      )}

      {rest.length > 0 && (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((bericht) => (
            <li key={bericht.id}>
              <BerichtKaart bericht={bericht} />
            </li>
          ))}
        </ul>
      )}
    </Sectie>
  );
}
