// SOURCE: Google Maps via apify compass/crawler-google-places, scraped 2026-05-26.
// Verified opening hours for Pedicurepraktijk FootCare+.
// Maandag t/m donderdag 08:30 - 17:30 op afspraak; vrijdag t/m zondag gesloten.

export type DayHours = {
  dayIndex: number;
  nl: string;
  open: string | null;
  close: string | null;
};

export const hours: DayHours[] = [
  { dayIndex: 1, nl: 'Maandag',   open: '08:30', close: '17:30' },
  { dayIndex: 2, nl: 'Dinsdag',   open: '08:30', close: '17:30' },
  { dayIndex: 3, nl: 'Woensdag',  open: '08:30', close: '17:30' },
  { dayIndex: 4, nl: 'Donderdag', open: '08:30', close: '17:30' },
  { dayIndex: 5, nl: 'Vrijdag',   open: null,    close: null   },
  { dayIndex: 6, nl: 'Zaterdag',  open: null,    close: null   },
  { dayIndex: 0, nl: 'Zondag',    open: null,    close: null   },
];

export function formatHoursShort(d: DayHours): string {
  if (!d.open || !d.close) return 'Gesloten';
  return `${d.open} – ${d.close}`;
}
