/* Bouwt de losse assortimentspaginas van concept 2, plus de prijspagina.
   Kop, voet en het aanvraagblok staan een keer hier in plaats van zeven keer in
   losse html-bestanden, zodat een wijziging aan het menu of de gegevens van Anka
   niet op zes plekken vergeten kan worden.
   Draaien: node bouw-paginas.mjs

   Sinds 10-10-2026 schrijft dit script ook tekst-ro.js: de Roemeense sleutels
   voor deze paginas, uit dezelfde bron als de Nederlandse tekst ernaast. Daarom
   staat de vertaling hieronder naast het origineel en niet in i18n.js - zo kan
   een nieuwe alinea of een nieuwe groep niet stil zonder vertaling de pagina op
   komen. De poort onderaan telt ze na en gooit.

   18-10-2026: Anka stuurde haar prijzen, 61 eigen fotos en de vraag om een
   Engelse versie. Drie dingen zijn daardoor veranderd.
   1. Engels is een derde taal geworden. Elke pagina heeft nu een en- EN een
      ro-blok, en de poort eist ze allebei. Een taal erbij is hier dus een
      kolom erbij en geen tweede bestand dat kan gaan afwijken.
   2. Prijzen staan in de data en niet in een zin, zodat hetzelfde bedrag op de
      soortpagina en op prijzen.html uit een bron komt. Haar eigen formulering
      is aangehouden: bedragen per kg of per stuk, decoratie apart.
   3. Eclairs zijn eruit en vruchtengebak ervoor in de plaats, op haar verzoek.
      eclairs.html blijft als omleiding bestaan, want dat adres is gedeeld.

   18-10-2026, tweede ronde: Anka vroeg om choux en cupcakes onder een item. Dat
   is haar eigen indeling - in haar prijslijst staan ze samen onder "Choux &
   cupcakes" met elk hun eigen bedrag. Ze zijn daarom een pagina geworden met
   twee groepen die elk hun eigen prijs dragen, en niet een pagina waarop twee
   bedragen tot een gemiddelde zijn platgeslagen. choux.html en cupcakes.html
   zijn allebei in deze groep rondgestuurd en blijven dus bestaan als omleiding.

   Daarbij kwam een fout boven die sinds de Engelse versie van vanmorgen in de
   site zat: html-entiteiten in de vertaaltabel. i18n.js zet een data-i18n met
   textContent, dus "Wedding &amp; ceremony" kwam er letterlijk zo te staan, met
   de &amp; erin. Alleen in het Engels zichtbaar en alleen op de pagina's met
   een & of een apostrof. De tabellen dragen nu gewone tekens en de poort
   onderaan zakt zodra er weer een entiteit in een tekstsleutel sluipt.
*/
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { aipoort } from './tools/aipoort.mjs';
import { ARTIKELEN, voorwaardenSleutels, VW_TITEL } from './voorwaarden.mjs';

const TALEN = ['nl', 'en', 'ro'];

/* ---------- 18-10-2026: verhuisd naar jiw-websites ----------
   Tot vandaag was dit een conceptmap: tien losse html-bestanden naast elkaar,
   adressen met .html erachter, en de Engelse en Roemeense versie die pas in de
   browser ontstond - i18n.js wisselde de tekst om op basis van localStorage.
   Dat werkt voor een bezoeker en niet voor een zoekmachine: er was precies een
   adres per pagina, met lang="nl" erop, en de andere twee talen bestonden
   nergens als pagina. Niet te indexeren, en niet te delen.

   Deze bouw schrijft daarom 31 echte pagina's in dist/: tien in het Nederlands
   op de wortel, tien onder /en/, tien onder /ro/ en een 404. Elke taal heeft
   zijn eigen adres, zijn eigen lang-attribuut, zijn eigen canonical en een
   hreflang-set die naar de andere twee wijst. De tekst staat voluit in de html;
   er is geen tekstbestand meer dat in de browser wordt ingeladen.

   De vertaling gebeurt daarbij op dezelfde sleutels als eerst (data-i18n,
   data-i18n-html, data-i18n-attr), alleen nu in de bouw in plaats van in de
   browser - zie vertaal() verderop. Dat is bewust: de tabellen die hier al
   stonden zijn maandenlang op de live site nagemeten, en ze worden nog steeds
   uit dezelfde bron naast het Nederlands gebouwd. Wat verdwijnt is alleen het
   moment waarop ze worden toegepast. tools/tegenproef.mjs legt de twee naast
   elkaar in een echte browser en bewijst dat er niets veranderd is.

   De adressen zijn ook .html kwijt (/taarten, niet /taarten.html). De oude
   vormen blijven werken: de worker stuurt alles wat op .html eindigt met een
   301 door, inclusief de drie adressen die geen pagina meer zijn (eclairs,
   choux, cupcakes). Die omleidingen stonden hier als losse html-bestanden met
   een meta-refresh erin; dat is nu een regel in worker/index.ts. */
const PROD = process.argv.includes('--prod');

/* Het echte domein. In de conceptbouw staan de pagina's op noindex (zie
   hoofd()), dus een canonical naar de apex is dan geen uitnodiging aan Google
   om een testbouw te indexeren - maar het adres blijft hetzelfde, zodat de
   poort in tools/vooraf.mjs in beide bouwen dezelfde controle doet.

   De apex is canoniek en niet www. Dit domein heeft geen geschiedenis: er stond
   nooit een site op, alleen haar Purelymail-mailbox. Dus geldt de huisregel uit
   de root CLAUDE.md, en niet de uitzondering die voor framemedia gemaakt is. */
const ADRES = 'https://velvetcakesbyanka.nl';

/* Waar een taal woont. Het Nederlands staat op de wortel omdat het de taal is
   waarin de site geschreven is en waarin haar klanten in Bergen op Zoom zoeken;
   Engels en Roemeens staan in een eigen map. x-default wijst naar het
   Nederlands, want dat is de versie die iemand zonder voorkeur hoort te krijgen.

   Een map en niet een hostnaam of een queryparameter: een map erft het domein,
   dus alles wat de apex aan vertrouwen opbouwt werkt ook voor /ro/. */
const PREFIX = { nl: '', en: '/en', ro: '/ro' };

/* De slug is in alle drie de talen dezelfde (/en/taarten, niet /en/cakes). Dat
   is een bewuste keuze en geen vergeetpunt: een vertaalde slug is iets beter
   voor het Engels, maar hij verandert ook elk intern adres, elke hreflang en
   elke sitemap-regel, en een fout daarin kost een pagina uit de index. De
   hreflang-set vertelt Google al in welke taal een pagina staat; de slug doet
   dat werk niet. Willen we het later wel, dan is het een tabel hier en niet een
   verbouwing van de links. */
const adresVan = (taal, slug) => `${PREFIX[taal]}/${slug === 'index' ? '' : slug}`;
const volledig = (taal, slug) => `${ADRES}${adresVan(taal, slug)}`;

/* ---------- haar gegevens, op een plek ----------
   Stond tot 18-10-2026 zes keer als letterlijk mailadres in dit script en in
   index.html. Haar voorwaarden noemen info@velvetcakesbyanka.nl als officieel
   adres; vanmorgen had dat domein nog geen MX-record, dus stond hier het gmail
   dat wel werkte. Nagemeten tegen 8.8.8.8 op 18-10-2026 13:00: er staat nu een
   MX naar mailserver.purelymail.com plus een SPF-regel voor purelymail, dus de
   mailbox bestaat. Daarmee is dit het adres van de site geworden, in een keer
   overal, en loopt hij gelijk met artikel 1 van haar voorwaarden.
   Het gmail blijft bestaan maar staat nergens meer op de site. */
const MAIL = 'info@velvetcakesbyanka.nl';
const TEL_TEKST = '06 83 67 40 69';
const WA_NUMMER = '31683674069';

/* ---------- bijschriften ----------
   De 41 fotos die er al stonden komen uit bijschriften.json, dat haal-caps.mjs
   uit concept 1 trekt: dezelfde foto draagt in beide concepten dezelfde regel,
   in alle drie de talen. De 57 fotos die Anka op 18-10-2026 zelf aanleverde
   staan niet in concept 1 en dus hieronder.

   Bijschriften blijven bij wat er in beeld staat. Wie de taart bestelde, wat
   iemand erbij voelde of hoe lekker het was staat er niet in: dat is haar
   verhaal om te vertellen en niet iets om uit een foto af te leiden. */
const BIJ_OUD = JSON.parse(readFileSync(new URL('./bijschriften.json', import.meta.url), 'utf8'));

const BIJ_NIEUW = {
  /* Uit de fotoshoot van 10-10-2026. Die fotos staan alleen in concept 2, dus
     bijschriften.json kent ze niet; ze stonden tot nu toe met de hand bijgezet
     in caps-ro.json. Hier horen ze thuis, naast de rest van wat concept 1 niet
     heeft. Het Engels is er op 18-10-2026 bij geschreven. */
  'bruid-ivoor-goud': { nl: 'Bruidstaart in ivoor met bladgoud en zijden strik', en: 'Ivory wedding cake with gold leaf and a satin bow', ro: 'Tort de nuntă ivoire cu foiță de aur și fundă de satin' },
  'bruid-ivoor-anka': { nl: 'Anka met de afgewerkte bruidstaart', en: 'Anka with the finished wedding cake', ro: 'Anka cu tortul de nuntă terminat' },

  /* bruiloft en ceremonie */
  'bruid-ruffle-lisianthus': { nl: 'Tweelaagse ruffletaart met lisianthus en rozen', en: 'Two-tier ruffle cake with lisianthus and roses', ro: 'Tort cu volane pe două etaje, cu lisianthus și trandafiri' },
  'bruid-ruffle-opbouw': { nl: 'Anka zet de bovenste laag op de ruffletaart', en: 'Anka setting the top tier on the ruffle cake', ro: 'Anka așază etajul de sus pe tortul cu volane' },
  'bruid-vier-lagen-rozen': { nl: 'Vierlaagse bruidstaart met rozen en orchideeen', en: 'Four-tier wedding cake with roses and orchids', ro: 'Tort de nuntă pe patru etaje, cu trandafiri și orhidee' },
  'bruid-ivoor-monogram': { nl: 'Ivoren taart met monogram en suikerbloemen', en: 'Ivory cake with a monogram and sugar flowers', ro: 'Tort ivoire cu monogramă și flori de zahăr' },

  /* klassiek en elegant */
  'klassiek-witte-ruffles': { nl: 'Witte taart met golvende ruffles', en: 'White cake with flowing ruffles', ro: 'Tort alb cu volane unduitoare' },
  'klassiek-luipaard-strik': { nl: 'Luipaardprint met zwarte strik', en: 'Leopard print with a black bow', ro: 'Imprimeu de leopard cu fundă neagră' },
  'klassiek-rode-blaadjes': { nl: 'Rode taart met blaadjes en gouden kaarsen', en: 'Red cake with petals and golden candles', ro: 'Tort roșu cu petale și lumânări aurii' },
  'klassiek-roze-vlinders': { nl: 'Roze rozen met vlinders', en: 'Pink roses with butterflies', ro: 'Trandafiri roz cu fluturi' },
  'klassiek-rozen-jasmijn': { nl: 'Ivoor met rode rozen en witte bloemen', en: 'Ivory with red roses and white blossom', ro: 'Ivoire cu trandafiri roșii și flori albe' },
  'klassiek-tas-monogram': { nl: 'Taart in de vorm van een designertas', en: 'Cake shaped like a designer handbag', ro: 'Tort în formă de geantă de designer' },
  'klassiek-zwart-kroon': { nl: 'Zwarte taart met gouden kroon', en: 'Black cake with a golden crown', ro: 'Tort negru cu coroană aurie' },
  'klassiek-dame-rode-hoed': { nl: 'Geschilderde dame met rode hoed', en: 'Hand-painted lady in a red hat', ro: 'Doamnă pictată manual, cu pălărie roșie' },
  'klassiek-rood-aardbei': { nl: 'Rode fluweellook met aardbeien', en: 'Red velvet finish with strawberries', ro: 'Finisaj roșu catifelat cu căpșuni' },
  'klassiek-orchidee-waaier': { nl: 'Ivoor met orchideeen en een gouden waaier', en: 'Ivory with orchids and a golden fan', ro: 'Ivoire cu orhidee și un evantai auriu' },
  'klassiek-rood-vierkant': { nl: 'Rode vierkante taart met aardbeien', en: 'Square red cake with strawberries', ro: 'Tort roșu pătrat cu căpșuni' },

  /* verjaardag */
  'feest-karamel-aardbei': { nl: 'Karameldrip met aardbeien', en: 'Caramel drip with strawberries', ro: 'Drip de caramel cu căpșuni' },
  'feest-bessen-rondom': { nl: 'Taart rondom bezet met rood fruit', en: 'Cake covered all round with berries', ro: 'Tort acoperit de jur împrejur cu fructe de pădure' },

  /* kinderfeest */
  'kinder-minion': { nl: 'Minion-taart met feesthoed', en: 'Minion cake with a party hat', ro: 'Tort Minion cu pălărie de petrecere' },
  'kinder-vlinders-lila': { nl: 'Drielaagse taart met vlinders in lila', en: 'Three-tier cake with lilac butterflies', ro: 'Tort pe trei etaje cu fluturi lila' },
  'kinder-zwarte-katten': { nl: 'Paarse taart met zwarte katten', en: 'Purple cake with black cats', ro: 'Tort mov cu pisici negre' },
  'kinder-jungle-dieren': { nl: 'Jungletaart met leeuw, panda en aapje', en: 'Jungle cake with a lion, a panda and a monkey', ro: 'Tort junglă cu leu, panda și maimuțică' },
  'kinder-hulk-muur': { nl: 'Hulk op een muur van steen', en: 'Hulk on a stone wall', ro: 'Hulk pe un zid de piatră' },
  'kinder-eerste-tandje': { nl: 'Taart voor een eerste tandje, met wolkjes', en: 'First tooth cake with little clouds', ro: 'Tort pentru primul dințișor, cu norișori' },
  'kinder-raceauto': { nl: 'Gele taart met raceauto en finishvlag', en: 'Yellow cake with a race car and a chequered flag', ro: 'Tort galben cu mașină de curse și steag în carouri' },
  /* bewust niet "ruimtetaart" of "space cake": dat leest in het Nederlands en
     het Engels als iets heel anders dan een taart met planeten erop */
  'kinder-ruimte-planeten': { nl: 'Taart met planeten en een raket', en: 'Cake with planets and a rocket', ro: 'Tort cu planete și o rachetă' },
  'kinder-spiderman-masker': { nl: 'Spidermanmasker met ballonnen', en: 'Spider-Man mask with balloons', ro: 'Mască Spider-Man cu baloane' },
  'kinder-lolly-blauw-roze': { nl: 'Blauw met roze, lolly en figuurtjes', en: 'Blue and pink, with a lollipop and figures', ro: 'Albastru cu roz, acadea și figurine' },
  'kinder-aardbei-groen': { nl: 'Groene drip over roze, met aardbeien', en: 'Green drip over pink, with strawberries', ro: 'Drip verde peste roz, cu căpșuni' },
  'kinder-regenboog-hartjes': { nl: 'Tweelaagse taart met regenbogen en hartjes', en: 'Two-tier cake with rainbows and hearts', ro: 'Tort pe două etaje cu curcubeie și inimioare' },
  'kinder-make-up': { nl: 'Taart met make-up van suiker', en: 'Cake with make-up made of sugar', ro: 'Tort cu machiaj din zahăr' },
  'kinder-blokjes-groen': { nl: 'Groene taart met blokjesfiguren', en: 'Green cake with block figures', ro: 'Tort verde cu figurine din cuburi' },
  'kinder-hond-regenboog': { nl: 'Tweelaagse taart met regenboog en hondjes', en: 'Two-tier cake with a rainbow and puppies', ro: 'Tort pe două etaje cu curcubeu și cățeluși' },
  'kinder-chocoladefabriek': { nl: 'Kleurige taart met snoep en een gouden kaartje', en: 'Colourful cake with sweets and a golden ticket', ro: 'Tort colorat cu bomboane și un bilet auriu' },

  /* cupcakes */
  'cup-blauw-roze': { nl: 'Cupcakes in blauw en roze met figuurtjes', en: 'Cupcakes in blue and pink with figures', ro: 'Cupcakes în albastru și roz, cu figurine' },
  'cup-framboos-doos': { nl: 'Cupcakes met framboos, klaar in de doos', en: 'Raspberry cupcakes, boxed and ready', ro: 'Cupcakes cu zmeură, gata în cutie' },
  'cup-mango-doos': { nl: 'Cupcakes met mango in de doos', en: 'Mango cupcakes in the box', ro: 'Cupcakes cu mango în cutie' },
  'cup-redvelvet-doos': { nl: 'Red velvet cupcakes met kruim', en: 'Red velvet cupcakes with crumb', ro: 'Cupcakes red velvet cu firimituri' },

  /* macarons */
  'macaron-dozen-kleur': { nl: 'Dozen macarons in verschillende kleuren', en: 'Boxes of macarons in different colours', ro: 'Cutii cu macarons în culori diferite' },
  'macaron-tafel-pastel': { nl: 'Macarons in pasteltinten op tafel', en: 'Macarons in pastel shades on the table', ro: 'Macarons în nuanțe pastel pe masă' },

  /* vruchtengebak */
  'vrucht-mango': { nl: 'Gebakjes in de vorm van een mango', en: 'Pastries shaped like a mango', ro: 'Prăjituri în formă de mango' },
  'vrucht-aardbei': { nl: 'Gebakje in de vorm van een aardbei', en: 'Pastry shaped like a strawberry', ro: 'Prăjitură în formă de căpșună' },
  'vrucht-citroen': { nl: 'Gebakje in de vorm van een citroen', en: 'Pastry shaped like a lemon', ro: 'Prăjitură în formă de lămâie' },
  'vrucht-cacao-rij': { nl: 'Ronde gebakjes met cacaopoeder', en: 'Round pastries dusted with cocoa', ro: 'Prăjituri rotunde pudrate cu cacao' },
  'vrucht-groen-marmer': { nl: 'Langwerpige gebakjes met gemarmerd glazuur', en: 'Elongated pastries with a marbled glaze', ro: 'Prăjituri alungite cu glazură marmorată' },

  /* desserts */
  'dessert-fruittaartje': { nl: 'Taartje met vers fruit', en: 'Tartlet with fresh fruit', ro: 'Tartă cu fructe proaspete' },
  'dessert-karamel-bol': { nl: 'Dessert met spiegelglazuur en een bol erop', en: 'Dessert with mirror glaze and a sphere on top', ro: 'Desert cu glazură oglindă și o sferă deasupra' },
  'dessert-chocolade-doos': { nl: 'Chocoladegebakjes in een doos', en: 'Chocolate pastries in a box', ro: 'Prăjituri cu ciocolată în cutie' },
  'dessert-framboos-roze': { nl: 'Roze frambozengebakjes op gouden schaaltjes', en: 'Pink raspberry pastries on gold bases', ro: 'Prăjituri roz cu zmeură pe suporturi aurii' },
  'dessert-wit-rood': { nl: 'Wit en rood gebak door elkaar', en: 'White and red pastries side by side', ro: 'Prăjituri albe și roșii una lângă alta' },
  'dessert-chocolade-roosjes': { nl: 'Chocoladetaartje met toefjes room', en: 'Chocolate tartlet with cream rosettes', ro: 'Tartă cu ciocolată și rozete de frișcă' },
  'dessert-chocolade-perzik': { nl: 'Chocolade en perzik naast elkaar in de doos', en: 'Chocolate and peach side by side in the box', ro: 'Ciocolată și piersică una lângă alta în cutie' },
  'dessert-noten-taartjes': { nl: 'Taartjes met toefjes en nootjes', en: 'Tartlets with cream tufts and nuts', ro: 'Tarte cu rozete și alune' },
  'dessert-abrikoos-schijf': { nl: 'Oranje gebakjes met een chocoladeschijf', en: 'Orange pastries with a chocolate disc', ro: 'Prăjituri portocalii cu un disc de ciocolată' },
  'dessert-bordeaux-goud': { nl: 'Donkerrode gebakjes met bladgoud', en: 'Deep red pastries with gold leaf', ro: 'Prăjituri roșu-închis cu foiță de aur' },

  /* cozonac */
  'cozonac-verpakt': { nl: 'Cozonac ingepakt met een zegel', en: 'Cozonac wrapped and sealed', ro: 'Cozonac ambalat cu sigiliu' },
  'cozonac-drie-soorten': { nl: 'Cozonac in drie soorten naast elkaar', en: 'Three kinds of cozonac side by side', ro: 'Cozonac în trei feluri, unul lângă altul' },
  'cozonac-amandel': { nl: 'Cozonac met amandelen op een plank', en: 'Cozonac with almonds on a board', ro: 'Cozonac cu migdale pe un fund de lemn' },
};

