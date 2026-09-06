import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Box, Button, Card, Flex, Grid, Inline, Spinner, Stack, Text, useToast } from '@sanity/ui';
import { useClient } from 'sanity';
import { usePaneRouter } from 'sanity/structure';
import { LexoRank } from 'lexorank';

/**
 * A wall, on the wall.
 *
 * The Studio's drag-and-drop list orders documents in a column of 35-pixel
 * thumbnails, which is a list of file names with a stamp next to it: the client
 * cannot see what they are moving, and the shape on screen looks nothing like
 * the page they are arranging. This is the same drag, in the grid the visitor
 * gets: the same two, three, four columns, the same portrait frames, reading
 * left to right. Where a work lands here is where it lands on the site.
 *
 * This is the whole wall, not a second opinion about it: adding a work, opening
 * one and moving one all happen here, so there is one screen per wall rather
 * than a list and a grid that have to be kept in the same order by hand.
 *
 * It writes the one field the site sorts on, `orderRank`. Both the draft and
 * the published version of a work are given the new rank, so the order on the
 * site changes when the museum lets go of the work rather than when they next
 * publish it.
 */

const API_VERSION = '2025-02-19';

/**
 * What adding a work is called, on the + in the pane header and on the last
 * tile in the grid. Both say the same thing because both do the same thing, and
 * `sanity.config.ts` reads the header one from here.
 */
export const NIEUW: Record<string, string> = {
  werk: 'Nieuw werk toevoegen',
  galeriewerk: 'Werk van een andere kunstenaar toevoegen',
};

/** A work as the query returns it, draft and published alike. */
type Bron = {
  _id: string;
  _createdAt: string;
  orderRank?: string;
  titel?: string;
  kunstenaar?: string;
  techniek?: string;
  afmetingen?: string;
  jaar?: string;
  inZaal?: boolean;
  ref?: string;
};

/** One tile: a work, in whichever version the museum is looking at. */
type Tegel = {
  /** The published id. What the tile links to, and what identifies the work. */
  id: string;
  /** Every id this work has right now: the draft, the published, or both. */
  ids: string[];
  concept: boolean;
  rank: string;
  gemaakt: string;
  titel: string;
  onder: string;
  waarschuwing: string | null;
  ref?: string;
};

type Opties = {
  type: string;
  /** What one of these is called in a sentence: "werk", "werk van een ander". */
  wat: string;
  /** The line under the title of the wall, in the client's own language. */
  uitleg: string;
  onder: (doc: Bron) => string;
  waarschuwing?: (doc: Bron) => string | null;
};

const zonderDraft = (id: string) => id.replace(/^drafts\./, '');

/** Ranks sort as plain strings; a work that has none is hung at the end. */
const sorteerbaar = (rank?: string) => rank || '9';

/**
 * The rank that puts a work between these two neighbours. Null when the two
 * cannot be told apart any more, which is LexoRank running out of room between
 * them, and is the one case the whole wall is renumbered.
 */
function tussen(voor?: string, na?: string): string | null {
  try {
    const a = voor ? LexoRank.parse(voor) : null;
    const b = na ? LexoRank.parse(na) : null;
    if (a && b) return a.between(b).toString();
    if (a) return a.genNext().toString();
    if (b) return b.genPrev().toString();
    return LexoRank.middle().toString();
  } catch {
    return null;
  }
}

/**
 * The thumbnail, straight from Sanity's image server. The asset reference
 * carries its own dimensions, which is all that is needed to build a URL, so
 * this pane does not need the image-url builder the site does without too.
 */
