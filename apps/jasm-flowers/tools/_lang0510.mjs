/**
 * Appends the NL + DE entries for the 5 Oct 2026 client-feedback round to the dictionaries.
 * Pairs are [english, nl, de]; the script skips a key that is already present so it is
 * safe to re-run.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const R = [
// ---- minimum order, order deadline, airports (client wording, FAQ + shipping cards)
[`A minimum order of 5 boxes applies. For first-time customers, we offer a minimum trial order of 5 boxes. Boxes can be mixed across different flower varieties, allowing you to test several lines in one shipment while meeting the minimum order requirement.`,
 `Er geldt een minimumafname van 5 dozen. Voor nieuwe klanten bieden we een proeforder van minimaal 5 dozen. Dozen mogen gemengd worden met verschillende bloemsoorten, zodat u meerdere lijnen in één zending kunt testen en toch aan de minimumafname voldoet.`,
 `Es gilt eine Mindestbestellmenge von 5 Kisten. Für Neukunden bieten wir eine Probebestellung von mindestens 5 Kisten an. Kisten lassen sich mit verschiedenen Blumensorten mischen, sodass Sie mehrere Linien in einer Sendung testen und zugleich die Mindestbestellmenge erreichen.`],

[`Orders should be confirmed 4 days before the scheduled shipment date. Earlier booking is recommended for larger volumes and standing programmes to ensure availability and consistent supply.`,
 `Orders moeten 4 dagen voor de geplande verzenddatum bevestigd zijn. Voor grotere volumes en vaste programma's raden we aan eerder te boeken, zodat beschikbaarheid en constante aanvoer gewaarborgd blijven.`,
 `Bestellungen sollten 4 Tage vor dem geplanten Versanddatum bestätigt sein. Bei größeren Mengen und laufenden Programmen empfehlen wir eine frühere Buchung, um Verfügbarkeit und gleichmäßige Versorgung zu sichern.`],

[`We fly into the destination airport agreed on your order. Tell us where the shipment has to land and we quote the route with it.`,
 `We vliegen op de bestemmingsluchthaven die op uw order is afgesproken. Laat weten waar de zending moet landen, dan nemen we de route mee in de offerte.`,
 `Wir fliegen den auf Ihrem Auftrag vereinbarten Zielflughafen an. Sagen Sie uns, wo die Sendung landen soll, dann kalkulieren wir die Route mit.`],

[`Full box and half box. A full box is the standard flower carton for air freight and holds roughly 10 to 12 kg of product depending on the line.`,
 `Hele doos en halve doos. Een hele doos is de standaard bloemendoos voor luchtvracht en houdt ruwweg 10 tot 12 kg product, afhankelijk van de lijn.`,
 `Ganze Kiste und halbe Kiste. Eine ganze Kiste ist der Standard-Blumenkarton für Luftfracht und fasst je nach Linie etwa 10 bis 12 kg Ware.`],

// ---- hero fact strip
[`<b>4 days</b>`, `<b>4 dagen</b>`, `<b>4 Tage</b>`],
[`order confirmed before shipment`,
 `order bevestigd voor verzending`,
 `Auftrag vor Versand bestätigt`],

// ---- cold chain steps
[`Sealed into pre-chilled boxes with your labels.`,
 `Gesloten in voorgekoelde dozen met uw etiketten.`,
 `In vorgekühlte Kisten mit Ihren Etiketten verschlossen.`],

[`Handed to the airline in a temperature-controlled build-up area, on the booked and confirmed flight.`,
 `Overgedragen aan de luchtvaartmaatschappij in een temperatuurgeregelde opbouwruimte, op de geboekte en bevestigde vlucht.`,
 `Übergabe an die Fluggesellschaft in einem temperaturgeführten Aufbaubereich, auf dem gebuchten und bestätigten Flug.`],

[`Lands in destination airport`,
 `Landt op de bestemmingsluchthaven`,
 `Landung am Zielflughafen`],

[`Cleared and moved into a cold store upon arrival.`,
 `Bij aankomst ingeklaard en in een koelcel gezet.`,
 `Bei Ankunft verzollt und in ein Kühllager gebracht.`],

[`Ready for pick up`, `Klaar om opgehaald te worden`, `Abholbereit`],

// ---- home page cold chain split
[`Europe is where most of our volume goes: out of Nairobi on the booked flight to your destination airport. Nothing goes through the Dutch clock, which saves a day of handling and a margin.`,
 `Het grootste deel van ons volume gaat naar Europa: vanuit Nairobi op de geboekte vlucht naar uw bestemmingsluchthaven. Niets gaat via de Nederlandse klok, wat een dag handling en een marge scheelt.`,
 `Der größte Teil unseres Volumens geht nach Europa: ab Nairobi auf dem gebuchten Flug zu Ihrem Zielflughafen. Nichts läuft über die niederländische Uhr, was einen Tag Handling und eine Marge spart.`],

[`Pre-cooled within the hour of cutting, sealed into pre-chilled boxes and held at 2 to 4 degrees through the export process, with the temperature logged.`,
 `Binnen een uur na het snijden voorgekoeld, gesloten in voorgekoelde dozen en gedurende het exportproces op 2 tot 4 graden gehouden, met de temperatuur gelogd.`,
 `Innerhalb einer Stunde nach dem Schnitt vorgekühlt, in vorgekühlte Kisten verschlossen und während des gesamten Exportprozesses bei 2 bis 4 Grad gehalten, mit protokollierter Temperatur.`],

// ---- new media: alt text and captions
[`A grader bunching and sleeving roses at the bench, filmed at one of our growing partners`,
 `Een sorteerder die rozen bundelt en hoest aan de werkbank, gefilmd bij een van onze teeltpartners`,
 `Eine Sortiererin bündelt und hüllt Rosen am Packtisch, gefilmt bei einem unserer Anbaupartner`],

[`A grader at one of our growing partners bunching and sleeving roses at the bench`,
 `Een sorteerder bij een van onze teeltpartners die rozen bundelt en hoest aan de werkbank`,
 `Eine Sortiererin bei einem unserer Anbaupartner bündelt und hüllt Rosen am Packtisch`],

[`JASM export cartons stacked on a pallet in the cold room`,
 `JASM-exportdozen gestapeld op een pallet in de koelcel`,
 `JASM-Exportkartons auf einer Palette im Kühlraum gestapelt`],

[`Pre-cooled within the hour and held there until it flies`,
 `Binnen het uur voorgekoeld en daar gehouden tot het vliegt`,
 `Innerhalb einer Stunde vorgekühlt und dort gehalten, bis es fliegt`],

[`Play the video`, `Speel de video af`, `Video abspielen`],

// ---- catalogue pack specs
[`300 stems / full box`, `300 stelen / hele doos`, `300 Stiele / ganze Kiste`],
[`300-500 stems / full box`, `300-500 stelen / hele doos`, `300-500 Stiele / ganze Kiste`],
[`200-220 stems / full box`, `200-220 stelen / hele doos`, `200-220 Stiele / ganze Kiste`],
[`25 stems`, `25 stelen`, `25 Stiele`],

// ---- contact page note
[`<b>What you get back:</b> a written quote per line with stem length, bunch spec, box count, FOB Nairobi price and the freight rate for your shipment.`,
 `<b>Wat u terugkrijgt:</b> een schriftelijke offerte per lijn met steellengte, bosspecificatie, aantal dozen, FOB Nairobi-prijs en het vrachttarief voor uw zending.`,
 `<b>Was Sie zurückbekommen:</b> ein schriftliches Angebot je Linie mit Stiellänge, Bundspezifikation, Kistenzahl, FOB-Nairobi-Preis und dem Frachtsatz für Ihre Sendung.`],

// ---- PDF sheet
[`Ordering and transit`, `Bestellen en transport`, `Bestellung und Transport`],

[`Orders confirmed 4 days before the scheduled shipment date; earlier for larger volumes and standing programmes.`,
 `Orders 4 dagen voor de geplande verzenddatum bevestigd; eerder bij grotere volumes en vaste programma's.`,
 `Bestellungen 4 Tage vor dem geplanten Versanddatum bestätigt; früher bei größeren Mengen und laufenden Programmen.`],

[`Out of Nairobi JKIA on the booked and confirmed flight.`,
 `Vanuit Nairobi JKIA op de geboekte en bevestigde vlucht.`,
 `Ab Nairobi JKIA auf dem gebuchten und bestätigten Flug.`],

[`Cold chain unbroken at 2 to 4 &deg;C, cleared into a cold store on arrival.`,
 `Koelketen ononderbroken op 2 tot 4 &deg;C, bij aankomst ingeklaard in een koelcel.`,
 `Kühlkette ununterbrochen bei 2 bis 4 &deg;C, bei Ankunft verzollt in ein Kühllager.`],

[`Minimum order 5 boxes, trial orders included.`,
 `Minimumafname 5 dozen, proeforders inbegrepen.`,
 `Mindestbestellmenge 5 Kisten, Probebestellungen eingeschlossen.`],

[`Lines, lengths, weekly volume and your destination airport. We check availability with our growing partners and come back with a quote.`,
 `Lijnen, lengtes, weekvolume en uw bestemmingsluchthaven. We checken de beschikbaarheid bij onze teeltpartners en komen terug met een offerte.`,
 `Linien, Längen, Wochenvolumen und Ihr Zielflughafen. Wir prüfen die Verfügbarkeit bei unseren Anbaupartnern und melden uns mit einem Angebot.`],
];

for (const [lang, idx] of [['nl', 1], ['de', 2]]) {
  const f = path.join(ROOT, 'src', 'lang', `${lang}.tsv`);
  const txt = fs.readFileSync(f, 'utf8');
  const have = new Set(txt.split(/\r?\n/).map(l => l.slice(0, l.indexOf('\t')).trim()));
  const add = R.filter(r => !have.has(r[0])).map(r => `${r[0]}\t${r[idx]}`);
  if (!add.length) { console.log(`${lang}: nothing to add`); continue; }
  fs.writeFileSync(f, txt.replace(/\s*$/, '') + '\n' +
    `# --- 05-10-2026 client feedback round ---\n` + add.join('\n') + '\n', 'utf8');
  console.log(`${lang}: +${add.length}`);
}