const BIJ = { ...BIJ_OUD, ...BIJ_NIEUW };

/* ---------- prijzen ----------
   Haar eigen prijslijst van 18-10-2026, zoals zij hem stuurde. Staat hier als
   data en niet als zin, zodat de soortpagina en prijzen.html hetzelfde bedrag
   uit dezelfde plek halen. Een bedrag op twee plekken overtypen is precies hoe
   er ergens een oude prijs blijft staan.

   eenheid: 'kg' of 'stuk'. bedrag: een string, of {van, tot} voor een bereik. */
const EENHEID = {
  kg: { nl: 'per kg', en: 'per kg', ro: 'pe kg' },
  stuk: { nl: 'per stuk', en: 'each', ro: 'bucata' },
};
const VAN = { nl: 'van', en: 'from', ro: 'de la' };
const OP_AANVRAAG = { nl: 'Op aanvraag', en: 'On request', ro: 'La cerere' };
const TOT = { nl: 'tot', en: 'to', ro: 'până la' };

const ZONDER_DECO = { nl: 'decoratie niet inbegrepen', en: 'decoration not included', ro: 'decorul nu este inclus' };
const NAAR_SOORT = { nl: 'afhankelijk van de soort', en: 'depending on the type', ro: 'în funcție de sortiment' };

/* ---------- haar smaken ----------
   De kaart "Taartsmaken" die Anka op 18-10-2026 stuurde, in haar eigen
   volgorde en met haar eigen nummering. Negentien smaken plus haar twintigste
   regel, "Andere smaken in overleg" - dat is geen smaak maar de open deur, dus
   die staat onderaan met een eigen merk (open: true) en krijgt geen nummer.

   Een merknaam blijft in elke taal staan zoals hij heet: Ferrero Rocher,
   Raffaello, Snickers, Bounty, Kinder Bueno, Oreo, Red velvet en Tiramisu zijn
   geen woorden om te vertalen. Alleen de beschrijvende smaken gaan mee in de
   taal. */
const SMAKEN = [
  { nl: 'Chocolade en vanille', en: 'Chocolate and vanilla', ro: 'Ciocolată și vanilie' },
  { nl: 'Witte chocolade en framboos', en: 'White chocolate and raspberry', ro: 'Ciocolată albă și zmeură' },
  { nl: 'Melkchocolade en framboos', en: 'Milk chocolate and raspberry', ro: 'Ciocolată cu lapte și zmeură' },
  { nl: 'Mascarpone en aardbeien', en: 'Mascarpone and strawberries', ro: 'Mascarpone și căpșuni' },
  { nl: 'Chocolade en bosvruchten', en: 'Chocolate and forest fruits', ro: 'Ciocolată și fructe de pădure' },
  { nl: 'Karamel en koffie', en: 'Caramel and coffee', ro: 'Caramel și cafea' },
  { nl: 'Pistache en framboos', en: 'Pistachio and raspberry', ro: 'Fistic și zmeură' },
  { nl: 'Citroen en maanzaad', en: 'Lemon and poppy seed', ro: 'Lămâie și mac' },
  { nl: 'Chocolade en kersen', en: 'Chocolate and cherry', ro: 'Ciocolată și vișine' },
  { nl: 'Mango en passievrucht', en: 'Mango and passion fruit', ro: 'Mango și fructul pasiunii' },
  { nl: 'Chocolade en sinaasappel', en: 'Chocolate and orange', ro: 'Ciocolată și portocale' },
  { nl: 'Ferrero Rocher', en: 'Ferrero Rocher', ro: 'Ferrero Rocher' },
  { nl: 'Raffaello', en: 'Raffaello', ro: 'Raffaello' },
  { nl: 'Snickers', en: 'Snickers', ro: 'Snickers' },
  { nl: 'Bounty', en: 'Bounty', ro: 'Bounty' },
  { nl: 'Tiramisu', en: 'Tiramisu', ro: 'Tiramisu' },
  { nl: 'Kinder Bueno', en: 'Kinder Bueno', ro: 'Kinder Bueno' },
  { nl: 'Oreo', en: 'Oreo', ro: 'Oreo' },
  { nl: 'Red velvet', en: 'Red velvet', ro: 'Red velvet' },
  { nl: 'Andere smaken in overleg', en: 'Other flavours on request', ro: 'Alte arome la cerere', open: true },
];
/* het aantal echte smaken, zonder haar open regel. Staat in de lead en in de
   omschrijving voor Google, en die twee moeten meelopen als er een smaak bij
   komt - een handmatig "negentien" blijft anders staan. */
