import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
} from '@sanity/ui';
import { useClient } from 'sanity';
import { useRouter } from 'sanity/router';
import {
  MAANDEN,
  WEEKKOPPEN,
  kalender,
  kleurVan,
  korteDatum,
  sleutel,
  type Activiteit,
  type Concept,
} from '../lib/reeks';

/**
 * De agenda als agenda.
 *
 * Hier stonden drie lijsten naast elkaar ("wat er nog komt", "alles", "de
 * mededelingen"), en dat is drie keer dezelfde inhoud met een ander filter. Wie
 * wil weten of er in oktober al iets op een donderdag staat, kan dat in een
 * lijst met documenten niet zien.
 *
 * Dit is één scherm: een maand met alles erin, precies zoals de site hem
 * uitrekent. Klik op iets om het te wijzigen, klik op een lege dag om er iets
 * op te zetten, en de datum staat dan al ingevuld.
 */

/** Een document uit de dataset; concepten en gepubliceerde versies door elkaar. */
type Doc = Concept & { _id: string; _updatedAt?: string };

const QUERY = `*[_type == "activiteit"]{
  _id, soort, titel, categorie, omschrijving, datum, totDatum, heleDag,
  begintijd, eindtijd, herhaling, herhaalTot, overslaan, aanmelden, bijdrage, locatie
}`;

const kaal = (id: string) => id.replace(/^drafts\./, '');

/**
 * Eén regel per agendapunt: het concept als er een is, anders de gepubliceerde
 * versie. Zo staat op de kalender wat de klant zelf net getypt heeft, met een
 * merkje erbij dat het nog niet online staat.
 */
function samen(docs: Doc[]): { doc: Doc; concept: boolean }[] {
  const gepubliceerd = new Map<string, Doc>();
  const concepten = new Map<string, Doc>();
  for (const doc of docs) {
    if (doc._id.startsWith('drafts.')) concepten.set(kaal(doc._id), doc);
    else gepubliceerd.set(doc._id, doc);
  }
  const alle = new Set([...gepubliceerd.keys(), ...concepten.keys()]);
  return [...alle].map((id) => {
    const concept = concepten.get(id);
    return { doc: (concept ?? gepubliceerd.get(id)) as Doc, concept: Boolean(concept) };
  });
}

