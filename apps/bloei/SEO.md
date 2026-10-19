# SEO - stand bij livegang

Nulmeting van 19-10-2026, de dag dat de site van `bloei-concept.jouwconcept.app`
naar **bloei-ouddorp.nl** verhuisde. Bedoeld om over een paar maanden tegenaan te
houden: wat er toen stond, wat we gedaan hebben, en wat er nog open staat.

## Het eigenaardige van deze site

De winkel heet op dit moment nog **Vershal Ouddorp** en gaat over een paar weken
verder als **Bloei!**. Dat is geen detail dat er bij komt, het is de hele
zoekopgave. Alles wat Google en de kaartendiensten over dit adres weten staat
onder de oude naam; alles wat deze site zegt staat onder de nieuwe. Wie daar niets
aan doet, zet een nieuw merk neer zonder één van de signalen die het bestaande
heeft opgebouwd.

Wat er daarom in staat:

- `alternateName: "Vershal Ouddorp"` in het `GardenStore`-blok op de home. Zonder
  dat kan Google twee winkels op hetzelfde adres lezen, en dan vechten die twee
  om dezelfde plek.
- Een regel bovenaan elke pagina ("Wij heten nu nog Vershal Ouddorp") met een link
  naar de uitleg.
- De uitleg zelf bij *Waar u ons vindt*, dat onder elke pagina staat.
- Een vraag bij *Veelgesteld*: "Heet deze winkel niet Vershal Ouddorp?"

Vijf vermeldingen van de oude naam op de home, allemaal in die rol. Zodra de naam
echt over is horen ze eruit; dat staat als los punt in `NOTITIES.md`.

## Eén adres per pagina

De site stond op één conceptadres dat een 200 gaf met een `robots.txt` die alles
toeliet. Vanaf nu:

| host | wat hij doet |
| --- | --- |
| `bloei-ouddorp.nl` | de canonieke, geeft 200 |
| `www.bloei-ouddorp.nl` | 301 naar de kale, pad en querystring behouden |
| `bloei-concept.jouwconcept.app` | 301 naar de kale, pad behouden |

De kale host wint omdat dit domein geen enkele geschiedenis had: geen A-record,
nooit een site. Er is dus geen www-verleden om te sparen zoals bij framemedia.

Het conceptadres blijft bestaan en blijft aan dezelfde Worker hangen. Het is
gedeeld in de groep en kan in de index staan; doorsturen geeft die waarde door,
loskoppelen gooit hem weg en levert een dood adres op.

De omleiding van `www` zit op twee plekken: een regel op de zone
(`http_request_dynamic_redirect`) en `ANDERE_HOSTS` in `worker/index.ts`. Dat is
geen dubbel werk maar een tweede slot - verdwijnt die zoneregel ooit bij het
opruimen van een andere site, dan degradeert dat naar dezelfde 301 in plaats van
naar twee hosts die allebei 200 geven.

## Voorgerenderd

Elk adres draagt zijn hele inhoud in de HTML. Gemeten op de live site met `curl`,
dus zonder browser en zonder javascript:

| adres | woorden in de HTML | JSON-LD |
| --- | --- | --- |
| `/` | 2645 | `GardenStore` + `WebSite` |
| `/assortiment/` | 1877 | `Service` + `BreadcrumbList` |
| `/kerst/` | 1691 | `Service` + `BreadcrumbList` |
| `/abonnement/` | 1768 | `Service` + `BreadcrumbList` |
| `/cadeau/` | 1798 | `Service` + `BreadcrumbList` |

React hydrateert daarna over die HTML heen; de tekst komt er niet uit javascript.
Dat is het verschil tussen gezien worden in de eerste ronde van Googlebot en in de
tweede, die dagen tot weken later komt - en de taalmodellen die tegenwoordig een
deel van de vragen over een winkel beantwoorden doen die tweede ronde helemaal
niet.

`scripts/prerender.mjs` bakt de zeven pagina's en controleert onderweg 25
beeldverwijzingen. `scripts/audit-seo.mjs` is de poort voor `ship`: title,
description, precies één gevulde `h1`, zelfwijzende canonical, og en twitter per
pagina, geen dubbele titels, en het `GardenStore`-blok met zeven dagen in het
rooster. Een poort die je kunt overslaan is geen poort, dus hij hangt in het
`ship`-script en niet in een losse opdracht.

## Geen zachte 404

`not_found_handling: "404-page"` en een echte 404-pagina met `noindex`. Een
onbekend pad gaf eerder geen 200 met de voorpagina, dus dat was hier nooit stuk -
het staat er omdat het de eerste plek is waar indexruimte weglekt.