const AANTAL_SMAKEN = SMAKEN.filter(s => !s.open).length;
const SMAAKWOORD = {
  nl: ['nul', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf', 'twaalf', 'dertien', 'veertien', 'vijftien', 'zestien', 'zeventien', 'achttien', 'negentien', 'twintig'],
  en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'],
  ro: ['zero', 'una', 'două', 'trei', 'patru', 'cinci', 'șase', 'șapte', 'opt', 'nouă', 'zece', 'unsprezece', 'douăsprezece', 'treisprezece', 'paisprezece', 'cincisprezece', 'șaisprezece', 'șaptesprezece', 'optsprezece', 'nouăsprezece', 'douăzeci'],
};
const smaakAantal = taal => SMAAKWOORD[taal]?.[AANTAL_SMAKEN] ?? String(AANTAL_SMAKEN);

/* ---------- de soortpaginas ---------- */
const PAGINAS = [
  {
    slug: 'taarten',
    titel: 'Taarten',
    tegel: 'bruid-ivoor-goud',
    hero: 'bruid-ivoor-goud',
    schrift: 'Het middelpunt',
    lead: 'Elke taart wordt opnieuw ontworpen rond het feest waar hij voor is. Van ingetogen ivoor met suikerbloemen tot het favoriete thema van je kind.',
    meta: 'Taarten van Velvet Cakes by Anka: bruidstaarten, doop- en communietaarten, verjaardagstaarten en kindertaarten, met de hand gemaakt in Bergen op Zoom. Prijzen per kilo.',
    gelegenheid: 'Iets anders',
    kenmerken: [
      ['Ontwerp op maat', 'Kleur, thema en formaat stemmen we af op je feest. Stuur gerust een inspiratiefoto mee.'],
      ['Met de hand gemaakt', 'Suikerbloemen, ruffles, bladgoud en figuren worden stuk voor stuk met de hand gemaakt.'],
      /* Stond hier tot 18-10-2026 als "vanille met yoghurtmousse en aardbei,
         chocolade of red velvet met framboos": drie smaken die ik uit haar
         foto-onderschriften had opgemaakt. Sinds haar eigen smaakkaart staan
         er voorbeelden uit die lijst, en het getal telt zichzelf. */
      ['Smaak kies je zelf', `${smaakAantal('nl').replace(/^./, c => c.toUpperCase())} smaken, van chocolade en vanille tot pistache en framboos, Tiramisu en Kinder Bueno.`],
    ],
    smaken: true,
    groepen: [
      {
        kop: 'Bruiloft & ceremonie',
        tekst: 'Bruidstaarten, doop- en communietaarten. Ingetogen wit, ruffles, suikerbloemen en gouden accenten, afgestemd op de styling van de dag.',
        prijs: { bedrag: '35,00', eenheid: 'kg', noot: ZONDER_DECO },
        fotos: ['bruid-ivoor-goud', 'bruid-ivoor-anka', 'bruid-ruffle-lisianthus', 'bruid-ruffle-opbouw', 'bruid-vier-lagen-rozen', 'bruid-ivoor-monogram', 'ceremonie-engelenvleugels', 'ceremonie-doop-engelen', 'ceremonie-doop-dominic', 'ceremonie-babyshower-roze'],
      },
      {
        kop: 'Klassiek & elegant',
        tekst: 'Ivoor met bladgoud, een gouden kroon of een drip met macarons. Rustige taarten waar een enkel detail het werk doet.',
        prijs: { bedrag: '29,00', eenheid: 'kg', noot: ZONDER_DECO },
        fotos: ['klassiek-kroon-goud', 'klassiek-ivoor-bloemen', 'klassiek-gouden-hart', 'klassiek-witte-bloemen', 'klassiek-steenlook-goud', 'klassiek-macarons-drip', 'klassiek-koppel-drip', 'klassiek-rode-strik', 'klassiek-kroon-goud-2', 'klassiek-witte-ruffles', 'klassiek-luipaard-strik', 'klassiek-rode-blaadjes', 'klassiek-roze-vlinders', 'klassiek-rozen-jasmijn', 'klassiek-tas-monogram', 'klassiek-zwart-kroon', 'klassiek-dame-rode-hoed', 'klassiek-rood-aardbei', 'klassiek-orchidee-waaier', 'klassiek-rood-vierkant'],
      },
      {
        kop: 'Verjaardag',
        tekst: 'Met naam, leeftijd of een knipoog naar wie er jarig is. Van zwart met goud voor een mijlpaal tot een taart over iemands vak.',
        prijs: { bedrag: '29,00', eenheid: 'kg', noot: ZONDER_DECO },
        fotos: ['feest-leeuw-goud-20', 'feest-smoking', 'feest-nagelstyliste', 'feest-groen-bier', 'feest-hbd-my-king', 'feest-dad-mode', 'feest-voetbal', 'feest-karamel-aardbei', 'feest-bessen-rondom'],
      },
      {
        kop: 'Kinderfeest',
        tekst: 'Het favoriete thema van je kind, van Paw Patrol tot Spiderman en eenhoorns. Vrolijk aan de buitenkant, gewoon lekker van binnen.',
        prijs: { bedrag: '29,00', tweede: { bedrag: '35,00', wat: { nl: 'gestapeld', en: 'tiered', ro: 'pe etaje' } }, eenheid: 'kg', noot: ZONDER_DECO, eerste: { nl: 'een laag', en: 'single tier', ro: 'un singur blat' } },
        fotos: ['kinder-elsa-unicorn', 'kinder-regenboog-vier', 'kinder-katten-paars', 'kinder-spiderman-6', 'kinder-spiderman-rood', 'kinder-pawpatrol-blauw', 'kinder-pawpatrol-geel', 'kinder-babyshark', 'kinder-hulk', 'kinder-dino', 'kinder-teddy-pastel', 'kinder-teddy-boho', 'kinder-minion', 'kinder-vlinders-lila', 'kinder-zwarte-katten', 'kinder-jungle-dieren', 'kinder-hulk-muur', 'kinder-eerste-tandje', 'kinder-raceauto', 'kinder-ruimte-planeten', 'kinder-spiderman-masker', 'kinder-lolly-blauw-roze', 'kinder-aardbei-groen', 'kinder-regenboog-hartjes', 'kinder-make-up', 'kinder-blokjes-groen', 'kinder-hond-regenboog', 'kinder-chocoladefabriek'],
      },
    ],
    en: {
      titel: 'Cakes',
      schrift: 'The centrepiece',
      lead: 'Every cake is designed around the party it is made for. From quiet ivory with sugar flowers to your child’s favourite theme.',
      meta: 'Cakes by Velvet Cakes by Anka: wedding cakes, christening and communion cakes, birthday cakes and children’s cakes, made by hand in Bergen op Zoom. Prices per kilo.',
      kenmerken: [
        ['Designed to order', 'Colour, theme and size are matched to your party. Feel free to send a photo for inspiration.'],
        ['Made by hand', 'Sugar flowers, ruffles, gold leaf and figures are each made by hand.'],
        ['You pick the flavour', `${smaakAantal('en').replace(/^./, c => c.toUpperCase())} flavours, from chocolate and vanilla to pistachio and raspberry, Tiramisu and Kinder Bueno.`],
      ],
      groepen: [
        { kop: 'Wedding & ceremony', tekst: 'Wedding cakes, christening and communion cakes. Quiet white, ruffles, sugar flowers and golden accents, matched to the styling of the day.' },
        { kop: 'Classic & elegant', tekst: 'Ivory with gold leaf, a golden crown, or a drip with macarons. Calm cakes where a single detail does the work.' },
        { kop: 'Birthday', tekst: 'With a name, an age or a nod to whoever is celebrating. From black and gold for a milestone to a cake about someone’s trade.' },
        { kop: 'Children’s party', tekst: 'Your child’s favourite theme, from Paw Patrol to Spider-Man and unicorns. Cheerful on the outside, simply good on the inside.' },
      ],
    },
    ro: {
      titel: 'Torturi',
      schrift: 'Punctul central',
      lead: 'Fiecare tort e desenat din nou în jurul petrecerii pentru care e făcut. De la ivoire discret cu flori de zahăr până la tema preferată a copilului tău.',
      meta: 'Torturi de la Velvet Cakes by Anka: torturi de nuntă, de botez și de cununie, torturi aniversare și torturi pentru copii, lucrate manual în Bergen op Zoom. Prețuri pe kilogram.',
      kenmerken: [
        ['Design la comandă', 'Culoarea, tema și dimensiunea le potrivim cu petrecerea ta. Trimite liniștit o fotografie de inspirație.'],
        ['Lucrat manual', 'Florile de zahăr, volanele, foița de aur și figurinele se fac bucată cu bucată, manual.'],
        ['Aroma o alegi tu', `${smaakAantal('ro').replace(/^./, c => c.toUpperCase())} arome, de la ciocolată și vanilie la fistic cu zmeură, Tiramisu și Kinder Bueno.`],
      ],
      groepen: [
        { kop: 'Nuntă și ceremonie', tekst: 'Torturi de nuntă, de botez și de cununie. Alb discret, volane, flori de zahăr și accente aurii, potrivite cu stilul zilei.' },
        { kop: 'Clasic și elegant', tekst: 'Ivoire cu foiță de aur, o coroană aurie sau un drip cu macarons. Torturi liniștite, în care un singur detaliu face toată treaba.' },
        { kop: 'Zi de naștere', tekst: 'Cu nume, vârstă sau o aluzie la cel sărbătorit. De la negru cu auriu pentru o aniversare rotundă până la un tort despre meseria cuiva.' },
        { kop: 'Petrecere pentru copii', tekst: 'Tema preferată a copilului tău, de la Paw Patrol la Spider-Man și unicorni. Vesel pe dinafară, pur și simplu bun pe dinăuntru.' },
      ],
    },
  },
  {
    slug: 'vruchtengebak',
    titel: 'Vruchtengebak',
    /* Alleen voor de H1. "Vruchtengebak" is een samenstelling van 13 letters en
       breekt dus nergens; in hoofdletters op 360 px was de kop 370 px breed en
       daarmee was de hele pagina opzij te slepen. Het zachte afbreekstreepje
       zet de breuk waar een Nederlandse lezer hem verwacht (vruchten-gebak) in
       plaats van ergens midden in een lettergreep. Niet in p.titel zelf, want
       die reist mee in het WhatsApp-bericht van het formulier. */
    titelKop: 'Vruchten&shy;gebak',
    tegel: 'vrucht-mango',
    hero: 'vrucht-aardbei',
    schrift: 'Fruit als vorm',
    lead: 'Gebakjes die eruitzien als het fruit waar ze naar smaken: een aardbei, een citroen, een mango. Van dichtbij zie je pas dat het gebak is.',
    meta: 'Vruchtengebak van Velvet Cakes by Anka: gebakjes in de vorm van aardbei, citroen of mango, per stuk besteld. Prijzen vanaf 6,50 euro per stuk.',
    gelegenheid: 'Dessert table',
    prijzen: [{ bedrag: { van: '6,50', tot: '10,00' }, eenheid: 'stuk', noot: NAAR_SOORT }],
    kenmerken: [
      ['Per stuk besteld', 'Je geeft het aantal door en we stemmen de soorten af op je tafel.'],
      ['Met de hand gevormd', 'De vorm en de kleur van elk gebakje worden met de hand opgebouwd en afgespoten.'],
      ['Prijs naar soort', 'De ene vorm kost meer werk dan de andere, dus de prijs loopt van 6,50 tot 10,00 euro per stuk.'],
    ],
    groepen: [
      {
        kop: 'In de vorm van het fruit',
        tekst: 'Aardbei, citroen en mango. Welke soorten er op een bepaalde dag te maken zijn, bespreken we vooraf.',
        fotos: ['vrucht-aardbei', 'vrucht-citroen', 'vrucht-mango'],
      },
      {
        kop: 'Uit dezelfde serie',
        tekst: 'Dezelfde gebakjes op de werktafel, naast de ronde gebakjes met cacaopoeder en het gemarmerde werk.',
        fotos: ['vrucht-cacao-rij', 'vrucht-groen-marmer'],
      },
    ],
    en: {
      titel: 'Fruit pastries',
      schrift: 'Fruit as a shape',
      lead: 'Pastries that look like the fruit they taste of: a strawberry, a lemon, a mango. Only up close do you see that it is pastry.',
      meta: 'Fruit pastries by Velvet Cakes by Anka: pastries shaped like a strawberry, a lemon or a mango, ordered by the piece. Prices from 6.50 euro each.',
      kenmerken: [
        ['Ordered by the piece', 'You give the number and we match the types to your table.'],
        ['Shaped by hand', 'The shape and the colour of each pastry are built up and sprayed by hand.'],
        ['Price follows the type', 'One shape takes more work than another, so the price runs from 6.50 to 10.00 euro each.'],
      ],
      groepen: [
        { kop: 'In the shape of the fruit', tekst: 'Strawberry, lemon and mango. Which types can be made on a given day is something we discuss beforehand.' },
        { kop: 'From the same batch', tekst: 'The same pastries on the work table, next to the round ones dusted with cocoa and the marbled work.' },
      ],
    },
    ro: {
      titel: 'Prăjituri cu fructe',
      schrift: 'Fructul ca formă',
      lead: 'Prăjituri care arată ca fructul al cărui gust îl au: o căpșună, o lămâie, un mango. Abia de aproape vezi că e prăjitură.',
      meta: 'Prăjituri cu fructe de la Velvet Cakes by Anka: prăjituri în formă de căpșună, lămâie sau mango, comandate la bucată. Prețuri de la 6,50 euro bucata.',
      kenmerken: [
        ['Comandate la bucată', 'Tu spui numărul, iar noi potrivim sortimentele cu masa ta.'],
        ['Modelate manual', 'Forma și culoarea fiecărei prăjituri se construiesc și se pulverizează manual.'],
        ['Prețul ține de sortiment', 'O formă cere mai multă muncă decât alta, așa că prețul merge de la 6,50 la 10,00 euro bucata.'],
      ],
      groepen: [
        { kop: 'În forma fructului', tekst: 'Căpșună, lămâie și mango. Ce sortimente se pot face într-o anumită zi discutăm dinainte.' },
        { kop: 'Din aceeași serie', tekst: 'Aceleași prăjituri pe masa de lucru, lângă cele rotunde pudrate cu cacao și lucrul marmorat.' },
      ],
    },
  },
  {
    slug: 'desserts',
    titel: 'Desserts',
    tegel: 'patisserie-verrines',
    hero: 'patisserie-verrines',
    schrift: 'Laag voor laag',
    lead: 'Verrines in een glaasje, entremets met spiegelglazuur en een complete dessert table. Zoet als afsluiter of als het feest zelf.',
    meta: 'Desserts van Velvet Cakes by Anka: verrines, entremets met spiegelglazuur, plateaus met gebak en complete dessert tables. Prijzen vanaf 5,50 euro per stuk.',
    gelegenheid: 'Dessert table',
    prijzen: [
      { bedrag: { van: '5,50', tot: '7,50' }, eenheid: 'stuk', noot: NAAR_SOORT },
      { wat: { nl: 'Plateau met gebak', en: 'Platter of pastries', ro: 'Platou cu prăjituri' }, bedrag: { van: '30,00', tot: '38,00' }, eenheid: 'kg', noot: NAAR_SOORT },
      { wat: { nl: 'Sweet table of candy bar', en: 'Sweet table or candy bar', ro: 'Sweet table sau candy bar' }, opAanvraag: true },
    ],
    kenmerken: [
      ['Per portie', 'Verrines staan in hun eigen glaasje, dus je hoeft niets te scheppen of te snijden.'],
      ['Een tafel in een palet', 'Bij een dessert table kiezen we een kleurenlijn en houden we alles daarbinnen.'],
      ['Combineer vrij', 'Verrines, choux, cupcakes en vruchtengebak door elkaar, of juist alles hetzelfde.'],
    ],
    groepen: [
      {
        kop: 'Van glaasje tot hele tafel',
        tekst: 'Aardbei, chocolade en praline in een glaasje, citroen met spiegelglazuur, en de tafel waar alles bij elkaar komt.',
        fotos: ['patisserie-verrines', 'patisserie-citroen', 'patisserie-buffet'],
      },
      {
        kop: 'Gebakjes per stuk',
        tekst: 'Entremets met spiegelglazuur, taartjes met vers fruit en werk met bladgoud. Los te bestellen of samen op een plateau.',
        fotos: ['dessert-karamel-bol', 'dessert-bordeaux-goud', 'dessert-framboos-roze', 'dessert-abrikoos-schijf', 'dessert-wit-rood', 'dessert-chocolade-perzik', 'dessert-chocolade-doos', 'dessert-fruittaartje', 'dessert-chocolade-roosjes', 'dessert-noten-taartjes'],
      },
    ],
    en: {
      titel: 'Desserts',
      schrift: 'Layer by layer',
      lead: 'Verrines in a glass, entremets with mirror glaze and a complete dessert table. Sweet as a finish, or as the party itself.',
      meta: 'Desserts by Velvet Cakes by Anka: verrines, entremets with mirror glaze, platters of pastries and complete dessert tables. Prices from 5.50 euro each.',
      kenmerken: [
        ['By the portion', 'Verrines come in their own glass, so there is nothing to spoon out or cut.'],
        ['A table in one palette', 'For a dessert table we choose a colour line and keep everything inside it.'],
        ['Mix freely', 'Verrines, choux, cupcakes and fruit pastries mixed together, or all of it the same.'],
      ],
      groepen: [
        { kop: 'From a glass to a whole table', tekst: 'Strawberry, chocolate and praline in a glass, lemon with mirror glaze, and the table where it all comes together.' },
        { kop: 'Pastries by the piece', tekst: 'Entremets with mirror glaze, tartlets with fresh fruit and work with gold leaf. Ordered on their own or together on a platter.' },
      ],
    },
    ro: {
      titel: 'Deserturi',
      schrift: 'Strat cu strat',
      lead: 'Verrine în pahar, entremets cu glazură oglindă și o dessert table completă. Dulce la final sau chiar ca petrecere în sine.',
      meta: 'Deserturi de la Velvet Cakes by Anka: verrine, entremets cu glazură oglindă, platouri cu prăjituri și dessert tables complete. Prețuri de la 5,50 euro bucata.',
      kenmerken: [
        ['La porție', 'Verrinele stau în paharul lor, deci nu trebuie să pui sau să tai nimic.'],
        ['O masă într-o paletă', 'La o dessert table alegem o linie de culoare și ținem totul în ea.'],
        ['Combini liber', 'Verrine, choux, cupcakes și prăjituri cu fructe amestecate, sau totul la fel.'],
      ],
      groepen: [
        { kop: 'De la pahar până la masa întreagă', tekst: 'Căpșuni, ciocolată și praline în pahar, lămâie cu glazură oglindă, și masa pe care se adună totul.' },
        { kop: 'Prăjituri la bucată', tekst: 'Entremets cu glazură oglindă, tarte cu fructe proaspete și lucru cu foiță de aur. De comandat separat sau împreună pe un platou.' },
      ],
    },
  },
  {
    slug: 'macarons',
    titel: 'Macarons',
    tegel: 'macaron-dozen-kleur',
    hero: 'macaron-dozen-kleur',
    schrift: 'Klein en precies',
    lead: 'Twee schelpjes van amandelmeel met een vulling ertussen. Ze worden per stuk besteld en per doos geleverd, in de kleuren die je kiest.',
    meta: 'Macarons van Velvet Cakes by Anka: amandelschelpjes met vulling, per stuk besteld en per doos geleverd. 1,50 euro per stuk.',
    gelegenheid: 'Dessert table',
    prijzen: [{ bedrag: '1,50', eenheid: 'stuk' }],
    kenmerken: [
      ['Per stuk besteld', 'Je geeft het aantal door en de kleuren stemmen we af op je feest.'],
      ['In jouw kleuren', 'De schelpjes worden gekleurd, dus ze passen bij de rest van je tafel.'],
      ['Ook als cadeau', 'In een doos zijn ze goed mee te geven of weg te geven.'],
    ],
    groepen: [
      {
        kop: 'Zo gaan ze de deur uit',
        tekst: 'Per kleur gesorteerd in de doos, of in pasteltinten naast elkaar. Welke smaken er zijn, bespreken we vooraf.',
        fotos: ['macaron-dozen-kleur', 'macaron-tafel-pastel'],
      },
    ],
    en: {
      titel: 'Macarons',
      schrift: 'Small and precise',
      lead: 'Two almond shells with a filling in between. They are ordered by the piece and delivered by the box, in the colours you choose.',
      meta: 'Macarons by Velvet Cakes by Anka: almond shells with a filling, ordered by the piece and delivered by the box. 1.50 euro each.',
      kenmerken: [
        ['Ordered by the piece', 'You give the number and we match the colours to your party.'],
        ['In your colours', 'The shells are coloured, so they sit well with the rest of your table.'],
        ['Also as a gift', 'In a box they are easy to hand over or give away.'],
      ],
      groepen: [
        { kop: 'How they go out the door', tekst: 'Sorted by colour in the box, or in pastel shades side by side. Which flavours are available is something we discuss beforehand.' },
      ],
    },
    ro: {
      titel: 'Macarons',
      schrift: 'Mici și precise',
      lead: 'Două scoici din făină de migdale cu o umplutură între ele. Se comandă la bucată și se livrează la cutie, în culorile pe care le alegi.',
      meta: 'Macarons de la Velvet Cakes by Anka: scoici din migdale cu umplutură, comandate la bucată și livrate la cutie. 1,50 euro bucata.',
      kenmerken: [
        ['Comandate la bucată', 'Tu spui numărul, iar culorile le potrivim cu petrecerea ta.'],
        ['În culorile tale', 'Scoicile se colorează, așa că merg bine cu restul mesei tale.'],
        ['Și ca un cadou', 'Într-o cutie sunt ușor de dat mai departe sau de dăruit.'],
      ],
      groepen: [
        { kop: 'Așa pleacă pe ușă', tekst: 'Sortate pe culori în cutie, sau în nuanțe pastel una lângă alta. Ce arome sunt discutăm dinainte.' },
      ],
    },
  },
  {
    /* Choux en cupcakes stonden tot 18-10-2026 als twee items in het
       assortiment. Anka vroeg of ze samen onder een item konden, en dat is
       ook haar eigen indeling: in de prijslijst die ze stuurde staan ze onder
       een kopje, met per soort een eigen bedrag. Vandaar twee groepen die elk
       hun eigen prijs dragen, en niet een pagina met een bedrag erboven -
       2,50 en 4,00 tot een gemiddelde platslaan zou van haar indeling onze
       indeling maken. choux.html en cupcakes.html blijven als omleiding
       bestaan, want allebei die adressen zijn rondgestuurd. */
    slug: 'choux-cupcakes',
    titel: 'Choux & cupcakes',
    tegel: 'patisserie-redvelvet-cupcakes',
    hero: 'patisserie-framboos-choux',
    schrift: 'Klein werk, per stuk',
    lead: 'Twee soorten klein gebak die het samen goed doen op een tafel: soezen met een verse vulling en cupcakes met een toef. Allebei per stuk te bestellen.',
    meta: 'Choux en cupcakes van Velvet Cakes by Anka: vers gevuld soezendeeg en cupcakes met botercreme, per stuk besteld. Choux 2,50 euro, cupcakes 4,00 euro per stuk.',
    gelegenheid: 'Dessert table',
    kenmerken: [
      ['Per stuk besteld', 'Je geeft per soort het aantal door. Het hoeft van allebei niet evenveel te zijn.'],
      ['In jouw kleuren', 'De toef en de afwerking gaan mee met het kleurenpalet van je feest.'],
      ['Per doos geleverd', 'Ze komen in een doos aan, klaar om neer te zetten. De choux worden vlak voor de bezorging gevuld, zodat het deeg krokant blijft.'],
    ],
    groepen: [
      {
        kop: 'Choux',
        tekst: 'Soezendeeg met een krokant laagje, vers gevuld met cremeux en afgemaakt met fruit. Framboos en citroen maakt Anka het vaakst; een andere smaak of kleur bespreken we vooraf.',
        prijs: { bedrag: '2,50', eenheid: 'stuk' },
        fotos: ['patisserie-framboos-choux', 'patisserie-citroen-choux'],
      },
      {
        kop: 'Cupcakes',
        tekst: 'Een zachte cake met een toef botercreme. Red velvet met framboos, mango en praline, en de toef kan mee met het thema van een kinderfeest.',
        prijs: { bedrag: '4,00', eenheid: 'stuk', noot: { nl: 'decoratie wordt apart berekend', en: 'decoration is charged separately', ro: 'decorul se calculează separat' } },
        fotos: ['patisserie-redvelvet-cupcakes', 'patisserie-mango-cupcakes', 'patisserie-ferrero-cupcakes', 'cup-redvelvet-doos', 'cup-framboos-doos', 'cup-mango-doos', 'cup-blauw-roze'],
      },
    ],
    en: {
      titel: 'Choux & cupcakes',
      schrift: 'Small work, by the piece',
      lead: 'Two kinds of small pastry that work well together on one table: choux with a fresh filling and cupcakes with a swirl. Both ordered by the piece.',
      meta: 'Choux and cupcakes by Velvet Cakes by Anka: choux pastry filled fresh and cupcakes with buttercream, ordered by the piece. Choux 2.50 euro, cupcakes 4.00 euro each.',
      kenmerken: [
        ['Ordered by the piece', 'You give the number for each kind. It does not have to be the same number for both.'],
        ['In your colours', 'The swirl and the finish follow the colour palette of your party.'],
        ['Delivered by the box', 'They arrive in a box, ready to put down. The choux are filled just before delivery, so the pastry stays crisp.'],
      ],
      groepen: [
        { kop: 'Choux', tekst: 'Choux pastry with a crisp layer, filled fresh with cremeux and finished with fruit. Raspberry and lemon are the ones Anka makes most often; another flavour or colour we discuss beforehand.' },
        { kop: 'Cupcakes', tekst: 'A soft cake with a swirl of buttercream. Red velvet with raspberry, mango and praline, and the swirl can follow the theme of a children’s party.' },
      ],
    },
    ro: {
      titel: 'Choux & cupcakes',
      schrift: 'Lucru mic, la bucată',
      lead: 'Două feluri de patiserie mică ce merg bine împreună pe o masă: choux cu umplutură proaspătă și cupcakes cu vârf de cremă. Amândouă se comandă la bucată.',
      meta: 'Choux și cupcakes de la Velvet Cakes by Anka: aluat choux umplut proaspăt și cupcakes cu cremă de unt, comandate la bucată. Choux 2,50 euro, cupcakes 4,00 euro bucata.',
      kenmerken: [
        ['Comandate la bucată', 'Spui numărul pentru fiecare fel. Nu trebuie să fie același număr la amândouă.'],
        ['În culorile tale', 'Vârful și finisajul merg după paleta de culori a petrecerii tale.'],
        ['Livrate în cutie', 'Vin într-o cutie, gata de așezat. Choux-urile se umplu chiar înainte de livrare, ca să rămână aluatul crocant.'],
      ],
      groepen: [
        { kop: 'Choux', tekst: 'Aluat choux cu o crustă crocantă, umplut proaspăt cu cremeux și finisat cu fructe. Zmeura și lămâia sunt aromele pe care Anka le face cel mai des; o altă aromă sau culoare o discutăm dinainte.' },
        { kop: 'Cupcakes', tekst: 'Un blat pufos cu un vârf de cremă de unt. Red velvet cu zmeură, mango și praline, iar vârful poate merge după tema unei petreceri pentru copii.' },
      ],
    },
  },
  {
    slug: 'cozonac',
    titel: 'Cozonac',
    tegel: 'cozonac-amandel',
    hero: 'cozonac-amandel',
    schrift: 'Uit Roemenie',
    lead: 'Een gevlochten zoet brood dat in Roemenie bij de feestdagen hoort. Anka maakt hem in drie vullingen en bakt hem per stuk.',
    meta: 'Cozonac van Velvet Cakes by Anka: het Roemeense feestbrood met walnoot, met Nutella of met pistache, per stuk gebakken in Bergen op Zoom.',
    gelegenheid: 'Iets anders',
    prijzen: [
      { wat: { nl: 'Klassiek, met walnoot', en: 'Classic, with walnut', ro: 'Clasic, cu nucă' }, bedrag: '28,00', eenheid: 'stuk' },
      { wat: { nl: 'Gevuld met Nutella', en: 'Filled with Nutella', ro: 'Umplut cu Nutella' }, bedrag: '30,00', eenheid: 'stuk' },
      { wat: { nl: 'Gevuld met pistache', en: 'Filled with pistachio', ro: 'Umplut cu fistic' }, bedrag: '37,00', eenheid: 'stuk' },
    ],
    kenmerken: [
      ['Drie vullingen', 'Klassiek met walnoot, gevuld met Nutella, of gevuld met pistache.'],
      ['Per stuk gebakken', 'Je bestelt per brood. Zeg erbij wanneer je hem nodig hebt, dan bakt Anka er naartoe.'],
      ['Om mee te geven', 'Hij wordt ingepakt geleverd, dus je kunt hem zo meenemen of weggeven.'],
    ],
    groepen: [
      {
        kop: 'Zoals Anka hem maakt',
        tekst: 'Gevlochten en afgebakken met amandelen, de drie vullingen naast elkaar, en ingepakt klaar om mee te geven.',
        fotos: ['cozonac-amandel', 'cozonac-drie-soorten', 'cozonac-verpakt'],
      },
    ],
    en: {
      titel: 'Cozonac',
      schrift: 'From Romania',
      lead: 'A braided sweet bread that belongs to the holidays in Romania. Anka makes it with three fillings and bakes it by the loaf.',
      meta: 'Cozonac by Velvet Cakes by Anka: the Romanian holiday bread with walnut, with Nutella or with pistachio, baked by the loaf in Bergen op Zoom.',
      kenmerken: [
        ['Three fillings', 'Classic with walnut, filled with Nutella, or filled with pistachio.'],
        ['Baked by the loaf', 'You order per loaf. Say when you need it and Anka bakes towards that date.'],
        ['Easy to pass on', 'It is delivered wrapped, so you can take it along or give it away as it is.'],
      ],
      groepen: [
        { kop: 'The way Anka makes it', tekst: 'Braided and baked with almonds, the three fillings side by side, and wrapped ready to pass on.' },
      ],
    },
    ro: {
      titel: 'Cozonac',
      schrift: 'Din România',
      lead: 'O pâine dulce împletită care ține de sărbători în România. Anka îl face cu trei umpluturi și îl coace la bucată.',
      meta: 'Cozonac de la Velvet Cakes by Anka: cozonacul românesc cu nucă, cu Nutella sau cu fistic, copt la bucată în Bergen op Zoom.',
      kenmerken: [
        ['Trei umpluturi', 'Clasic cu nucă, umplut cu Nutella, sau umplut cu fistic.'],
        ['Copt la bucată', 'Comanzi pe cozonac. Spune când ai nevoie de el și Anka coace către acea dată.'],
        ['Ușor de dat mai departe', 'Se livrează ambalat, deci îl poți lua cu tine sau dărui așa cum e.'],
      ],
      groepen: [
        { kop: 'Așa îl face Anka', tekst: 'Împletit și copt cu migdale, cele trei umpluturi una lângă alta, și ambalat gata de dat mai departe.' },
      ],
    },
  },
];

/* ---------- vaste tekst, in drie talen ----------
   Het Nederlands staat in de html (dat is de bron, zie i18n.js); hieronder
   staan de twee vertalingen ervan. */
const EN_ALGEMEEN = {
  'meta.title': 'Velvet Cakes by Anka | Luxury cakes & patisserie',
  'meta.desc': 'Velvet Cakes by Anka: luxury cakes, fine patisserie and desserts, made with love and an eye for detail for every special occasion.',

  'nav.home': 'Home',
  'nav.over': 'About me',
  'nav.assortiment': 'What I make',
  'nav.portfolio': 'Portfolio',
  'nav.prijzen': 'Prices',
  'nav.smaken': 'Flavours',
  'nav.contact': 'Contact',
  'nav.voorwaarden': 'Terms and conditions',
  'cta.offerte': 'Request a quote',
  'cta.alle': 'Everything I make',

  'cta.meer': 'See more',
  'cta.prijzen': 'View all prices',
  'cta.smaken': 'View all flavours',
  'kruimel.home': 'Home',
  'kruimel.assortiment': 'What I make',
  'bovenregel.assortiment': 'What I make',
  'bovenregel.bestellen': 'Ordering',
  'bovenregel.verder': 'The rest of what I make',
  'voet.plaats': 'Bergen op Zoom',
  'voet.land': ', the Netherlands',
  'voet.volg': 'Follow me',
  'lb.sluiten': 'Close',
  'lb.vorige': 'Previous photo',
  'lb.volgende': 'Next photo',

  'merk.titel': 'Sweet<br>Moments',
  'merk.schrift': 'Beautifully Made',
  'merk.foto': 'Baked<br>with love',
  'merk.tagline': 'Where sweetness meets elegance',
  'merk.over': 'More<br>than cakes<br>it’s love<br>in every<br>detail',

  'hero.bovenregel': 'Luxury cakes & patisserie',
  'hero.lead': 'Luxury cakes, fine patisserie and desserts, made with love and an eye for detail, for every special occasion.',
  'hero.cta': 'See what I make',
  'hero.alt': 'Anka setting the flowers on a wedding cake',

  'waarde.maat': 'Made to order',
  'waarde.gelegenheid': 'For every occasion',
  'waarde.puur': 'Pure ingredients',
  'waarde.design': 'Luxury, one of a kind',

  'over.titel': 'About me',
  'over.tekst': 'Hello, I am Anka. With a lot of passion I bake cakes and patisserie that turn any moment into something special. Quality, flavour and a beautiful design come first with me. Everything is made with care and love, especially for you.',
  'over.cta': 'Take a look inside the studio',
  'over.alt': 'Anka at her work surface',

  'atelier.bovenregel': 'The studio',
  'atelier.titel': 'How a cake comes about',
  'atelier.tekst': 'Photos from the October shoot, around an ivory wedding cake with gold leaf: sifting sugar, setting out pearls, applying gold leaf and finishing the cake.',
  'atelier.alt1': 'The wedding cake on the kitchen island, with flowers and candles beside it',
  'atelier.alt2': 'Sifting above a glass bowl',
  'atelier.alt3': 'Anka takes something from a storage jar',
  'atelier.alt4': 'Storage jars with sugar pearls',
  'atelier.alt5': 'Anka finishes the cake',
  'atelier.alt6': 'The finished cake is photographed',

  'oproep.schrift': 'Let us create something sweet and unforgettable together',

  'aanvraag.titel': 'Tell me about your party',
  'aanvraag.lead': 'The date, the number of people, the occasion and the flavour you have in mind. You get a proposal back with a design and a price.',
  'form.naam': 'Name',
  'form.naam.ph': 'Your name',
  'form.mail': 'Email',
  'form.mail.ph': 'you@example.com',
  'form.tel': 'Phone number',
  'form.tel.ph': 'So Anka can call you',
  'form.datum': 'Date of the party',
  'form.personen': 'Number of people',
  'form.personen.ph': 'For example 25',
  'form.soort': 'Occasion',
  'form.o1': 'Wedding',
  'form.o2': 'Christening or communion',
  'form.o3': 'Birthday',
  'form.o4': 'Children’s party',
  'form.o5': 'Dessert table',
  'form.o6': 'Something else',
  'form.smaak': 'Flavour and your idea',
  'form.smaak.ph': 'Flavour, colours, theme',
  'form.foto': 'Photo for inspiration',
  'form.verstuur': 'Send the request',
  'form.noot': 'Anka reads your request and comes back to you with a design and a price. You get a copy by email.',
  'form.dank': 'Your request is in. You get a copy by email, and Anka comes back to you with a design and a price.',
  'form.mis': 'Sending did not work. Send a WhatsApp to 06 83 67 40 69 and your request is with her anyway.',
  'form.bezig': 'Sending',

  /* Stond hier tot de verhuizing als wa.* : de labels van het WhatsApp-bericht
     dat site.js uit het formulier bouwde. Het formulier verstuurt nu zelf en
     die labels staan in worker/confirmation.ts, in de mail waar ze thuishoren. */

  'strook.alt1': 'Cake with macarons',
  'strook.alt2': 'Choux with lemon',
  'strook.alt3': 'Pink baby shower cake',
  'strook.alt4': 'Cupcakes with mango',
  'strook.alt5': 'White cake with flowers',

  'prijzen.titel': 'Prices',
  'prijzen.schrift': 'What it costs',
  'prijzen.lead': 'Cakes are charged per kilo, patisserie per piece. Decoration is quoted separately, because that is the part that differs most from one party to the next.',
  'prijzen.desc': 'Prices of Velvet Cakes by Anka: cakes per kilo, patisserie per piece, cozonac per item and platters per kilo. Bergen op Zoom.',
  'prijzen.noot': 'For a sweet table or candy bar, and for anything that is not listed here, ask Anka for a quote.',
  'prijzen.kop': 'Price list',

  'smaken.titel': 'Flavours',
  'smaken.schrift': 'You pick the flavour',
  'smaken.lead': `These are the flavours for her cakes. Tell her which one you would like when you send your request.`,
  'smaken.desc': `Cake flavours from Velvet Cakes by Anka: ${AANTAL_SMAKEN} flavours, from chocolate and vanilla to pistachio and raspberry, Tiramisu and Kinder Bueno. Bergen op Zoom.`,
  'smaken.kop': 'Flavour list',
};

const RO_ALGEMEEN = {
  'meta.title': 'Velvet Cakes by Anka | Torturi de lux și patiserie',
  'meta.desc': 'Velvet Cakes by Anka: torturi de lux, patiserie fină și deserturi, lucrate cu drag și atenție la detaliu pentru fiecare ocazie specială.',

  'nav.home': 'Acasă',
  'nav.over': 'Despre mine',
  'nav.assortiment': 'Produse',
  'nav.portfolio': 'Portofoliu',
  'nav.prijzen': 'Prețuri',
  'nav.smaken': 'Arome',
  'nav.contact': 'Contact',
  'nav.voorwaarden': 'Termeni și condiții',
  'cta.offerte': 'Cere o ofertă',
  'cta.alle': 'Toate produsele',
  'cta.meer': 'Vezi mai mult',
  'cta.prijzen': 'Vezi toate prețurile',
  'cta.smaken': 'Vezi toate aromele',
  'kruimel.home': 'Acasă',
  'kruimel.assortiment': 'Produse',
  'bovenregel.assortiment': 'Produse',
  'bovenregel.bestellen': 'Comenzi',
  'bovenregel.verder': 'Restul produselor',
  'voet.plaats': 'Bergen op Zoom',
  'voet.land': ', Olanda',
  'voet.volg': 'Urmărește-mă',
  'lb.sluiten': 'Închide',
  'lb.vorige': 'Fotografia anterioară',
  'lb.volgende': 'Fotografia următoare',

  /* ---------- haar merkregels ----------
     Deze stonden tot 10-10-2026 in elke taal in het Engels, omdat ze zo in het
     voorbeeld staan dat ze zelf aanleverde. Dat hield niet: op de Roemeense
     pagina is de hele opener (kop, schrijfregel, de regel op de foto en de
     streepregel eronder) dan Engels, en dat is het blok waar een bezoeker
     begint. Vertaald, met een grens: het woordmerk zelf blijft
     "Velvet Cakes by Anka", want dat is het logobestand en geen zin. */
  'merk.titel': 'Momente<br>Dulci',
  'merk.schrift': 'Create cu măiestrie',
  'merk.foto': 'Coapte<br>cu drag',
  'merk.tagline': 'Unde dulceața întâlnește eleganța',
  'merk.over': 'Mai mult<br>decât torturi,<br>e dragoste<br>în fiecare<br>detaliu',

  'hero.bovenregel': 'Torturi de lux și patiserie',
  'hero.lead': 'Torturi de lux, patiserie fină și deserturi, lucrate cu drag și atenție la detaliu, pentru fiecare ocazie specială.',
  'hero.cta': 'Descoperă produsele',
  'hero.alt': 'Anka așază florile pe un tort de nuntă',

  'waarde.maat': 'Lucrat la comandă',
  'waarde.gelegenheid': 'Pentru orice ocazie',
  'waarde.puur': 'Ingrediente pure',
  'waarde.design': 'Design luxos și unic',

  'over.titel': 'Despre mine',
  'over.tekst': 'Bună, eu sunt Anka. Fac cu multă pasiune torturi și patiserie care transformă orice moment în ceva deosebit. Calitatea, gustul și un design frumos sunt pe primul loc la mine. Totul e lucrat cu grijă și drag, special pentru tine.',
  'over.cta': 'Aruncă o privire în atelier',
  'over.alt': 'Anka la blatul ei de lucru',

  'atelier.bovenregel': 'Atelierul',
  'atelier.titel': 'Așa ia naștere un tort',
  'atelier.tekst': 'Fotografii din ședința foto din octombrie, în jurul unui tort de nuntă ivoire cu foiță de aur: cernut zahărul, pregătit perlele, aplicat foița de aur și finisat tortul.',
  'atelier.alt1': 'Tortul de nuntă pe insula din bucătărie, cu flori și lumânări alături',
  'atelier.alt2': 'Cernut deasupra unui bol de sticlă',
  'atelier.alt3': 'Anka ia ceva dintr-un borcan',
  'atelier.alt4': 'Borcane cu perle de zahăr',
  'atelier.alt5': 'Anka finisează tortul',
  'atelier.alt6': 'Tortul terminat este fotografiat',

  'oproep.schrift': 'Hai să creăm împreună ceva dulce și de neuitat',

  'aanvraag.titel': 'Spune-mi despre petrecerea ta',
  'aanvraag.lead': 'Data, numărul de persoane, ocazia și aroma dorită. Primești înapoi o propunere cu design și preț.',
  'form.naam': 'Nume',
  'form.naam.ph': 'Numele tău',
  'form.mail': 'E-mail',
  'form.mail.ph': 'tu@exemplu.com',
  'form.tel': 'Număr de telefon',
  'form.tel.ph': 'Ca să te poată suna Anka',
  'form.datum': 'Data petrecerii',
  'form.personen': 'Număr de persoane',
  'form.personen.ph': 'De exemplu 25',
  'form.soort': 'Ocazia',
  'form.o1': 'Nuntă',
  'form.o2': 'Botez sau prima împărtășanie',
  'form.o3': 'Zi de naștere',
  'form.o4': 'Petrecere pentru copii',
  'form.o5': 'Dessert table',
  'form.o6': 'Altceva',
  'form.smaak': 'Aroma și ideea ta',
  'form.smaak.ph': 'Aromă, culori, temă',
  'form.foto': 'Fotografie de inspirație',
  'form.verstuur': 'Trimite cererea',
  'form.noot': 'Anka îți citește cererea și revine cu un design și un preț. Primești o copie pe e-mail.',
  'form.dank': 'Cererea ta a ajuns. Primești o copie pe e-mail, iar Anka revine cu un design și un preț.',
  'form.mis': 'Trimiterea nu a reușit. Trimite un WhatsApp la 06 83 67 40 69 și cererea ajunge oricum la ea.',
  'form.bezig': 'Se trimite',

  /* Zie de noot in de Engelse tabel: de wa.*-sleutels zijn met het
     WhatsApp-bericht uit site.js verdwenen. */

  'strook.alt1': 'Tort cu macarons',
  'strook.alt2': 'Choux cu lămâie',
  'strook.alt3': 'Tort de baby shower în roz',
  'strook.alt4': 'Cupcakes cu mango',
  'strook.alt5': 'Tort alb cu flori',

  'prijzen.titel': 'Prețuri',
  'prijzen.schrift': 'Cât costă',
  'prijzen.lead': 'Torturile se calculează pe kilogram, patiseria la bucată. Decorul se cotează separat, pentru că el diferă cel mai mult de la o petrecere la alta.',
  'prijzen.desc': 'Prețurile de la Velvet Cakes by Anka: torturi pe kilogram, patiserie la bucată, cozonac la bucată și platouri pe kilogram. Bergen op Zoom.',
  'prijzen.noot': 'Pentru un sweet table sau candy bar, și pentru orice nu e trecut aici, cere-i Ankăi o ofertă.',
  'prijzen.kop': 'Listă de prețuri',

  'smaken.titel': 'Arome',
  'smaken.schrift': 'Aroma o alegi tu',
  'smaken.lead': 'Acestea sunt aromele pentru torturile ei. Spune-i care îți place atunci când trimiți cererea.',
  'smaken.desc': `Arome de tort de la Velvet Cakes by Anka: ${AANTAL_SMAKEN} de arome, de la ciocolată și vanilie la fistic cu zmeură, Tiramisu și Kinder Bueno. Bergen op Zoom.`,
  'smaken.kop': 'Lista de arome',
};

const ALGEMEEN = { en: EN_ALGEMEEN, ro: RO_ALGEMEEN };

/* ---------- tekst de html in ----------
   De tekst hierboven staat als gewone tekst, niet als html. Dat moet ook: hij
   gaat twee kanten op. In de Nederlandse pagina wordt hij html en dan hoort
   "Choux & cupcakes" als "Choux &amp; cupcakes" op de pagina te staan. In
   tekst-en.js en tekst-ro.js gaat hij naar een data-i18n, en die zet i18n.js
   met textContent: daar is een entiteit geen teken maar letterlijk de zes
   letters "&amp;". Zo stond er op de Engelse taartenpagina sinds vanmorgen
   "Wedding &amp; ceremony". Dus: de bron blijft gewone tekst en wordt hier
   ontsmet, in plaats van andersom. */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* De titel en de omschrijving van de startpagina. Stonden tot de verhuizing met
   de hand in index.html, waar bouw.mjs ze niet kon zien; nu staan ze hier en
   vallen ze onder dezelfde poorten als de rest. */
const META_TITEL_NL = 'Velvet Cakes by Anka | Luxe taarten en patisserie uit Bergen op Zoom';
const META_DESC_NL = 'Velvet Cakes by Anka maakt luxe taarten, verfijnde patisserie en desserts in Bergen op Zoom. Bruidstaarten, verjaardagstaarten en kindertaarten, met de hand gemaakt. Prijzen per kilo.';

/* Een sleutel in de taal van de pagina. Het Nederlands heeft geen tabel: dat
   staat als tekst in de templates en in bron/index.html, en dat is de bron.
   Een tweede NL-tabel zou een tweede waarheid zijn die stil kan gaan afwijken.
   De tabellen zelf worden verderop gebouwd (EN/RO); deze functie wordt pas bij
   het schrijven aangeroepen, dus dan bestaan ze. */
const tekst = (taal, sleutel, nl) => (taal === 'nl' ? nl : (TABEL[taal][sleutel] ?? nl));

/* ---------- onderdelen die op elke pagina hetzelfde zijn ---------- */

const IG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2m0-2.2C8.7 0 8.3 0 7 .07 5.7.13 4.8.33 4.1.6c-.8.3-1.4.7-2.1 1.4C1.3 2.7.9 3.3.6 4.1.3 4.8.1 5.7.07 7 0 8.3 0 8.7 0 12s0 3.7.07 5c.03 1.3.23 2.2.53 2.9.3.8.7 1.4 1.4 2.1.7.7 1.3 1.1 2.1 1.4.7.3 1.6.5 2.9.53C8.3 24 8.7 24 12 24s3.7 0 5-.07c1.3-.03 2.2-.23 2.9-.53.8-.3 1.4-.7 2.1-1.4.7-.7 1.1-1.3 1.4-2.1.3-.7.5-1.6.53-2.9.07-1.3.07-1.7.07-5s0-3.7-.07-5c-.03-1.3-.23-2.2-.53-2.9-.3-.8-.7-1.4-1.4-2.1-.7-.7-1.3-1.1-2.1-1.4-.7-.3-1.6-.5-2.9-.53C15.7 0 15.3 0 12 0m0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4m0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8m7.9-10.4a1.44 1.44 0 1 1-2.9 0 1.44 1.44 0 0 1 2.9 0"/></svg>';
const FB = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07"/></svg>';
const WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.14-.14.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35M12.05 21.8h-.02c-1.74 0-3.45-.47-4.95-1.35l-.35-.21-3.68.96.98-3.58-.23-.37a9.8 9.8 0 0 1-1.5-5.23c0-5.42 4.42-9.83 9.86-9.83 2.63 0 5.1 1.03 6.96 2.89a9.76 9.76 0 0 1 2.88 6.95c0 5.42-4.42 9.83-9.85 9.83M20.5 3.45A11.77 11.77 0 0 0 12.05 0C5.5 0 .2 5.3.2 11.82c0 2.08.55 4.12 1.59 5.91L.1 24l6.42-1.68a11.9 11.9 0 0 0 5.53 1.4h.01c6.53 0 11.85-5.3 11.85-11.82 0-3.16-1.24-6.13-3.47-8.36"/></svg>';
const HART = '<svg class="hartje" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 39S8 30 8 19.5C8 14 12 10 17 10c3 0 5.6 1.6 7 4 1.4-2.4 4-4 7-4 5 0 9 4 9 9.5C40 30 24 39 24 39z"/></svg>';

/* De taalkiezer was tot de verhuizing drie knoppen die i18n.js de tekst van de
   pagina lieten omwisselen. Dat kon maar een adres hebben, dus er was niets om
   naartoe te linken en niets om te indexeren.

   Hij is nu drie echte links naar dezelfde pagina in de andere taal. Dat is
   meer dan nette techniek: een bezoeker kan de Roemeense versie nu doorsturen
   en de ontvanger komt in het Roemeens binnen, en Google kan de drie versies
   als een set lezen (zie de hreflang in hoofd()).

   De keuze wordt niet onthouden en er is geen omleiding op de browsertaal.
   Zo'n omleiding stuurt een Nederlandse bezoeker met een Engelse telefoon van
   de pagina af die hij net aanklikte, en voor Google is het een adres dat per
   bezoek iets anders uitlevert. De drie links staan er bij elke pagina, dus
   wie de andere taal wil is een tik ver.

   De pagina waar je staat is een <span> en geen link: aria-current zegt het al
   en een link naar jezelf is een knop die niets doet.

   Het ingevulde blok wordt per taal in de body gezet (zie zetTaalkiezer). */
const taalkiezer = () => '<!--vc:talen-->';

const TAALNAAM = { nl: 'Nederlands', en: 'English', ro: 'Română' };

const zetTaalkiezer = (html, taal, slug) => {
  const items = TALEN.map(t => (t === taal
    ? `      <span class="lang-btn is-nu" lang="${t}" aria-current="true">${t.toUpperCase()}</span>`
    : `      <a class="lang-btn" href="${adresVan(t, slug)}" lang="${t}" hreflang="${t}" title="${TAALNAAM[t]}">${t.toUpperCase()}</a>`));
  return html.split('<!--vc:talen-->').join(`
    <div class="taalkiezer" role="group" aria-label="Taal / Language / Limba">
${items.join('\n      <span aria-hidden="true"></span>\n')}
    </div>`);
};

/* is-blad = "dit item blijft aan staan, waar je op deze pagina ook scrollt"
   (zie site.js). Welk item dat is hangt van de pagina af: op een soortpagina
   is dat Assortiment, op de prijslijst Prijzen en op de smaakkaart Smaken.
   Stond tot 18-10-2026 hard op Assortiment, waardoor de prijspagina zichzelf
   als onderdeel van het assortiment aanwees. */
const kop = (actief = 'assortiment') => {
  const aan = n => (n === actief ? ' class="is-nu is-blad"' : '');
  return `
<header class="kop" id="top">
  <a class="merk" href="index.html" aria-label="Velvet Cakes by Anka">
    <img src="photos/merk/logo-goud-krap.svg" alt="Velvet Cakes by Anka" width="2396" height="870">
  </a>
  <nav class="menu">
    <a href="index.html" data-i18n="nav.home">Home</a>
    <a href="index.html#over" data-i18n="nav.over">Over mij</a>
    <a href="index.html#assortiment"${aan('assortiment')} data-i18n="nav.assortiment">Assortiment</a>
    <a href="smaken.html"${aan('smaken')} data-i18n="nav.smaken">Smaken</a>
    <a href="prijzen.html"${aan('prijzen')} data-i18n="nav.prijzen">Prijzen</a>
    <a href="index.html#portfolio" data-i18n="nav.portfolio">Portfolio</a>
    <a href="#contact" data-i18n="nav.contact">Contact</a>
  </nav>
  <div class="kop-rechts">${taalkiezer()}
    <a class="sociaal" href="https://www.instagram.com/ionecaterina1987" target="_blank" rel="noopener" aria-label="Instagram">${IG}</a>
    <a class="sociaal" href="https://www.facebook.com/share/1Hu1g4kP7w/" target="_blank" rel="noopener" aria-label="Facebook">${FB}</a>
    <a class="knop knop-vol kop-cta" href="#contact"><span data-i18n="cta.offerte">Offerte aanvragen</span> <i>&rarr;</i></a>
  </div>
  <button class="menu-knop" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
</header>`;
};

const voet = () => `
<footer class="voet">
  <div class="voet-merk">
    <img src="photos/merk/logo-goud-krap.svg" alt="Velvet Cakes by Anka" width="2396" height="870" loading="lazy">
  </div>
  <div class="voet-gegevens">
    <p><b data-i18n="voet.plaats">Bergen op Zoom</b><span data-i18n="voet.land">, Nederland</span></p>
    <p><a href="mailto:${MAIL}">${MAIL}</a></p>
    <p><a href="https://wa.me/${WA_NUMMER}" target="_blank" rel="noopener">${TEL_TEKST}</a></p>
    ${/* De voorwaarden staan in de voet en niet in het menu. Dat is de plek
         waar een bezoeker een rechtsdocument zoekt, en de menubalk is een rij
         zonder afbreking: een zevende item duwt hem op een smal venster weer
         breder dan het scherm (zie kop-breedte.mjs). */ ''}<p class="voet-vw"><a href="voorwaarden.html" data-i18n="nav.voorwaarden">${esc(VW_TITEL.nl)}</a></p>
  </div>
  <div class="voet-volg">
    <p data-i18n="voet.volg">Volg mij</p>
    <div class="voet-iconen">
      <a class="sociaal" href="https://www.instagram.com/ionecaterina1987" target="_blank" rel="noopener" aria-label="Instagram">${IG}</a>
      <a class="sociaal" href="https://www.facebook.com/share/1Hu1g4kP7w/" target="_blank" rel="noopener" aria-label="Facebook">${FB}</a>
    </div>
  </div>
  <p class="voet-slot"><i></i>${HART}<span data-i18n="merk.tagline">Where sweetness meets elegance</span><i></i></p>
</footer>

<div class="dock" id="dock">
  <a class="dock-wa" href="https://wa.me/${WA_NUMMER}" target="_blank" rel="noopener" aria-label="WhatsApp">${WA}</a>
  <a class="dock-cta" href="#contact" data-i18n="cta.offerte">Offerte aanvragen</a>
</div>`;

const aanvraag = p => `
<section class="oproep" id="bestellen">
  <img class="oproep-merk" src="photos/merk/monogram-goud.svg" alt="" width="1600" height="1600" loading="lazy">
  <p class="schrift" data-i18n="oproep.schrift">Laat ons samen iets zoets en onvergetelijks creeren</p>
  ${HART}
  <a class="knop knop-vol" href="#contact"><span data-i18n="cta.offerte">Offerte aanvragen</span> <i>&rarr;</i></a>
</section>

<section class="aanvraag" id="contact">
  <div class="aanvraag-kop">
    <p class="bovenregel" data-i18n="bovenregel.bestellen">Bestellen</p>
    <h2 data-i18n="aanvraag.titel">Vertel over je feest</h2>
    <p class="aanvraag-lead" data-i18n="aanvraag.lead">Datum, aantal personen, de gelegenheid en je gewenste smaak. Je krijgt een voorstel terug met ontwerp en prijs.</p>
    <p class="direct">
      <a href="https://wa.me/${WA_NUMMER}" target="_blank" rel="noopener">WhatsApp ${TEL_TEKST}</a>
      <span aria-hidden="true">&middot;</span>
      <a href="mailto:${MAIL}">${MAIL}</a>
    </p>
  </div>
  ${formulier(p)}
</section>`;

/* ---------- het aanvraagformulier ----------
   Tot de verhuizing verstuurde dit niets. site.js bundelde de antwoorden tot
   een WhatsApp-bericht en opende de chat; de bezoeker hield zelf niets over, en
   bij een geblokkeerde pop-up ging de aanvraag verloren zonder dat iemand het
   merkte. Het post nu naar /api/forms/aanvraag op dezelfde hostnaam, en zowel
   Anka als de bezoeker krijgt een mail.

   Daardoor zijn er twee velden bij gekomen die het WhatsApp-bericht niet nodig
   had: een mailadres (daar gaat de bevestiging naartoe, en het pakket eist het)
   en een telefoonnummer. Dat tweede is niet verplicht - wie alleen wil mailen
   hoeft zijn nummer niet af te geven voor een taart.

   De WhatsApp-knop blijft staan, in de kop van dit blok en in de meelopende
   balk. Dat was haar kanaal en dat blijft het; dit formulier is er voor wie
   liever een formulier invult, en dat is niet dezelfde bezoeker.

   `files` is de veldnaam die het pakket voor bijlagen leest. De inspiratiefoto
   gaat dus echt mee naar de R2-bak en staat als link in de mail aan Anka - waar
   hij eerst een regel was die de bezoeker vroeg hem zelf nog even te sturen.

   `soort` staat op de pagina van een soort al op de juiste keuze. Prijzen en
   smaken zijn geen product, dus daar niet. */
const GELEGENHEDEN = ['Bruiloft', 'Doop of communie', 'Verjaardag', 'Kinderfeest', 'Dessert table', 'Iets anders'];

const formulier = p => `<form novalidate method="post" action="/api/forms/aanvraag"
    ${/* De drie regels die site.js kan laten zien. Ze staan als attribuut in de
         html en niet in het script, want het script is een bestand voor alle
         drie de talen en de pagina weet in welke taal hij staat. Zo hoeft er
         geen tekstbestand ingeladen te worden om "je aanvraag is binnen" in het
         Roemeens te kunnen zeggen. */ ''}data-dank="Je aanvraag is binnen. Je krijgt een kopie per mail, en Anka komt bij je terug met een ontwerp en een prijs."
    data-mis="Versturen lukte niet. Stuur een WhatsApp naar ${TEL_TEKST} en je aanvraag is alsnog bij haar."
    data-bezig="Versturen"
    data-i18n-attr="data-dank:form.dank,data-mis:form.mis,data-bezig:form.bezig"><!--vc:formvelden:${p.slug}-->
    <div class="veld"><label for="naam" data-i18n="form.naam">Naam</label><input id="naam" name="firstName" type="text" required autocomplete="name" placeholder="Je naam" data-i18n-attr="placeholder:form.naam.ph"></div>
    <div class="veld"><label for="mail" data-i18n="form.mail">E-mail</label><input id="mail" name="email" type="email" required autocomplete="email" placeholder="jij@voorbeeld.nl" data-i18n-attr="placeholder:form.mail.ph"></div>
    <div class="veld"><label for="tel" data-i18n="form.tel">Telefoonnummer</label><input id="tel" name="tel" type="tel" autocomplete="tel" placeholder="Zodat Anka je kan bellen" data-i18n-attr="placeholder:form.tel.ph"></div>
    <div class="veld"><label for="datum" data-i18n="form.datum">Datum van het feest</label><input id="datum" name="datum" type="date" required></div>
    <div class="veld"><label for="personen" data-i18n="form.personen">Aantal personen</label><input id="personen" name="personen" type="number" min="1" placeholder="Bijvoorbeeld 25" data-i18n-attr="placeholder:form.personen.ph"></div>
    <div class="veld"><label for="soort" data-i18n="form.soort">Gelegenheid</label>
      <select id="soort" name="soort" required>
${GELEGENHEDEN.map((o, i) => `        <option data-i18n="form.o${i + 1}"${o === p.gelegenheid ? ' selected' : ''}>${o}</option>`).join('\n')}
      </select>
    </div>
    <div class="veld veld-breed"><label for="smaak" data-i18n="form.smaak">Gewenste smaak en idee</label><textarea id="smaak" name="smaak" rows="4" placeholder="Smaak, kleuren, thema" data-i18n-attr="placeholder:form.smaak.ph"></textarea></div>
    <div class="veld veld-breed"><label for="foto" data-i18n="form.foto">Inspiratiefoto</label><input id="foto" name="files" type="file" accept="image/*"></div>
    <button class="knop knop-vol" type="submit"><span data-i18n="form.verstuur">Aanvraag versturen</span> <i>&rarr;</i></button>
    <p class="vormnoot" data-i18n="form.noot">Anka leest je aanvraag en komt bij je terug met een ontwerp en een prijs. Je krijgt zelf een kopie per mail.</p>
    <p class="form-melding" data-melding role="status" aria-live="polite"></p>
  </form>`;

/* De velden die niet van de bezoeker komen, per taal en per pagina in de bouw
   gezet in plaats van met de hand in tien html-bestanden - want dan staat er
   over een maand een formulier zonder bestemming op de site en valt een
   aanvraag stil in het niets.

   `website` is het lokvink: het staat wel in de html (anders ziet een bot het
   niet) maar buiten beeld en buiten de tabvolgorde. Een bot die het vult krijgt
   {"ok":true} terug en er wordt niets opgeslagen en niets gemaild. Dat scheelt
   een Turnstile, dus ook een extra verzoek naar Cloudflare voor iemand die
   alleen een taart wil aanvragen.

   `__jiw_confirmation_locale` bepaalt de taal van de bevestiging. Die staat
   hier per pagina vast en wordt niet uit de browser gelezen: wie de Roemeense
   pagina invult hoort Roemeens terug te krijgen, ook met een Nederlandse
   browser. */
const zetFormvelden = (html, taal) => html.replace(/<!--vc:formvelden:([a-z-]+)-->/g, (_, slug) => {
  const id = `${taal}-${slug}`;
  return `
    <div class="lokvink" aria-hidden="true">
      <label for="hp-${id}">Website</label>
      <input id="hp-${id}" name="website" type="text" tabindex="-1" autocomplete="off">
    </div>
    <input type="hidden" name="__jiw_confirmation_locale" value="${taal}">
    <input type="hidden" name="lang" value="${TAALNAAM[taal]}">
    <input type="hidden" name="herkomst" value="${adresVan(taal, slug)}">`;
});

const lightbox = () => `
<div class="lightbox" id="lightbox" hidden>
  <button class="lb-close" aria-label="Sluiten" data-i18n-attr="aria-label:lb.sluiten">&times;</button>
  <button class="lb-prev" aria-label="Vorige foto" data-i18n-attr="aria-label:lb.vorige">&lsaquo;</button>
  <button class="lb-next" aria-label="Volgende foto" data-i18n-attr="aria-label:lb.volgende">&rsaquo;</button>
  <div class="lb-track" id="lb-track"></div>
  <div class="lb-bar">
    <p id="lb-caption"></p>
    <p class="lb-teller"><span id="lb-nu">1</span> / <span id="lb-totaal">1</span></p>
  </div>
</div>`;

const tegel = f => `      <figure class="tegel" tabindex="0" data-groot="photos/groot/${f}.webp">
        <img src="photos/${f}.webp" alt="${esc(BIJ[f].nl)}" data-i18n-attr="alt:bij.${f}" width="620" height="775" loading="lazy" decoding="async">
        <figcaption data-i18n="bij.${f}">${esc(BIJ[f].nl)}</figcaption>
      </figure>`;

/* ---------- een prijsregel ----------
   Een bedrag staat in de data als string ('35,00') of als bereik
   ({van, tot}); de taal bepaalt alleen het woordje ervoor en de eenheid. */
const bedragTekst = (r, taal) => {
  if (r.opAanvraag) return OP_AANVRAAG[taal];
  const e = EENHEID[r.eenheid][taal] ?? EENHEID[r.eenheid].nl;
  /* het bedrag draagt het gewicht, de eenheid eromheen staat in <i> en wordt
     door de css klein en grijs gezet: "per kg" is geen nieuws */
  if (typeof r.bedrag === 'object') {
    return `<i>${VAN[taal]}</i> &euro; ${r.bedrag.van} <i>${TOT[taal]}</i> &euro; ${r.bedrag.tot} <i>${e}</i>`;
  }
  if (r.tweede) {
    const eerste = r.eerste[taal] ?? r.eerste.nl;
    const tweede = r.tweede.wat[taal] ?? r.tweede.wat.nl;
    return `&euro; ${r.bedrag} <i>${e}, ${eerste}</i> &middot; &euro; ${r.tweede.bedrag} <i>${e}, ${tweede}</i>`;
  }
  return `&euro; ${r.bedrag} <i>${e}</i>`;
};

/* Alle prijsregels van een pagina: de losse regels plus, bij taarten, de prijs
   die aan een groep hangt. Zo staat een bedrag maar op een plek in de data. */
const prijsregels = p => [
  ...(p.groepen || []).filter(g => g.prijs).map((g, i) => ({
    ...g.prijs,
    wat: { nl: g.kop, en: p.en.groepen[p.groepen.indexOf(g)].kop, ro: p.ro.groepen[p.groepen.indexOf(g)].kop },
    sleutel: `prijs.${p.slug}.g${p.groepen.indexOf(g) + 1}`,
  })),
  ...(p.prijzen || []).map((r, i) => ({ ...r, sleutel: `prijs.${p.slug}.r${i + 1}` })),
];

const prijsblok = p => {
  const regels = prijsregels(p);
  if (!regels.length) return '';
  return `
<section class="prijsblok">
  <ul class="prijslijst">
${regels.map(r => `    <li>
      ${r.wat ? `<span class="prijs-wat" data-i18n="${r.sleutel}w">${esc(r.wat.nl)}</span>` : ''}
      <span class="prijs-bedrag" data-i18n-html="${r.sleutel}b">${bedragTekst(r, 'nl')}</span>
      ${r.noot ? `<span class="prijs-noot" data-i18n="${r.sleutel}n">${esc(r.noot.nl)}</span>` : ''}
    </li>`).join('\n')}
  </ul>
  <div class="prijsblok-knoppen">
    <a class="knop knop-lijn" href="prijzen.html"><span data-i18n="cta.prijzen">Bekijk alle prijzen</span> <i>&rarr;</i></a>
    ${/* alleen bij de taarten: haar smaakkaart gaat over taartvullingen, niet
          over macarons of cozonac */ ''}${p.smaken ? `<a class="knop knop-lijn" href="smaken.html"><span data-i18n="cta.smaken">Bekijk alle smaken</span> <i>&rarr;</i></a>` : ''}
  </div>
</section>`;
};

const groep = (g, i, p) => `
<section class="groep${i % 2 ? ' groep-gevuld' : ''}">
  <div class="groep-kop">
    <h2 data-i18n="${g.sleutel}k">${esc(g.kop)}</h2>
    <span class="lijntje"></span>
    <p data-i18n="${g.sleutel}t">${esc(g.tekst)}</p>
    ${g.prijs ? `<p class="groep-prijs"><span data-i18n-html="prijs.${p.slug}.g${i + 1}b">${bedragTekst(g.prijs, 'nl')}</span>${g.prijs.noot ? `<i data-i18n="prijs.${p.slug}.g${i + 1}n">${esc(g.prijs.noot.nl)}</i>` : ''}</p>` : ''}
  </div>
  <div class="galerij">
${g.fotos.map(tegel).join('\n')}
  </div>
</section>`;

const verwant = p => `
<section class="verwant">
  <p class="bovenregel" data-i18n="bovenregel.verder">Verder in het assortiment</p>
  <div class="soorten">
${PAGINAS.filter(a => a.slug !== p.slug).map(a => `    <a class="soort" href="${a.slug}.html">
      <img src="photos/${a.tegel}.webp" alt="${esc(BIJ[a.tegel].nl)}" data-i18n-attr="alt:bij.${a.tegel}" width="620" height="775" loading="lazy">
      <h3 data-i18n="soort.${a.slug}">${esc(a.titel)}</h3>
      <span class="meer"><span data-i18n="cta.meer">Bekijk meer</span> <i>&rarr;</i></span>
    </a>`).join('\n')}
  </div>
</section>`;

const aantal = p => p.groepen.reduce((n, g) => n + g.fotos.length, 0);

/* ---------- de kop van het document ----------
   Hier zit het verschil tussen de conceptmap en een site die gevonden wordt.
   Elke pagina draagt nu:

   - het juiste lang-attribuut. Stond in het concept op alle 30 varianten "nl",
     ook op de Roemeense tekst, want de taal werd pas in de browser omgezet.
   - een canonical naar zichzelf, op het echte domein.
   - een hreflang-set die de drie talen aan elkaar knoopt, met x-default op het
     Nederlands. Dit is wat van drie losse pagina's een set maakt: zonder dit
     zijn /taarten en /en/taarten voor Google twee pagina's die hetzelfde
     beweren, en kiest hij er zelf een.
   - og- en twitter-kaarten met een echte foto, zodat een link in WhatsApp (het
     kanaal waar haar klanten komen) een plaatje en een regel laat zien in
     plaats van een naakte url.
   - JSON-LD. Zie schema() hieronder.

   De fonts blijven van Google, met preconnect ervoor. Ze zelf meeleveren zou
   een verzoek minder zijn, maar Parisienne en Allura zijn hier geen decoratie:
   als die niet laden valt de schrijfregel terug op een systeemletter en dat is
   zichtbaar haar merk kwijt. Eerst meten, dan verbouwen.

   In de conceptbouw (zonder --prod) staat er noindex op alles. Dat is de reden
   dat die bouw bestaat: een testadres hoort niet in de index te komen, en
   tools/vooraf.mjs zakt als die noindex in de productiebouw blijft staan. */
const paginaTitel = (taal, slug, nl) => tekst(taal, slug === 'index' ? 'meta.title' : `${slug}.meta`, nl);
const paginaDesc = (taal, slug, nl) => tekst(taal, slug === 'index' ? 'meta.desc' : `${slug}.desc`, nl);

const hreflang = slug => [
  ...TALEN.map(t => `<link rel="alternate" hreflang="${t}" href="${volledig(t, slug)}">`),
  `<link rel="alternate" hreflang="x-default" href="${volledig('nl', slug)}">`,
].join('\n');

const hoofd = (taal, slug, titelNl, descNl, ogFoto) => {
  const titel = paginaTitel(taal, slug, titelNl);
  const desc = paginaDesc(taal, slug, descNl);
  const hier = volledig(taal, slug);
  return `<!DOCTYPE html>
<html lang="${taal}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titel)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${hier}">
${hreflang(slug)}${PROD ? '' : '\n<meta name="robots" content="noindex">'}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Velvet Cakes by Anka">
<meta property="og:locale" content="${{ nl: 'nl_NL', en: 'en_GB', ro: 'ro_RO' }[taal]}">
<meta property="og:title" content="${esc(titel)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${hier}">
<meta property="og:image" content="${ADRES}/photos/groot/${ogFoto}.webp">
<meta property="og:image:alt" content="${esc(BIJ[ogFoto][taal])}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="64x64" href="/favicon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/photos/merk/monogram-cacao-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&family=Parisienne&family=Allura&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
${schema(taal, slug, titel)}
</head>`;
};

/* ---------- JSON-LD ----------
   Twee blokken, en geen van de twee beweert iets dat niet op de pagina staat.

   Bakery op elke pagina: wie zij is, waar ze zit, hoe je haar bereikt en in
   welke prijsklasse. Dat is het blok waar Google een lokaal bedrijf uit haalt,
   en "Bergen op Zoom" is precies waar haar klanten op zoeken. Het adres is
   alleen de plaats en niet de straat: haar huisadres staat in haar algemene
   voorwaarden omdat dat wettelijk moet, maar het in de structured data van elke
   pagina zetten is het breed rondsturen van het huisadres van iemand die thuis
   werkt. priceRange komt uit haar eigen prijslijst (29 tot 38 per kilo).

   BreadcrumbList op elke pagina behalve de startpagina: hetzelfde kruimelpad
   dat er in beeld al staat. Niets verzonnen, en Google toont het in het
   zoekresultaat in plaats van de naakte url.

   Geen aggregateRating en geen review: ze heeft geen reviews op deze site, en
   een sterrenblok zonder reviews is precies waar Search Console een handmatige
   maatregel voor uitdeelt. */
const schema = (taal, slug, titel) => {
  const blokken = [{
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    '@id': `${ADRES}/#bedrijf`,
    name: 'Velvet Cakes by Anka',
    description: paginaDesc(taal, 'index', META_DESC_NL),
    url: volledig(taal, 'index'),
    image: `${ADRES}/photos/groot/bruid-ivoor-goud.webp`,
    logo: `${ADRES}/photos/merk/logo-goud.svg`,
    telephone: `+${WA_NUMMER}`,
    email: MAIL,
    priceRange: '\u20ac\u20ac',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bergen op Zoom',
      addressRegion: 'Noord-Brabant',
      addressCountry: 'NL',
    },
    areaServed: { '@type': 'City', name: 'Bergen op Zoom' },
    sameAs: [
      'https://www.instagram.com/ionecaterina1987',
      'https://www.facebook.com/share/1Hu1g4kP7w/',
    ],
  }];
  if (slug !== 'index') {
    blokken.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: tekst(taal, 'kruimel.home', 'Home'), item: volledig(taal, 'index') },
        { '@type': 'ListItem', position: 2, name: titel.replace(/ \| Velvet Cakes by Anka$/, ''), item: volledig(taal, slug) },
      ],
    });
  }
  /* `<` in een JSON-LD-blok sluit het script af. Komt hier niet voor, maar een
     bijschrift of een artikel kan er morgen een krijgen, en dan staat er stille
     onzin in de head. */
  return blokken.map(b => `<script type="application/ld+json">${JSON.stringify(b).replace(/</g, '\\u003c')}</script>`).join('\n');
};

