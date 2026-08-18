import {ArrowRight, Flower2, Heart, Phone, Sparkles} from 'lucide-react';
import {Pagina, PaginaKop} from '../layout';
import {
  Bullet, KNOP_HOOFD, KNOP_TWEEDE_DONKER, Kicker, Section, TEL, TEL_DISPLAY,
} from '../ui';

/* ------------------------------------------------------------------ */

const ONDERDELEN = [
  {
    img: '/img/bruidsboeket.webp',
    icon: Heart,
    titel: 'Het bruidsboeket',
    tekst:
      'Het boeket waar de hele dag omheen staat. Rond en klassiek, of losser en landelijk, in de kleuren van uw jurk en uw dag.',
    punten: ['Rond, druppel of losse vorm', 'Een klein werpboeket kan erbij', 'Passend bij uw jurk en kleuren'],
  },
  {
    img: '/img/corsage.webp',
    icon: Sparkles,
    titel: 'Corsages en opstekers',
    tekst:
      'Voor de bruidegom, de ouders, de getuigen en de kinderen. Gemaakt van dezelfde bloemen als het boeket, zodat het een geheel blijft.',
    punten: ['Opsteker of polscorsage', 'Voor bruidegom, ouders en getuigen', 'Van dezelfde bloemen als het boeket'],
  },
  {
    img: '/img/tulpen.webp',
    icon: Flower2,
    titel: 'Bloemen op de locatie',
    tekst:
      'Op de tafels, bij de ceremonie, aan de stoelen of bij de ingang. Vertel ons hoe de ruimte eruitziet, dan denken wij mee.',
    punten: ['Tafeldecoratie', 'Bloemen bij de ceremonie', 'Boog of ingang mogelijk'],
  },
];

const STAPPEN: [string, string][] = [
  ['We gaan zitten', 'U vertelt over de dag, de locatie en de sfeer. Foto\'s van wat u mooi vindt zijn welkom.'],
  ['Wij komen met een voorstel', 'Een plan voor het boeket, de corsages en de bloemen op de locatie, met een prijs erbij.'],
  ['Bijschaven tot het klopt', 'U mag rustig aanpassen. Pas als het helemaal goed voelt, zetten we het vast.'],
  ['Op de dag zelf', 'Alles staat op tijd klaar. We spreken af waar en hoe laat het opgehaald of gebracht wordt.'],
];

export default function Trouwbloemen() {
  return (
    <Pagina>
      <PaginaKop
        kicker="Trouwbloemen"
        titel="De trouwbloemen voor uw dag"
        intro="Van het bruidsboeket tot de corsages en de bloemen op de locatie. We kijken samen naar de kleuren en de sfeer van uw dag en maken eerst een voorstel, zodat u precies weet wat u krijgt."
        /* Hier stond een bak pioenen uit de winkel, omdat het bruidsboeket op
           de kaart hieronder al in beeld was. Dit is een boeket dat ze zelf
           maakten, in de hand van de bruid: op een trouwpagina is dat het beeld
           waar iemand voor komt, en het is niet hetzelfde boeket als op de
           kaart. */
        img="/img/bruidsboeket-bruid.webp"
        alt="Bruid met haar bruidsboeket van zachtroze rozen, dahlia's en eucalyptus"
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#vraag-aan" className={KNOP_HOOFD}>
            Vrijblijvend een gesprek <ArrowRight className="h-4 w-4" />
          </a>
          <a href={`tel:${TEL}`} className={KNOP_TWEEDE_DONKER}>
            <Phone className="h-4 w-4 text-accent" /> {TEL_DISPLAY}
          </a>
        </div>
      </PaginaKop>

      {/* -------------------------------------------------------------- */}

      <Section tone="wit">
        <div className="max-w-2xl">
          <Kicker>Wat we verzorgen</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">Alles in dezelfde lijn</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/70">
            Het boeket, de corsages en de bloemen op de locatie maken we van dezelfde soorten en kleuren. Zo
            hoort alles bij elkaar, van de eerste foto tot de laatste tafel.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {ONDERDELEN.map((o) => (
            <article key={o.titel} className="overflow-hidden rounded-2xl border border-line bg-cream">
              <img src={o.img} alt={o.titel} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <div className="p-6">
                <o.icon className="h-5 w-5 text-accent-dark" />
                <h3 className="mt-3 text-lg font-semibold">{o.titel}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{o.tekst}</p>
                <ul className="mt-4 space-y-2 text-sm text-ink/75">
                  {o.punten.map((p) => <Bullet key={p}>{p}</Bullet>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------------- */}

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <Kicker>Hoe het gaat</Kicker>
            <h2 className="text-3xl font-semibold sm:text-4xl">Eerst overleg, dan een voorstel</h2>

            <ol className="mt-8 space-y-6">
              {STAPPEN.map(([kop, tekst], i) => (
                <li key={kop} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/15 text-sm font-bold text-accent-dark">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold leading-snug">{kop}</p>
                    <p className="mt-1 leading-relaxed text-ink/65">{tekst}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            {/* Naast de tekst over rond en klassiek of losser en landelijk
                stond een bak zachtroze ranonkels uit de winkel. Hier hoort het
                andere uiterste van diezelfde zin: een bruidsboeket van
                veldbloemen in alle kleuren, zodat de twee foto's op deze pagina
                samen laten zien hoe ver het uit elkaar mag liggen.
                Geen 4:3-kader eromheen: dit boeket loopt tot in de hoeken van
                de foto, dus een liggend kader snijdt de bovenste takken eraf.
                De echte maten staan erbij, dan houdt de browser de plek vrij. */}
            <img
              src="/img/bruidsboeket-veld.webp"
              alt="Bruidsboeket van veldbloemen met kamille, ridderspoor en rozen"
              width={1200}
              height={1278}
              loading="lazy"
              className="h-auto w-full rounded-2xl object-cover"
            />
            <div className="mt-6 rounded-2xl border border-line bg-white p-6 sm:p-8">
              <h3 className="text-xl font-semibold">Goed om te weten</h3>
              <ul className="mt-5 space-y-3 text-ink/75">
                <Bullet>Een gesprek is vrijblijvend en kost u niets</Bullet>
                <Bullet>Meld u gerust ruim van tevoren, dan kunnen we de bloemen op tijd bestellen</Bullet>
                <Bullet>Ook voor een kleine bruiloft of alleen een boeket bent u welkom</Bullet>
                <Bullet>Foto's van wat u mooi vindt helpen ons enorm</Bullet>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </Pagina>
  );
}
