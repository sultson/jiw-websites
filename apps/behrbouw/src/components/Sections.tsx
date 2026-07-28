import { ArrowUpRight, CalendarCheck, ClipboardList, Hammer, KeyRound, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { ADDRESS, EMAIL, PHONE_DISPLAY, PHONE_HREF, SERVICES, type ServiceKey } from '../data';

const PILLARS = [
  {
    icon: Hammer,
    title: 'Dagelijks onderhoud',
    text: 'Reparaties en klein onderhoud aan woningen en gebouwen. Snel ingepland, netjes uitgevoerd en direct teruggekoppeld aan de beheerder.',
  },
  {
    icon: KeyRound,
    title: 'Mutatieonderhoud',
    text: 'Bij een wisseling van huurder maken we de woning technisch en cosmetisch weer op orde, klaar voor de volgende bewoner.',
  },
  {
    icon: CalendarCheck,
    title: 'Projectmatig werk',
    text: 'Van badkamerrenovatie tot complete afbouw. Meerdere disciplines in een planning, met een aanspreekpunt van start tot oplevering.',
  },
];

export function Pillars() {
  return (
    <section id="wat-we-doen" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow text-xs text-oranje">Wat we doen</p>
        <h2 className="display mt-4 max-w-3xl text-4xl text-ink sm:text-5xl">Van melding tot oplevering</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <div key={p.title} className="rounded-2xl bg-white p-7 shadow-[0_1px_2px_rgb(17_19_24_/_0.06)]">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-oranje/12 text-oranje">
                  <p.icon size={22} strokeWidth={2.2} />
                </span>
                <span className="display text-lg text-ink/15">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-ink">{p.title}</h3>
              <p className="mt-2.5 leading-relaxed text-ink/65">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Vakgebieden({ onSelect }: { onSelect: (key: ServiceKey) => void }) {
  return (
    <section id="vakgebieden" className="bg-paper pb-20 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-xs text-oranje">Vakgebieden</p>
            <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
              Zeven vakgebieden, <span className="text-oranje">één ploeg</span>
            </h2>
          </div>
          <p className="max-w-md text-ink/60">
            Alles in eigen hand, dus geen afstemming tussen losse partijen. Onze vakmensen werken door elkaars
            disciplines heen aan hetzelfde resultaat.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <a
              key={s.key}
              href="#top"
              onClick={() => onSelect(s.key)}
              className="group overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgb(17_19_24_/_0.06)]"
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={s.image}
                  alt={`${s.name}: ${s.short.toLowerCase()}`}
                  loading="lazy"
                  width={1264}
                  height={848}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-ink">{s.name}</h3>
                  <ArrowUpRight size={18} className="text-ink/30 transition-colors group-hover:text-oranje" />
                </div>
                <p className="mt-1.5 leading-relaxed text-ink/65">{s.description}</p>
              </div>
            </a>
          ))}
          <div className="flex flex-col justify-center rounded-2xl bg-ink p-7 text-white">
            <h3 className="display text-2xl">Iets anders nodig?</h3>
            <p className="mt-3 leading-relaxed text-white/65">
              Veel werk valt tussen de vakgebieden in. Beschrijf wat er speelt, dan hoort u van ons of wij het
              kunnen oppakken.
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-oranje px-5 py-2.5 font-bold text-white transition-colors hover:bg-oranje-deep"
            >
              <Mail size={16} strokeWidth={2.5} />
              {EMAIL}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const AUDIENCES = [
  {
    title: 'Woningcorporaties',
    text: 'Dagelijks en mutatieonderhoud met vaste terugkoppeling per melding en respect voor de bewoner.',
  },
  {
    title: "VvE's",
    text: 'Planbaar onderhoud aan het gebouw, van gezamenlijke delen tot individuele woningen.',
  },
  {
    title: 'Aannemers',
    text: 'Een betrouwbare partner in de afbouwfase, met vakmensen die aansluiten op uw planning.',
  },
  {
    title: 'Particulieren',
    text: 'Dezelfde professionele aanpak voor reparaties en verbouwingen aan uw eigen woning.',
  },
];

export function Doelgroepen() {
  return (
    <section className="bg-oranje py-16 text-ink sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="display max-w-2xl text-3xl sm:text-4xl">Gebouwd voor professioneel beheer</h2>
        <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="border-t-2 border-ink/25 pt-4">
              <h3 className="text-lg font-extrabold">{a.title}</h3>
              <p className="mt-2 leading-relaxed text-ink/75">{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    title: 'Melding of aanvraag',
    text: 'Bel, app of mail wat er speelt. Op werkdagen reageren we binnen 24 uur.',
  },
  {
    title: 'Inspectie en prijs',
    text: 'We bekijken de situatie, adviseren over de aanpak en sturen een helder prijsvoorstel.',
  },
  {
    title: 'Uitvoering',
    text: 'We beschermen de omgeving en werken door tot het af is. Ook in bewoonde staat, met zo min mogelijk overlast.',
  },
  {
    title: 'Oplevering',
    text: 'We leveren op zoals afgesproken en laten de werkplek schoon achter. Afspraak is afspraak.',
  },
];

export function Werkwijze() {
  return (
    <section id="werkwijze" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow text-xs text-oranje">Werkwijze</p>
        <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">Zo pakken we het aan</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgb(17_19_24_/_0.06)]">
              <span className="display text-4xl text-oranje">0{i + 1}</span>
              <h3 className="mt-4 text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-ink/65">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Betrouwbaarheid',
    text: 'Wat we toezeggen doen we, op tijd en zoals besproken.',
  },
  {
    icon: ClipboardList,
    title: 'Kwaliteit',
    text: 'We werken uitsluitend met hoogwaardige materialen en letten op de details.',
  },
  {
    icon: Phone,
    title: 'Service',
    text: 'Goed bereikbaar, vriendelijk en duidelijk in de communicatie.',
  },
];

export function Over() {
  return (
    <section id="over" className="bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="overflow-hidden rounded-2xl">
          <img
            src="/images/over-behr.webp"
            alt="Twee vakmensen van BEHR op weg naar een klus in een appartementengebouw"
            loading="lazy"
            width={1264}
            height={848}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="eyebrow text-xs text-oranje">Over BEHR</p>
          <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">Vakmanschap met zorg</h2>
          <p className="mt-6 leading-relaxed text-ink/70">
            BEHR is in 2019 gestart en uitgegroeid tot een vaste naam in Amsterdam, Lelystad en omstreken. Onze
            vakmensen behandelen elk project als een waardevolle investering, of het nu om een kleine reparatie
            gaat of om een grootschalig traject.
          </p>
          <ul className="mt-8 space-y-5">
            {VALUES.map((v) => (
              <li key={v.title} className="flex gap-4">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-oranje/12 text-oranje">
                  <v.icon size={20} strokeWidth={2.2} />
                </span>
                <div>
                  <h3 className="font-bold text-ink">{v.title}</h3>
                  <p className="mt-0.5 text-ink/65">{v.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="bg-ink py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow text-xs text-oranje">Contact</p>
        <h2 className="display mt-4 max-w-3xl text-4xl sm:text-5xl">Vertel ons wat er moet gebeuren</h2>
        <p className="mt-5 max-w-2xl text-white/65">
          Telefonisch en via WhatsApp bereikbaar op werkdagen van 08:00 tot 16:00 uur, daarbuiten voor
          spoedgevallen. Mailen kan altijd, u krijgt binnen 24 uur antwoord op werkdagen.
        </p>
        <a href={PHONE_HREF} className="display mt-10 block text-5xl text-white transition-colors hover:text-oranje sm:text-7xl lg:text-8xl">
          {PHONE_DISPLAY}
        </a>
        <div className="mt-12 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/45">
              <Mail size={15} /> E-mail
            </p>
            <a href={`mailto:${EMAIL}`} className="mt-2 inline-block text-lg font-semibold hover:text-oranje">
              {EMAIL}
            </a>
          </div>
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/45">
              <MapPin size={15} /> Adres
            </p>
            <p className="mt-2 text-lg font-semibold">{ADDRESS}</p>
          </div>
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/45">
              <Hammer size={15} /> Werkgebied
            </p>
            <p className="mt-2 text-lg font-semibold">Amsterdam, Lelystad en omstreken</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <div>
          <p className="display text-xl">
            BEHR<span className="ml-1 inline-block h-[0.55em] w-[0.55em] rounded-[2px] bg-oranje" />
          </p>
          <p className="mt-1 text-sm text-white/45">Bouw en installatietechniek</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60" aria-label="Voettekst">
          <a href="#wat-we-doen" className="hover:text-white">Wat we doen</a>
          <a href="#vakgebieden" className="hover:text-white">Vakgebieden</a>
          <a href="#werkwijze" className="hover:text-white">Werkwijze</a>
          <a href="#over" className="hover:text-white">Over BEHR</a>
          <a href="#contact" className="hover:text-white">Contact</a>
        </nav>
        <p className="text-sm text-white/40">© {new Date().getFullYear()} BEHR</p>
      </div>
    </footer>
  );
}