/* De vier paginatemplates leveren alleen de body. De kop van het document komt
   per taal uit hoofd() en de scripts uit staart(), zodat een canonical, een
   hreflang of een scriptnaam op een plek staat en niet vier keer. */
const pagina = p => `<body data-meta="${p.slug}">
${kop()}

<section class="hero hero-blad">
  <div class="hero-tekst">
    <nav class="kruimel" aria-label="Kruimelpad">
      <a href="index.html" data-i18n="kruimel.home">Home</a> <span aria-hidden="true">/</span>
      <a href="index.html#assortiment" data-i18n="kruimel.assortiment">Assortiment</a> <span aria-hidden="true">/</span>
      <b data-i18n="soort.${p.slug}">${esc(p.titel)}</b>
    </nav>
    <p class="bovenregel" data-i18n="bovenregel.assortiment">Assortiment</p>
    <h1 data-i18n="soort.${p.slug}">${p.titelKop || esc(p.titel)}</h1>
    <p class="schrift schrift-groot"><span data-i18n="${p.slug}.schrift">${esc(p.schrift)}</span> ${HART}</p>
    <p class="hero-lead" data-i18n="${p.slug}.lead">${esc(p.lead)}</p>
    <div class="hero-knoppen">
      <a class="knop knop-vol" href="#contact"><span data-i18n="cta.offerte">Offerte aanvragen</span> <i>&rarr;</i></a>
      <a class="knop knop-lijn" href="index.html#assortiment"><span data-i18n="cta.alle">Alle soorten</span> <i>&rarr;</i></a>
    </div>
  </div>
  <div class="hero-foto">
    <img src="photos/groot/${p.hero}.webp" alt="${esc(BIJ[p.hero].nl)}" data-i18n-attr="alt:bij.${p.hero}" width="1100" height="1375" fetchpriority="high">
  </div>
</section>

<section class="kenmerken">
${p.kenmerken.map(([k, t], i) => `  <div class="kenmerk"><h3 data-i18n="${p.slug}.k${i + 1}t">${esc(k)}</h3><p data-i18n="${p.slug}.k${i + 1}p">${esc(t)}</p></div>`).join('\n')}
</section>
${prijsblok(p)}
${p.groepen.map((g, i) => groep({ ...g, sleutel: `${p.slug}.g${i + 1}` }, i, p)).join('\n')}

<p class="galerijnoot" data-i18n="${p.slug}.noot">${aantal(p)} foto${aantal(p) === 1 ? '' : "'s"}. Klik er een aan om hem groot te bekijken en door te bladeren.</p>

${verwant(p)}
${aanvraag(p)}
${voet()}
${lightbox()}

`;