function thumbnail(ref: string | undefined, projectId: string, dataset: string): string | null {
  if (!ref) return null;
  const delen = ref.split('-');
  if (delen.length < 4 || delen[0] !== 'image') return null;
  const ext = delen[delen.length - 1];
  const maten = delen[delen.length - 2];
  const asset = delen.slice(1, -2).join('-');
  if (!asset || !maten) return null;
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${asset}-${maten}.${ext}?w=500&q=75&fit=max&auto=format`;
}

export function maakVolgorde(opties: Opties) {
  const { type, wat, uitleg, onder, waarschuwing } = opties;

  return function Volgorde() {
    const basis = useClient({ apiVersion: API_VERSION });
    // Raw, so drafts and published versions both come back and this pane can
    // decide for itself which one the museum is looking at.
    const client = useMemo(() => basis.withConfig({ perspective: 'raw', useCdn: false }), [basis]);
    const { projectId, dataset } = client.config();
    const { ChildLink, navigateIntent } = usePaneRouter();
    const toast = useToast();

    const [tegels, setTegels] = useState<Tegel[] | null>(null);
    const [bezig, setBezig] = useState(false);
    const [sleept, setSleept] = useState<number | null>(null);
    const [boven, setBoven] = useState<{ index: number; na: boolean } | null>(null);

    // Read by the listener, which must not pull the wall out from under a hand
    // that is holding a work.
    const stil = useRef(false);
    stil.current = bezig || sleept !== null;

    const laad = useCallback(async () => {
      const docs = await client.fetch<Bron[]>(
        `*[_type == $type && !(_id in path("versions.**"))]{
          _id, _createdAt, orderRank, titel, kunstenaar, techniek, afmetingen, jaar, inZaal,
          "ref": afbeelding.asset._ref
        }`,
        { type },
      );

      // One tile per work. The draft is what the museum is working on, so it is
      // what they see; the published version is remembered so both get the new
      // rank and the site does not fall out of step with this screen.
      const perWerk = new Map<string, { toon: Bron; ids: string[]; concept: boolean }>();
      for (const doc of docs) {
        const id = zonderDraft(doc._id);
        const concept = doc._id !== id;
        const bestaand = perWerk.get(id);
        if (!bestaand) {
          perWerk.set(id, { toon: doc, ids: [doc._id], concept });
          continue;
        }
        bestaand.ids.push(doc._id);
        if (concept) {
          bestaand.toon = doc;
          bestaand.concept = true;
        }
      }

      const lijst: Tegel[] = [...perWerk.entries()]
        .map(([id, { toon, ids, concept }]) => ({
          id,
          ids,
          concept,
          rank: toon.orderRank ?? '',
          gemaakt: toon._createdAt ?? '',
          titel: toon.titel?.trim() || 'Werk zonder titel',
          onder: onder(toon),
          waarschuwing: waarschuwing?.(toon) ?? null,
          ref: toon.ref,
        }))
        // The same comparison the site's `order(orderRank asc, _createdAt asc)`
        // makes, character by character rather than by locale: `localeCompare`
        // has opinions about `|` and `:`, which are the two characters a
        // LexoRank is built out of, and this grid is worthless the moment it
        // disagrees with the page about where a work hangs.
        .sort((a, b) => {
          const links = sorteerbaar(a.rank);
          const rechts = sorteerbaar(b.rank);
          if (links !== rechts) return links < rechts ? -1 : 1;
          return a.gemaakt < b.gemaakt ? -1 : a.gemaakt > b.gemaakt ? 1 : 0;
        });

      setTegels(lijst);
    }, [client]);

    useEffect(() => {
      laad().catch(() => setTegels([]));
    }, [laad]);

    // Somebody adding a work in another tab, or in the list next to this one,
    // should see it appear here rather than wonder why it is missing.
    useEffect(() => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const sub = client
        .listen(`*[_type == $type]`, { type }, { visibility: 'query', includeResult: false })
        .subscribe({
          next: (event) => {
            if (event.type !== 'mutation' || stil.current) return;
            clearTimeout(timer);
            timer = setTimeout(() => {
              if (!stil.current) laad().catch(() => {});
            }, 800);
          },
          error: () => {},
        });
      return () => {
        clearTimeout(timer);
        sub.unsubscribe();
      };
    }, [client, laad]);

    /**
     * Moves one work and writes the ranks that follow from it. Normally that is
     * a rank for the moved work alone; only when there is no room left between
     * its new neighbours is the whole wall renumbered, which is invisible from
     * here apart from taking a moment longer.
     */
    const verplaats = useCallback(
      async (van: number, naar: number) => {
        if (!tegels || van === naar || van < 0 || naar < 0 || van >= tegels.length) return;

        const nieuw = [...tegels];
        const [verplaatst] = nieuw.splice(van, 1);
        nieuw.splice(naar, 0, verplaatst);

        // A work that has never been ranked cannot be measured against, so
        // landing next to one renumbers the whole wall, which also gives that
        // work a rank of its own and is the last time it comes up.
        const links = nieuw[naar - 1];
        const rechts = nieuw[naar + 1];
        const rank =
          (links && !links.rank) || (rechts && !rechts.rank)
            ? null
            : tussen(links?.rank, rechts?.rank);
        const teSchrijven: { ids: string[]; rank: string }[] = [];

        if (rank) {
          nieuw[naar] = { ...verplaatst, rank };
          teSchrijven.push({ ids: verplaatst.ids, rank });
        } else {
          let volgende = LexoRank.middle();
          for (let i = 0; i < nieuw.length; i += 1) {
            const waarde = volgende.toString();
            nieuw[i] = { ...nieuw[i], rank: waarde };
            teSchrijven.push({ ids: nieuw[i].ids, rank: waarde });
            volgende = volgende.genNext();
          }
        }

        // On screen first: a wall that moves when you let go of the work, not
        // when the server answers.
        setTegels(nieuw);
        setBezig(true);
        try {
          let transactie = client.transaction();
          for (const { ids, rank: waarde } of teSchrijven) {
            for (const id of ids) {
              transactie = transactie.patch(id, (patch) => patch.set({ orderRank: waarde }));
            }
          }
          await transactie.commit({ visibility: 'async' });
        } catch (error) {
          toast.push({
            status: 'error',
            title: 'De nieuwe volgorde is niet opgeslagen',
            description: error instanceof Error ? error.message : undefined,
          });
          await laad().catch(() => {});
        } finally {
          setBezig(false);
        }
      },
      [client, laad, tegels, toast],
    );

    /**
     * The same + as the one in the pane header, at the end of the wall, which is
     * where a new work is hung: the rank the schema hands it comes after the
     * last one. Sanity opens the empty work next to the grid.
     */
    const voegToe = useCallback(() => {
      navigateIntent('create', { type, template: type });
    }, [navigateIntent]);

    /** Dropped on the half of a tile that decides which side of it to land. */
    const legDaar = (index: number, na: boolean) => {
      if (sleept === null) return;
      let doel = index + (na ? 1 : 0);
      if (doel > sleept) doel -= 1;
      setSleept(null);
      setBoven(null);
      if (doel !== sleept) verplaats(sleept, doel);
    };

    if (tegels === null) {
      return (
        <Flex align="center" justify="center" height="fill" padding={5}>
          <Spinner muted />
        </Flex>
      );
    }

    return (
      <Box height="fill" overflow="auto">
        <Card padding={4} borderBottom tone="transparent">
          <Flex align="flex-start" gap={3}>
            <Stack space={3} flex={1}>
              <Text size={1} weight="semibold">
                Sleep een {wat} naar de plek waar het moet hangen
              </Text>
              <Text size={1} muted>
                {uitleg} Linksboven staat vooraan, daarna van links naar rechts. De nieuwe volgorde
                staat meteen op de site, publiceren hoeft er niet voor.
              </Text>
            </Stack>
            <Inline space={2}>
              {bezig && <Spinner muted size={1} />}
              <Button
                mode="ghost"
                fontSize={1}
                padding={2}
                text="Vernieuwen"
                onClick={() => laad().catch(() => {})}
              />
            </Inline>
          </Flex>
        </Card>

        <Box padding={4}>
          {tegels.length === 0 && (
            <Box paddingBottom={4}>
              <Text size={1} muted>
                Er hangt nog geen {wat} aan deze wand.
              </Text>
            </Box>
          )}
          {/* The visitor's grid: two columns on a phone, three on a tablet,
              four on a wide screen, exactly as the page lays it out. */}
          <Grid columns={[2, 2, 3, 4]} gap={3}>
            {tegels.map((tegel, index) => {
              const url = thumbnail(tegel.ref, projectId ?? '', dataset ?? '');
              const markeer = boven?.index === index && sleept !== null;
              return (
                <Card
                  key={tegel.id}
                  padding={2}
                  radius={2}
                  border
                  tone={sleept === index ? 'primary' : 'default'}
                  draggable
                  onDragStart={(event) => {
                    setSleept(index);
                    event.dataTransfer.effectAllowed = 'move';
                    // Firefox refuses to start a drag without payload.
                    event.dataTransfer.setData('text/plain', tegel.id);
                  }}
                  onDragOver={(event) => {
                    if (sleept === null) return;
                    event.preventDefault();
                    event.dataTransfer.dropEffect = 'move';
                    const vak = event.currentTarget.getBoundingClientRect();
                    setBoven({ index, na: event.clientX > vak.left + vak.width / 2 });
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const vak = event.currentTarget.getBoundingClientRect();
                    legDaar(index, event.clientX > vak.left + vak.width / 2);
                  }}
                  onDragEnd={() => {
                    setSleept(null);
                    setBoven(null);
                  }}
                  style={{
                    cursor: 'grab',
                    opacity: sleept === index ? 0.4 : 1,
                    boxShadow: markeer
                      ? `inset ${boven?.na ? '-3px' : '3px'} 0 0 var(--card-focus-ring-color, #2276fc)`
                      : undefined,
                  }}
                >
                  <Stack space={3}>
                    <Box
                      style={{
                        position: 'relative',
                        aspectRatio: '3 / 4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        background: 'var(--card-code-bg-color, rgba(0,0,0,.2))',
                      }}
                    >
                      {url ? (
                        <img
                          src={url}
                          alt=""
                          draggable={false}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        <Text size={1} muted>
                          Geen foto
                        </Text>
                      )}
                      <Box style={{ position: 'absolute', top: 6, left: 6 }}>
                        <Badge tone="default" fontSize={0}>
                          {index + 1}
                        </Badge>
                      </Box>
                    </Box>

                    <Stack space={2}>
                      <Text size={1} weight="medium" textOverflow="ellipsis">
                        {tegel.titel}
                      </Text>
                      {tegel.onder && (
                        <Text size={0} muted textOverflow="ellipsis">
                          {tegel.onder}
                        </Text>
                      )}
                      {(tegel.concept || tegel.waarschuwing) && (
                        <Inline space={1}>
                          {tegel.concept && (
                            <Badge tone="caution" fontSize={0}>
                              Concept
                            </Badge>
                          )}
                          {tegel.waarschuwing && (
                            <Badge tone="default" fontSize={0}>
                              {tegel.waarschuwing}
                            </Badge>
                          )}
                        </Inline>
                      )}
                    </Stack>

                    {/* The same move, for a touchscreen and for a keyboard,
                        because dragging is neither. */}
                    <Flex gap={1}>
                      <Button
                        mode="bleed"
                        fontSize={0}
                        padding={2}
                        text="←"
                        title="Een plek naar voren"
                        disabled={index === 0 || bezig}
                        onClick={() => verplaats(index, index - 1)}
                      />
                      <Button
                        mode="bleed"
                        fontSize={0}
                        padding={2}
                        text="→"
                        title="Een plek naar achteren"
                        disabled={index === tegels.length - 1 || bezig}
                        onClick={() => verplaats(index, index + 1)}
                      />
                      <Box flex={1} />
                      <Box
                        onDragStart={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                      >
                        <ChildLink childId={tegel.id}>
                          <Button as="span" mode="bleed" fontSize={0} padding={2} text="Bewerken" />
                        </ChildLink>
                      </Box>
                    </Flex>
                  </Stack>
                </Card>
              );
            })}

            {/* The last tile is the empty frame at the end of the wall: the
                place a new work is hung, and the same thing the + in the
                header does. Not draggable, so it stays at the end. */}
            <Card
              as="button"
              type="button"
              padding={2}
              radius={2}
              onClick={voegToe}
              style={{
                cursor: 'pointer',
                appearance: 'none',
                font: 'inherit',
                width: '100%',
                background: 'none',
                border: '1px dashed var(--card-border-color, rgba(255,255,255,.2))',
              }}
            >
              <Stack space={3}>
                <Flex align="center" justify="center" style={{ aspectRatio: '3 / 4' }}>
                  <Text size={4} muted>
                    +
                  </Text>
                </Flex>
                <Box paddingBottom={1}>
                  <Text size={1} weight="medium" align="center">
                    {NIEUW[type] ?? 'Toevoegen'}
                  </Text>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Box>
      </Box>
    );
  };
}

/** The collection, in the order the page and the 3D room both read. */
export const VolgordeCollectie = maakVolgorde({
  type: 'werk',
  wat: 'werk',
  uitleg: 'Deze volgorde is de volgorde van de collectie op de pagina en in de 3D-zaal.',
  onder: (doc) => [doc.techniek, doc.afmetingen].filter(Boolean).join(', '),
  waarschuwing: (doc) => (doc.inZaal === false ? 'Niet in de 3D-zaal' : null),
});

/** The wall reserved for other artists. */
export const VolgordeGalerie = maakVolgorde({
  type: 'galeriewerk',
  wat: 'werk',
  uitleg: 'Deze volgorde is de volgorde waarin het werk van andere kunstenaars op de pagina staat.',
  onder: (doc) => [doc.kunstenaar, doc.jaar].filter(Boolean).join(', '),
});
