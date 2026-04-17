import { ArrowLeft } from 'lucide-react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { useLang } from '../hooks/useLang';

type Article = {
  n: string;
  title: string;
  blocks: Block[];
};

type Block =
  | { kind: 'p'; num?: string; text: string }
  | { kind: 'list'; items: string[] };

const articles: Article[] = [
  {
    n: '1',
    title: 'Algemeen',
    blocks: [
      { kind: 'p', num: '1.1', text: 'Deze algemene voorwaarden zijn van toepassing op alle behandelingen, afspraken en overeenkomsten tussen Nail It Nagelstudio (KVK: 55481434) en de cliënt.' },
      { kind: 'p', num: '1.2', text: 'Nail It Nagelstudio is gevestigd aan Prinses Margrietstraat 26, 5246 XS Rosmalen. Telefoon: 06–39211983. E-mail: nagelstudionailit@gmail.com.' },
      { kind: 'p', num: '1.3', text: 'Door het maken van een afspraak gaat de cliënt akkoord met deze algemene voorwaarden.' },
    ],
  },
  {
    n: '2',
    title: 'Afspraken',
    blocks: [
      { kind: 'p', num: '2.1', text: 'Een afspraak die in de agenda is vastgelegd, geldt als definitief.' },
      { kind: 'p', num: '2.2', text: 'Annuleren of verplaatsen is kosteloos tot 24 uur vóór het tijdstip van de afspraak. Dit kan telefonisch of per e-mail.' },
      { kind: 'p', num: '2.3', text: 'Bij annulering binnen 24 uur of bij het niet verschijnen op de afspraak (no-show) wordt de volledige behandelprijs in rekening gebracht.' },
      { kind: 'p', num: '2.4', text: 'De cliënt wordt verzocht op tijd aanwezig te zijn. Bij meer dan 10 minuten vertraging behoudt Nail It Nagelstudio het recht de afspraak te annuleren. In dat geval gelden de no-show voorwaarden van artikel 2.3.' },
      { kind: 'p', num: '2.5', text: 'Wanneer de periode tussen twee behandelingen langer is dan 4 weken, geldt het tarief van een nieuwe set (€ 75,-), ongeacht de eerder gemaakte afspraak.' },
      { kind: 'p', num: '2.6', text: 'Nail It Nagelstudio behoudt zich het recht voor een afspraak te annuleren of te verzetten bij bijzondere omstandigheden (ziekte, calamiteiten). In dat geval wordt de cliënt zo spoedig mogelijk geïnformeerd en wordt kosteloos een nieuwe afspraak ingepland.' },
    ],
  },
  {
    n: '3',
    title: 'Betaling',
    blocks: [
      { kind: 'p', num: '3.1', text: 'Betaling geschiedt direct na de behandeling, contant of via pin.' },
      { kind: 'p', num: '3.2', text: 'Nail It Nagelstudio accepteert geen betalingen via overboeking achteraf, tenzij uitdrukkelijk schriftelijk anders overeengekomen.' },
      { kind: 'p', num: '3.3', text: 'Prijswijzigingen worden minimaal 30 dagen van tevoren aangekondigd via de website of per bericht aan vaste cliënten.' },
      { kind: 'p', num: '3.4', text: 'Bij niet-tijdige betaling is Nail It Nagelstudio gerechtigd de wettelijke rente in rekening te brengen, alsmede redelijke incassokosten.' },
    ],
  },
  {
    n: '4',
    title: 'Garantie',
    blocks: [
      { kind: 'p', num: '4.1', text: 'Op een nieuwe set acryl of gellak geldt een garantietermijn van 3 weken. Op losse behandelingen geldt een garantietermijn van 1 week.' },
      { kind: 'p', num: '4.2', text: 'De garantie vervalt in de volgende gevallen:' },
      {
        kind: 'list',
        items: [
          'De cliënt heeft gewerkt met agressieve reinigingsmiddelen of chemicaliën zonder beschermende handschoenen te dragen.',
          'De nagels zijn verwijderd of bijgewerkt door een andere studio of door de cliënt zelf.',
          'Er is sprake van opzettelijke of onzorgvuldige beschadiging.',
          'De cliënt heeft gebruik gemaakt van producten die door Nail It Nagelstudio zijn afgeraden.',
          'Medisch of nageladvies gegeven na de behandeling is niet binnen 5 werkdagen opgevolgd.',
        ],
      },
      { kind: 'p', num: '4.3', text: 'Garantiewerkzaamheden worden uitsluitend uitgevoerd na beoordeling door Nail It Nagelstudio. De cliënt dient binnen de garantietermijn contact op te nemen.' },
    ],
  },
  {
    n: '5',
    title: 'Beschadiging en diefstal',
    blocks: [
      { kind: 'p', num: '5.1', text: 'Schade aan producten of apparatuur van Nail It Nagelstudio die ontstaat door verkeerd gebruik of nalatigheid van de cliënt, komt voor rekening van de cliënt.' },
      { kind: 'p', num: '5.2', text: 'Bij diefstal wordt te allen tijde aangifte gedaan bij de politie. Nail It Nagelstudio behoudt zich het recht voor de geleden schade te verhalen op de cliënt.' },
      { kind: 'p', num: '5.3', text: 'Nail It Nagelstudio is niet aansprakelijk voor verlies, diefstal of beschadiging van persoonlijke eigendommen van de cliënt tijdens het bezoek aan de studio.' },
    ],
  },
  {
    n: '6',
    title: 'Leeftijd',
    blocks: [
      { kind: 'p', num: '6.1', text: 'Bij cliënten onder de 16 jaar worden in beginsel geen kunstproducten zoals acryl of gellak geplaatst. De reden hiervan is dat hormonale schommelingen de hechting nadelig kunnen beïnvloeden, de kans op allergische reacties groter is en lange nagels op deze leeftijd praktisch en fysiek bezwaarlijk kunnen zijn.' },
      { kind: 'p', num: '6.2', text: 'Uitzondering: bij hardnekkig nagelbijten kan plaatsing, in overleg en na duidelijke uitleg aan cliënt en ouder/verzorger, bespreekbaar zijn. Dit geschiedt volledig op eigen risico van de cliënt en/of ouder/verzorger.' },
      { kind: 'p', num: '6.3', text: 'Voor cliënten onder de 16 jaar is toestemming van een ouder of wettelijk verzorger vereist. Nail It Nagelstudio behoudt zich het recht voor een behandeling te weigeren indien deze toestemming ontbreekt.' },
    ],
  },
  {
    n: '7',
    title: 'Gezondheid en allergische reacties',
    blocks: [
      { kind: 'p', num: '7.1', text: 'De cliënt is verplicht relevante medische informatie, huidaandoeningen of bekende allergischeën voorafgaand aan de behandeling te melden.' },
      { kind: 'p', num: '7.2', text: 'Nail It Nagelstudio behoudt zich het recht voor een behandeling te weigeren indien de gezondheidstoestand van de cliënt dit naar oordeel van de nagelstyliste vereist.' },
      { kind: 'p', num: '7.3', text: 'Nail It Nagelstudio is niet aansprakelijk voor allergische reacties of huidirritaties die het gevolg zijn van het verzwijgen van relevante medische informatie door de cliënt.' },
    ],
  },
  {
    n: '8',
    title: 'Aansprakelijkheid',
    blocks: [
      { kind: 'p', num: '8.1', text: 'Nail It Nagelstudio is niet aansprakelijk voor indirecte schade, gevolgschade of gederfde inkomsten van de cliënt.' },
      { kind: 'p', num: '8.2', text: 'De aansprakelijkheid van Nail It Nagelstudio is in alle gevallen beperkt tot het bedrag van de door de cliënt voor de betreffende behandeling betaalde prijs.' },
      { kind: 'p', num: '8.3', text: 'Nail It Nagelstudio is niet aansprakelijk voor schade die is ontstaan door onjuiste of onvolledige informatie verstrekt door de cliënt.' },
    ],
  },
  {
    n: '9',
    title: 'Privacy',
    blocks: [
      { kind: 'p', num: '9.1', text: 'Nail It Nagelstudio gaat zorgvuldig om met de persoonsgegevens van cliënten. Gegevens worden uitsluitend gebruikt voor het plannen en uitvoeren van behandelingen.' },
      { kind: 'p', num: '9.2', text: 'Nail It Nagelstudio deelt geen persoonsgegevens met derden, tenzij dit wettelijk verplicht is of noodzakelijk voor de dienstverlening.' },
      { kind: 'p', num: '9.3', text: 'De volledige privacyverklaring is beschikbaar op de website en op verzoek verkrijgbaar in de studio.' },
    ],
  },
  {
    n: '10',
    title: 'Klachten',
    blocks: [
      { kind: 'p', num: '10.1', text: 'Klachten over de behandeling dienen zo spoedig mogelijk, maar uiterlijk binnen 7 dagen na de behandeling, gemeld te worden bij Nail It Nagelstudio.' },
      { kind: 'p', num: '10.2', text: 'Nail It Nagelstudio streeft ernaar klachten binnen 5 werkdagen af te handelen.' },
      { kind: 'p', num: '10.3', text: 'Indien een klacht niet naar tevredenheid wordt opgelost, kan de cliënt zich wenden tot een bevoegde rechter of mediator.' },
    ],
  },
  {
    n: '11',
    title: 'Toepasselijk recht',
    blocks: [
      { kind: 'p', text: 'Op deze algemene voorwaarden en alle overeenkomsten met Nail It Nagelstudio is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement Den Bosch.' },
    ],
  },
];

