import { useMemo } from 'react';
import { expandeer } from './model';
import type { Activiteit, AgendaBron } from '../content/types';

/** Hoe ver de agenda vooruit kijkt. Verder dan een jaar plant niemand hier. */
const MAANDEN_VOORUIT = 12;

/**
 * De agenda uitgerekend: van de regels in het beheer naar de losse keren dat
 * er iets is.
 *
 * De regels en het moment komen allebei van de aanroeper. De Worker rendert
 * dezelfde pagina als de browser, en daar is geen `content` op moduleniveau en
 * geen klok die met de bezoeker meeloopt: zou elke kant zijn eigen "nu"
 * pakken, dan rekent de een een donderdag uit die de ander net voorbij vindt en
 * klopt de gehydrateerde pagina niet meer met wat er verstuurd is.
 *
 * Zonder meegegeven moment is het gewoon nu, en dan verandert er in de browser
 * niets.
 */
export function useAgenda(bronnen: AgendaBron[], nu?: Date): Activiteit[] {
  // Op de tijdstempel en niet op het Date-object: een aanroeper die zijn datum
  // in de aanroep maakt, zou anders bij elke render de hele agenda opnieuw
  // laten uitrekenen.
  const moment = nu?.getTime();

  return useMemo(() => {
    const vanaf = moment === undefined ? new Date() : new Date(moment);
    const tot = new Date(vanaf.getFullYear(), vanaf.getMonth() + MAANDEN_VOORUIT, vanaf.getDate());
    return expandeer(bronnen, vanaf, tot);
  }, [bronnen, moment]);
}
