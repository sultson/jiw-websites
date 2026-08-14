import { useState } from 'react';
import { Box, Button, Card, Flex, Text } from '@sanity/ui';

/**
 * Het tabblad "Voorbeeld" naast de tekstvelden: de echte site, opgebouwd met
 * wat hier nog als concept staat, zodat de klant een wijziging kan zien voordat
 * iemand anders hem ziet.
 *
 * De Worker doet het werk; dit geeft alleen de voorbeeldsleutel mee en dan
 * antwoordt hij met de concepten erbij. Die sleutel opent niets anders dan
 * ongepubliceerde teksten van deze site, en daarom mag hij in deze bundel
 * staan. Het token dat ze leest is een geheim van de Worker en komt nooit in
 * de browser.
 *
 * Hij laadt op verzoek opnieuw en niet bij elke toetsaanslag: een concept
 * verandert terwijl je typt, en een venster dat onder je handen herlaadt is
 * onbruikbaar.
 */

const SITE = 'https://toonoverleven.jouwidealewebsite.nl';
const PREVIEW_KEY = 'iOn8UC59pa0hFXXd-pb8VWkN';

type Displayed = { slug?: { current?: string }; soort?: string };

export default function SitePreview(props: {
  schemaType?: { name?: string } | string;
  document?: { displayed?: Displayed };
}) {
  const [ronde, setRonde] = useState(0);

  const naam = typeof props.schemaType === 'string' ? props.schemaType : props.schemaType?.name;
  const slug = props.document?.displayed?.slug?.current;

  // Elk soort document hoort bij een pagina. Een blogbericht heeft er zelfs een
  // van zichzelf, dus zolang het adres al gegenereerd is opent het voorbeeld
  // dat bericht en niet het overzicht.
  const pad =
    naam === 'nieuws'
      ? slug
        ? `/nieuws/${slug}`
        : '/nieuws'
      : naam === 'activiteit'
        ? '/agenda'
        : naam === 'sponsor'
          ? '/steun'
          : '/';

  const url = `${SITE}${pad}?preview=${PREVIEW_KEY}`;

  return (
    <Flex direction="column" height="fill">
      <Card padding={2} borderBottom tone="transparent">
        <Flex align="center" gap={3} paddingX={2}>
          <Text size={1} muted style={{ flex: 1 }}>
            Zo ziet de site eruit met uw wijzigingen, inclusief wat nog niet gepubliceerd is.
          </Text>
          <Button
            mode="ghost"
            fontSize={1}
            padding={2}
            text="Vernieuwen"
            onClick={() => setRonde((r) => r + 1)}
          />
          <Button
            mode="ghost"
            fontSize={1}
            padding={2}
            text="Openen"
            as="a"
            href={url}
            target="_blank"
            rel="noreferrer"
          />
        </Flex>
      </Card>
      <Box flex={1}>
        <iframe
          key={ronde}
          src={url}
          title="Voorbeeld van de site"
          style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
        />
      </Box>
    </Flex>
  );
}