/* ---------- de prijspagina ----------
   Dezelfde bedragen als op de soortpaginas, uit dezelfde data. Een bezoeker die
   alleen wil weten wat iets kost hoeft dan niet zeven paginas af. */
const prijspagina = () => `<body data-meta="prijzen">
${kop('prijzen')}

<section class="hero hero-blad hero-prijzen">
  <div class="hero-tekst">
    <nav class="kruimel" aria-label="Kruimelpad">
      <a href="index.html" data-i18n="kruimel.home">Home</a> <span aria-hidden="true">/</span>
      <b data-i18n="prijzen.titel">Prijzen</b>
    </nav>
    <p class="bovenregel" data-i18n="prijzen.kop">Prijslijst</p>
    <h1 data-i18n="prijzen.titel">Prijzen</h1>
    <p class="schrift schrift-groot"><span data-i18n="prijzen.schrift">Wat het kost</span> ${HART}</p>
    <p class="hero-lead" data-i18n="prijzen.lead">Taarten rekenen we per kilo, patisserie per stuk. De decoratie wordt apart begroot, want dat is het deel dat per feest het meest verschilt.</p>
    <div class="hero-knoppen">
      <a class="knop knop-vol" href="#contact"><span data-i18n="cta.offerte">Offerte aanvragen</span> <i>&rarr;</i></a>
    </div>
  </div>
</section>

<section class="prijstabel">
${PAGINAS.map(p => {
  const regels = prijsregels(p);
  if (!regels.length) return '';
  return `  <div class="prijsgroep">
    <h2><a href="${p.slug}.html" data-i18n="soort.${p.slug}">${esc(p.titel)}</a></h2>
    <ul class="prijslijst">
