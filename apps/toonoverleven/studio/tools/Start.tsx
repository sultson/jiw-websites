import { Box, Card, Container, Grid, Heading, Stack, Text } from '@sanity/ui';
import { useRouter } from 'sanity/router';

/**
 * Het scherm waar het beheer op opent.
 *
 * Sanity opent standaard op een lijst met een lege rechterhelft, en een leeg
 * scherm is precies het moment waarop iemand die geen CMS wilde leren besluit
 * dat dit ingewikkeld is. Hier staat wat er te doen is, in hun eigen woorden.
 */

const SITE = 'https://toonoverleven.jouwidealewebsite.nl';

const kaarten = [
  {
    pad: '/beheer/structure/agenda',
    titel: 'Agenda',
    uitleg:
      'De maand met alles erop, zoals hij op de site komt te staan. Klik iets aan om het te wijzigen, of klik een lege dag om er iets op te zetten. Een wekelijkse inloop vult u één keer in met "elke week" en staat dan vanzelf op elke donderdag; valt een keer uit, dan zet u die keer uit in de lijst onderaan het formulier.',
  },
  {
    pad: '/beheer/structure/nieuws',
    titel: 'Nieuws & Blog',
    uitleg:
      'De berichten die op de voorpagina langskomen. Elk bericht krijgt een eigen pagina, dus u kunt het hele verhaal kwijt en de link delen op Facebook en Instagram.',
  },
  {
    pad: '/beheer/structure/siteTeksten',
    titel: 'Teksten op de site',
    uitleg:
      'De kop op de voorpagina, wie we zijn, wat we doen, vrijwilliger worden, steun en verantwoording. Per pagina bij elkaar gezet.',
  },
  {
    pad: '/beheer/structure/sponsor',
    titel: 'Sponsoren',
    uitleg: 'De logo’s onderaan de pagina Steun ons. Naam, logo en eventueel een website.',
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

          <Grid columns={[1, 1, 2]} gap={3}>
            {kaarten.map((kaart) => (
              <Card
                key={kaart.pad}
                as="a"
                href={kaart.pad}
                onClick={ga(kaart.pad)}
                padding={4}
                radius={2}
                border
                tone="default"
                style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
              >
                <Stack space={3}>
                  <Text weight="semibold" size={2}>
                    {kaart.titel}
                  </Text>
                  <Text muted size={1}>
                    {kaart.uitleg}
                  </Text>
                </Stack>
              </Card>
            ))}
          </Grid>

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
