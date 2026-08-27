import { Facebook, Instagram } from 'lucide-react';
import type { Bericht } from '../content/types';
import { bron } from '../content/image';
import { schrijfNaam } from '../ui';

/**
 * Eén bericht als kaart.
 *
 * De kaart is een doorkijkje: erop klikken opent het bericht op de site zelf en
 * niet Facebook. Staat hetzelfde bericht ook op de socials, dan staat dat er
 * klein bij, want daar kijken hun bezoekers ook.
 *
 * De vorm is die van de andere kaarten op de site: dezelfde ronding, dezelfde
 * lijn, dezelfde pijl achter de vervolgstap. Een bericht is geen ander soort
 * ding dan een activiteit of een onderwerp.
 */
export default function BerichtKaart({
  bericht,
  bereikbaar = true,
}: {
  bericht: Bericht;
  bereikbaar?: boolean;
}) {
  return (
    <a
      href={`/nieuws/${bericht.slug}`}
      tabIndex={bereikbaar ? undefined : -1}
      aria-hidden={bereikbaar ? undefined : true}
      className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-lijn bg-white no-underline shadow-[0_8px_24px_rgba(55,28,38,0.04)] transition hover:-translate-y-0.5 hover:border-blos-diep"
    >
      {bericht.img && (
        <img
          src={bron(bericht.img, 'klein')}
          alt=""
          className="aspect-[4/3] w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="flex flex-1 flex-col p-[1.4rem]">
        <p className="flex flex-wrap items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-teal">
          {bericht.vastgezet && (
            <span className="rounded-full bg-blos px-2 py-0.5 text-wijn">Blijft staan</span>
          )}
          {bericht.datum}
        </p>
        <strong className="my-2 font-display text-[1.16rem] font-medium leading-tight text-wijn-diep">
          {schrijfNaam(bericht.titel)}
        </strong>
        <span className="line-clamp-3 flex-1 text-[0.9rem] leading-relaxed text-inkt-doffer">
          {schrijfNaam(bericht.samenvatting)}
        </span>
        <span className="mt-auto flex items-center justify-between gap-3 pt-3.5">
          <span className="text-[0.82rem] font-extrabold text-wijn">
            Lees verder <span aria-hidden="true">→</span>
          </span>
          <span className="flex items-center gap-2 text-inkt/30">
            {bericht.instagram && <Instagram className="h-4 w-4" aria-label="Ook op Instagram" />}
            {bericht.facebook && <Facebook className="h-4 w-4" aria-label="Ook op Facebook" />}
          </span>
        </span>
      </div>
    </a>
  );
}
