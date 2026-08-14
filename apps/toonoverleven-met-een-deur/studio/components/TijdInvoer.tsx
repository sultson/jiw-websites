import { useCallback } from 'react';
import { TextInput } from '@sanity/ui';
import { set, unset, type StringInputProps } from 'sanity';

/**
 * Een klokje in plaats van een tekstvakje.
 *
 * Hier stond een gewoon tekstveld met de regel "schrijf de tijd als 10:00"
 * eronder, en dus met een foutmelding voor wie "half elf" of "10.00" typt. Een
 * echt tijdveld kan niet fout ingevuld worden: de browser laat alleen een tijd
 * toe en levert hem altijd als 10:00 aan, precies zoals de site hem verwacht.
 */

/** "9:30" wordt "09:30": een tijdveld accepteert alleen twee cijfers. */
function netjes(waarde?: string): string {
  if (!waarde) return '';
  const delen = /^(\d{1,2}):(\d{2})$/.exec(waarde.trim());
  if (!delen) return '';
  return `${delen[1].padStart(2, '0')}:${delen[2]}`;
}

export default function TijdInvoer(props: StringInputProps) {
  const { value, onChange, elementProps, schemaType } = props;

  const zet = useCallback(
    (tijd: string) => onChange(tijd ? set(tijd) : unset()),
    [onChange],
  );

  return (
    <TextInput
      {...elementProps}
      type="time"
      value={netjes(value)}
      placeholder={schemaType.placeholder}
      onChange={(event) => zet(event.currentTarget.value)}
      style={{ maxWidth: '9rem' }}
    />
  );
}
