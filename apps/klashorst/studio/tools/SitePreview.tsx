import { useState } from 'react';
import { Box, Button, Card, Flex, Text } from '@sanity/ui';

/**
 * "Voorbeeld" tab next to the editor: the real site, rendered with unpublished
 * drafts, so the client can see a change before anyone else can.
 *
 * The Worker does the actual work; this passes the preview key and it answers
 * from the drafts perspective. The key only unlocks unpublished museum copy,
 * which is why it can sit in this bundle. The token that reads it is a Worker
 * secret and never reaches the browser.
 *
 * It reloads on demand rather than on every keystroke: a draft changes as you
 * type, and an iframe that reloads under your hands is unusable.
 */

const SITE = 'https://klashorst.jouwidealewebsite.nl';
const PREVIEW_KEY = '9ZdDXvc80iVY6m1jvTmvamKW';

/** Land on the part of the page this document belongs to. */
const ANKER: Record<string, string> = {
  werk: '#werk',
  galeriewerk: '#galerie',
  nieuws: '#blog',
};

type Displayed = { slug?: { current?: string } };

export default function SitePreview(props: {
  schemaType?: { name?: string } | string;
  document?: { displayed?: Displayed };
}) {
  const [ronde, setRonde] = useState(0);

  const naam = typeof props.schemaType === 'string' ? props.schemaType : props.schemaType?.name;

  // A blog post has a page of its own, so the preview opens that page rather
  // than the museum page it is announced on. Before the address is generated
  // there is nothing to open yet, and the blog overview is the next best thing.
  const slug = props.document?.displayed?.slug?.current;
  const pad = naam === 'nieuws' ? (slug ? `/blog/${slug}` : '/blog') : '/';
  const anker = naam === 'nieuws' ? '' : (ANKER[naam ?? ''] ?? '');
  const url = `${SITE}${pad}?preview=${PREVIEW_KEY}${anker}`;

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
