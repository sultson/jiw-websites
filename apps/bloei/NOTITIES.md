# Bloei! Ouddorp — wat klopt en wat nog niet

Concept, gebouwd 7 oktober 2026. Live op <https://bloei-concept.jouwconcept.app>.

De opdracht: de eigenaren van Fleurig! (Oud-Beijerland, `apps/fleurig`, inmiddels
`TIJDELIJK_GESLOTEN`) beginnen onder de naam Bloei! en waren tevreden over de site
van Fleurig!. Deze app is daar een kopie van, met één gevraagde wijziging: licht
groen in plaats van zwart, naar het logo toe.

## Dit moet langs de klant voordat er iets live gaat

Alles hieronder staat wél op de site, want een winkelpagina zonder adres, nummer
en openingstijden is niet te beoordelen. Niets ervan is door de eigenaren zelf
doorgegeven.

| Wat | Wat er nu staat | Waar het vandaan komt |
| --- | --- | --- |
| Adres | Hogepad 9, 3253 BH Ouddorp | Openbare vermelding van **Vershal Ouddorp** |
| Telefoon | 06 86 19 45 17 | Idem |
| Openingstijden | ma t/m vr 9:00-18:00, za 9:00-17:00, zo dicht | **Aanname.** Nergens te vinden |
| Coördinaten kaart | 51.81876, 3.93414 | Afgeleid van het adres hierboven |

**Er staat geen e-mailadres op de site.** Hier stond `info@bloei-ouddorp.nl`, en dat
was verzonnen: er staat er geen op hun Facebook en nergens anders openbaar. Op
verzoek van Armando is hij overal weg — uit de voet, uit het blok bij de
openingstijden, uit de contactregel bij het formulier, uit het schema.org-blok op
de homepage en uit de bevestigingsmail. Contact loopt nu via telefoon en WhatsApp,
en dat zijn de twee die wél bevestigd zijn. Geeft de winkel een adres door, dan is
het één regel in `site.config.mjs` (`WINKEL.email`) plus de plekken terugzetten.

Het verband tussen Bloei! en Vershal Ouddorp is een gevolgtrekking, geen
bevestigd feit: de Facebookpagina die is doorgestuurd staat op naam van "Vershal
ouddorp", en op de foto's staat naast de planten een saprek en een
`SMAAK BLOKJE`-vlag. Dat past bij een vershal. Maar niemand heeft gezegd dat
Bloei! op datzelfde adres zit.

De plaatsnamen in `STREEKKERNEN` (src/ui.tsx) zijn de kernen van
Goeree-Overflakkee, en staan er nadrukkelijk **niet** als bezorggebied. Of Bloei!
bezorgt en wat dat kost is onbekend, dus daar belooft de site niets over; het
formulier zegt bij "Bezorgen" alleen "in overleg".

Er staan ook **geen prijzen** op de site. Fleurig! had drie vaste bedragen bij
het abonnement (15/20/35 euro); van Bloei! is geen enkel bedrag bekend, dus het
budgetveld in het formulier is één vrij invulveld geworden.

## Het logo

Het logo staat vrijstaand op de site. Op 09-10 leverde Alfred het aan op fel
magenta, juist zodat die achtergrond eruit te sleutelen is; `raw/maak-logo.mjs`
doet dat en schrijft `public/img/logo-bloei.webp` (900 × 564, met alfakanaal) plus
een controleplaatje op hun eigen groen. Opnieuw maken: `node raw/maak-logo.mjs`.

Dat verving twee eerdere oplossingen. Het losse bestand dat er eerst lag was
358 × 252 px en daarmee te klein voor een balk op een scherm met hoge
pixeldichtheid; daarna stond er een stuk uit de foto van de gevel geknipt, en dat
bracht het groene bord als rechthoek mee. Die uitsnede is weg (de functie
`naambord` is uit `raw/maak-beelden.mjs` gehaald, `logobalk.webp` verwijderd).

Let op bij hoogtes: dit logo is 1,6 : 1, tegen 3 : 1 voor de oude uitsnede — het
blad steekt boven de letters uit en de vuurtoren staat eronder. Een balk die op de
oude verhouding gemaakt is snijdt de punt van het blad eraf. Vandaar dat de balk
bovenaan nu een hogere, zwevende kaart is.

Nog te vragen:

1. **Een vectorversie** (svg, ai of eps). Minder urgent dan het was — 900 px is
   genoeg voor elke plek waar het nu staat — maar voor drukwerk en voor een groot
   beeldmerk nog steeds het vragen waard.
2. **De letters zelf.** In het logo loopt het blad over de O en de E heen, waardoor
   er eerder `BLŒI!` dan `BLOEI!` staat. Op een gevel van tien meter afstand valt
   dat weg, op een scherm van 50 pixels hoog niet. Dat is iets om te melden voordat
   het op briefpapier en op een bestelbus staat.

