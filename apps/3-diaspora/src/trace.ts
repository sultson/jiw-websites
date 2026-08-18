/**
 * Wat Cloudflare over dit verzoek weet.
 *
 * Op elke Cloudflare-site staat /cdn-cgi/trace: een paar regels sleutel=waarde
 * op onze eigen host. Geen dienst van derden, er gaat niets naar buiten, en het
 * kost een fractie van een seconde.
 *
 * Twee dingen hier gebruiken het: de taalkeuze wil `loc`, het land van de
 * bezoeker, en het aftellen wil `ts`, de klok van Cloudflare. Zonder deze
 * gedeelde belofte zou dat twee verzoeken zijn voor hetzelfde antwoord. Nu
 * wordt hij één keer gedaan en delen ze de uitkomst, ook als de tweede pas
 * later vraagt.
 *
 * Faalt hij, dan komt er een leeg antwoord terug en niet een fout: beide
 * gebruikers hebben een terugval die het zonder doet.
 */
export type Trace = Record<string, string>;

let belofte: Promise<Trace> | null = null;

export function trace(): Promise<Trace> {
  belofte ??= fetch('/cdn-cgi/trace', {cache: 'no-store'})
    .then((r) => (r.ok ? r.text() : ''))
    .then((tekst) =>
      Object.fromEntries(
        tekst
          .split('\n')
          .filter(Boolean)
          .map((regel) => {
            const is = regel.indexOf('=');
            return is === -1 ? [regel, ''] : [regel.slice(0, is), regel.slice(is + 1)];
          }),
      ),
    )
    .catch(() => ({}) as Trace);
  return belofte;
}
