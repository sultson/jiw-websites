/**
 * Het moment waarop deze pagina gerenderd is.
 *
 * De Worker tekent de pagina op de server en de browser hangt zich daar
 * vervolgens aan vast. Reken je aan beide kanten met je eigen klok, dan kan de
 * agenda er in de browser net één keer anders uitzien dan in de HTML, en dan
 * gooit React de hele server-versie weg. Dus schrijft de Worker zijn eigen
 * moment op het html-element, en rekent de browser daar de eerste keer mee.
 */
export const NU: number = lees();

function lees(): number {
  if (typeof document === 'undefined') return Date.now();
  const gestempeld = Number(document.documentElement.dataset.nu);
  return Number.isFinite(gestempeld) && gestempeld > 0 ? gestempeld : Date.now();
}