## De foto's

23 foto's, allemaal van de winkel zelf, aangeleverd op 7 oktober. De bronbestanden
staan in `raw/`, de bewerkte in `public/img/`. Opnieuw maken:
`node raw/maak-beelden.mjs`.

**Wat ontbreekt: kerst.** Er is geen enkele kerstfoto. Kerst is volgens de
aantekeningen juist het seizoen waar de winkel het van moet hebben, dus het blok
op de homepage en de pagina `/kerst/` staan er wel, maar als tekst op hun eigen
groen. Bewust geen gekochte sfeerfoto van een andere kerstafdeling: die zet een
verwachting die de winkel daarna moet waarmaken. Zodra er foto's zijn kunnen ze
er zo in.

Ontbreekt verder: een foto van de eigenaren, en een foto van een boeket dat zij
zelf gemaakt hebben.

## Wat er van de aantekeningen in zit

De lijst die Armando doorgaf, punt voor punt:

- *abonnementen > opgemaakte plantenbakken bij restaurants/bedrijven > of vazen* →
  `/abonnement/` plus het blok op de homepage. Dit heette eerst "Zakelijk", omdat
  het iets anders is dan het bloemenabonnement van Fleurig!; de winkel wil de naam
  abonnement houden, dus heet het weer zo. Het adres is meeverhuisd, want een
  menu-item Abonnement dat naar `/zakelijk/` wijst is een halve hernoeming.
  `/zakelijk/` geeft een 301 naar het nieuwe adres (`VERHUISD` in
  `worker/index.ts`); die regel mag weg zodra dit een echte site is.
- *cadeaubonnen* en *cadeaupakketjes* → `/cadeau/`, allebei als eigen blok.
- *bloemen/planten/tuin en woon ass / binnen en buiten potten, mest stoffen;
  potgrond tuinaarde hydro korrels mest, houtsnippers* → `/assortiment/`, vier
  afdelingen plus een apart blok "Grond en mest".
- *gras zaden* → eerst één regel in datzelfde blok, op verzoek (07-10) opgewaardeerd
  naar een eigen blok `/assortiment/#zaden`. Op 08-10 ("ze hebben in het algemeen
  veel zaden") breed getrokken: zes tegels (gras, bloemen, groenten, kruiden,
  bollen en knollen, bijen- en vlindermengsels) met daaronder graszaad
  uitgesplitst naar doorzaaien, nieuw gazon, schaduw en speelgazon. Ook een
  eigen vraag "Hebben jullie zaden?" bij Veelgesteld.
  **Nog te bevestigen:** welke soorten en merken er werkelijk liggen. Dit zijn de
  gangbare groepen, niet hun voorraad. Kloppen bollen/knollen en de
  bijenmengsels niet, dan moeten die tegels eruit — die heb ik erbij gezet omdat
  een zadenwand die compleet is er anders half uitziet, niet omdat ze genoemd
  zijn. De tekst zegt nergens "wij hebben X op voorraad", alles staat in de vorm
  "zeg wat u wilt zaaien, dan zoeken we het erbij".
- *november/december > focus op kerst, groot op de website* → `/kerst/` plus een
  blok hoog op de homepage, boven de seizoenen en boven het abonnement.
- *bloemen assortiment is aan het groeien ... kan je niet vinden wat je zoekt laat
  het ons weten > boeketten zijn te bestellen* → staat op drie plekken, telkens
  waar iemand anders zou afhaken: in de strip bovenaan, in het blok "Bloemen" op
  de assortimentspagina, en in het formulier bij de keuze "Boeket".
- *fleurig aanhouden > achtergrond hele lichte tint groen > naar het logo toe* →
  zie hieronder.

## De kleuren

Alle kleuren komen uit het bord aan de gevel (gemeten, zie `src/index.css`):
bord `#425331`, letters `#e7e1c7`, blad licht `#86a85e`, blad donker `#162810`.

Fleurig! stond op bijna zwart (`#0d2a21`) met framboos. Die opzet is gebleven,
maar het zwart is weg:

- De hele pagina staat op `--color-cream` `#f1f6e8`, een echte lichte tint groen.
- De balk bovenaan, die bij Fleurig! bijna zwart was, staat nu ook op dat licht
  groen met donkergroene letters.
- Het framboosroze blijft, alleen op de hoofdknoppen. Het bord heeft die kleur
  niet, de tafels buiten wel, en de winkel was er tevreden over.

