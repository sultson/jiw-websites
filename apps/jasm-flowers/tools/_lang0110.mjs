/**
 * Appends the NL + DE entries for the 1 Oct 2026 client-feedback round to the dictionaries.
 * Pairs are [english, nl, de]; the script skips a key that is already present so it is
 * safe to re-run.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const R = [
[`<b>Buying the same lines every week?</b> Talk to us about a weekly or seasonal supply programme and we plan it with you and our growing partners.`,
 `<b>Koopt u elke week dezelfde lijnen?</b> Praat met ons over een wekelijks of seizoensgebonden leveringsprogramma; we plannen het samen met u en onze teeltpartners.`,
 `<b>Kaufen Sie jede Woche dieselben Linien?</b> Sprechen Sie mit uns über ein wöchentliches oder saisonales Lieferprogramm, das wir gemeinsam mit Ihnen und unseren Anbaupartnern planen.`],

[`Talk to us about a programme`,
 `Praat met ons over een programma`,
 `Sprechen Sie mit uns über ein Programm`],

[`A Kenyan flower export business connecting selected Kenyan growers with professional flower buyers in Europe, Africa, the Middle East, Asia and other international markets.`,
 `Een Keniaans bloemenexportbedrijf dat geselecteerde Keniaanse telers verbindt met professionele bloemeninkopers in Europa, Afrika, het Midden-Oosten, Azië en andere internationale markten.`,
 `Ein kenianisches Blumenexportunternehmen, das ausgewählte kenianische Erzeuger mit professionellen Blumeneinkäufern in Europa, Afrika, dem Nahen Osten, Asien und weiteren internationalen Märkten verbindet.`],

[`How flowers get from a Kenyan field to your cold store: cut to order, pre-cooled within the hour, night freighter out of Nairobi on an unbroken cold chain.`,
 `Hoe bloemen van een Keniaans veld naar uw koelcel komen: op order gesneden, binnen het uur voorgekoeld, nachtvracht vanuit Nairobi op een ononderbroken koelketen.`,
 `Wie Blumen vom kenianischen Feld in Ihr Kühllager gelangen: auf Auftrag geschnitten, innerhalb einer Stunde vorgekühlt, Nachtfracht ab Nairobi in ununterbrochener Kühlkette.`],

[`From Kenya to your destination,<br>cold the whole way`,
 `Van Kenia naar uw bestemming,<br>de hele weg gekoeld`,
 `Von Kenia bis zu Ihrem Ziel,<br>durchgehend gekühlt`],

[`JASM Flowers is a Kenyan flower export business connecting selected Kenyan growers with professional flower buyers in Europe, Africa, the Middle East, Asia and other international markets.`,
 `JASM Flowers is een Keniaans bloemenexportbedrijf dat geselecteerde Keniaanse telers verbindt met professionele bloemeninkopers in Europa, Afrika, het Midden-Oosten, Azië en andere internationale markten.`,
 `JASM Flowers ist ein kenianisches Blumenexportunternehmen, das ausgewählte kenianische Erzeuger mit professionellen Blumeneinkäufern in Europa, Afrika, dem Nahen Osten, Asien und weiteren internationalen Märkten verbindet.`],

[`You order from us, our growing partners cut to that order, and the box is built for you. One fewer week in transit, and a better price for the stem.`,
 `U bestelt bij ons, onze teeltpartners snijden op die order, en de doos wordt voor u samengesteld. Een week minder onderweg, en een betere prijs voor de steel.`,
 `Sie bestellen bei uns, unsere Anbaupartner schneiden auf diesen Auftrag, und die Box wird für Sie gepackt. Eine Woche weniger unterwegs und ein besserer Preis für den Stiel.`],

[`We work with selected Kenyan growers rather than owning farms, and collaborate closely with them on quality, specifications, grading and export preparation, so what leaves the country matches what was agreed.`,
 `Wij werken met geselecteerde Keniaanse telers in plaats van zelf kwekerijen te bezitten, en werken nauw met hen samen aan kwaliteit, specificaties, sortering en exportvoorbereiding, zodat wat het land verlaat overeenkomt met wat is afgesproken.`,
 `Wir arbeiten mit ausgewählten kenianischen Erzeugern, statt selbst Farmen zu besitzen, und stimmen uns eng mit ihnen zu Qualität, Spezifikationen, Sortierung und Exportvorbereitung ab, sodass das, was das Land verlässt, dem Vereinbarten entspricht.`],

[`Stem length, bunch weight, stem count and cut stage are agreed up front and shared with the grower.`,
 `Steellengte, bosgewicht, aantal stelen en snijstadium worden vooraf afgesproken en met de teler gedeeld.`,
 `Stiellänge, Bundgewicht, Stielzahl und Schnittstadium werden vorab vereinbart und mit dem Erzeuger geteilt.`],

[`Quality at every stage`,
 `Kwaliteit in elke fase`,
 `Qualität in jeder Stufe`],

[`Quality starts with the right crop and continues through every stage of the supply chain. We work closely with our growing partners to align production and handling with the specifications agreed with each buyer.`,
 `Kwaliteit begint bij het juiste gewas en loopt door in elke schakel van de keten. We werken nauw samen met onze teeltpartners om teelt en behandeling af te stemmen op de specificaties die met elke koper zijn afgesproken.`,
 `Qualität beginnt mit der richtigen Kultur und setzt sich über jede Stufe der Lieferkette fort. Wir arbeiten eng mit unseren Anbaupartnern zusammen, um Produktion und Handhabung auf die mit jedem Käufer vereinbarten Spezifikationen abzustimmen.`],

[`About JASM Flowers`,
 `Over JASM Flowers`,
 `Über JASM Flowers`],

[`Long-term<br>partnership`,
 `Langdurig<br>partnerschap`,
 `Langfristige<br>Partnerschaft`],

[`We focus on reliable supply, consistent quality and competitive export solutions for professional wholesalers, importers, florists and other flower businesses.`,
 `Wij richten ons op betrouwbare levering, consistente kwaliteit en concurrerende exportoplossingen voor professionele groothandels, importeurs, bloemisten en andere bloemenbedrijven.`,
 `Wir konzentrieren uns auf zuverlässige Lieferung, gleichbleibende Qualität und wettbewerbsfähige Exportlösungen für professionelle Großhändler, Importeure, Floristen und andere Blumenbetriebe.`],

[`Our role is to coordinate sourcing, quality specifications, consolidation and export logistics while working closely with our growing partners and international customers.`,
 `Onze rol is het coördineren van inkoop, kwaliteitsspecificaties, consolidatie en exportlogistiek, in nauwe samenwerking met onze teeltpartners en internationale klanten.`,
 `Unsere Aufgabe ist es, Beschaffung, Qualitätsspezifikationen, Konsolidierung und Exportlogistik zu koordinieren, in enger Zusammenarbeit mit unseren Anbaupartnern und internationalen Kunden.`],

[`We believe in building long-term relationships with both growers and buyers. By understanding our customers&rsquo; specifications and maintaining good communication with our growing partners, we aim to create reliable supply programmes that work for both sides.`,
 `Wij geloven in het opbouwen van langdurige relaties met zowel telers als kopers. Door de specificaties van onze klanten te begrijpen en goed contact te houden met onze teeltpartners, willen we betrouwbare leveringsprogramma&rsquo;s maken die voor beide kanten werken.`,
 `Wir glauben an den Aufbau langfristiger Beziehungen zu Erzeugern und Einkäufern. Indem wir die Spezifikationen unserer Kunden verstehen und guten Kontakt zu unseren Anbaupartnern halten, wollen wir verlässliche Lieferprogramme schaffen, die für beide Seiten funktionieren.`],

[`Graded to your<br>specification`,
 `Gesorteerd op uw<br>specificatie`,
 `Sortiert nach Ihrer<br>Spezifikation`],

[`Every order is carefully graded according to your agreed specifications, including stem length, stem count and cut stage.`,
 `Elke order wordt zorgvuldig gesorteerd volgens uw afgesproken specificaties, waaronder steellengte, aantal stelen en snijstadium.`,
 `Jeder Auftrag wird sorgfältig nach Ihren vereinbarten Spezifikationen sortiert, einschließlich Stiellänge, Stielzahl und Schnittstadium.`],

[`Our grading team checks the flowers against the order before dispatch to ensure they meet your requirements.`,
 `Ons sorteerteam controleert de bloemen vóór verzending tegen de order, zodat ze aan uw eisen voldoen.`,
 `Unser Sortierteam prüft die Blumen vor dem Versand gegen den Auftrag, damit sie Ihren Anforderungen entsprechen.`],

[`We take care to address any variations before the flowers leave Kenya, helping ensure you receive the quality and specifications you ordered.`,
 `Afwijkingen pakken we aan voordat de bloemen Kenia verlaten, zodat u de kwaliteit en specificaties ontvangt die u besteld heeft.`,
 `Abweichungen klären wir, bevor die Blumen Kenia verlassen, damit Sie die bestellte Qualität und Spezifikation erhalten.`],

[`Importers, wholesalers, floral distributors, florists, bouquet producers and retail flower businesses.`,
 `Importeurs, groothandels, bloemendistributeurs, bloemisten, boeketmakers en retailbedrijven.`,
 `Importeure, Großhändler, Blumendistributoren, Floristen, Bouquetbetriebe und Blumeneinzelhandel.`],

[`Grown in Kenya &middot; Exported worldwide`,
 `Geteeld in Kenia &middot; Wereldwijd geëxporteerd`,
 `In Kenia angebaut &middot; Weltweit exportiert`],
];

for (const [lang, idx] of [['nl', 1], ['de', 2]]) {
  const f = path.join(ROOT, 'src', 'lang', `${lang}.tsv`);
  const txt = fs.readFileSync(f, 'utf8');
  const have = new Set(txt.split(/\r?\n/).map(l => l.slice(0, l.indexOf('\t')).trim()));
  const add = R.filter(r => !have.has(r[0])).map(r => `${r[0]}\t${r[idx]}`);
  if (!add.length) { console.log(`${lang}: nothing to add`); continue; }
  fs.writeFileSync(f, txt.replace(/\s*$/, '') + '\n' +
    `# --- 01-10-2026 client feedback round ---\n` + add.join('\n') + '\n', 'utf8');
  console.log(`${lang}: +${add.length}`);
}
