import { ArrowRight, Facebook, Instagram } from 'lucide-react';
import type { Bericht } from '../content/types';
import { bron } from '../content';
import { schrijfNaam } from '../ui';

/**
 * Eén bericht als kaart.
 *
 * De kaart is een doorkijkje: erop klikken opent het bericht op de site zelf en
 * niet Facebook. Staat hetzelfde bericht ook op de socials, dan staat dat er
 * klein bij, want daar kijken hun bezoekers ook.
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
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-lijn bg-white transition duration-300 hover:border-wijn/30 hover:shadow-lg"
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
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-wijn">
          {bericht.datum}
        </p>
        <h3 className="mt-2 text-xl leading-snug">{schrijfNaam(bericht.titel)}</h3>
        <p className="mt-2.5 line-clamp-3 flex-1 leading-relaxed text-inkt/70">
          {schrijfNaam(bericht.samenvatting)}
        </p>
        <span className="mt-5 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-wijn">
            Lees verder
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
          <span className="flex items-center gap-2 text-inkt/35">
            {bericht.instagram && <Instagram className="h-4 w-4" aria-label="Ook op Instagram" />}
            {bericht.facebook && <Facebook className="h-4 w-4" aria-label="Ook op Facebook" />}
          </span>
        </span>
      </div>
    </a>
  );
}
