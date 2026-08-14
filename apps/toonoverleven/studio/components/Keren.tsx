import { useCallback, useMemo, useState } from 'react';
import { Badge, Button, Card, Flex, Stack, Switch, Text } from '@sanity/ui';
import { set, unset, useFormValue, type ArrayOfPrimitivesInputProps } from 'sanity';
import { keren, korteDatum, langeDatum, ritme, sleutel, type Concept } from '../lib/reeks';

/**
 * De keren dat dit plaatsvindt, uitgerekend en aan te klikken.
 *
 * Hiervoor stond hier een lijstje waar je met de hand een datum in typte om een
 * keer af te zeggen. Dat vraagt twee dingen die niemand paraat heeft: welke
 * datums de herhaling precies oplevert, en hoe je die opschrijft. Nu staan de
 * eerstvolgende keren er gewoon, en zet je er eentje uit met een schakelaar.
 *
 * Het is tegelijk het antwoord op "wat doet elke maand eigenlijk?": je ziet de
 * datums verschijnen terwijl je het formulier invult.
 */

const HOEVEEL = 12;
/** Zoveel keren staan er meteen; de rest komt achter een knop vandaan. */
const METEEN = 6;

export default function Keren(props: ArrayOfPrimitivesInputProps) {
  const { value, onChange } = props;
  const doc = useFormValue([]) as Concept | undefined;
  const [alles, setAlles] = useState(false);

  const uit = useMemo(() => new Set((value ?? []) as string[]), [value]);

  const lijst = useMemo(() => (doc ? keren(doc, HOEVEEL) : []), [doc]);

  const wissel = useCallback(
    (datum: string) => {
      const nieuw = new Set(uit);
      if (nieuw.has(datum)) nieuw.delete(datum);
      else nieuw.add(datum);
      const gesorteerd = [...nieuw].sort();
      onChange(gesorteerd.length ? set(gesorteerd) : unset());
    },
    [onChange, uit],
  );

  if (!doc?.datum) {
    return (
      <Card padding={3} radius={2} tone="transparent" border>
        <Text size={1} muted>
          Vul eerst een datum in, dan staat hier wanneer dit allemaal plaatsvindt.
        </Text>
      </Card>
    );
  }

  /* Keren die uitstaan maar niet meer in de reeks vallen, bijvoorbeeld omdat de
     dag of de herhaling later veranderd is. Die zou je anders nooit meer zien
     staan, terwijl ze wel in het document blijven zitten. */
  const bekend = new Set(lijst.map((a) => sleutel(a.start)));
  const verweesd = [...uit].filter((d) => !bekend.has(d)).sort();

  const afgezegd = lijst.filter((a) => uit.has(sleutel(a.start))).length;
  const eerste = lijst[0];

  return (
    <Stack space={3}>
      <Flex gap={2} align="center" wrap="wrap">
        <Text size={1} muted>
          {eerste
            ? `${ritme(eerste) ?? 'Eén keer'}, eerstvolgend ${korteDatum(eerste.start)}`
            : 'Deze datum is al geweest, dus er komt niets meer.'}
        </Text>
        {afgezegd > 0 && (
          <Badge tone="caution" fontSize={0}>
            {afgezegd} {afgezegd === 1 ? 'keer gaat niet door' : 'keren gaan niet door'}
          </Badge>
        )}
      </Flex>

      <Stack space={1}>
        {(alles ? lijst : lijst.slice(0, METEEN)).map((keer) => {
          const datum = sleutel(keer.start);
          const gaatNiet = uit.has(datum);
          return (
            <Card
              key={datum}
              padding={3}
              radius={2}
              border
              tone={gaatNiet ? 'caution' : 'default'}
            >
              <Flex align="center" gap={3}>
                <Switch checked={!gaatNiet} onChange={() => wissel(datum)} />
                <Stack space={2} flex={1}>
                  <Text
                    size={1}
                    weight="medium"
                    style={gaatNiet ? { textDecoration: 'line-through', opacity: 0.6 } : undefined}
                  >
                    {langeDatum(keer.start)}
                  </Text>
                  {gaatNiet && (
                    <Text size={0} muted>
                      Staat als afgelast op de site
                    </Text>
                  )}
                </Stack>
              </Flex>
            </Card>
          );
        })}
      </Stack>

      {verweesd.length > 0 && (
        <Card padding={3} radius={2} tone="caution" border>
          <Stack space={3}>
            <Text size={1}>
              Deze keren staan uit, maar vallen niet meer in de reeks. Waarschijnlijk is de dag of
              de herhaling daarna veranderd.
            </Text>
            {verweesd.map((datum) => (
              <Flex key={datum} align="center" gap={3}>
                <Switch checked={false} onChange={() => wissel(datum)} />
                <Text size={1} muted>
                  {langeDatum(new Date(`${datum}T00:00:00`))}
                </Text>
              </Flex>
            ))}
          </Stack>
        </Card>
      )}

      {lijst.length > METEEN && (
        <Button
          mode="bleed"
          fontSize={1}
          padding={2}
          text={alles ? 'Minder keren tonen' : `Nog ${lijst.length - METEEN} keren tonen`}
          onClick={() => setAlles(!alles)}
        />
      )}

      {alles && lijst.length === HOEVEEL && (
        <Text size={0} muted>
          De eerstvolgende {HOEVEEL} keren. Daarna loopt het gewoon door.
        </Text>
      )}
    </Stack>
  );
}
