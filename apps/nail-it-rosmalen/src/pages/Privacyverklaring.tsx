import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { useLang } from '../hooks/useLang';

type Section = {
  n: string;
  title: string;
  blocks: Block[];
};

type Block =
  | { kind: 'p'; text: string }
  | { kind: 'p-html'; text: ReactNode }
  | { kind: 'list'; items: ReactNode[] };

const sections: Section[] = [
  {
    n: '1',
    title: 'Wie zijn wij?',
    blocks: [
      {
        kind: 'p',
        text: 'Nail It Nagelstudio is verantwoordelijk voor de verwerking van uw persoonsgegevens zoals beschreven in deze privacyverklaring.',
      },
      { kind: 'p', text: 'Prinses Margrietstraat 26, 5246 XS Rosmalen' },
      {
        kind: 'p-html',
        text: (
          <>
            Telefoon:{' '}
            <a href="tel:+31639211983" className="text-gold hover:underline">
              06–39211983
            </a>
          </>
        ),
      },
      {
        kind: 'p-html',
        text: (
          <>
            E-mail:{' '}
            <a href="mailto:nagelstudionailit@gmail.com" className="text-gold hover:underline break-all">
              nagelstudionailit@gmail.com
            </a>
          </>
        ),
      },
      { kind: 'p', text: 'KVK: 55481434' },
    ],
  },
  {
    n: '2',
    title: 'Welke gegevens verwerken wij?',
    blocks: [
      { kind: 'p', text: 'Wij verwerken de volgende persoonsgegevens van cliënten:' },
      {
        kind: 'list',
        items: [
          'Naam',
          'Telefoonnummer en/of e-mailadres (voor afspraakbevestigingen en herinneringen)',
          'Afspraakhistorie en behandelnotities (bijv. gebruikte producten, eventuele huidreacties)',
          'Betalingsgegevens (uitsluitend voor administratiedoeleinden)',
        ],
      },
      {
        kind: 'p',
        text: 'Wij verwerken geen bijzondere persoonsgegevens, tenzij de cliënt zelf relevante medische informatie verstrekt die noodzakelijk is voor een veilige behandeling.',
      },
    ],
  },
  {
    n: '3',
    title: 'Waarom verwerken wij uw gegevens?',
    blocks: [
      { kind: 'p', text: 'Wij gebruiken uw gegevens uitsluitend voor:' },
      {
        kind: 'list',
        items: [
          'Het plannen en bevestigen van afspraken.',
          'Het uitvoeren en vastleggen van behandelingen (veiligheid en kwaliteit).',
          'Facturatie en betalingsverwerking.',
          'Het nakomen van wettelijke verplichtingen.',
        ],
      },
    ],
  },
  {
    n: '4',
    title: 'Grondslag voor verwerking',
    blocks: [
      { kind: 'p', text: 'Wij verwerken uw gegevens op basis van:' },
      {
        kind: 'list',
        items: [
          <>
            <strong className="font-medium text-espresso">Uitvoering van de overeenkomst:</strong> het
            plannen en uitvoeren van uw behandeling.
          </>,
          <>
            <strong className="font-medium text-espresso">Gerechtvaardigd belang:</strong> het bijhouden
            van behandelnotities voor uw veiligheid en de kwaliteit van onze service.
          </>,
          <>
            <strong className="font-medium text-espresso">Wettelijke verplichting:</strong> voor zover
            bewaarplichten van toepassing zijn (bijv. administratie).
          </>,
        ],
      },
    ],
  },
  {
    n: '5',
    title: 'Bewaartermijnen',
    blocks: [
      {
        kind: 'list',
        items: [
          'Cliëntgegevens en afspraakhistorie: maximaal 2 jaar na uw laatste bezoek.',
          'Financiele administratie: 7 jaar (wettelijke bewaarplicht Belastingdienst).',
          'Medische notities: maximaal 1 jaar na uw laatste bezoek, tenzij u toestemming geeft voor langere bewaring.',
        ],
      },
    ],
  },
  {
    n: '6',
    title: 'Delen met derden',
    blocks: [
      {
        kind: 'p',
        text: 'Nail It Nagelstudio deelt uw persoonsgegevens niet met derden, behalve:',
      },
      {
        kind: 'list',
        items: [
          'Indien wettelijk verplicht (bijv. op verzoek van de Belastingdienst).',
          'Met de afspraakplanning- of administratiesoftware die wij gebruiken, uitsluitend voor zover noodzakelijk voor de dienstverlening.',
        ],
      },
      { kind: 'p', text: 'Wij verkopen uw gegevens nooit aan derden.' },
    ],
  },
  {
    n: '7',
    title: 'Beveiliging',
    blocks: [
      {
        kind: 'p',
        text: 'Nail It Nagelstudio treft passende maatregelen om uw persoonsgegevens te beschermen tegen onbevoegde toegang, verlies of misbruik. Cliëntgegevens worden opgeslagen in beveiligde systemen en zijn uitsluitend toegankelijk voor bevoegd personeel.',
      },
    ],
  },
  {
    n: '8',
    title: 'Uw rechten',
    blocks: [
      { kind: 'p', text: 'U heeft de volgende rechten met betrekking tot uw persoonsgegevens:' },
      {
        kind: 'list',
        items: [
          <>
            <strong className="font-medium text-espresso">Recht op inzage:</strong> u kunt opvragen welke
            gegevens wij van u hebben.
          </>,
          <>
            <strong className="font-medium text-espresso">Recht op correctie:</strong> u kunt onjuiste
            gegevens laten corrigeren.
          </>,
          <>
            <strong className="font-medium text-espresso">Recht op verwijdering:</strong> u kunt verzoeken
            uw gegevens te laten verwijderen, tenzij wettelijke bewaarplichten dit verhinderen.
          </>,
          <>
            <strong className="font-medium text-espresso">Recht van bezwaar:</strong> u kunt bezwaar maken
            tegen de verwerking van uw gegevens.
          </>,
        ],
      },
      {
        kind: 'p-html',
        text: (
          <>
            Om gebruik te maken van uw rechten kunt u contact opnemen via{' '}
            <a href="mailto:nagelstudionailit@gmail.com" className="text-gold hover:underline break-all">
              nagelstudionailit@gmail.com
            </a>{' '}
            of telefonisch via{' '}
            <a href="tel:+31639211983" className="text-gold hover:underline">
              06–39211983
            </a>
            . Wij reageren binnen 30 dagen.
          </>
        ),
      },
    ],
  },
  {
    n: '9',
    title: 'Klachten',
    blocks: [
      {
        kind: 'p-html',
        text: (
          <>
            Heeft u een klacht over de manier waarop wij omgaan met uw persoonsgegevens? Neem dan eerst
            contact met ons op. U heeft ook het recht een klacht in te dienen bij de Autoriteit
            Persoonsgegevens via{' '}
            <a
              href="https://www.autoriteitpersoonsgegevens.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline break-all"
            >
              www.autoriteitpersoonsgegevens.nl
            </a>
            .
          </>
        ),
      },
    ],
  },
  {
    n: '10',
    title: 'Cookies',
    blocks: [
      {
        kind: 'p',
        text: 'Onze website maakt mogelijk gebruik van functionele cookies die noodzakelijk zijn voor het functioneren van de site. Er worden geen tracking- of advertentiecookies geplaatst zonder uw toestemming.',
      },
    ],
  },
  {
    n: '11',
    title: 'Wijzigingen',
    blocks: [
      {
        kind: 'p',
        text: 'Nail It Nagelstudio behoudt zich het recht voor deze privacyverklaring te wijzigen. De meest actuele versie is beschikbaar op de website. Bij wezenlijke wijzigingen worden vaste cliënten hiervan op de hoogte gesteld.',
      },
    ],
  },
];

