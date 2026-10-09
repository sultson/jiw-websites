/**
 * Appends the Dutch and German entries for the four key-line pages (/wholesale/*).
 * One-shot: run once, then the tsv files are the source of truth.
 *   node tools/_lang0910b.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');

const ROWS = [
  // --- shared across the four pages ---
  ['Key lines', 'Kernlijnen', 'Kernlinien'],
  ['Stem lengths', 'Steellengtes', 'Stiellängen'],
  ['Country of origin', 'Land van herkomst', 'Herkunftsland'],
  ['The standard pack', 'De standaardverpakking', 'Die Standardverpackung'],
  ['See it in the catalogue', 'Bekijk het in de catalogus', 'Im Katalog ansehen'],
  ['Grown at altitude', 'Geteeld op hoogte', 'In der Höhe angebaut'],
  ['Ordering and grading', 'Bestellen en sorteren', 'Bestellung und Sortierung'],
  ['Who buys it', 'Wie het koopt', 'Wer es kauft'],
  ['Also known as', 'Ook bekend als', 'Auch bekannt als'],
  ['Our other key lines', 'Onze andere kernlijnen', 'Unsere weiteren Kernlinien'],
  ['Every figure above is the house standard. Stem length, bunch weight, stem count and cut stage can be set to your own programme and written into the order, and that is what the packhouse checks against.',
    'Elk cijfer hierboven is onze huisstandaard. Steellengte, bosgewicht, aantal stelen en snijstadium kunnen op uw eigen programma worden ingesteld en in de order worden vastgelegd, en daarop controleert de verwerkingshal.',
    'Jede Zahl oben ist unser Hausstandard. Stiellänge, Bundgewicht, Stielzahl und Schnittstadium lassen sich auf Ihr eigenes Programm einstellen und werden im Auftrag festgehalten, und genau daran prüft die Packhalle.'],
  ['Buying more than one line? Fillers, foliage and roses pack on the same airway bill, so one bouquet costs one freight minimum.',
    'Meer dan één lijn nodig? Vulbloemen, groen en rozen gaan op dezelfde vrachtbrief, zodat één boeket één vrachtminimum kost.',
    'Mehr als eine Linie nötig? Füllblumen, Schnittgrün und Rosen gehen auf denselben Luftfrachtbrief, sodass ein Bouquet ein Frachtminimum kostet.'],
  // Length ranges and the card line under "Our other key lines". The bare ranges are
  // identical in all three languages; they still need an entry or they read as a gap.
  ['50 cm&ndash;80 cm', '50 cm&ndash;80 cm', '50 cm&ndash;80 cm'],
  ['50 cm&ndash;70 cm', '50 cm&ndash;70 cm', '50 cm&ndash;70 cm'],
  ['50 cm to 80 cm &middot; 14-21 days', '50 cm tot 80 cm &middot; 14-21 dagen', '50 cm bis 80 cm &middot; 14-21 Tage'],
  ['50 cm to 80 cm &middot; 10-14 days', '50 cm tot 80 cm &middot; 10-14 dagen', '50 cm bis 80 cm &middot; 10-14 Tage'],

  // --- Solidago ---
  ['Solidago wholesale from Kenya | JASM Flowers',
    'Solidago groothandel uit Kenia | JASM Flowers',
    'Solidago Großhandel aus Kenia | JASM Flowers'],
  ['Solidago grown in Kenya for professional flower buyers. 50 cm to 80 cm, 20 stems a bunch, 300 stems / full box. Cut to order, graded to your specification, FOB Nairobi.',
    'Solidago, geteeld in Kenia voor professionele bloemeninkopers. 50 cm tot 80 cm, 20 stelen per bos, 300 stelen / hele doos. Op order gesneden, gesorteerd op uw specificatie, FOB Nairobi.',
    'Solidago, in Kenia angebaut für professionelle Blumeneinkäufer. 50 cm bis 80 cm, 20 Stiele je Bund, 300 Stiele / ganze Kiste. Auf Auftrag geschnitten, nach Ihrer Spezifikation sortiert, FOB Nairobi.'],
  ['Solidago wholesale<br>from Kenya', 'Solidago groothandel<br>uit Kenia', 'Solidago Großhandel<br>aus Kenia'],
  ['Solidago is our largest programme. Our growing partners plant it for us through the year in the Kenyan highlands, so the volume is there when Europe needs it most.',
    'Solidago is ons grootste programma. Onze telerspartners planten het het hele jaar door voor ons in de Keniaanse hooglanden, zodat het volume er is wanneer Europa het het hardst nodig heeft.',
    'Solidago ist unser größtes Programm. Unsere Anbaupartner pflanzen es das ganze Jahr über für uns im kenianischen Hochland, damit das Volumen da ist, wenn Europa es am dringendsten braucht.'],
  ['Dense feathery plumes on a strong straight stem, cut at the stage that travels and opens in the vase rather than the stage that fills a box fastest. Graded so every bunch in the box carries the same plume weight.',
    'Dichte, pluimige bloemen aan een sterke rechte steel, gesneden op het stadium dat transport doorstaat en in de vaas opengaat, niet op het stadium dat een doos het snelst vult. Zo gesorteerd dat elke bos in de doos hetzelfde pluimgewicht heeft.',
    'Dichte, federartige Rispen an einem kräftigen geraden Stiel, geschnitten in dem Stadium, das den Transport übersteht und in der Vase aufgeht, nicht in dem Stadium, das eine Kiste am schnellsten füllt. So sortiert, dass jedes Bund in der Kiste dasselbe Rispengewicht trägt.'],
  ['One colour, golden yellow. Lengths run from 50 to 80 cm, and the length you order is what gets measured before the bunch is tied.',
    'Eén kleur, goudgeel. De lengtes lopen van 50 tot 80 cm, en de lengte die u bestelt is de lengte die wordt opgemeten voordat de bos wordt gebonden.',
    'Eine Farbe, Goldgelb. Die Längen reichen von 50 bis 80 cm, und die Länge, die Sie bestellen, wird gemessen, bevor das Bund gebunden wird.'],
  ['Grown between Naivasha at around 1,900 metres and the slopes of Mount Kenya. Bright days and nights that drop close to ten degrees slow the plant down, and that is what gives a tighter plume and a thicker neck.',
    'Geteeld tussen Naivasha op ongeveer 1.900 meter en de hellingen van Mount Kenya. Heldere dagen en nachten die tot bijna tien graden terugvallen remmen de plant af, en dat is wat een vastere pluim en een dikkere nek geeft.',
    'Angebaut zwischen Naivasha auf rund 1.900 Metern und den Hängen des Mount Kenya. Helle Tage und Nächte, die auf knapp zehn Grad fallen, bremsen die Pflanze, und genau das ergibt eine festere Rispe und einen stärkeren Hals.'],
  ['Cut in the cool of the morning into clean water with a hydration treatment, and into the cold room at 2 to 4 degrees within the hour. Most of a solidago&rsquo;s vase life is won or lost in that first hour.',
    'In de koelte van de ochtend gesneden, direct in schoon water met een hydratatiemiddel, en binnen het uur de koelcel in op 2 tot 4 graden. Het grootste deel van het vaasleven van solidago wordt in dat eerste uur gewonnen of verloren.',
    'In der Kühle des Morgens geschnitten, direkt in klares Wasser mit Hydrationsmittel, und innerhalb einer Stunde bei 2 bis 4 Grad in den Kühlraum. Der größte Teil des Vasenlebens von Solidago wird in dieser ersten Stunde gewonnen oder verloren.'],
  ['Available every month of the year. October to February is peak, which is when European supply is at its thinnest and standing volume is easiest to hold at the best grade.',
    'Elke maand van het jaar beschikbaar. Oktober tot februari is piek, precies wanneer de Europese aanvoer het dunst is en vast volume het makkelijkst op de beste sortering te houden is.',
    'In jedem Monat des Jahres verfügbar. Oktober bis Februar ist Spitze, genau dann, wenn das europäische Angebot am dünnsten ist und festes Volumen am leichtesten in der besten Sortierung zu halten ist.'],
  ['The workhorse filler for supermarket bouquet programmes and florist work. Buyers take it on a standing weekly weight alongside the eucalyptus and the limonium, so one bouquet costs one freight minimum.',
    'De werkpaardvulbloem voor boeketprogramma&rsquo;s in de supermarkt en voor floristenwerk. Inkopers nemen het op een vast weekgewicht naast de eucalyptus en de limonium, zodat één boeket één vrachtminimum kost.',
    'Die Arbeitspferd-Füllblume für Bouquetprogramme im Lebensmittelhandel und für Floristenarbeit. Einkäufer nehmen sie auf festem Wochengewicht neben dem Eukalyptus und dem Limonium, sodass ein Bouquet ein Frachtminimum kostet.'],

  // --- Eucalyptus Baby Blue ---
  ['Eucalyptus Baby Blue wholesale from Kenya | JASM Flowers',
    'Eucalyptus Baby Blue groothandel uit Kenia | JASM Flowers',
    'Eucalyptus Baby Blue Großhandel aus Kenia | JASM Flowers'],
  ['Eucalyptus Baby Blue grown in Kenya for professional flower buyers. 50 cm to 80 cm, 10 stems a bunch, 300 stems / full box. Cut to order, graded to your specification, FOB Nairobi.',
    'Eucalyptus Baby Blue, geteeld in Kenia voor professionele bloemeninkopers. 50 cm tot 80 cm, 10 stelen per bos, 300 stelen / hele doos. Op order gesneden, gesorteerd op uw specificatie, FOB Nairobi.',
    'Eucalyptus Baby Blue, in Kenia angebaut für professionelle Blumeneinkäufer. 50 cm bis 80 cm, 10 Stiele je Bund, 300 Stiele / ganze Kiste. Auf Auftrag geschnitten, nach Ihrer Spezifikation sortiert, FOB Nairobi.'],
  ['Eucalyptus Baby Blue wholesale<br>from Kenya',
    'Eucalyptus Baby Blue groothandel<br>uit Kenia',
    'Eucalyptus Baby Blue Großhandel<br>aus Kenia'],
  ['Eucalyptus Baby Blue is one of the two foliage lines we lead with: small round powder-blue leaves on a fine stem, with the scent the leaf is bought for.',
    'Eucalyptus Baby Blue is een van de twee groenlijnen waarmee wij vooroplopen: kleine ronde poederblauwe blaadjes aan een fijne steel, met de geur waar het blad om gekocht wordt.',
    'Eucalyptus Baby Blue ist eine der beiden Schnittgrünlinien, mit denen wir führen: kleine runde pudrig blaue Blätter an einem feinen Stiel, mit dem Duft, für den das Blatt gekauft wird.'],
  ['Cut at the stage that holds its bloom, the pale waxy film on a young leaf, rather than the stage that fills a box fastest. Sold by stem count, ten to a bunch, not by weight.',
    'Gesneden op het stadium dat de waslaag vasthoudt, het bleke matte laagje op een jong blad, en niet op het stadium dat een doos het snelst vult. Verkocht per aantal stelen, tien per bos, niet op gewicht.',
    'Geschnitten in dem Stadium, das den Wachsfilm hält, den blassen matten Belag auf einem jungen Blatt, und nicht in dem Stadium, das eine Kiste am schnellsten füllt. Verkauft nach Stielzahl, zehn je Bund, nicht nach Gewicht.'],
  ['Lengths from 50 to 80 cm. The colour runs powder blue to blue green depending on the block and the time of year; tell us which end of that you want and we grade for it.',
    'Lengtes van 50 tot 80 cm. De kleur loopt van poederblauw tot blauwgroen, afhankelijk van het perceel en de tijd van het jaar; zeg ons welke kant u wilt en wij sorteren daarop.',
    'Längen von 50 bis 80 cm. Die Farbe reicht von Pudrigblau bis Blaugrün, je nach Parzelle und Jahreszeit; sagen Sie uns, welches Ende Sie wollen, und wir sortieren darauf.'],
  ['Grown on the Mount Kenya side, between 2,100 and 2,400 metres. Altitude is what keeps the colour in the leaf and stops it blacking off in transit, which is the most common complaint about imported eucalyptus.',
    'Geteeld aan de kant van Mount Kenya, tussen 2.100 en 2.400 meter. Hoogte is wat de kleur in het blad houdt en voorkomt dat het onderweg zwart wordt. Dat is de meest gehoorde klacht over geïmporteerde eucalyptus.',
    'Angebaut auf der Mount-Kenya-Seite, zwischen 2.100 und 2.400 Metern. Die Höhe hält die Farbe im Blatt und verhindert, dass es unterwegs schwarz wird. Das ist die häufigste Beschwerde über importierten Eukalyptus.'],
  ['Pre-cooled within an hour of cutting and held at 2 to 4 degrees through the export process. Foliage is where bouquet margin sits, and it is also the first thing to look tired if the cold chain breaks.',
    'Binnen een uur na het snijden voorgekoeld en door het hele exportproces op 2 tot 4 graden gehouden. In het groen zit de marge van een boeket, en het is ook het eerste dat er vermoeid uitziet als de koelketen breekt.',
    'Innerhalb einer Stunde nach dem Schnitt vorgekühlt und über den gesamten Exportprozess bei 2 bis 4 Grad gehalten. Im Schnittgrün liegt die Marge eines Bouquets, und es ist auch das Erste, das müde aussieht, wenn die Kühlkette bricht.'],
  ['Available every month of the year, with no real peak or trough. That makes it the easiest line on our list to put on a standing weekly programme.',
    'Elke maand van het jaar beschikbaar, zonder echte piek of dal. Daarmee is het de makkelijkste lijn op onze lijst om op een vast weekprogramma te zetten.',
    'In jedem Monat des Jahres verfügbar, ohne echte Spitze oder Delle. Das macht es zur einfachsten Linie auf unserer Liste für ein festes Wochenprogramm.'],
  ['Bouquet producers and florists. One stem of Baby Blue carries texture that three fillers cannot, which is why it keeps its place in a recipe even when the flower in the middle changes.',
    'Boeketproducenten en floristen. Eén steel Baby Blue brengt een textuur die drie vulbloemen niet halen, en daarom houdt het zijn plek in een recept, ook als de bloem in het midden wisselt.',
    'Bouquetproduzenten und Floristen. Ein Stiel Baby Blue bringt eine Textur, die drei Füllblumen nicht erreichen, und darum hält es seinen Platz in einem Rezept, auch wenn die Blume in der Mitte wechselt.'],

  // --- Eucalyptus Silver Dollar ---
  ['Eucalyptus Silver Dollar wholesale from Kenya | JASM Flowers',
    'Eucalyptus Silver Dollar groothandel uit Kenia | JASM Flowers',
    'Eucalyptus Silver Dollar Großhandel aus Kenia | JASM Flowers'],
  ['Eucalyptus Silver Dollar grown in Kenya for professional flower buyers. 50 cm to 80 cm, 10 stems a bunch, 300 stems / full box. Cut to order, graded to your specification, FOB Nairobi.',
    'Eucalyptus Silver Dollar, geteeld in Kenia voor professionele bloemeninkopers. 50 cm tot 80 cm, 10 stelen per bos, 300 stelen / hele doos. Op order gesneden, gesorteerd op uw specificatie, FOB Nairobi.',
    'Eucalyptus Silver Dollar, in Kenia angebaut für professionelle Blumeneinkäufer. 50 cm bis 80 cm, 10 Stiele je Bund, 300 Stiele / ganze Kiste. Auf Auftrag geschnitten, nach Ihrer Spezifikation sortiert, FOB Nairobi.'],
  ['Eucalyptus Silver Dollar wholesale<br>from Kenya',
    'Eucalyptus Silver Dollar groothandel<br>uit Kenia',
    'Eucalyptus Silver Dollar Großhandel<br>aus Kenia'],
  ['Eucalyptus Silver Dollar is the structural half of our foliage programme: the large rounded coin leaf, on a straighter and heavier stem than Baby Blue.',
    'Eucalyptus Silver Dollar is de constructieve helft van ons groenprogramma: het grote ronde muntblad, aan een rechtere en zwaardere steel dan Baby Blue.',
    'Eucalyptus Silver Dollar ist die tragende Hälfte unseres Schnittgrünprogramms: das große runde Münzblatt, an einem geraderen und schwereren Stiel als Baby Blue.'],
  ['Used where a bouquet needs volume and structure rather than texture. One stem does the work of three fillers, and it holds its shape in the vase for weeks after the flowers have gone over.',
    'Gebruikt waar een boeket volume en structuur nodig heeft in plaats van textuur. Eén steel doet het werk van drie vulbloemen, en houdt zijn vorm weken in de vaas nadat de bloemen al over zijn.',
    'Eingesetzt dort, wo ein Bouquet Volumen und Struktur braucht statt Textur. Ein Stiel leistet die Arbeit von drei Füllblumen und hält seine Form wochenlang in der Vase, wenn die Blumen längst vorbei sind.'],
  ['Ten stems a bunch, 50 to 80 cm, silver green to grey green. Sold by stem count rather than by weight, so what you order is what you can count in the box.',
    'Tien stelen per bos, 50 tot 80 cm, zilvergroen tot grijsgroen. Verkocht per aantal stelen in plaats van op gewicht, dus wat u bestelt kunt u in de doos natellen.',
    'Zehn Stiele je Bund, 50 bis 80 cm, Silbergrün bis Graugrün. Verkauft nach Stielzahl statt nach Gewicht, also lässt sich das Bestellte in der Kiste nachzählen.'],
  ['The same Mount Kenya blocks as Baby Blue, 2,100 to 2,400 metres. The cool nights at that altitude are what build the heavier stem; a lower farm grows the same variety faster and softer.',
    'Dezelfde percelen bij Mount Kenya als Baby Blue, 2.100 tot 2.400 meter. De koele nachten op die hoogte bouwen de zwaardere steel; een lager gelegen bedrijf laat dezelfde variëteit sneller en slapper groeien.',
    'Dieselben Mount-Kenya-Parzellen wie Baby Blue, 2.100 bis 2.400 Meter. Die kühlen Nächte in dieser Höhe bauen den schwereren Stiel; ein tiefer gelegener Betrieb zieht dieselbe Sorte schneller und weicher.'],
  ['Checked on stem straightness and leaf condition before bunching, then pre-cooled within the hour and held at 2 to 4 degrees until it flies.',
    'Voor het bossen gecontroleerd op rechte steel en bladconditie, dan binnen het uur voorgekoeld en op 2 tot 4 graden gehouden tot het vliegt.',
    'Vor dem Bündeln auf geraden Stiel und Blattzustand geprüft, dann innerhalb der Stunde vorgekühlt und bei 2 bis 4 Grad gehalten, bis es fliegt.'],
  ['Available every month of the year. Like Baby Blue it has no real season, which is why the two of them anchor most standing foliage programmes.',
    'Elke maand van het jaar beschikbaar. Net als Baby Blue kent het geen echt seizoen, en daarom vormen die twee samen de basis van de meeste vaste groenprogramma&rsquo;s.',
    'In jedem Monat des Jahres verfügbar. Wie Baby Blue kennt es keine echte Saison, und darum tragen die beiden zusammen die meisten festen Schnittgrünprogramme.'],
  ['Wholesalers and bouquet lines that need a foliage they can specify once and keep buying. Also strong in event and wedding work, where the leaf is on show rather than filling a gap.',
    'Grossiers en boeketlijnen die groen nodig hebben dat ze één keer specificeren en blijven kopen. Ook sterk in event- en bruidswerk, waar het blad in beeld staat in plaats van een gat te vullen.',
    'Großhändler und Bouquetlinien, die ein Schnittgrün brauchen, das sie einmal spezifizieren und dann weiter kaufen. Auch stark in Event- und Hochzeitsarbeit, wo das Blatt zu sehen ist und nicht eine Lücke füllt.'],

  // --- Limonium ---
  ['Limonium wholesale from Kenya | JASM Flowers',
    'Limonium groothandel uit Kenia | JASM Flowers',
    'Limonium Großhandel aus Kenia | JASM Flowers'],
  ['Limonium grown in Kenya for professional flower buyers. 50 cm to 70 cm, 25 stems a bunch, 300 stems / full box. Cut to order, graded to your specification, FOB Nairobi.',
    'Limonium, geteeld in Kenia voor professionele bloemeninkopers. 50 cm tot 70 cm, 25 stelen per bos, 300 stelen / hele doos. Op order gesneden, gesorteerd op uw specificatie, FOB Nairobi.',
    'Limonium, in Kenia angebaut für professionelle Blumeneinkäufer. 50 cm bis 70 cm, 25 Stiele je Bund, 300 Stiele / ganze Kiste. Auf Auftrag geschnitten, nach Ihrer Spezifikation sortiert, FOB Nairobi.'],
  ['Limonium wholesale<br>from Kenya', 'Limonium groothandel<br>uit Kenia', 'Limonium Großhandel<br>aus Kenia'],
  ['Limonium runs alongside the solidago and the eucalyptus as a core programme line: airy sprays of small papery flowers on a branched stem, graded so every bunch carries the same spray weight.',
    'Limonium loopt naast de solidago en de eucalyptus mee als kernprogrammalijn: luchtige pluimen van kleine papierachtige bloemen aan een vertakte steel, zo gesorteerd dat elke bos hetzelfde pluimgewicht heeft.',
    'Limonium läuft neben dem Solidago und dem Eukalyptus als Kernprogrammlinie mit: luftige Rispen kleiner papierartiger Blüten an einem verzweigten Stiel, so sortiert, dass jedes Bund dasselbe Rispengewicht trägt.'],
  ['Twenty-five stems a bunch, 50 to 70 cm, 300 stems in a full box. It fills volume without adding weight, which matters when the freight is priced by the kilo.',
    'Vijfentwintig stelen per bos, 50 tot 70 cm, 300 stelen in een hele doos. Het vult volume zonder gewicht toe te voegen, en dat telt wanneer de vracht per kilo wordt afgerekend.',
    'Fünfundzwanzig Stiele je Bund, 50 bis 70 cm, 300 Stiele in einer ganzen Kiste. Es füllt Volumen, ohne Gewicht hinzuzufügen, und das zählt, wenn die Fracht nach Kilo abgerechnet wird.'],
  ['Lavender, deep purple, yellow and white. Mixed or straight colour, and a mix is graded rather than whatever came off the block that morning.',
    'Lavendel, dieppaars, geel en wit. Gemengd of in één kleur, en een mengeling is gesorteerd in plaats van wat die ochtend van het perceel kwam.',
    'Lavendel, Tieflila, Gelb und Weiß. Gemischt oder in einer Farbe, und eine Mischung ist sortiert und nicht einfach, was an diesem Morgen von der Parzelle kam.'],
  ['Lakeside blocks around Naivasha on volcanic soil at about 1,900 metres, the same ground as the solidago. That is the reason filler volume holds here all year.',
    'Percelen aan het meer bij Naivasha op vulkanische grond op ongeveer 1.900 meter, dezelfde grond als de solidago. Dat is de reden dat het vulbloemvolume hier het hele jaar doorloopt.',
    'Parzellen am See bei Naivasha auf vulkanischem Boden auf etwa 1.900 Metern, derselbe Boden wie beim Solidago. Das ist der Grund, warum das Füllblumenvolumen hier das ganze Jahr durchläuft.'],
  ['Cut, graded and pre-cooled on the same timeline as everything else we ship: into the cold room at 2 to 4 degrees within the hour, and held there until it flies.',
    'Gesneden, gesorteerd en voorgekoeld op dezelfde tijdlijn als al het andere dat wij verzenden: binnen het uur de koelcel in op 2 tot 4 graden, en daar gehouden tot het vliegt.',
    'Geschnitten, sortiert und vorgekühlt auf derselben Zeitlinie wie alles andere, was wir versenden: innerhalb der Stunde bei 2 bis 4 Grad in den Kühlraum und dort gehalten, bis es fliegt.'],
  ['Available every month of the year, with no closed season.',
    'Elke maand van het jaar beschikbaar, zonder gesloten seizoen.',
    'In jedem Monat des Jahres verfügbar, ohne geschlossene Saison.'],
  ['Bouquet programmes and florists who need to make a bouquet look twice the size for very little weight. It also dries well, so it carries into dried and preserved work.',
    'Boeketprogramma&rsquo;s en floristen die een boeket twee keer zo groot willen laten lijken voor heel weinig gewicht. Het droogt ook goed, dus het loopt door in droog- en preserveerwerk.',
    'Bouquetprogramme und Floristen, die ein Bouquet mit sehr wenig Gewicht doppelt so groß wirken lassen wollen. Es trocknet außerdem gut und trägt damit in Trocken- und Konservierungsarbeit weiter.'],
];

for (const [lang, idx] of [['nl', 1], ['de', 2]]) {
  const f = path.join(ROOT, 'src', 'lang', `${lang}.tsv`);
  const have = new Set(fs.readFileSync(f, 'utf8').split(/\r?\n/)
    .filter(l => l && l[0] !== '#' && l.includes('\t'))
    .map(l => l.slice(0, l.indexOf('\t')).trim()));
  const add = ROWS.filter(r => !have.has(r[0]));
  if (!add.length) { console.log(`${lang}: nothing to add`); continue; }
  fs.appendFileSync(f,
    `\n# --- key-line pages (/wholesale/*), 9 Oct 2026 ---\n` +
    add.map(r => `${r[0]}\t${r[idx]}`).join('\n') + '\n');
  console.log(`${lang}: +${add.length}`);
}