export default function AlgemeneVoorwaarden() {
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
            <span className="kicker">Juridisch</span>
            <h1 className="mt-3 font-serif text-3xl md:text-5xl leading-tight">
              Algemene voorwaarden
            </h1>
            <p className="mt-3 text-base text-espresso/70">Nail It Nagelstudio</p>
            <p className="mt-1 text-sm text-espresso/50">Versie: april 2026</p>
          </header>

          <div className="space-y-10 md:space-y-12">
            {articles.map(article => (
              <section key={article.n}>
                <h2 className="font-serif text-xl md:text-2xl text-espresso mb-4 md:mb-5">
                  <span className="text-gold tabular-nums mr-3">Artikel {article.n}</span>
                  <span className="text-espresso/30 mr-3">—</span>
                  {article.title}
                </h2>

                <div className="space-y-3 md:space-y-4 text-[15px] md:text-base leading-relaxed text-espresso/85">
                  {article.blocks.map((block, i) =>
                    block.kind === 'p' ? (
                      <p key={i} className="flex gap-3">
                        {block.num && (
                          <span className="text-gold font-medium tabular-nums shrink-0 min-w-[2.5rem]">
                            {block.num}
                          </span>
                        )}
                        <span>{block.text}</span>
                      </p>
                    ) : (
                      <ul key={i} className="pl-[2.5rem] md:pl-[3.25rem] space-y-2 list-disc marker:text-gold">
                        {block.items.map((item, j) => (
                          <li key={j} className="pl-1">{item}</li>
                        ))}
                      </ul>
                    ),
                  )}
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
                <a href="mailto:nagelstudionailit@gmail.com" className="text-gold hover:underline">
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
