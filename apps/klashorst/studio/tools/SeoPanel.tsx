import { Badge, Box, Card, Container, Flex, Heading, Stack, Text } from '@sanity/ui';

/**
 * "Vindbaarheid": what a plugin like Yoast actually does, for the one document
 * type where it matters.
 *
 * It is not magic and it does not talk to Google. It reads the post the client
 * has open and checks it against the handful of things that decide whether a
 * search result is worth clicking: a search term that appears where a reader
 * would expect it, a headline and a description of the right length, alt text
 * on the photographs, and prose somebody can read. Everything a search engine
 * is then handed (title, description, canonical, hreflang, structured data,
 * sitemap) the Worker writes into the page itself, so nothing here has to be
 * remembered twice.
 */

type Doc = Record<string, any>;
type Oordeel = 'goed' | 'let op' | 'niet goed';

type Check = { oordeel: Oordeel; regel: string };

const tone: Record<Oordeel, 'positive' | 'caution' | 'critical'> = {
  goed: 'positive',
  'let op': 'caution',
  'niet goed': 'critical',
};

/** Everything the article says, as plain words. */
function woorden(body: unknown): string {
  if (!Array.isArray(body)) return '';
  return body
    .filter((block: Doc) => block?._type === 'block' && Array.isArray(block.children))
    .map((block: Doc) =>
      block.children.map((child: Doc) => (typeof child?.text === 'string' ? child.text : '')).join(''),
    )
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const telWoorden = (tekst: string) => (tekst ? tekst.split(/\s+/).filter(Boolean).length : 0);

const bevat = (haystack: string, needle: string) =>
  Boolean(needle) && haystack.toLowerCase().includes(needle.toLowerCase());

/** How often the search term turns up, as a share of everything written. */
function dichtheid(tekst: string, term: string): { keer: number; procent: number } {
  if (!term.trim() || !tekst) return { keer: 0, procent: 0 };
  const naald = term.toLowerCase();
  const hooi = tekst.toLowerCase();
  let keer = 0;
  let vanaf = 0;
  for (;;) {
    const at = hooi.indexOf(naald, vanaf);
    if (at === -1) break;
    keer += 1;
    vanaf = at + naald.length;
  }
  const totaal = telWoorden(tekst);
  return { keer, procent: totaal ? (keer * telWoorden(term) * 100) / totaal : 0 };
}

function beoordeel(doc: Doc, taal: 'nl' | 'en'): Check[] {
  const en = (doc.en ?? {}) as Doc;
  const titel = taal === 'en' ? en.titel || '' : doc.titel || '';
  const intro = taal === 'en' ? en.intro || '' : doc.intro || '';
  const body = taal === 'en' ? en.body : doc.body;
  const seoTitel = (taal === 'en' ? en.seoTitel : doc.seoTitel) || '';
  const seoOmschrijving = (taal === 'en' ? en.seoOmschrijving : doc.seoOmschrijving) || '';
  const term = String(doc.seoFocus || '').trim();
  const slug = String(doc.slug?.current || '');

  const tekst = woorden(body);
  const aantal = telWoorden(tekst);
  const blocks: Doc[] = Array.isArray(body) ? body : [];
  const eersteAlinea =
    blocks.find((b) => b?._type === 'block' && b.style === 'normal')?.children?.map((c: Doc) => c?.text ?? '').join('') ??
    '';
  const koppen = blocks.filter((b) => b?._type === 'block' && (b.style === 'h2' || b.style === 'h3')).length;
  const fotos = blocks.filter((b) => b?._type === 'image');
  const zonderAlt = fotos.filter((b) => !String(b.alt || '').trim()).length;
  const links = blocks.filter(
    (b) => Array.isArray(b?.markDefs) && b.markDefs.some((m: Doc) => m?._type === 'link'),
  ).length;
  const zinnen = tekst.split(/[.!?]+\s/).filter((s) => s.trim().length > 1);
  const gemiddeld = zinnen.length ? Math.round(aantal / zinnen.length) : 0;

  const uitTitel = seoTitel || `${titel} | Klashorst Museum`;
  const uitOms = seoOmschrijving || intro || tekst.slice(0, 165);
  const dicht = dichtheid(tekst, term);

  const checks: Check[] = [];

  if (!term) {
    checks.push({
      oordeel: 'let op',
      regel: 'Geen zoekterm ingevuld. Vul er een in bij Vindbaarheid, dan kan hieronder gecontroleerd worden of het bericht erover gaat.',
    });
  } else {
    checks.push({
      oordeel: bevat(titel, term) ? 'goed' : 'niet goed',
      regel: bevat(titel, term)
        ? `De zoekterm staat in de kop.`
        : `De zoekterm "${term}" staat niet in de kop.`,
    });
    checks.push({
      oordeel: bevat(slug, term.replace(/\s+/g, '-')) ? 'goed' : 'let op',
      regel: bevat(slug, term.replace(/\s+/g, '-'))
        ? 'De zoekterm staat in het webadres.'
        : 'De zoekterm staat niet in het webadres. Verander dat alleen zolang het bericht nog niet gedeeld is.',
    });
    checks.push({
      oordeel: bevat(intro, term) ? 'goed' : 'let op',
      regel: bevat(intro, term)
        ? 'De zoekterm staat in de inleiding.'
        : 'De zoekterm staat niet in de inleiding.',
    });
    checks.push({
      oordeel: bevat(eersteAlinea, term) ? 'goed' : 'let op',
      regel: bevat(eersteAlinea, term)
        ? 'De zoekterm staat in de eerste alinea.'
        : 'De zoekterm staat niet in de eerste alinea van het bericht.',
    });
    checks.push({
      oordeel: dicht.procent >= 0.4 && dicht.procent <= 3 ? 'goed' : dicht.keer === 0 ? 'niet goed' : 'let op',
      regel:
        dicht.keer === 0
          ? 'De zoekterm komt niet voor in het bericht zelf.'
          : `De zoekterm komt ${dicht.keer} keer voor (${dicht.procent.toFixed(1)}% van de tekst). Tussen 0,5% en 3% leest natuurlijk.`,
    });
  }

  checks.push({
    oordeel: uitTitel.length >= 30 && uitTitel.length <= 62 ? 'goed' : 'let op',
    regel: `Titel in de zoekresultaten: ${uitTitel.length} tekens. Tussen de 30 en 60 past er precies in.`,
  });
  checks.push({
    oordeel:
      uitOms.length >= 70 && uitOms.length <= 160 ? 'goed' : uitOms.length === 0 ? 'niet goed' : 'let op',
    regel:
      uitOms.length === 0
        ? 'Er is geen omschrijving en geen inleiding, dus Google verzint zelf twee regels.'
        : `Omschrijving in de zoekresultaten: ${uitOms.length} tekens. Tussen de 70 en 160 wordt hij niet afgekapt.`,
  });

  checks.push({
    oordeel: aantal >= 200 ? 'goed' : aantal >= 100 ? 'let op' : 'niet goed',
    regel: `Het bericht telt ${aantal} woorden. Vanaf ongeveer 200 heeft een zoekmachine genoeg om mee te werken.`,
  });
  checks.push({
    oordeel: gemiddeld === 0 ? 'let op' : gemiddeld <= 20 ? 'goed' : 'let op',
    regel:
      gemiddeld === 0
        ? 'Nog geen lopende tekst om te beoordelen.'
        : `Gemiddeld ${gemiddeld} woorden per zin. Tot ongeveer 20 leest vlot.`,
  });
  if (aantal > 300) {
    checks.push({
      oordeel: koppen > 0 ? 'goed' : 'let op',
      regel: koppen
        ? `${koppen} tussenkop${koppen === 1 ? '' : 'pen'} in het bericht.`
        : 'Een bericht van deze lengte leest prettiger met een tussenkop of twee.',
    });
  }

  checks.push({
    oordeel: doc.afbeelding ? 'goed' : 'let op',
    regel: doc.afbeelding
      ? 'Er is een hoofdfoto, dus een gedeelde link laat een afbeelding zien.'
      : 'Zonder hoofdfoto is een gedeelde link op WhatsApp of LinkedIn alleen tekst.',
  });
  if (fotos.length) {
    checks.push({
      oordeel: zonderAlt === 0 ? 'goed' : 'let op',
      regel:
        zonderAlt === 0
          ? `Alle ${fotos.length} foto's in het bericht hebben een omschrijving.`
          : `${zonderAlt} van de ${fotos.length} foto's mist een omschrijving.`,
    });
  }
  checks.push({
    oordeel: links > 0 ? 'goed' : 'let op',
    regel: links
      ? 'Er staat minstens één link in het bericht.'
      : 'Nog geen links. Een verwijzing naar een ander bericht of naar de collectie helpt de lezer en de zoekmachine.',
  });

  if (taal === 'nl') {
    const heeftEn = Boolean(en.titel || (en.body as unknown[])?.length);
    checks.push({
      oordeel: heeftEn ? 'goed' : 'let op',
      regel: heeftEn
        ? 'Er is een Engelse versie, dus dit bericht staat ook op /en/blog.'
        : 'Nog geen Engelse versie. Vul het tabblad English in als dit bericht ook op /en/blog hoort te staan.',
    });
  }

  return checks;
}

function Kolom({ titel, checks }: { titel: string; checks: Check[] }) {
  const fout = checks.filter((c) => c.oordeel === 'niet goed').length;
  const letop = checks.filter((c) => c.oordeel === 'let op').length;

  return (
    <Stack space={3}>
      <Flex align="center" gap={2}>
        <Heading size={1}>{titel}</Heading>
        <Badge tone={fout ? 'critical' : letop ? 'caution' : 'positive'} fontSize={0}>
          {fout ? `${fout} aandachtspunt${fout === 1 ? '' : 'en'}` : letop ? `${letop} kan beter` : 'in orde'}
        </Badge>
      </Flex>
      <Stack space={2}>
        {checks.map((check) => (
          <Card key={check.regel} padding={3} radius={2} tone={tone[check.oordeel]} border>
            <Text size={1}>{check.regel}</Text>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

export default function SeoPanel(props: { document?: { displayed?: Doc } }) {
  const doc = props.document?.displayed ?? {};
  const en = (doc.en ?? {}) as Doc;
  const heeftEn = Boolean(en.titel || (en.body as unknown[])?.length);

  return (
    <Box padding={[3, 3, 4]} overflow="auto" height="fill">
      <Container width={2}>
        <Stack space={5}>
          <Stack space={3}>
            <Heading size={2}>Vindbaarheid</Heading>
            <Text muted size={1}>
              Deze controles lopen mee terwijl u schrijft. Ze zijn een advies, geen regel: een kort
              bericht met één goede zin is beter dan tweehonderd woorden om de teller te halen. De
              titel, de omschrijving, de taalverwijzingen en de sitemap zet de site zelf klaar.
            </Text>
          </Stack>

          <Kolom titel="Nederlands" checks={beoordeel(doc, 'nl')} />
          {heeftEn && <Kolom titel="English" checks={beoordeel(doc, 'en')} />}
        </Stack>
      </Container>
    </Box>
  );
}