`/bedankt/` staat ook op `noindex` en in geen van beide gevallen in de sitemap,
maar wel in `robots.txt` toegestaan: een crawler die er niet mag komen leest die
`noindex` nooit. Uitsluiten doe je met het een of het ander, nooit met allebei.

## Sitemap en robots

`scripts/seo.mjs` schrijft beide na elke build uit `PAGINAS` in
`site.config.mjs`, dus een nieuwe pagina wordt op één plek aangemeld. Vijf
adressen in de sitemap - de bedankpagina en de 404 horen er niet in.

`robots.txt` is één groep: `User-agent: *`, `Allow: /`, plus de sitemapregel. Niet
twintig groepen onder elkaar: een crawler volgt precies één groep, de meest
specifieke die op hem past, dus twintig kopieën lopen uit elkaar zonder dat het
opvalt. De taalmodellen hebben geen eigen regel nodig om te mogen, alleen om
geweigerd te worden.

## IndexNow

`pnpm indexnow` meldt de vijf adressen bij Bing, Yandex, Seznam en Naver. Op
19-10-2026 gedaan: 202 Accepted. Google doet hier niet aan mee, maar Bing is hier
geen bijzaak - die voedt ook de antwoorden van ChatGPT en Copilot, en dat is
precies waar de nieuwe naam moet landen zolang de oude nog overal staat.

De sleutel is `public/abd0a19c615a18e5b6f5bd8c898e86e0.txt`; de bestandsnaam is de
sleutel en de inhoud ook. Het script weigert te melden als dat bestand niet live
staat of als de sitemap een andere host noemt, want dan wordt de hele lijst
weggegooid zonder dat het aan het antwoord te zien is.

## Mail

Verstuurd vanaf `no-reply@notify.bloei-ouddorp.nl`, het eigen afzenderdomein, in
Cloudflare Email Service ingeschakeld met DKIM, SPF en DMARC op `p=reject`. Dat
stond tot de verhuizing op het gedeelde `notify.jouwidealewebsite.nl`: goed genoeg
voor een concept, maar dan komt de bevestiging van de winkel aan vanaf het domein
van het bureau.

De records hangen onder `cf-bounce.notify.bloei-ouddorp.nl` en
`_dmarc.notify.bloei-ouddorp.nl`, **niet** onder `notify.bloei-ouddorp.nl` zelf.
Een lookup op die laatste naam geeft niets terug en dat is geen bewijs dat er iets
mist.

De apex heeft zijn eigen Purelymail-records (MX, SPF, DKIM, DMARC) voor de mailbox
van de winkel. Dat staat hier los van en mag niet aangeraakt worden.

Aanvragen komen op `hallo@jouwidealewebsite.nl` binnen, niet bij de winkel: die
heeft geen mailadres doorgegeven. De bevestiging aan de klant draagt het logo en
de kleuren van Bloei! en geen contactadres, want een verzonnen adres laat iemand
antwoorden naar een postbus die niet bestaat - er staat een telefoonnummer en de
mail is te beantwoorden.

## Wat nog open staat

1. **Search Console.** Het domein is niet geverifieerd en de sitemap is niet
   ingediend. Dat vraagt een Google-account dat wij hier niet kunnen aanmelden;
   het is de enige manier om te zien wat Google werkelijk van de verhuizing
   maakt. Verificatie kan via een TXT-record op de zone, dat kan hier wel.
2. **Google Bedrijfsprofiel.** Hier zit de grootste winst en die ligt niet in de
   site. Het profiel staat onder Vershal Ouddorp; daar hoort de naam om te gaan
   en `bloei-ouddorp.nl` als website in te staan. Een winkel in Ouddorp wordt via
   de kaart gevonden, niet via tien blauwe links.
3. **De naamswijziging zelf.** Zodra de winkel echt Bloei! heet gaan de vier
   plekken met de disclaimer eruit en blijft `alternateName` staan - dat laatste
   nog een jaar, want zo lang blijven mensen op de oude naam zoeken.
4. **Geen kerstfoto's.** De winkel heeft er geen aangeleverd, dus de kerstpagina
   staat er als kleur en vorm en haar `og:image` (1200x630, zoals elke pagina er
   een heeft) is een afbeelding van ons eigen ontwerp en niet van hun
   kerstafdeling. Dat is een bewuste keuze - geen stockfoto van andermans
   kerstbomen - maar het scheelt wel in wat iemand doorstuurt. November is de
   maand waarin dat geld kost.
5. **Mailadres van de winkel.** Zolang dat er niet is loopt elke aanvraag via ons
   en staat er geen `contactEmail` in de bevestigingsmail.
