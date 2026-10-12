# SEO - stand bij livegang

Nulmeting van 12-10-2026, de dag dat de site van `marjon.jouwidealewebsite.nl`
naar **bewustgezondinjemond.nl** verhuisde. Bedoeld om over een paar maanden
tegenaan te houden: wat er toen stond, wat we hebben gedaan, en wat er nog open
staat.

## Wat er veranderd is

**De pagina's bestaan nu voor een crawler.** Dit is het grote punt. Op het
conceptadres was er één `index.html` met een lege `<div id="root">` en een
SPA-terugval op elk onbekend pad. Een browser vulde dat in; Googlebot rendert
javascript ook, maar in een tweede ronde die dagen tot weken later komt, en de
taalmodellen die tegenwoordig een deel van de vragen over iemand beantwoorden
doen het helemaal niet. Nu draagt elk adres zijn hele inhoud in de HTML:

| adres | woorden in de HTML |
| --- | --- |
| `/` | 1481 |
| `/aanpak/voeding` | 650 |
| `/privacy` | 1319 |

Gemeten op de live site met javascript uit.

**Eén adres per pagina.** De site stond op drie hosts tegelijk kunnen staan.
Nu wint `bewustgezondinjemond.nl`; `www` gaat er met een 301 op zonder het pad
te verliezen (zowel een regel op de zone als de Worker zelf), en
`marjon.jouwidealewebsite.nl` doet hetzelfde. Dat laatste adres blijft bestaan:
het staat bij Google en Marjon heeft het gedeeld, dus weghalen zou de waarde die
het al heeft weggooien in plaats van doorgeven.

**Geen zachte 404 meer.** Elk onbekend pad gaf de voorpagina terug met een 200.
Dat is een kopie van de voorpagina op oneindig veel adressen. Nu een echte 404
met een eigen pagina.

**De twaalf eerdere adressen van de pijlers** (`/aanpak/voeding-en-gifstoffen`
en elf andere, uit de tijd dat het acht losse onderwerpen waren) bestaan nog en
wijzen met hun canonical naar de opvolger. Ze staan niet in de sitemap.

**Het FAQPage-blok is eruit.** Er stonden vijf vragen met antwoorden als
schema.org-gegevens in de pagina, maar die vragen stonden nergens als tekst op
de site - alleen in de code. Google eist dat wat je als FAQPage opgeeft
woordelijk op diezelfde pagina staat, en structured data die niet overeenkomt
met de zichtbare inhoud is een van de redenen voor een handmatige maatregel.
Sinds augustus 2023 levert FAQ-markup voor vrijwel alle sites ook geen
rich result meer op, dus het stond er met risico en zonder opbrengst.
De vragen zelf staan bewaard in `scripts/kop.mjs`: het zijn goede vragen in haar
eigen woorden, en als ze als blok op de voorpagina komen mag het blok terug.

**Titels op lengte.** De oude titel van de voorpagina was 84 tekens en werd dus
halverwege afgekapt. De vijf pijlerpagina's heetten alleen "Voeding" of
"Zingeving"; daar zoekt niemand op. Nu dragen ze allemaal waar ze over gaan
(`Voeding en je mondgezondheid`), elk binnen de 65 tekens.

## Wat er bewaakt wordt

`pnpm ship` draait `scripts/audit-seo.mjs` en gaat niet door als:

- een pagina niet voorgerenderd is of onder de 250 woorden zakt
- twee pagina's dezelfde title, description of canonical dragen
- een canonical, og:url of verwijzing nog naar `marjon.jouwidealewebsite.nl` wijst
- een title boven de 65 tekens komt of een description buiten 110-165
- een pagina een FAQPage draagt met vragen die niet op die pagina staan
- de sitemap een adres noemt dat niet gebouwd is, of een gebouwd adres mist
- het formulier naar een ander adres post dan de Worker bedient

## Nog te doen, in volgorde van opbrengst

1. **Google Search Console.** Het nieuwe domein toevoegen en de sitemap
   indienen: `https://bewustgezondinjemond.nl/sitemap.xml`. Daarna in het oude
   property `marjon.jouwidealewebsite.nl` de **adreswijziging** doorgeven. Dat
   is de knop die Google vertelt dat dit dezelfde site is, en hij werkt alleen
   als allebei de adressen als property bestaan en de 301 staat (dat laatste is
   gedaan). Zonder die melding duurt het overdragen van de waarde van het oude
   adres maanden langer.
2. **Bing Webmaster Tools.** Zelfde twee stappen. Kost tien minuten en bedient
   ook ChatGPT, dat op Bing leunt.
3. **Google Analytics.** Het meet-ID (`G-...`) ontbreekt nog; `NUMMERS.ga4` in
   `src/cookies.ts` is leeg. Zolang dat zo is meet niemand iets en weten we over
   drie maanden niet of dit geholpen heeft. De Meta Pixel staat er wel in. Beide
   laden alleen na 'alles toestaan' in de cookiemelding.
4. **De teksten gaan nog over een praktijk.** Marjon doet sinds 10-10-2026 alleen
   online coaching, maar de site praat over patiënten, over behandelen en over
   een praktijk - in de lopende tekst, in de alt-teksten bij de foto's en in de
   schema.org-gegevens. Dat is een eigen ronde en raakt de hele site; bij de
   verhuizing is er met opzet geen woord aan veranderd. Het is wel het eerste
   dat iemand opvalt die via een zoekopdracht binnenkomt.
5. **Google Bedrijfsprofiel.** Niet gecontroleerd of er een profiel is. Voor
   iemand die op naam en op regio gevonden wil worden is dat meestal meer waard
   dan alles hierboven bij elkaar.
6. **Eén onderwerp, één pagina.** De pijlerpagina's `voeding` en `zingeving`
   hebben nog geen eigen blokken (`blokken: []` in `src/specialisaties.tsx`) en
   leunen op de intro. Daar is ruimte, en het zijn de pagina's die een vraag
   beantwoorden waar mensen echt op zoeken.
