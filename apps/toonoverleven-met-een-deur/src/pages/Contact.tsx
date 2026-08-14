import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CalendarDays, Mail, MapPin, Phone } from 'lucide-react';
import type { Teksten } from '../content/types';
import Formulier from '../components/Formulier';
import { Knop, Kop, MAIL, PLAATS, POSTCODE, ROUTE, STRAAT, Sectie, TEL, TEL_LINK } from '../ui';

export default function Contact({ teksten }: { teksten: Teksten }) {
  return (
    <>
      <Sectie>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <Kop
              kicker={teksten.contact.kicker}
              titel={teksten.contact.titel}
              intro={teksten.contact.lead}
            />

            <dl className="mt-8 space-y-5">
              <Regel icoon={MapPin} kop="Adres">
                {STRAAT}
                <br />
                {POSTCODE} {PLAATS}
              </Regel>
              <Regel icoon={CalendarDays} kop="Inloopmomenten">
                {teksten.contact.openingstijden.split('\n').map((regel, i) => (
                  <span key={regel} className={i === 2 ? 'block text-groen/55' : 'block'}>
                    {regel}
                  </span>
                ))}
              </Regel>
              <Regel icoon={Phone} kop="Telefoon">
                <a href={TEL_LINK} className="font-semibold text-teal-tekst hover:underline">
                  {TEL}
                </a>
              </Regel>
              <Regel icoon={Mail} kop="E-mail">
                <a href={`mailto:${MAIL}`} className="font-semibold text-teal-tekst hover:underline">
                  {MAIL}
                </a>
              </Regel>
            </dl>

            <div className="mt-8">
              <Knop href={ROUTE} target="_blank" rel="noreferrer" soort="rand">
                Plan je route <ArrowUpRight className="h-4 w-4" />
              </Knop>
            </div>
          </div>

          <div className="space-y-4">
            <Kaartje />
            <figure>
              <img
                src="/img/huis-buiten.jpg"
                alt="Het pand aan het Mazerhard 37 met bezoekers ervoor"
                className="w-full rounded-2xl object-cover"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="mt-2.5 text-sm text-groen/55">
                Dit is het pand. Op de foto hangt nog het oude bordje.
              </figcaption>
            </figure>
          </div>
        </div>
      </Sectie>

      <Sectie kleur="room-diep">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <Kop titel={teksten.contact.formulierTitel} klein />
            <p className="mt-4 leading-relaxed text-groen/70">{teksten.contact.formulierTekst}</p>
          </div>
          <Formulier />
        </div>
      </Sectie>
    </>
  );
}

function Regel({
  icoon: Icoon,
  kop,
  children,
}: {
  icoon: typeof MapPin;
  kop: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3.5">
      <Icoon className="mt-1 h-5 w-5 flex-none text-teal-tekst" />
      <div>
        <dt className="font-semibold">{kop}</dt>
        <dd className="mt-0.5 leading-relaxed text-groen/75">{children}</dd>
      </div>
    </div>
  );
}

/**
 * Een gewone kaart op straatniveau. Wie hiernaar kijkt wil weten waar de deur
 * zit, niet hoe groot Zeewolde is. Hij laadt pas als je in de buurt scrolt, dus
 * hij kost geen laadtijd.
 */
function Kaartje() {
  const doel = useRef<HTMLDivElement>(null);
  const [zichtbaar, setZichtbaar] = useState(false);

  useEffect(() => {
    const el = doel.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setZichtbaar(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setZichtbaar(true);
          obs.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={doel} className="overflow-hidden rounded-2xl border border-lijn bg-room-diep">
      {zichtbaar ? (
        <iframe
          title="Kaart met het inloophuis aan het Mazerhard 37 in Zeewolde"
          src="https://www.google.com/maps?q=Mazerhard%2037,%203891%20BR%20Zeewolde&z=16&output=embed"
          className="h-[22rem] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="h-[22rem]" />
      )}
    </div>
  );
}