**Twee vlakken zijn nog donker, en dat is een keuze om voor te leggen:** het
aanvraagformulier en de voet. Zonder die twee loopt het formulier mee als vierde
lichtgroene vlak op rij en heeft de enige plek waar de bezoeker iets moet dóén
niets dat hem van de rest scheidt. Ze staan in het groen van hun eigen bord
(`#27351b`), niet in zwart. Wil de klant het overal licht, dan is dat
`tone="ink"` → `tone="wit"` op twee plekken.

Sinds 09-10 is de balk bovenaan de derde donkere plek: die stond op licht groen,
maar het logo staat er nu vrijstaand in en crème letters horen op donker. Hij
staat op `#3b4c2b`, het bord zelf.

## Revisieronde 9 oktober

Punten van Alfred, met wat er gebeurd is:

- *frosted glass op de kaarten in de hero* → de twee panelen staan op 78 %
  dekking met `backdrop-blur` plus `brightness` en `saturate` (constante `GLAS`
  in `App.tsx`). Die laatste twee doen het werk dat de oude 95 % deed: ze maken
  van wat er doorheen schijnt een lichte, kleurloze toon, zodat de foto zichtbaar
  blijft als vorm maar niet als contrast. Alleen op die twee panelen en op de
  balk bovenaan — `backdrop-filter` op tientallen kaarten tegelijk maakt het
  scrollen op een middenklasse-telefoon stroperig.
- *balk bovenaan als kaart, zachtere overgang naar de volgende sectie* → de balk
  is een zwevende kaart met afgeronde hoeken; de kopfoto loopt er nu onderdoor tot
  de bovenrand van het scherm. De overgang is een `kraag` op `Section`: het vlak
  eronder schuift met afgeronde bovenhoeken over het vlak erboven. Staat op drie
  naden waar donker of foto overgaat in licht (onder de hero, onder het kerstblok,
  onder het formulier).
- *"Kom gerust even rondkijken": kaarten veel te smal op desktop* → vijf kaarten
  op één rij gaven 200 px per kaart. Nu een raster van zes kolommen: boven drie
  kaarten van 2 kolommen (~350 px), onder twee van 3 (~535 px), met een liggender
  uitsnede op die twee zodat de onderste rij niet zwaarder weegt dan de bovenste.
- *kerst moet er ook als kerst uitzien* → `tone="kerst"` plus `kerst` op `Section`:
  een dieper groen (`#1b2d15`), een lichtsnoer langs de bovenrand (`.kerstsnoer`
  in `index.css`, een tegel van 300 px die zichzelf herhaalt), warm lamplicht dat
  daaronder het vlak in zakt, en vurentakken in plaats van het gewone blad
  (`Kerstgroen` in `ui.tsx`). Staat op het kerstblok op de homepage en op de
  onderste sectie van `/kerst/`. **Nog steeds geen kerstfoto's** — dit is kleur en
  vorm, het belooft nergens iets.
- *Facebook-logo is een camera* → was `Camera` uit lucide; staat nu op `Facebook`,
  op alle vier de plekken (voet, kerstblok, "Over ons", `/kerst/`).

## Techniek

Kopie van `apps/fleurig`, dus hetzelfde recept: Vite + React 19 + Tailwind v4,
elke pagina als kant-en-klare HTML gebakken (`scripts/prerender.mjs`), Worker met
`@jiw/cloudflare-forms` ervoor.

```
pnpm --filter @jiw/bloei dev      # :3065
pnpm --filter @jiw/bloei lint     # tsc, app + worker
pnpm --filter @jiw/bloei ship     # build + audit:seo + wrangler deploy
```

`scripts/audit-seo.mjs` controleert op `GardenStore` en niet op `Florist`: Bloei!
verkoopt bloemen, maar het zwaartepunt ligt bij planten, tuin en wonen.

**De ontvanger van het formulier staat op `hallo@jouwidealewebsite.nl`**, niet op
een adres van de klant (`LEAD_RECIPIENT` in `wrangler.jsonc`). Dit is een concept
en het e-mailadres van de winkel is niet bevestigd; een testaanvraag hoort niet in
de inbox van een klant te belanden.

Het conceptadres staat op `jouwconcept.app` en niet op `jouwidealewebsite.nl`:
die zone zit op de grens van 100 custom domains.

Wordt dit een echte site, dan:

1. `SITE_URL` in `site.config.mjs` naar het eigen domein.
2. In `wrangler.jsonc` de apex én de `www`-variant als `custom_domain` erbij.
3. Een zone-redirect van `www` naar de apex (301); een canonical alleen laat twee
   hosts 200 geven.
4. `bloei-concept.jouwconcept.app` in `ANDERE_HOSTS` (`worker/index.ts`), dan
   stuurt het conceptadres door in plaats van een tweede kopie te serveren.
5. Afzenderdomein `notify.<domein>` aanmelden bij Cloudflare Email Service, en
   `LEAD_RECIPIENT` op het echte adres van de winkel.
