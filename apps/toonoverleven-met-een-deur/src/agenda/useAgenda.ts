import { useMemo } from 'react';
import { content } from '../content';
import { expandeer } from './model';
import type { Activiteit } from '../content/types';

/** Hoe ver de agenda vooruit kijkt. Verder dan een jaar plant niemand hier. */
const MAANDEN_VOORUIT = 12;

/**
 * De agenda uitgerekend: van de regels in het beheer naar de losse keren dat
 * er iets is.
 *
 * Eén keer per bezoek, want de uitkomst hangt alleen van de datum af en de
 * regels zelf staan al in het document dat de Worker stuurde.
 */
export function useAgenda(): Activiteit[] {
  return useMemo(() => {
    const nu = new Date();
    const tot = new Date(nu.getFullYear(), nu.getMonth() + MAANDEN_VOORUIT, nu.getDate());
    return expandeer(content.agenda, nu, tot);
  }, []);
}
