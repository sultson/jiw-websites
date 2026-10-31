import { Box, Card, Container, Grid, Heading, Stack, Text } from '@sanity/ui';
import { useRouter } from 'sanity/router';

/** Landing screen, so /beheer does not open on an empty right-hand pane. */
const SITE = 'https://demo.jouwconcept.app';

const kaarten = [
  {
    pad: '/beheer/structure/siteTeksten',
    titel: 'Teksten op de site',
    uitleg: 'De kop, de introductie, de grote foto, het blok "over" en de contactgegevens.',
  },
  {
    pad: '/beheer/structure/bericht',
    titel: 'Berichten',
    uitleg: 'Korte berichten met datum en foto. Het nieuwste staat bovenaan. Nieuw bericht via de + rechtsboven.',
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
            <Heading size={3}>Welkom bij het beheer</Heading>
            <Text muted size={2}>
              Pas de site aan en druk op Publiceren. Een wijziging staat binnen een paar seconden online.
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
                style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
              >
                <Stack space={3}>
                  <Text weight="semibold" size={2}>{kaart.titel}</Text>
                  <Text muted size={1}>{kaart.uitleg}</Text>
                </Stack>
              </Card>
            ))}
          </Grid>
          <Card padding={4} radius={2} tone="transparent">
            <Text muted size={1}>
              <a href={SITE} target="_blank" rel="noreferrer">{SITE.replace('https://', '')}</a> opent de site.
              Ziet u een wijziging nog niet? Zet <code>?fresh=1</code> achter het adres.
            </Text>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
