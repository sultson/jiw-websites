import {ArrowRight, Phone} from 'lucide-react';
import {Kicker, TEL, TEL_TEKST} from '../ui';
import {Kop, MobieleBalk, Voet} from '../layout';

/**
 * De 404.
 *
 * Cloudflare serveert hem met status 404 (zie `not_found_handling` in
 * wrangler.jsonc), dus het is geen zachte 404 die indexruimte kost. Hij draagt
 * de balk en de voet van de site, zodat iemand die hier belandt in één klik
 * terug is op een pagina die wel bestaat.
 */
export default function NietGevonden() {
  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <Kop />

      <main className="flex flex-1 items-center pt-16 sm:pt-20">
        <div className="mx-auto w-full max-w-3xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <Kicker>Foutmelding 404</Kicker>
          <h1 className="text-3xl text-white sm:text-4xl">Deze pagina bestaat niet</h1>
          <p className="mx-auto mt-4 max-w-lg leading-relaxed text-white/60">
            Mogelijk is het adres verouderd of staat er een tikfout in. Wat we doen staat allemaal
            op de startpagina: opruimen, opkopen en schoonmaken in de regio Antwerpen.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-semibold text-ink transition hover:bg-[#e0bd70]"
            >
              Naar de startpagina <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={`tel:${TEL}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-semibold text-white transition hover:border-gold hover:text-gold"
            >
              <Phone className="h-4 w-4" /> <span className="tabular-nums">{TEL_TEKST}</span>
            </a>
          </div>
        </div>
      </main>

      <Voet />
      <MobieleBalk />
    </div>
  );
}
