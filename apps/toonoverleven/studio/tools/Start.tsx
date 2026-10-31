import { Box, Card, Container, Grid, Heading, Stack, Text } from '@sanity/ui';
import { useRouter } from 'sanity/router';

/**
 * Het scherm waar het beheer op opent.
 *
 * Sanity opent standaard op een lijst met een lege rechterhelft, en een leeg
 * scherm is precies het moment waarop iemand die geen CMS wilde leren besluit
 * dat dit ingewikkeld is. Hier staat wat er te doen is, in hun eigen woorden,
 * en per onderdeel waar het op de site terechtkomt.
 */

// The site this Studio is served from: the concept address today, toonoverleven.nl after the move.
const SITE = typeof window === 'undefined' ? 'https://toonoverleven.nl' : window.location.origin;

// Wat vrijwilligers bijhouden, en daaronder wat bij het bestuur hoort. Dezelfde
// twee groepen als in het menu (sanity.config.ts).
const wekelijks = [
  {
    pad: '/beheer/structure/agenda',
    titel: 'Agenda',
    uitleg:
      'De maand met alles erop, zoals hij op de site komt te staan. Klik iets aan om het te wijzigen, of klik een lege dag om er iets op te zetten. Een wekelijkse inloop vult u één keer in met "elke week" en staat dan vanzelf op elke donderdag; valt een keer uit, dan zet u die keer uit in de lijst onderaan het formulier. Kies de vaste activiteit om het moment ook op de juiste bezoekroutes te tonen.',
  },
  {
    pad: '/beheer/structure/activiteit',
    titel: 'Alle agendapunten',
    uitleg:
      'Dezelfde agendapunten als een lijst. Handig om iets op naam te zoeken of om iets van lang geleden terug te vinden.',
  },
  {
    pad: '/beheer/structure/nieuws',
    titel: 'Nieuws & Blog',
    uitleg:
      'De berichten op de nieuwspagina. Elk bericht krijgt een eigen pagina, dus u kunt het hele verhaal kwijt en de link delen op Facebook en Instagram.',
  },
];

const bestuur = [
  {
    pad: '/beheer/structure/sitePage',
    titel: 'Pagina’s en vaste onderdelen',
    uitleg:
      'Alle goedgekeurde pagina’s, met hun teksten, links en beelden. Het warme welkom, de eerste stap, het sonnet en de voettekst zijn gedeelde onderdelen: één wijziging werkt overal door.',
  },
  {
    pad: '/beheer/structure/siteTeksten',
    titel: 'Teksten op de site',
    uitleg:
      'De inlooptijden, het adres, het bestuur en de raad van advies. Andere teksten bewerkt u bij Pagina’s en vaste onderdelen.',
  },
  {
    pad: '/beheer/structure/sponsor',
    titel: 'Sponsoren',
    uitleg:
      'De logo\'s prominent op de voorpagina en op de pagina Onze sponsors. Naam, logo en eventueel een website.',
  },
];

export default function Start() {
  const router = useRouter();

  const ga = (pad: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    try {
      router.navigateUrl({ path: pad });
    } catch {
      window.location.assign(pad);
    }
  };

  const kaart = ({ pad, titel, uitleg }: { pad: string; titel: string; uitleg: string }) => (
    <Card
      key={pad}
      as="a"
      href={pad}
      onClick={ga(pad)}
      padding={4}
      radius={2}
      border
      tone="default"
      style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
    >
      <Stack space={3}>
        <Text weight="semibold" size={2}>
          {titel}
        </Text>
        <Text muted size={1}>
          {uitleg}
        </Text>
      </Stack>
    </Card>
  );

  return (
    <Box padding={[4, 4, 5]} overflow="auto" height="fill">
      <Container width={2}>
        <Stack space={5}>
          <Stack space={3}>
            <Heading size={3}>Welkom bij het beheer van Toon over Leven</Heading>
            <Text muted size={2}>
              Hier past u de site aan. Wat u wijzigt staat na publiceren binnen een minuut online.
              Kies hieronder, of bovenin op Structure.
            </Text>
          </Stack>

          <Stack space={3}>
            <Heading size={1}>Agenda en nieuws</Heading>
            <Text muted size={1}>
              Wat vrijwilligers bijhouden. Als vrijwilliger werkt u alleen hier.
            </Text>
            <Grid columns={[1, 1, 3]} gap={3}>
              {wekelijks.map(kaart)}
            </Grid>
          </Stack>

          <Stack space={3}>
            <Heading size={1}>Alleen voor het bestuur</Heading>
            <Text muted size={1}>
              De vaste pagina’s, de teksten en de sponsoren. Wijzigingen hier lopen via het bestuur.
            </Text>
            <Grid columns={[1, 1, 3]} gap={3}>
              {bestuur.map(kaart)}
            </Grid>
          </Stack>

          <Card padding={4} radius={2} tone="transparent">
            <Stack space={3}>
              <Text weight="semibold" size={1}>
                Twee dingen die goed zijn om te weten
              </Text>
              <Text muted size={1}>
                Elk scherm heeft een tabblad <strong>Voorbeeld</strong>. Daar ziet u de echte site
                met uw wijziging erin, ook als u nog niet gepubliceerd heeft.
              </Text>
              <Text muted size={1}>
                De site staat op{' '}
                <a href={SITE} target="_blank" rel="noreferrer">
                  {SITE.replace('https://', '')}
                </a>
                . Ziet u een wijziging nog niet? Zet <code>?fresh=1</code> achter het adres, dan
                wordt de pagina meteen opnieuw opgehaald.
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