export default function Privacyverklaring() {
  const { lang, setLang, t } = useLang();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-cream">
      <Nav lang={lang} setLang={setLang} t={t} />

      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-5 sm:px-8 py-12 md:py-20">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-espresso/60 hover:text-gold mb-8"
          >
            <ArrowLeft size={14} /> Terug naar home
          </a>

          <header className="border-b border-espresso/10 pb-8 mb-10">
            <span className="kicker">Privacy</span>
            <h1 className="mt-3 font-serif text-3xl md:text-5xl leading-tight">
              Privacyverklaring
            </h1>
            <p className="mt-3 text-base text-espresso/70">Nail It Nagelstudio</p>
            <p className="mt-1 text-sm text-espresso/50">Versie: april 2026</p>
          </header>

          <div className="space-y-10 md:space-y-12">
            {sections.map(section => (
              <section key={section.n}>
                <h2 className="font-serif text-xl md:text-2xl text-espresso mb-4 md:mb-5">
                  <span className="text-gold tabular-nums mr-3">{section.n}.</span>
                  {section.title}
                </h2>

                <div className="space-y-3 md:space-y-4 text-[15px] md:text-base leading-relaxed text-espresso/85">
                  {section.blocks.map((block, i) => {
                    if (block.kind === 'p') return <p key={i}>{block.text}</p>;
                    if (block.kind === 'p-html') return <p key={i}>{block.text}</p>;
                    return (
                      <ul key={i} className="pl-5 space-y-2 list-disc marker:text-gold">
                        {block.items.map((item, j) => (
                          <li key={j} className="pl-1">
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <footer className="mt-14 pt-8 border-t border-espresso/10">
            <p className="kicker">Contactgegevens</p>
            <div className="mt-4 space-y-1 text-[15px] md:text-base text-espresso/85 leading-relaxed">
              <p className="font-medium text-espresso">Nail It Nagelstudio</p>
              <p>Prinses Margrietstraat 26, 5246 XS Rosmalen</p>
              <p>
                Telefoon:{' '}
                <a href="tel:+31639211983" className="text-gold hover:underline">
                  06–39211983
                </a>
              </p>
              <p>
                E-mail:{' '}
                <a href="mailto:nagelstudionailit@gmail.com" className="text-gold hover:underline break-all">
                  nagelstudionailit@gmail.com
                </a>
              </p>
              <p>KVK: 55481434</p>
              <p>BTW-nr: NL2156.67.396.B.02</p>
            </div>
          </footer>
        </article>
      </main>

      <Footer t={t} />
    </div>
  );
}