export default function AgendaPaneel() {
  const client = useClient({ apiVersion: '2024-10-01' });
  const router = useRouter();
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const vandaag = useMemo(() => new Date(), []);
  const [maand, setMaand] = useState(() => new Date(vandaag.getFullYear(), vandaag.getMonth(), 1));

  // Ophalen, en meeluisteren zodat een wijziging in de rechterhelft meteen in
  // de kalender staat. Zonder dat lijkt het beheer te vergeten wat je net deed.
  useEffect(() => {
    let levend = true;
    const haal = () => {
      client
        .fetch<Doc[]>(QUERY, {}, { perspective: 'raw' })
        .then((uit) => levend && setDocs(uit))
        .catch(() => levend && setDocs([]));
    };
    haal();
    const abonnement = client
      .listen(QUERY, {}, { visibility: 'query', includeResult: false })
      .subscribe({ next: haal, error: () => undefined });
    return () => {
      levend = false;
      abonnement.unsubscribe();
    };
  }, [client]);

  const regels = useMemo(() => (docs ? samen(docs) : []), [docs]);

  /**
   * Wat er deze maand gebeurt, met dezelfde som als de site.
   *
   * Activiteiten staan op hun dag. Een mededeling niet: een vakantiesluiting
   * van zes weken zou dan zes weken lang dezelfde regel in elk vakje zetten en
   * de hele maand onleesbaar maken. Die staat als balk boven de kalender, en de
   * dagen waarop hij geldt krijgen een tintje.
   */
  const { perDag, meldingen, gesloten } = useMemo(() => {
    const van = new Date(maand.getFullYear(), maand.getMonth(), 1);
    const tot = new Date(maand.getFullYear(), maand.getMonth() + 1, 0);
    const conceptVan = new Map(regels.map((r) => [r.doc._id, r.concept]));
    const dagen = new Map<string, { keer: Activiteit; id: string; concept: boolean }[]>();
    const banden: { keer: Activiteit; id: string; concept: boolean }[] = [];
    const dicht = new Set<string>();

    for (const keer of kalender(regels.map((r) => r.doc), van, tot)) {
      const regel = { keer, id: keer.bronId, concept: conceptVan.get(keer.bronId) ?? false };

      if (keer.soort === 'mededeling') {
        banden.push(regel);
        const eerste = keer.start < van ? van : keer.start;
        const laatste = keer.eind > tot ? tot : keer.eind;
        for (
          let dag = new Date(eerste.getFullYear(), eerste.getMonth(), eerste.getDate());
          dag <= laatste;
          dag = new Date(dag.getFullYear(), dag.getMonth(), dag.getDate() + 1)
        ) {
          dicht.add(sleutel(dag));
        }
        continue;
      }

      const key = sleutel(keer.start);
      const rij = dagen.get(key) ?? [];
      rij.push(regel);
      dagen.set(key, rij);
    }
    return { perDag: dagen, meldingen: banden, gesloten: dicht };
  }, [regels, maand]);

  const open = useCallback(
    (id: string) => router.navigateIntent('edit', { id: kaal(id), type: 'activiteit' }),
    [router],
  );

  const nieuw = useCallback(
    (datum?: string) =>
      router.navigateIntent('create', {
        type: 'activiteit',
        template: 'activiteit-op-datum',
        ...(datum ? { datum } : {}),
      }),
    [router],
  );

  const verzet = (stap: number) =>
    setMaand(new Date(maand.getFullYear(), maand.getMonth() + stap, 1));

  // Maandag als eerste kolom, zoals een kalender in Nederland staat.
  const beginKolom = (new Date(maand.getFullYear(), maand.getMonth(), 1).getDay() + 6) % 7;
  const aantalDagen = new Date(maand.getFullYear(), maand.getMonth() + 1, 0).getDate();

  return (
    <Box padding={4} overflow="auto" height="fill">
      <Stack space={4}>
        <Flex align="center" gap={3} wrap="wrap">
          <Heading size={2}>
            {MAANDEN[maand.getMonth()]} {maand.getFullYear()}
          </Heading>
          <Flex gap={2}>
            <Button mode="ghost" text="Vorige" onClick={() => verzet(-1)} />
            <Button
              mode="ghost"
              text="Deze maand"
              onClick={() => setMaand(new Date(vandaag.getFullYear(), vandaag.getMonth(), 1))}
            />
            <Button mode="ghost" text="Volgende" onClick={() => verzet(1)} />
          </Flex>
          <Box flex={1} />
          <Button tone="primary" text="Nieuw agendapunt" onClick={() => nieuw()} />
        </Flex>

        <Text size={1} muted>
          Alles wat er in deze maand gebeurt, uitgerekend zoals de site het doet. Een wekelijkse
          inloop is één agendapunt en staat hier vanzelf op elke donderdag. Klik iets aan om het te
          wijzigen, of klik een lege dag om er iets op te zetten.
        </Text>

        {meldingen.map(({ keer, id, concept }) => (
          <Card
            key={keer.id}
            padding={3}
            radius={2}
            tone="critical"
            border
            as="button"
            onClick={() => open(id)}
            style={{ cursor: 'pointer', textAlign: 'left', width: '100%' }}
          >
            <Flex gap={3} align="center" wrap="wrap">
              <Text size={1} weight="semibold">
                {keer.titel}
              </Text>
              <Text size={1} muted>
                {korteDatum(keer.start)} tot en met {korteDatum(keer.eind)}
              </Text>
              {concept && (
                <Badge tone="caution" fontSize={0}>
                  concept
                </Badge>
              )}
            </Flex>
          </Card>
        ))}

        {docs === null ? (
          <Flex justify="center" padding={5}>
            <Spinner muted />
          </Flex>
        ) : (
          <Card radius={3} border overflow="hidden">
            <Grid columns={7}>
              {WEEKKOPPEN.map((kop) => (
                <Box key={kop} padding={2} style={{ borderBottom: '1px solid var(--card-border-color)' }}>
                  <Text size={0} weight="semibold" muted align="center">
                    {kop.toUpperCase()}
                  </Text>
                </Box>
              ))}

              {Array.from({ length: beginKolom }).map((_, i) => (
                <Box key={`leeg-${i}`} style={{ minHeight: '7rem', background: 'var(--card-muted-bg-color)' }} />
              ))}

              {Array.from({ length: aantalDagen }).map((_, i) => {
                const datum = new Date(maand.getFullYear(), maand.getMonth(), i + 1);
                const dag = sleutel(datum);
                const items = perDag.get(dag) ?? [];
                const isVandaag = dag === sleutel(vandaag);
                const kolom = (beginKolom + i) % 7;

                return (
                  <Box
                    key={dag}
                    padding={2}
                    style={{
                      minHeight: '7rem',
                      borderTop: '1px solid var(--card-border-color)',
                      borderLeft: kolom === 0 ? undefined : '1px solid var(--card-border-color)',
                      // De dagen waarop een mededeling geldt, bijvoorbeeld een
                      // vakantiesluiting. Alleen een tintje: de tekst staat
                      // eenmalig in de balk hierboven.
                      background: gesloten.has(dag) ? 'rgba(163, 74, 104, 0.10)' : undefined,
                    }}
                  >
                    <Stack space={2}>
                      <button
                        type="button"
                        onClick={() => nieuw(dag)}
                        title={`Iets op ${korteDatum(datum)} zetten`}
                        style={{
                          background: isVandaag ? 'var(--card-focus-ring-color)' : 'transparent',
                          color: isVandaag ? '#fff' : 'var(--card-muted-fg-color)',
                          border: 'none',
                          borderRadius: '999px',
                          width: '1.75rem',
                          height: '1.75rem',
                          fontSize: '0.8125rem',
                          fontWeight: isVandaag ? 700 : 400,
                          cursor: 'pointer',
                        }}
                      >
                        {i + 1}
                      </button>

                      {items.map(({ keer, id, concept }) => {
                        const kleur = kleurVan(keer);
                        return (
                          <button
                            key={keer.id}
                            type="button"
                            onClick={() => open(id)}
                            title={keer.titel}
                            style={{
                              display: 'block',
                              width: '100%',
                              textAlign: 'left',
                              background: kleur.vlak,
                              color: kleur.tekst,
                              border: 'none',
                              borderLeft: `3px solid ${kleur.rand}`,
                              borderRadius: '4px',
                              padding: '0.25rem 0.4rem',
                              fontSize: '0.75rem',
                              lineHeight: 1.3,
                              cursor: 'pointer',
                              opacity: concept ? 0.7 : 1,
                            }}
                          >
                            <span style={{ fontWeight: 600 }}>{keer.titel}</span>
                            <br />
                            <span style={{ opacity: 0.8 }}>
                              {keer.heleDag
                                ? 'hele dag'
                                : `${keer.start.getHours()}:${String(keer.start.getMinutes()).padStart(2, '0')}`}
                              {concept ? ' · concept' : ''}
                            </span>
                          </button>
                        );
                      })}
                    </Stack>
                  </Box>
                );
              })}
            </Grid>
          </Card>
        )}

        <Flex gap={3} wrap="wrap" align="center">
          <Text size={0} muted>
            Kleuren:
          </Text>
          {['Inloop', 'Creatief', 'Bewegen', 'Wellness', 'Overig', 'Mededeling'].map((naam) => {
            const kleur = kleurVan({ soort: naam === 'Mededeling' ? 'mededeling' : 'activiteit', categorie: naam } as Activiteit);
            return (
              <Flex key={naam} gap={2} align="center">
                <span
                  style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    borderRadius: '3px',
                    background: kleur.vlak,
                    border: `1px solid ${kleur.rand}`,
                    display: 'inline-block',
                  }}
                />
                <Text size={0} muted>
                  {naam}
                </Text>
              </Flex>
            );
          })}
          {regels.some((r) => r.concept) && (
            <Badge tone="caution" fontSize={0}>
              Doorzichtig = nog niet gepubliceerd
            </Badge>
          )}
        </Flex>
      </Stack>
    </Box>
  );
}
