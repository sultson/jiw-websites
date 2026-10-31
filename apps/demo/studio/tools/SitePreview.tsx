import { useState } from 'react';
import { Box, Button, Card, Flex, Text } from '@sanity/ui';

/**
 * "Voorbeeld" tab: the real site rendered with drafts. The key only unlocks
 * unpublished demo copy; the token that reads drafts is a Worker secret.
 * Reloads on demand, not per keystroke.
 */
const SITE = 'https://demo.jouwconcept.app';
const PREVIEW_KEY = 'hdCHRjtN1I-9HKZziLBWfAti';

export default function SitePreview() {
  const [ronde, setRonde] = useState(0);
  const url = `${SITE}/?preview=${PREVIEW_KEY}`;

  return (
    <Flex direction="column" height="fill">
      <Card padding={2} borderBottom tone="transparent">
        <Flex align="center" gap={3} paddingX={2}>
          <Text size={1} muted style={{ flex: 1 }}>
            De site met uw wijzigingen, ook wat nog niet gepubliceerd is.
          </Text>
          <Button mode="ghost" fontSize={1} padding={2} text="Vernieuwen" onClick={() => setRonde((r) => r + 1)} />
          <Button mode="ghost" fontSize={1} padding={2} text="Openen" as="a" href={url} target="_blank" rel="noreferrer" />
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