${regels.map(r => `      <li>
        ${/* zonder eigen omschrijving zou hier de naam van de soort nog een keer
             staan, direct onder de kop die hem al noemt */ ''}${r.wat ? `<span class="prijs-wat" data-i18n="${r.sleutel}w">${esc(r.wat.nl)}</span>` : ''}
        <span class="prijs-bedrag" data-i18n-html="${r.sleutel}b">${bedragTekst(r, 'nl')}</span>
        ${r.noot ? `<span class="prijs-noot" data-i18n="${r.sleutel}n">${esc(r.noot.nl)}</span>` : ''}
      </li>`).join('\n')}
    </ul>
  </div>`;
}).filter(Boolean).join('\n')}
</section>

<p class="galerijnoot" data-i18n="prijzen.noot">Voor een sweet table of candy bar, en voor alles wat hier niet bij staat, vraag je Anka om een offerte.</p>

${aanvraag({ titel: 'Prijzen', slug: 'prijzen', gelegenheid: 'Iets anders' })}
${voet()}

`;

/* ---------- de smakenpagina ----------
   Haar smaakkaart van 18-10-2026 als pagina. Dezelfde opbouw als de
   prijspagina: een vraag die een bezoeker apart stelt ("welke smaken heb je?")
   krijgt een eigen adres, in plaats van als alinea weg te zakken op de
   taartenpagina. De nummering is haar eigen en staat in de html en niet in de
   tabel: een cijfer is in alle drie de talen hetzelfde. */
