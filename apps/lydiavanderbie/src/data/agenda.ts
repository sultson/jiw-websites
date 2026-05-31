import type { Lang } from '../translations';

export type AgendaItem = {
  /** ISO date, used for sorting + localized formatting */
  date: string;
  title: Record<Lang, string>;
  tag: 'opleiding' | 'training' | 'examen';
};

/**
 * Forward schedule as published by Lydia (Jun 2026 – Feb 2027).
 * The Agenda component filters to upcoming dates and groups them by month.
 * After enrolment, course days are confirmed in writing and those dates lead.
 */
export const agenda: AgendaItem[] = [
  { date: '2026-06-02', title: { nl: 'Lage rug massage met Dorn', en: 'Lower back massage with Dorn' }, tag: 'training' },
  { date: '2026-06-04', title: { nl: 'Energie in balans', en: 'Energy in balance' }, tag: 'training' },
  { date: '2026-06-17', title: { nl: 'Biotensor: fases van het leven', en: 'Biotensor: life phases' }, tag: 'training' },

  { date: '2026-09-16', title: { nl: 'Stoelmassage, lesdag 1', en: 'Chair massage, day 1' }, tag: 'opleiding' },
  { date: '2026-09-17', title: { nl: 'Chakra reflexologie', en: 'Chakra reflexology' }, tag: 'training' },
  { date: '2026-09-30', title: { nl: 'Stoelmassage, lesdag 2', en: 'Chair massage, day 2' }, tag: 'opleiding' },

  { date: '2026-10-01', title: { nl: 'Acupressuur & ohm-stemvork', en: 'Acupressure & ohm tuning fork' }, tag: 'training' },
  { date: '2026-10-07', title: { nl: 'Stoelmassage, lesdag 3', en: 'Chair massage, day 3' }, tag: 'opleiding' },
  { date: '2026-10-08', title: { nl: 'Chakra massage', en: 'Chakra massage' }, tag: 'training' },
  { date: '2026-10-13', title: { nl: 'Hotstone massage', en: 'Hot stone massage' }, tag: 'training' },
  { date: '2026-10-15', title: { nl: 'Meten met de biotensor', en: 'Measuring with the biotensor' }, tag: 'training' },

  { date: '2026-11-17', title: { nl: 'Voetreflextherapie, lesdag 1', en: 'Foot reflexology, day 1' }, tag: 'opleiding' },
  { date: '2026-11-19', title: { nl: 'Biotensor: levensfases van de ziel, deel 1', en: 'Biotensor: soul life phases, part 1' }, tag: 'training' },
  { date: '2026-11-24', title: { nl: 'Voetreflextherapie, lesdag 2', en: 'Foot reflexology, day 2' }, tag: 'opleiding' },

  { date: '2026-12-01', title: { nl: 'Voetreflextherapie, lesdag 3', en: 'Foot reflexology, day 3' }, tag: 'opleiding' },
  { date: '2026-12-02', title: { nl: 'Munay-Ki dag 1', en: 'Munay-Ki day 1' }, tag: 'training' },
  { date: '2026-12-03', title: { nl: 'Biotensor: levensfases van de ziel, deel 2', en: 'Biotensor: soul life phases, part 2' }, tag: 'training' },

  { date: '2027-01-05', title: { nl: 'Voetreflextherapie, lesdag 4', en: 'Foot reflexology, day 4' }, tag: 'opleiding' },
  { date: '2027-01-19', title: { nl: 'Voetreflextherapie, lesdag 5', en: 'Foot reflexology, day 5' }, tag: 'opleiding' },

  { date: '2027-02-02', title: { nl: 'Examen voetreflextherapie', en: 'Foot reflexology exam' }, tag: 'examen' },
];
