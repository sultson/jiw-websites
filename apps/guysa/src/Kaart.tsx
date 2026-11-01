/**
 * Google Maps, gewoon ingesloten. Geen ingekleurd gebied en geen ring: die
 * suggereerde een harde grens die er niet is. De gemeentes staan er als lijst
 * naast, de kaart laat alleen zien waar de regio ligt.
 *
 * Zonder API-sleutel: de klassieke embed met alleen een middelpunt en zoom,
 * dus ook geen speld (ze hebben geen winkel of balie). Google zet zelf een
 * knop 'Openen in Maps' linksboven in de kaart.
 */
const EMBED =
  'https://www.google.com/maps?ll=51.17,4.47&z=10&hl=nl&output=embed';

export default function Kaart() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/12">
      <iframe
        src={EMBED}
        title="Kaart van het werkgebied rond Antwerpen"
        /* Pas ophalen als de kaart in de buurt van het scherm komt. */
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-[26rem] w-full border-0 bg-ink-soft"
      />
    </div>
  );
}