const smakenpagina = () => `<body data-meta="smaken">
${kop('smaken')}

<section class="hero hero-blad hero-prijzen">
  <div class="hero-tekst">
    <nav class="kruimel" aria-label="Kruimelpad">
      <a href="index.html" data-i18n="kruimel.home">Home</a> <span aria-hidden="true">/</span>
      <b data-i18n="smaken.titel">Smaken</b>
    </nav>
    <p class="bovenregel" data-i18n="smaken.kop">Smaakkaart</p>
    <h1 data-i18n="smaken.titel">Smaken</h1>
    <p class="schrift schrift-groot"><span data-i18n="smaken.schrift">Smaak kies je zelf</span> ${HART}</p>
    <p class="hero-lead" data-i18n="smaken.lead">Dit zijn de smaken voor haar taarten. Geef bij je aanvraag door welke je wilt.</p>
    <div class="hero-knoppen">
      <a class="knop knop-vol" href="#contact"><span data-i18n="cta.offerte">Offerte aanvragen</span> <i>&rarr;</i></a>
      <a class="knop knop-lijn" href="prijzen.html"><span data-i18n="cta.prijzen">Bekijk alle prijzen</span> <i>&rarr;</i></a>
    </div>
  </div>
</section>

<section class="smaaklijst">
  <ol class="smaken">
${SMAKEN.filter(s => !s.open).map((s, i) => `    <li><span class="smaak-nr" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="smaak-naam" data-i18n="smaak.${i + 1}">${esc(s.nl)}</span></li>`).join('\n')}
  </ol>
${SMAKEN.filter(s => s.open).map(s => `  <p class="smaak-overleg"><span data-i18n="smaak.open">${esc(s.nl)}</span></p>`).join('\n')}
</section>

${/* Geen noot onder de smaakkaart: de datum is onze administratie en niet die van
     de bezoeker, en "een smaak die er niet bij staat" stond al een regel hoger
     als "Andere smaken in overleg". */ ''}
${aanvraag({ titel: 'Smaken', slug: 'smaken', gelegenheid: 'Iets anders' })}
${voet()}

`;

/* ---------- de voorwaardenpagina ----------
   Haar algemene voorwaarden van 18-10-2026, woordelijk zoals zij ze aanleverde.
   De tekst staat in voorwaarden.mjs; hier staat alleen de opmaak.

   Geen formulier onderaan deze pagina. Op elke andere pagina hoort dat er wel,
   want daar kijkt iemand naar taarten; hier leest iemand de kleine letters, en
   een offerteknop tussen de annuleringsvoorwaarden leest als een aanzet om nu
   te bestellen voordat je het uitgelezen hebt. De knop in de balk en de
   meelopende knop staan er nog, dus bestellen kan gewoon. */
const artikel = a => {
  const r = [`  <article class="vw-art" id="artikel-${a.nr}">
    <h2><span class="vw-nr" aria-hidden="true">${a.nr}</span><span data-i18n="vw.a${a.nr}.kop">${esc(a.kop.nl)}</span></h2>`];

  if (a.gegevens) {
    /* Haar naam, straat en postcode staan onder elkaar als adres en dragen geen
       label: "Straat: Dr Ensinkstraat 16" is geen adres maar een formulier. Ze
       staan daarom in een <address> en niet als lege <dt> in de lijst eronder -
       een dt zonder tekst is voor een schermlezer een term zonder naam. */
    const los = a.gegevens.filter(g => !g.label);
    if (los.length) r.push(`    <address class="vw-adres">${los.map(g => esc(g.waarde)).join('<br>')}</address>`);
    r.push(`    <dl class="vw-gegevens">`);
    a.gegevens.forEach((g, i) => {
      if (!g.label) return;
      const waarde = g.mail ? `<a href="mailto:${g.waarde}">${g.waarde}</a>`
        : g.tel ? `<a href="https://wa.me/${g.tel}" target="_blank" rel="noopener">${esc(g.waarde)}</a>`
        : esc(g.waarde);
      r.push(`      <div><dt data-i18n="vw.a${a.nr}.l${i + 1}">${esc(g.label.nl)}</dt><dd>${waarde}</dd></div>`);
    });
    r.push(`    </dl>`);
  }
  if (a.noot) r.push(`    <p class="vw-noot" data-i18n="vw.a${a.nr}.noot">${esc(a.noot.nl)}</p>`);
  if (a.tekst) r.push(`    <p class="vw-tekst" data-i18n="vw.a${a.nr}.tekst">${esc(a.tekst.nl)}</p>`);
  if (a.punten) {
    r.push(`    <ol class="vw-punten">`);
    a.punten.forEach((p, i) => r.push(`      <li data-i18n="vw.a${a.nr}.p${i + 1}">${esc(p.nl)}</li>`));
    r.push(`    </ol>`);
  }
  if (a.subkop) r.push(`    <h3 data-i18n="vw.a${a.nr}.subkop">${esc(a.subkop.nl)}</h3>`);
  if (a.streep) {
    r.push(`    <ul class="vw-streep">`);
    a.streep.forEach((s, i) => r.push(`      <li data-i18n="vw.a${a.nr}.s${i + 1}">${esc(s.nl)}</li>`));
    r.push(`    </ul>`);
  }
  r.push(`  </article>`);
  return r.join('\n');
};

const voorwaardenpagina = () => `<body data-meta="vw">
${kop('voorwaarden')}

<section class="hero hero-blad hero-prijzen">
  <div class="hero-tekst">
    <nav class="kruimel" aria-label="Kruimelpad">
      <a href="index.html" data-i18n="kruimel.home">Home</a> <span aria-hidden="true">/</span>
      <b data-i18n="vw.titel">${esc(VW_TITEL.nl)}</b>
    </nav>
    <p class="bovenregel" data-i18n="vw.kop">Voorwaarden</p>
    <h1 data-i18n="vw.titel">${esc(VW_TITEL.nl)}</h1>
  </div>
</section>

<section class="voorwaarden">
${ARTIKELEN.map(artikel).join('\n')}
  <p class="vw-bindend" data-i18n="vw.bindend">${esc(voorwaardenSleutels('nl')['vw.bindend'])}</p>
</section>

${voet()}

`;

/* De drie adressen die geen pagina meer zijn (eclairs, choux, cupcakes) stonden
   hier als losse html-bestanden met een meta-refresh erin. Dat is sinds de
   verhuizing een 301 in worker/index.ts, samen met de omleiding van elk
   .html-adres naar zijn schone vorm. Een echte 301 geeft de opvolger ook het
   gewicht van het oude adres; een meta-refresh doet dat niet.
   tools/vooraf.mjs telt na dat de site zelf nergens meer naar die drie linkt. */

/* ---------- poort: is elke taal rond? ----------
   Een vertaling die een groep, een kenmerk of een bijschrift mist stopt de
   build. Anders komt er een pagina online die half omklapt: de ene alinea in
   het Engels, de volgende in het Nederlands, en dat valt pas op als een
   bezoeker het ziet. */
const fouten = [];
for (const p of PAGINAS) {
  for (const taal of ['en', 'ro']) {
    const v = p[taal];
    if (!v) { fouten.push(`${p.slug}: geen ${taal}-blok`); continue; }
    for (const veld of ['titel', 'schrift', 'lead', 'meta']) {
      if (!v[veld]) fouten.push(`${p.slug}.${veld}: niet vertaald naar ${taal}`);
    }
    if (v.kenmerken?.length !== p.kenmerken.length) fouten.push(`${p.slug}: ${p.kenmerken.length} kenmerken, ${v.kenmerken?.length ?? 0} in ${taal}`);
    if (v.groepen?.length !== p.groepen.length) fouten.push(`${p.slug}: ${p.groepen.length} groepen, ${v.groepen?.length ?? 0} in ${taal}`);
    (v.groepen || []).forEach((g, i) => {
      if (!g.kop || !g.tekst) fouten.push(`${p.slug}.g${i + 1}: halve ${taal}-vertaling`);
    });
  }
  /* elke getoonde foto moet bestaan en een bijschrift in alle drie de talen
     hebben; anders staat er een lege regel onder een tegel */
  for (const g of p.groepen) {
    for (const f of g.fotos) {
      if (!BIJ[f]) { fouten.push(`${p.slug}: foto ${f} heeft geen bijschrift`); continue; }
      for (const taal of TALEN) if (!BIJ[f][taal]) fouten.push(`bij.${f}: geen ${taal}`);
    }
  }
  if (!BIJ[p.tegel]) fouten.push(`${p.slug}: tegel ${p.tegel} heeft geen bijschrift`);
  if (!BIJ[p.hero]) fouten.push(`${p.slug}: hero ${p.hero} heeft geen bijschrift`);
}
/* elke smaak in alle drie de talen. Een merknaam staat in de data drie keer
   hetzelfde en dat is goed; een smaak die er in een taal uitvalt zou als lege
   regel in de lijst komen te staan, want die lijst heeft geen bijschrift om
   op terug te vallen. */
SMAKEN.forEach((s, i) => {
  for (const taal of TALEN) if (!s[taal]) fouten.push(`smaak ${i + 1} (${s.nl}): geen ${taal}`);
});

/* de twee vaste tabellen moeten dezelfde sleutels dragen, anders valt er in een
   van beide talen een regel terug naar het Nederlands zonder dat iemand het ziet */
for (const s of Object.keys(EN_ALGEMEEN)) if (!(s in RO_ALGEMEEN)) fouten.push(`${s}: wel en, geen ro`);
for (const s of Object.keys(RO_ALGEMEEN)) if (!(s in EN_ALGEMEEN)) fouten.push(`${s}: wel ro, geen en`);

if (fouten.length) {
  console.error('Vertaling niet rond:\n  ' + fouten.join('\n  '));
  process.exit(1);
}

/* "32 de fotografii", maar "3 fotografii": vanaf 20 komt er in het Roemeens
   "de" tussen het getal en het zelfstandig naamwoord. */
const fotosRo = n => (n === 1 ? '1 fotografie' : n < 20 ? `${n} fotografii` : `${n} de fotografii`);
const fotosEn = n => (n === 1 ? '1 photo' : `${n} photos`);

/* elke foto die op een pagina staat: in een galerij, als tegel of als hero */
const GEBRUIKTE_FOTOS = new Set(PAGINAS.flatMap(p => [
  p.tegel, p.hero, ...p.groepen.flatMap(g => g.fotos),
]));

const bouwTabel = (taal) => {
  const T = { ...ALGEMEEN[taal] };
  for (const p of PAGINAS) {
    const v = p[taal];
    T[`soort.${p.slug}`] = v.titel;
    T[`${p.slug}.meta`] = `${v.titel} | Velvet Cakes by Anka`;
    T[`${p.slug}.desc`] = v.meta;
    T[`${p.slug}.schrift`] = v.schrift;
    T[`${p.slug}.lead`] = v.lead;
    v.kenmerken.forEach(([k, t], i) => { T[`${p.slug}.k${i + 1}t`] = k; T[`${p.slug}.k${i + 1}p`] = t; });
    v.groepen.forEach((g, i) => { T[`${p.slug}.g${i + 1}k`] = g.kop; T[`${p.slug}.g${i + 1}t`] = g.tekst; });
    T[`${p.slug}.noot`] = taal === 'ro'
      ? `${fotosRo(aantal(p))}. Apasă pe una ca să o vezi mare și să răsfoiești.`
      : `${fotosEn(aantal(p))}. Click one to see it large and browse through.`;
    for (const r of prijsregels(p)) {
      if (r.wat) T[`${r.sleutel}w`] = r.wat[taal] ?? r.wat.nl;
      T[`${r.sleutel}b`] = bedragTekst(r, taal);
      if (r.noot) T[`${r.sleutel}n`] = r.noot[taal] ?? r.noot.nl;
    }
  }
  /* de prijspagina heeft geen eigen blok in PAGINAS, dus zijn titel en
     omschrijving worden hier gezet. .meta is de paginatitel en .desc de regel
     voor Google; die twee zijn makkelijk te verwisselen, zie i18n.js. */
  T['prijzen.meta'] = `${ALGEMEEN[taal]['prijzen.titel']} | Velvet Cakes by Anka`;
  T['smaken.meta'] = `${ALGEMEEN[taal]['smaken.titel']} | Velvet Cakes by Anka`;
  /* haar voorwaarden: titel, lead en alle dertien artikelen, uit voorwaarden.mjs.
     Die staan daar per regel in drie talen naast elkaar, om dezelfde reden als
     de rest: een artikel dat onvertaald blijft zakt dan op de poort hieronder
     in plaats van half Nederlands op een Roemeense pagina te komen. */
  Object.assign(T, voorwaardenSleutels(taal));
  SMAKEN.filter(s => !s.open).forEach((s, i) => { T[`smaak.${i + 1}`] = s[taal]; });
  SMAKEN.filter(s => s.open).forEach(s => { T['smaak.open'] = s[taal]; });
  /* alleen de fotos die ergens staan. bijschriften.json draagt ook de fotos
     van concept 1 die hier niet gebruikt worden (de eclairs bijvoorbeeld, die
     Anka niet meer maakt); zo'n sleutel is dood gewicht in de tabel en de
     taalcontrole meldt hem terecht als ongebruikt. */
  for (const f of GEBRUIKTE_FOTOS) T[`bij.${f}`] = BIJ[f][taal];
  return T;
};

const EN = bouwTabel('en');
const RO = bouwTabel('ro');

/* ---------- ai-poort over de copy, in alle drie de talen ----------
   Playground-huisregel: elke sitecopy gaat door .gereedschap/aipoort.mjs, in
   elke taal. Voor een vertaling is dat geen formaliteit: machinetaal komt er
   juist bij het vertalen in, omdat een vertaler naar een mooier woord grijpt
   dan het origineel had. Zakt de poort, dan komt er geen pagina uit. */
const nlCopy = Object.fromEntries(PAGINAS.map(p => [p.slug, {
  titel: p.titel, schrift: p.schrift, lead: p.lead, meta: p.meta,
  kenmerken: p.kenmerken, groepen: p.groepen.map(g => ({ kop: g.kop, tekst: g.tekst })),
}]));
const nlBij = Object.fromEntries(Object.entries(BIJ).map(([f, c]) => [f, c.nl]));
aipoort({
  talen: { nl: { ...nlCopy, bij: nlBij, vw: voorwaardenSleutels('nl') }, en: EN, ro: RO },
  toegestaan: {
    /* Haar eigen regel uit het voorbeeld dat ze aanleverde ("iets zoets en
       onvergetelijks"). De vertalingen moeten dezelfde belofte doen, en
       "unforgettable" en "de neuitat" zijn daar het gewone woord voor. Niet
       onze verfraaiing, maar haar zin. */
    'en:oproep.schrift': 'vertaling van haar eigen regel, niet onze copy',
    'ro:oproep.schrift': 'vertaling van haar eigen regel, niet onze copy',
  },
});


/* ===========================================================================
   De schrijver: van een Nederlandse body naar 31 pagina's in dist/
   ===========================================================================

   De templates hierboven leveren Nederlandse html met vertaalsleutels erin
   (data-i18n, data-i18n-html, data-i18n-attr) - precies de markering die
   i18n.js tot vandaag in de browser gebruikte. Die sleutels worden nu in de
   bouw opgelost. Drie stappen per pagina per taal:

     1. vertaal()    de tekst in de taal van de pagina zetten
     2. adressen()   elk intern adres absoluut maken en in de juiste taal
     3. hoofd()      de kop van het document, met canonical en hreflang

   Waarom een nabewerking en niet drie keer een template met een taalparameter:
   de tabellen die hier al stonden zijn maandenlang op de live site nagemeten,
   tot en met de Roemeense schrijfletters en de html-entiteiten. Ze worden nog
   steeds uit dezelfde bron naast het Nederlands gebouwd, en er verandert alleen
   het moment waarop ze worden toegepast. tools/tegenproef.mjs bewijst dat in
   een echte browser: de oude conceptsite op RO naast de nieuwe /ro/-pagina.

   Elke stap telt wat hij heeft gedaan en gooit als dat niet klopt. Een
   vertaling die stil overslaat is namelijk precies de fout die niemand ziet: de
   pagina blijft heel, er staat alleen een Nederlandse regel tussen het
   Roemeens. */
const TABEL = { en: EN, ro: RO };

const DIST = new URL('./dist/', import.meta.url);

/* ---------- 1. vertalen ----------
   Drie soorten sleutel, elk met zijn eigen regel.

   data-i18n is textContent, dus de inhoud van zo'n element is per definitie
   platte tekst: er kan geen tag in staan. Daarom mag [^<]* hier en is het ook
   de controle - een element met markup erin matcht niet, en dan klopt de
   telling onderaan niet meer en stopt de bouw.

   data-i18n-html is innerHTML (de prijsbedragen, die een <i> met de eenheid
   dragen). Die inhoud gaat er onbewerkt in, want de tabel draagt daar html.

   data-i18n-attr zet een attribuut op het element zelf (alt, placeholder,
   aria-label).

   De tagnaam matcht als [a-z][a-z0-9]* en niet als [a-z]+. Dat tweede stond er
   eerst, en dan matcht <h1> niet: [a-z]+ pakt de h, en dan wil \b een
   woordgrens tussen de h en de 1, die er niet is. Gevolg: elke kop op de site
   bleef Nederlands terwijl de rest van de pagina vertaald werd. Alleen gevonden
   omdat de telling hieronder 64 sleutels in de html zag en 55 opgepakte -
   vandaar die telling. */
