import { Box, Card, Container, Grid, Heading, Stack, Text } from '@sanity/ui';
import { useRouter } from 'sanity/router';

/**
 * Landing screen for the Studio.
 *
 * Sanity opens on the structure list, which leaves the right half of the screen
 * empty until something is clicked. For a client who did not ask to learn a CMS,
 * an empty screen is the moment they decide this is complicated. This says what
 * is here, in their language, and points at the four things they can do.
 */

const SITE = 'https://klashorst.jouwidealewebsite.nl';

const kaarten = [
  {
    pad: '/beheer/structure/siteTeksten',
    titel: 'Teksten op de site',
    uitleg: 'De kop bovenaan, de introducties, het verhaal over Peter en de bezoekgegevens.',
  },
  {
    pad: '/beheer/structure/werk',
    titel: 'Collectie',
    uitleg: 'Het werk van Peter Klashorst. Eén foto per werk, de site maakt zelf alle formaten.',
  },
  {
    pad: '/beheer/structure/galeriewerk',
    titel: 'Galerie: andere kunstenaars',
    uitleg: 'Werk van andere kunstenaars, te huur of te koop, met prijs en beschikbaarheid.',
  },
  {
    pad: '/beheer/structure/nieuws',
    titel: 'Nieuws',
    uitleg: 'Berichten en aankondigingen. Het nieuwste bericht staat vooraan.',
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
            <Heading size={3}>Welkom bij het beheer van het Klashorst Museum</Heading>
            <Text muted size={2}>
              Hier past u de site aan: teksten, foto&apos;s, nieuwe berichten en werk in de galerie.
              Kies hieronder, of bovenin op Structure. Na publiceren staat een wijziging binnen een
              minuut op de site.
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
                // A card that navigates has to look like it does; the default
                // dark card sits flush against the page behind it.
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
                De site bekijken
              </Text>
              <Text muted size={1}>
                <a href={SITE} target="_blank" rel="noreferrer">
                  {SITE.replace('https://', '')}
                </a>
                {' '}opent in een nieuw tabblad. Ziet u een wijziging nog niet? Zet{' '}
                <code>?fresh=1</code> achter het adres, dan wordt de pagina meteen opnieuw opgehaald.
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
