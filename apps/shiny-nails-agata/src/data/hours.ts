import type { Lang } from '../translations';

export type DayHours = {
  dayIndex: number;
  name: Record<Lang, string>;
  open: string | null;
  close: string | null;
};

export const hours: DayHours[] = [
  { dayIndex: 1, name: { en: 'Monday',    nl: 'Maandag',   pl: 'Poniedziałek' }, open: null,    close: null    },
  { dayIndex: 2, name: { en: 'Tuesday',   nl: 'Dinsdag',   pl: 'Wtorek'       }, open: '07:30', close: '12:00' },
  { dayIndex: 3, name: { en: 'Wednesday', nl: 'Woensdag',  pl: 'Środa'        }, open: null,    close: null    },
  { dayIndex: 4, name: { en: 'Thursday',  nl: 'Donderdag', pl: 'Czwartek'     }, open: '07:30', close: '12:00' },
  { dayIndex: 5, name: { en: 'Friday',    nl: 'Vrijdag',   pl: 'Piątek'       }, open: '07:30', close: '12:00' },
  { dayIndex: 6, name: { en: 'Saturday',  nl: 'Zaterdag',  pl: 'Sobota'       }, open: '08:00', close: '14:30' },
  { dayIndex: 0, name: { en: 'Sunday',    nl: 'Zondag',    pl: 'Niedziela'    }, open: null,    close: null    },
];

const CLOSED: Record<Lang, string> = { en: 'Closed', nl: 'Gesloten', pl: 'Zamknięte' };

export function formatHoursShort(d: DayHours, lang: Lang): string {
  if (!d.open || !d.close) return CLOSED[lang];
  return `${d.open} – ${d.close}`;
}
