import { useCallback } from 'react';
import { Flex, Text, TextInput } from '@sanity/ui';
import { set, unset, type StringInputProps } from 'sanity';

/**
 * Een datumveld dat Nederlands spreekt.
 *
 * Het datumveld van Sanity zet zijn eigen tekst in het Engels: "Thursday 3
 * September 2026", ook al staat de rest van het beheer in het Nederlands. In
 * de helft van de maanden staat er dan een woord dat hier niet bestaat
 * (March, May, October). Een echt datumveld laat de browser het in de taal van
 * de computer zetten, en levert het aan als 2026-09-03: precies wat er
 * opgeslagen wordt.
 *
 * Ernaast schrijven we de dag voluit, want bij een herhaling gaat het erom
 * welke wéékdag je kiest.
 */

function nederlands(waarde?: string): string {
  if (!waarde) return '';
  const datum = new Date(`${waarde}T00:00:00`);
  if (Number.isNaN(datum.getTime())) return '';
  return datum.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function DatumInvoer(props: StringInputProps) {
  const { value, onChange, elementProps } = props;

  const zet = useCallback(
    (datum: string) => onChange(datum ? set(datum) : unset()),
    [onChange],
  );

  return (
    <Flex gap={3} align="center" wrap="wrap">
      <TextInput
        {...elementProps}
        type="date"
        value={value ?? ''}
        onChange={(event) => zet(event.currentTarget.value)}
        style={{ maxWidth: '12rem' }}
      />
      {value && (
        <Text size={1} muted>
          {nederlands(value)}
        </Text>
      )}
    </Flex>
  );
}