function vertaal(html, taal) {
  if (taal === 'nl') return html;
  const T = TABEL[taal];
  const mist = [];

  const verwacht = {
    tekst: (html.match(/\bdata-i18n="/g) ?? []).length,
    htm: (html.match(/\bdata-i18n-html="/g) ?? []).length,
    attr: (html.match(/\bdata-i18n-attr="/g) ?? []).length,
  };
  const n = { tekst: 0, htm: 0, attr: 0 };

  html = html.replace(/(<([a-z][a-z0-9]*)\b[^>]*\bdata-i18n-html="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g,
    (heel, open, tag, sleutel, inhoud, sluit) => {
      n.htm++;
      const v = T[sleutel];
      if (v === undefined) { mist.push(sleutel); return heel; }
      return open + v + sluit;
    });

  html = html.replace(/(<([a-z][a-z0-9]*)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)([^<]*)(<\/\2>)/g,
    (heel, open, tag, sleutel, inhoud, sluit) => {
      n.tekst++;
      const v = T[sleutel];
      if (v === undefined) { mist.push(sleutel); return heel; }
      return open + esc(v) + sluit;
    });

  html = html.replace(/<[a-z][a-z0-9]*\b[^>]*\bdata-i18n-attr="([^"]+)"[^>]*>/g, (tag, lijst) => {
    n.attr++;
    for (const paar of lijst.split(',')) {
      const [attr, sleutel] = paar.split(':').map(x => x.trim());
      const v = T[sleutel];
      if (v === undefined) { mist.push(sleutel); continue; }
      const re = new RegExp('(\\s' + attr + '=")[^"]*(")');
      if (!re.test(tag)) { mist.push(sleutel + ' (geen ' + attr + '= op het element)'); continue; }
      tag = tag.replace(re, '$1' + esc(v) + '$2');
    }
    return tag;
  });

  const fout = [];
  const naam = { tekst: 'data-i18n', htm: 'data-i18n-html', attr: 'data-i18n-attr' };
  for (const soort of ['tekst', 'htm', 'attr']) {
    if (n[soort] !== verwacht[soort]) {
      fout.push(`${taal}: ${verwacht[soort]} keer ${naam[soort]} in de html, ${n[soort]} opgepakt`);
    }
  }
  if (mist.length) fout.push(`${taal}: geen vertaling voor ${[...new Set(mist)].join(', ')}`);
  if (fout.length) throw new Error('vertaalpoort:\n  ' + fout.join('\n  '));
  return html;
}

/* ---------- 2. adressen ----------
   In de conceptmap lagen alle bestanden naast elkaar, dus kon elk adres
   relatief: href="taarten.html", src="photos/x.webp". Dat kan niet meer. De
   pagina's staan nu op /taarten, /en/taarten en /ro/taarten, en een relatieve
   verwijzing vanaf /en/taarten gaat zoeken in /en/photos/. Dat is precies het
   soort fout dat op de startpagina niet te zien is en op elke andere pagina
   alles stuk maakt.

   Een regel, niet een lijst: elk href/src/data-groot dat niet met /, #, een
   protocol of een mailto begint wordt absoluut gemaakt. Eindigt het op .html,
   dan is het een pagina en gaat het naar het adres van die pagina IN DEZE TAAL
   - zo blijft een bezoeker in zijn eigen taal doorklikken. Anders is het een
   bestand en staat het op de wortel.

   Zo kan er geen adres buiten vallen als er morgen een link bij komt, en
   tools/vooraf.mjs loopt er daarna nog eens langs om te kijken of elk intern
   adres ook echt bestaat. */
const SLUGS = new Set(['index', 'prijzen', 'smaken', 'voorwaarden', ...PAGINAS.map(p => p.slug)]);

function adressen(html, taal) {
  const onbekend = [];
  html = html.replace(/\b(href|src|data-groot)="([^"]+)"/g, (heel, attr, doel) => {
    if (/^(\/|#|[a-z]+:|\/\/)/.test(doel)) return heel;
    if (!doel.endsWith('.html') && !doel.includes('.html#')) return `${attr}="/${doel}"`;
    const [pad, hash] = doel.split('#');
    const slug = pad.replace(/\.html$/, '');
    if (!SLUGS.has(slug)) { onbekend.push(doel); return heel; }
    return `${attr}="${adresVan(taal, slug)}${hash ? '#' + hash : ''}"`;
  });
  if (onbekend.length) throw new Error(`${taal}: link naar een pagina die niet bestaat: ${[...new Set(onbekend)].join(', ')}`);
  return html;
}

/* ---------- 3. de staart ----------
   galerij.js alleen op een pagina die een galerij heeft. Dat wordt afgelezen
   uit de body in plaats van per pagina bijgehouden: een lijst die je met de
   hand bijwerkt loopt achter, en het gevolg (fotos die niet groot opengaan) is
   stil.

   i18n.js is weg. Dat was het enige script dat echte inhoud aanraakte, en de
   huisregel in de root CLAUDE.md is dat geen bezoeker op JavaScript hoeft te
   wachten voor tekst. Nu staat alle tekst in de html en doen de twee scripts
   die over zijn alleen nog menu, lightbox en het versturen van het formulier. */
const staart = body => `
<script src="/site.js"></script>${body.includes('class="galerij"') ? '\n<script src="/galerij.js"></script>' : ''}
</body>
</html>
`;

/* ---------- de startpagina ----------
   bron/index.html draagt de blokken die alleen de startpagina heeft (de opener,
   de waarden, het assortiment, Over mij, het atelier en de fotostrook). Kop,
   voet, het aanvraagblok en de meelopende balk komen uit dit script, net als op
   elke andere pagina.

   Tot de verhuizing stonden die vier blokken in index.html EN hier, elk met hun
   eigen kopie van haar mailadres, haar telefoonnummer en het menu. Dat is al
   een keer misgegaan: index.html werd niet gebouwd, dus een wissel van het
   mailadres liet de startpagina op het oude adres staan. Nu zijn het markers. */
function vulIndex() {
  let html = readFileSync(new URL('./bron/index.html', import.meta.url), 'utf8');
  const nodig = ['<!--vc:kop-->', '<!--vc:aanvraag-->', '<!--vc:voet-->'];
  for (const m of nodig) {
    if (!html.includes(m)) throw new Error(`bron/index.html mist de marker ${m}`);
  }
  return '<body data-meta="index">\n'
    + html
      .replace('<!--vc:kop-->', kop(''))
      /* De startpagina heeft geen gelegenheid voorgekozen in het formulier: wie
         hier binnenkomt heeft nog niet gezegd wat voor feest het is. */
      .replace('<!--vc:aanvraag-->', aanvraag({ slug: 'index', titel: 'Velvet Cakes by Anka', gelegenheid: null }))
      .replace('<!--vc:voet-->', voet());
}

/* ---------- de pagina's ----------
   Elke pagina een keer in het Nederlands gebouwd, daarna drie keer
   uitgeschreven. De og-foto per pagina is de hero van die pagina; de
   startpagina, de prijzen, de smaken en de voorwaarden lenen de bruidstaart met
   bladgoud, want dat is de foto die haar werk het beste laat zien. */
const BLADEN = [
  { slug: 'index', body: vulIndex(), titel: META_TITEL_NL, desc: META_DESC_NL, og: 'bruid-ivoor-goud' },
  { slug: 'prijzen', body: prijspagina(), titel: 'Prijzen | Velvet Cakes by Anka', desc: 'Prijzen van Velvet Cakes by Anka: taarten per kilo, patisserie per stuk, cozonac per stuk en plateaus per kilo. Bergen op Zoom.', og: 'bruid-ivoor-goud' },
  { slug: 'smaken', body: smakenpagina(), titel: 'Smaken | Velvet Cakes by Anka', desc: `Taartsmaken van Velvet Cakes by Anka: ${AANTAL_SMAKEN} smaken, van chocolade en vanille tot pistache en framboos, Tiramisu en Kinder Bueno. Bergen op Zoom.`, og: 'bruid-ivoor-goud' },
  { slug: 'voorwaarden', body: voorwaardenpagina(), titel: `${VW_TITEL.nl} | Velvet Cakes by Anka`, desc: voorwaardenSleutels('nl')['vw.desc'], og: 'bruid-ivoor-goud' },
  ...PAGINAS.map(p => ({ slug: p.slug, body: pagina(p), titel: `${p.titel} | Velvet Cakes by Anka`, desc: p.meta, og: p.hero })),
];

function schrijf(pad, inhoud) {
  const doel = new URL('.' + pad, DIST);
  mkdirSync(new URL('.', doel), { recursive: true });
  writeFileSync(doel, inhoud);
}

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

let aantalPaginas = 0;
let aantalFormulieren = 0;
for (const blad of BLADEN) {
  for (const taal of TALEN) {
    let body = blad.body;
    body = zetTaalkiezer(body, taal, blad.slug);
    body = zetFormvelden(body, taal);
    body = vertaal(body, taal);
    body = adressen(body, taal);
    const html = hoofd(taal, blad.slug, blad.titel, blad.desc, blad.og) + body + staart(body);
    aantalFormulieren += (html.match(/<form\b/g) ?? []).length;
    schrijf(`${PREFIX[taal]}/${blad.slug}.html`, html);
    aantalPaginas++;
  }
}

/* De foutpagina. Alleen Nederlands en met noindex: het is geen pagina met
   inhoud maar een afslag terug naar de site, en hij komt op elk verkeerd adres
   in elke taal. De links wijzen naar het Nederlands omdat de taal van iemand
   die op een kapot adres landt niet te weten is - de taalkiezer staat er in de
   kop, zoals op elke pagina. */
function vierkantvier() {
  let body = `<body data-meta="404">
${kop('')}

<section class="hero hero-blad hero-prijzen">
  <div class="hero-tekst">
    <p class="bovenregel">Pagina niet gevonden</p>
    <h1>Deze pagina bestaat niet</h1>
    <p class="hero-lead">Het adres is verhuisd of er zit een typefout in. Hieronder staat alles wat Anka maakt.</p>
    <div class="hero-knoppen">
      <a class="knop knop-vol" href="index.html"><span>Naar de startpagina</span> <i>&rarr;</i></a>
      <a class="knop knop-lijn" href="prijzen.html"><span>Bekijk alle prijzen</span> <i>&rarr;</i></a>
    </div>
  </div>
</section>

<section class="verwant">
  <p class="bovenregel">Alles wat ze maakt</p>
  <div class="soorten">
${PAGINAS.map(a => `    <a class="soort" href="${a.slug}.html">
      <img src="photos/${a.tegel}.webp" alt="${esc(BIJ[a.tegel].nl)}" width="620" height="775" loading="lazy">
      <h3>${esc(a.titel)}</h3>
      <span class="meer"><span>Bekijk meer</span> <i>&rarr;</i></span>
    </a>`).join('\n')}
  </div>
</section>

${voet()}
`;
  body = zetTaalkiezer(body, 'nl', 'index');
  body = adressen(body, 'nl');
  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pagina niet gevonden | Velvet Cakes by Anka</title>
<meta name="robots" content="noindex">
<link rel="icon" type="image/png" sizes="64x64" href="/favicon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/photos/merk/monogram-cacao-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&family=Parisienne&family=Allura&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
</head>
` + body + staart(body);
}
schrijf('/404.html', vierkantvier());

/* ---------- sitemap ----------
   Elke pagina een regel, en in die regel de drie talen als xhtml:link. Dat is
   dezelfde hreflang-set als in de head, en dat is bewust dubbel: Google leest
   ze uit de sitemap ook als hij de pagina nog niet heeft opgehaald.

   De omgeleide adressen (.html, eclairs, choux, cupcakes) staan er niet in:
   dat zijn omleidingen en geen pagina's. De 404 ook niet. tools/vooraf.mjs
   zakt als de sitemap en de indexeerbare pagina's niet precies samenvallen. */
schrijf('/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${BLADEN.flatMap(b => TALEN.map(taal => `  <url>
    <loc>${volledig(taal, b.slug)}</loc>
${TALEN.map(t => `    <xhtml:link rel="alternate" hreflang="${t}" href="${volledig(t, b.slug)}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${volledig('nl', b.slug)}"/>
  </url>`)).join('\n')}
</urlset>
`);

schrijf('/robots.txt', PROD
  ? `User-agent: *\nAllow: /\n\nSitemap: ${ADRES}/sitemap.xml\n`
  /* In de conceptbouw hoort er niets te worden opgehaald. De noindex in de head
     doet het werk, maar een robots.txt die alles dichtzet scheelt de
     verwarring van een testadres dat in een logbestand opduikt. */
  : 'User-agent: *\nDisallow: /\n');

/* Twee kopregels die niets met deze site te maken hebben en op elke site
   horen: geen mime-sniffing, en een referrer die het pad niet meestuurt naar
   derden. De fonts van Google krijgen dus de hostnaam en niet welke pagina
   iemand las. _headers werkt op Workers Static Assets, niet alleen op Pages
   (nagemeten op rhklusservice.nl). In de conceptbouw gaat er een
   noindex-kopregel bij, zodat ook een foto buiten de index blijft. */
schrijf('/_headers', `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin${PROD ? '' : '\n  X-Robots-Tag: noindex'}
`);

/* De statische bestanden erbij: de 109 fotos, het merk, de stijl en de twee
   scripts. Ze staan in statisch/ en niet in dist/, want dist/ wordt bij elke
   bouw weggegooid - dat is wat een bouwmap een bouwmap maakt. */
cpSync(new URL('./statisch/', import.meta.url), DIST, { recursive: true });

/* ---------- poort: geen conceptresten in de productiebouw ----------
   De dingen die bij een verhuizing achterblijven en die je in een browser niet
   ziet. Een adres van het conceptdomein in een canonical stuurt Google terug
   naar een site die niemand meer onderhoudt; een noindex die blijft staan houdt
   de hele site uit de index; en een .html in een intern adres geeft elke klik
   een onnodige 301. */
const resten = [];
for (const blad of BLADEN) {
  for (const taal of TALEN) {
    const pad = `${PREFIX[taal]}/${blad.slug}.html`;
    const html = readFileSync(new URL('.' + pad, DIST), 'utf8');
    const zeg = t => resten.push(`${pad}: ${t}`);
    if (html.includes('klantenkraan.nl')) zeg('een adres van het conceptdomein');
    if (html.includes('jouwidealewebsite.nl')) zeg('een adres van ons eigen domein');
    if (PROD && /name="robots"[^>]*noindex/.test(html)) zeg('noindex in de productiebouw');
    if (!PROD && !/name="robots"[^>]*noindex/.test(html)) zeg('geen noindex in de conceptbouw');
    for (const m of html.matchAll(/(?:href|src)="(\/[^"]*\.html)"/g)) zeg(`intern adres met .html erin: ${m[1]}`);
    if (/Conceptversie|conceptformulier|Conceptontwerp/i.test(html)) zeg('conceptwoorden in de tekst');
    if (html.includes('wa.me') && !html.includes(`wa.me/${WA_NUMMER}`)) zeg('een ander WhatsApp-nummer');
    if (!html.includes('data-i18n')) { /* goed: de sleutels mogen blijven staan, ze doen niets meer */ }
    /* De taal van het document moet de taal van de map zijn. Dit was de fout
       van de conceptsite: lang="nl" op alle dertig varianten. */
    if (!html.startsWith(`<!DOCTYPE html>\n<html lang="${taal}">`)) zeg(`geen lang="${taal}" op <html>`);
  }
}
/* Zevenentwintig formulieren: negen pagina's in drie talen, elk met precies
   een. Een getal en geen "er staat er wel een": raakt een formulier zijn blok
   kwijt (zoals de prijspagina die het aanvraagblok van een soortpagina leent),
   dan zakt dit en niet een bezoeker.

   De voorwaarden zijn de negende niet: daar staat bewust geen formulier en ook
   geen offerteknop. Een knop "offerte aanvragen" onder de annuleringsvoorwaarden
   leest als aanzetten tot bestellen terwijl iemand juist zit te lezen wat er
   gebeurt als hij afzegt. */
const ZONDER_FORMULIER = ['voorwaarden'];
const hoortFormulier = (BLADEN.length - ZONDER_FORMULIER.length) * TALEN.length;
if (aantalFormulieren !== hoortFormulier) {
  resten.push(`${aantalFormulieren} formulieren gebouwd, ${hoortFormulier} verwacht (een per pagina per taal, behalve ${ZONDER_FORMULIER.join(' en ')})`);
}
for (const slug of ZONDER_FORMULIER) {
  for (const taal of TALEN) {
    const html = readFileSync(new URL(`.${PREFIX[taal]}/${slug}.html`, DIST), 'utf8');
    if (html.includes('<form')) resten.push(`${PREFIX[taal]}/${slug}.html: hier hoort geen formulier te staan`);
  }
}
if (resten.length) {
  console.error(`\nDe bouw draagt ${resten.length} rest(en):`);
  resten.forEach(r => console.error('  ' + r));
  process.exit(1);
}

console.log(`\n${aantalPaginas} pagina's in dist/ (${TALEN.map(t => `${t}: ${BLADEN.length}`).join(', ')}) plus de 404`);
console.log(`${aantalFormulieren} formulieren, alle naar /api/forms/aanvraag`);
console.log(`sitemap.xml: ${aantalPaginas} adressen, elk met hreflang naar de andere twee`);
console.log(PROD ? 'productiebouw: indexeerbaar' : 'conceptbouw: noindex op alles');
