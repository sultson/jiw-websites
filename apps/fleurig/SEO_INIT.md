# SEO_INIT: Fleurig! Bloemenwinkel

Wat er moet gebeuren zodra `bloemenwinkelfleurig.nl` aan deze site wordt gekoppeld, en wat er daarna moet gebeuren om gevonden te worden.

**Stand van zaken: de koppeling is in de code al gemaakt.** `SITE_URL` staat op `https://bloemenwinkelfleurig.nl`, de drie `custom_domain` routes staan aan (het kale domein, `www`, en het oude adres dat blijft doorsturen), en de aanvragen gaan naar `fleurig26@gmail.com`. Wat er nog moet gebeuren staat in Deel 2: de afzender van de bevestigingsmail, en de deploy.

Het domein staat al bij Cloudflare (zone actief, nameservers `dean` en `lindsey.ns.cloudflare.com`, oorspronkelijk mijn.host) maar serveert nog niets: op het moment van schrijven staat er geen enkel DNS-record in. De A-records maakt Cloudflare zelf aan zodra de routes worden uitgerold; de mailrecords niet, en dat is de enige stap die echt op iets wacht.

Er is **geen echte migratie**: het oude adres is een demo-subdomein zonder geschiedenis, dus geen 301-ketens en geen posities om te verliezen. Wel betekent het dat het nieuwe domein op dag één bij nul begint.

---

## In één oogopslag

**Al gedaan, in de code**
- [x] `SITE_URL` op `https://bloemenwinkelfleurig.nl`
- [x] De drie `custom_domain` routes aan (kaal domein, www, en het oude adres dat blijft doorsturen)
- [x] Ontvanger op `fleurig26@gmail.com`

**Voor het uitrollen**
- [ ] **Afzenderdomein `notify.bloemenwinkelfleurig.nl` verifiëren in Cloudflare Email Service** *(2.1, zonder dit faalt elk formulier)*
- [ ] `apps/fleurig` in git zetten, anders laat de sitemap `lastmod` weg *(2.2)*

**Uitrollen**
- [ ] `pnpm --filter @jiw/fleurig ship` *(2.3)*
- [ ] Omleidingen, canonical, sitemap, robots en de 404 nalopen *(2.4)*
- [ ] Een echte aanvraag versturen en de bevestiging in Gmail én Outlook bekijken *(2.4)*
- [ ] Adreswijziging melden in Search Console, met een aantekening op die datum *(2.5)*
- [ ] DMARC-record op `_dmarc.bloemenwinkelfleurig.nl` *(2.1)*

**Daarna**
- [ ] **Google Bedrijfsprofiel: hoofdcategorie op `Bloemist` zetten (staat nu op `Winkel`)** *(Deel 4)*
- [ ] **Uitzoeken wat "Peet the Flowerman" op hetzelfde adres is** *(Deel 4)*
- [ ] Website-veld, openingstijden, diensten en foto's in het profiel *(Deel 4)*
- [ ] Google Maps-URL van het profiel toevoegen aan `sameAs` in `index.html` *(Deel 4)*
- [ ] Search Console: domeineigenschap, sitemap indienen, vijf adressen laten indexeren *(Deel 4)*
- [ ] Bing Webmaster Tools importeren uit Search Console *(Deel 4)*
- [ ] Apple Business, Bing Places en Facebook gelijktrekken op dezelfde NAP *(Deel 4)*
- [ ] Recensies vragen, per mail of WhatsApp, één tot twee dagen ná de bloemen *(Deel 4)*
- [ ] Afwijkende openingstijden rond de feestdagen een jaar vooruit invullen *(Deel 5)*

Wat je **niet** doet: geen llms.txt, geen extra schema om AI mee te overtuigen, geen seizoenspagina's, geen `AggregateRating` op eigen sterren, geen betaalde vermeldingenpakketten. Waarom staat in Deel 3, 4 en 5.

---

## Deel 1. Wat er al staat

Zodat duidelijk is wat je niet meer hoeft te doen.

| | |
|---|---|
| **Voorgerenderd** | Alle 7 pagina's gaan als complete HTML de deur uit (`scripts/prerender.mjs`). Een crawler die geen JavaScript draait, en dat geldt voor de meeste taalmodellen, ziet de hele pagina. |
| **Eén adres** | Canonical, `og:url`, sitemap en de omleiding van www komen alle uit `SITE_URL` in `site.config.mjs`. Eén regel omzetten verzet ze allemaal. |
| **Sitemap** | `/sitemap.xml`, opgebouwd uit de paginalijst, met `lastmod` uit de laatste commit die die pagina raakte. Weet het script het niet, dan laat hij de regel wég in plaats van de datum van vandaag te stempelen: Google gebruikt `lastmod` alleen als hij klopt. Geen `changefreq` en geen `priority`, want die negeert Google. |
| **robots.txt** | Eén groep: iedereen mag alles, taalmodellen inbegrepen. Hier stonden eerst twintig identieke groepen, één per crawler, en dat is een val: een crawler leest precies één groep, dus een latere wijziging in de `*`-groep zou aan Googlebot voorbijgaan. De bedankpagina staat er niet in: die draagt `noindex`, en een crawler die er niet mag komen leest dat nooit. |
| **Gegevens** | `Florist` met een vast `@id` en `WebSite` op de homepage; `Service` + `BreadcrumbList` per onderwerppagina, met de dienst die naar diezelfde winkel verwijst. NAP, geo, `areaServed` met 12 kernen, en openingstijden inclusief de drie dagen dat de deur dicht is (`00:00`-`00:00`, Googles eigen notatie: een dag zonder regel leest hij als onbekend, niet als gesloten). Geen `FAQPage`: dat rich result heeft Google in mei 2026 uit de resultaten gehaald. |
| **Deelplaatjes** | Per pagina een eigen `og-*.jpg` van 1200x630, met `og:image:width/height/alt`. |
| **Snelheid** | Stijlblad in de pagina, letters zelf gehost (geen Google Fonts), hero per pagina vooraf aangekondigd, alle foto's WebP, mapbox pas bij het scrollen. |
| **404** | Echte 404-status met een eigen pagina die doorverwijst, geen zachte 200. |
| **Bewaking** | `pnpm audit:seo` draait mee in `ship` en blokkeert een deploy bij een verkeerde canonical, een te lange title, een dubbele beschrijving, een pagina die uit de sitemap valt of een plaatje dat niet bestaat. |

Wat er **niet** is, en bewust niet: geen Turnstile op het formulier (verborgen veld doet het werk), geen cookiebanner (er staat geen tracking op de site), geen verzonnen beoordelingen in de gegevens.

---

## Deel 2. Live gaan

De code staat klaar. Wat er nu nog tussen zit is één ding met een wachttijd, en dan de deploy zelf.

### 2.1 De afzender van de bevestigingsmail

**Doe dit eerst.** Het formulier verstuurt vanaf `aanvraag@notify.bloemenwinkelfleurig.nl`. Dat adres werkt pas als het subdomein in Cloudflare Email Service is aangemeld en de bijbehorende DKIM- en SPF-records in de zone staan.

Op 14 augustus 2026 gaf een rechtstreekse bevraging van Cloudflares eigen nameservers (`dean.ns.cloudflare.com`) **geen enkel record** terug voor `bloemenwinkelfleurig.nl` of `notify.bloemenwinkelfleurig.nl`: geen TXT, geen MX, geen DKIM op de gangbare selectors. Als dat nog zo is, faalt `env.LEAD_EMAIL.send()` en krijgt elke bezoeker een foutmelding in plaats van een verstuurde aanvraag.

Controleer het zo, zonder API-sleutel:

```bash
dig +short @dean.ns.cloudflare.com TXT notify.bloemenwinkelfleurig.nl
dig +short @dean.ns.cloudflare.com TXT cf2024-1._domainkey.notify.bloemenwinkelfleurig.nl
```

Komt daar niets uit: Cloudflare dashboard → account `aec64586d4d04a644f4f9b8225d7ca28` → **Email** → **Email Sending** → afzenderdomein `notify.bloemenwinkelfleurig.nl` toevoegen en de verificatie aflopen.

Moet de site eerder live dan de afzender klaar is, zet dan tijdelijk zowel `LEAD_SENDER` als `allowed_sender_addresses` in `wrangler.jsonc` op `offerte@notify.jouwidealewebsite.nl`. Dat adres is al geverifieerd; het formulier werkt dan meteen, alleen staat de afzender nog niet op het eigen domein.

**Zet er meteen een DMARC-record bij.** De aanvragen gaan naar een Gmail-adres, en Gmail is de strengste ontvanger. Cloudflare publiceert SPF en DKIM voor het afzenderdomein, maar geen DMARC. Een TXT-record op `_dmarc.bloemenwinkelfleurig.nl` met `v=DMARC1; p=none; rua=mailto:fleurig26@gmail.com` kost niets en helpt de bezorging.

### 2.2 De app in git

`scripts/seo.mjs` haalt de datum van de laatste wijziging uit `git log`. Zolang `apps/fleurig` niet is vastgelegd weet hij niets en laat hij `lastmod` weg. Dat is eerlijk, maar met de datum erbij is het een signaal in plaats van niets. Google gebruikt de waarde alleen "if it's consistently and verifiably accurate".

```bash
git add apps/fleurig && git commit -m "feat(fleurig): breng de site naar de monorepo"
```

### 2.3 Uitrollen

```bash
cd /Users/alfred/Projects/jiw-websites
set -a && source .env && set +a
pnpm --filter @jiw/fleurig ship
```

`ship` draait `build` → `audit:seo` → `wrangler deploy`. Struikelt de audit, dan gaat er niets de deur uit.

Het domein heeft nu nog geen DNS-records; die zet Cloudflare zelf klaar zodra de `custom_domain` routes worden aangemaakt. Reken op een paar minuten voordat het certificaat er is. In dat venster kan `https://bloemenwinkelfleurig.nl` even een certificaatfout geven, en heeft het logo in een bevestigingsmail nog geen bereikbaar adres. Beide lossen zichzelf op.

### 2.4 Nalopen, meteen na het uitrollen

```bash
# het kale domein moet 200 geven, de andere twee een enkele 301 daarnaartoe
for h in bloemenwinkelfleurig.nl www.bloemenwinkelfleurig.nl fleurig.jouwidealewebsite.nl; do
  curl -s -o /dev/null -m 15 -w "$h -> %{http_code} %{redirect_url}\n" "https://$h/boeketten/"
done

curl -s https://bloemenwinkelfleurig.nl/ | grep -o '<link rel="canonical"[^>]*>'
curl -s https://bloemenwinkelfleurig.nl/ | grep -c Molendijk          # moet > 0 zijn
curl -s -o /dev/null -w "robots %{http_code}\n"  https://bloemenwinkelfleurig.nl/robots.txt
curl -s -o /dev/null -w "sitemap %{http_code}\n" https://bloemenwinkelfleurig.nl/sitemap.xml
curl -s -o /dev/null -w "404 geeft %{http_code}\n" https://bloemenwinkelfleurig.nl/bestaat-niet
```

**En dan het formulier, met je eigen adres.** Dit is de enige test die er echt toe doet:

```bash
curl -X POST https://bloemenwinkelfleurig.nl/api/forms/aanvraag \
  -F "firstName=Test" -F "lastName=Aanvraag" -F "email=JOUW@ADRES.nl" \
  -F "soort=Boeket" -F "leveringId=ophalen" -F "wensen=Test" -F "bedrijf="
```

Verwacht `{"ok":true,...}`. Komt er `{"ok":false,"error":"server",...}`, dan is de afzender uit 2.1 nog niet klaar. Controleer daarna of de aanvraag in `fleurig26@gmail.com` staat en of de bevestiging bij jou aankwam, **in Gmail én in Outlook**, in de inbox en niet in spam, met het logo zichtbaar.

`fleurig.jouwidealewebsite.nl` blijft als route staan en stuurt door. Niet weghalen bij het opruimen: die omleiding bestaat alleen zolang de host aan de Worker hangt.

### 2.5 Adreswijziging melden

Het gereedschap in Search Console werkt op hostniveau en een subdomein is een geldige bron (Googles eigen voorbeeld is `m.example.com`). Er valt weinig door te geven, want het oude adres heeft nauwelijks geschiedenis, maar het verschuift de crawlaandacht naar het nieuwe domein en het is tien minuten. Let op de aanscherping van 17 juni 2026: dien hem in voor **alle varianten** van de oude naam. Vereist eigenaarschap van beide eigenschappen in hetzelfde Google-account, dus maak ze eerst allebei aan (Deel 4).

Zet meteen een **aantekening** op die datum in het Prestaties-rapport (rechtsklik op de grafiek). Over een half jaar wil je die markering hebben.

## Deel 3. AI-zoekmachines, wat wel en wat niet

Dit deel staat vooraan omdat er in 2026 het meeste onzin over verkocht wordt. De korte versie: er is één ding dat aantoonbaar werkt, en dat is al gedaan.

### Wat aantoonbaar werkt: de pagina moet leesbaar zijn zonder JavaScript

Vercel en MERJ hebben de logboeken van de grote AI-crawlers geanalyseerd en kwamen tot één zin die alles bepaalt: *"None of the major AI crawlers currently render JavaScript."* Dat geldt voor GPTBot, ClaudeBot, PerplexityBot, Meta en ByteDance. Alleen Gemini (via Googlebot) en AppleBot voeren wel JavaScript uit.

Een onafhankelijke test van searchVIU (oktober 2025) kwam op hetzelfde uit: bij een directe fetch haalde Claude 0 van de 8 gegevens uit een pagina die JavaScript nodig had.

Daarom staat er in `scripts/prerender.mjs` een stap die elke pagina als complete HTML wegschrijft. Een site die zijn tekst pas na het draaien van React laat zien, is voor de helft van deze crawlers een lege pagina. **Dit is de enige technische maatregel in dit hele document waarvan het effect gemeten is.** Hij is gedaan, en `pnpm audit:seo` bewaakt dat hij gedaan blijft.

- https://vercel.com/blog/the-rise-of-the-ai-crawler
- https://www.searchviu.com/en/schema-markup-and-ai-in-2025-what-chatgpt-claude-perplexity-gemini-really-see/

Kanttekening die erbij hoort: dat onderzoek is van december 2024 en niemand heeft het in 2026 opnieuw gedaan. Het is het beste bewijs dat er is, niet het nieuwste.

### Geen llms.txt

Er wordt geld gevraagd voor het aanmaken van een `llms.txt`. Niet doen.

- Ahrefs onderzocht 137.210 domeinen (mei 2026): 28% had het bestand, en **97% daarvan kreeg nul verzoeken**. Van de verzoeken die er wel waren, kwam 1,1% van AI-zoekbots en 21,7% van SEO-controletools. AI-bots zoeken er nooit uit zichzelf naar. Ahrefs' eigen conclusie: *"largely decoration"*.
- Otterly.ai haalde de llms.txt-controle uit hun eigen betaalde product nadat bleek dat 84 van 62.100 AI-bot-verzoeken het bestand raakten (0,1%), tegen gemiddeld 265 per gewone pagina.
- Google schrijft het letterlijk op: *"Doing so will neither harm nor help your site's visibility or rankings in Google Search, as Google Search ignores them."*
- Geen enkele AI-leverancier heeft ooit gedocumenteerd dat zijn crawler het bestand van dérden leest. Dat OpenAI en Anthropic er zelf een publiceren voor hun ontwikkelaarsdocumentatie is iets anders, en dat is precies waar de verwarring vandaan komt.

De enige groep die het aantoonbaar gebruikt, zijn programmeerassistenten die documentatie van softwarebibliotheken lezen. Een bloemenwinkel heeft die niet.

- https://ahrefs.com/blog/llmstxt-study/
- https://otterly.ai/blog/the-llms-txt-experiment/
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide#mythbusting

Uitzondering: draait het platform het gratis en automatisch mee (Wix, Yoast), laat het dan staan. Het kost niets en Google noemt het neutraal. Hier bouwen we het niet.

### Schema.org helpt, maar niet waarvoor het verkocht wordt

Ahrefs volgde 1.885 pagina's die tussen augustus 2025 en maart 2026 JSON-LD toevoegden, elk vergeleken met drie controlepagina's op andere domeinen met hetzelfde citatieniveau vooraf. Uitkomst: AI Overviews **−4,6%**, AI Mode +2,4%, ChatGPT +2,2%. De twee positieve getallen zijn ruis, de negatieve is klein maar significant. Toevoegen van schema doet niets voor citaties in AI-antwoorden.

In hetzelfde onderzoek: over 6 miljoen adressen hadden pagina's die wél geciteerd werden ongeveer 3x zo vaak schema. Dat is het klassieke verschil tussen samenhang en oorzaak: schema is een teken van een goed onderhouden site, niet de reden dat hij geciteerd wordt.

Google zegt hetzelfde: *"There's also no special schema.org structured data that you need to add"* om in AI Overviews of AI Mode te verschijnen.

**Waarom staat het er dan toch op deze site?** Omdat schema wel degelijk werkt voor twee dingen die niets met AI te maken hebben:

1. **Rich results in de gewone zoekresultaten** (kruimelpad, openingstijden, veelgestelde vragen).
2. **De lokale kennisgraaf van Google.** `LocalBusiness`/`Florist` met NAP, openingstijden en `geo` is een van de manieren waarop Google de site aan het bedrijf koppelt. Dat is een echte lokale factor.

Wat het niet doet, is een AI ervan overtuigen dat deze winkel de beste is. Verkoop dat niet, en betaal er niet voor.

- https://ahrefs.com/blog/schema-ai-citations/
- https://developers.google.com/search/docs/appearance/ai-features

### Waar lokale AI-antwoorden hun bronnen halen

Bij een vraag als "beste bloemist in Oud-Beijerland" citeren AI-antwoorden overwegend **derden**, niet de site van de winkel zelf: recensieplatforms en gidsen. Whitespark onderzocht 153 lokale zoekopdrachten in 17 categorieën en vond Facebook als meest voorkomende bron, daarna Yelp, daarna TripAdvisor.

Dat betekent iets ongemakkelijks maar belangrijks: **voor "beste bloemist"-vragen doet Deel 4 hieronder meer dan wat er ook op deze site verandert.** De site moet kloppen; de vermeldingen elders bepalen of de winkel genoemd wordt.

Wees hier eerlijk over in de verwachtingen: BrightLocal mat dat 45% van de Amerikaanse consumenten in het afgelopen jaar een AI om een bedrijfsaanbeveling vroeg (was 6% een jaar eerder), maar ook dat 88% de bronnen daarna nakijkt. En de meeste ChatGPT-antwoorden citeren nog steeds helemaal niets: het aandeel antwoorden mét bronvermelding groeide van 1,6% naar 6,8%.

- https://whitespark.ca/blog/want-to-rank-in-chatgpt-focus-on-these-review-sites-new-research/
- https://www.brightlocal.com/research/lcrs-ai-trust/

### robots.txt, en welke bot je écht niet moet blokkeren

`robots.txt` bestaat hier uit één groep: `User-agent: *`, `Allow: /`. Iedereen mag binnen, taalmodellen inbegrepen. Een crawler heeft geen eigen regel nodig om te mogen, alleen om geweigerd te worden.

Wil de winkel ooit wél iets buiten de deur houden, dan is dit het onderscheid dat telt, en waar bijna iedereen op misgaat:

| Bot | Waarvoor | Blokkeren betekent |
|---|---|---|
| `GPTBot` | trainingsdata van OpenAI | **niet** uit ChatGPT-antwoorden |
| `OAI-SearchBot` | het zoekgedeelte van ChatGPT | **wel** uit ChatGPT-antwoorden |
| `ClaudeBot` | trainingsdata | niet uit Claude-antwoorden |
| `Claude-SearchBot` | het zoekgedeelte | wel uit Claude-antwoorden |
| `PerplexityBot` | zoeken (niet trainen) | wel uit Perplexity |
| `Google-Extended` | Gemini-training | **niets** voor gewone zoekresultaten |
| `Googlebot` | alles van Google | uit Google, inclusief AI Overviews |

Dus: wie zijn teksten uit trainingsdata wil houden blokkeert `GPTBot` en `CCBot` en blijft gewoon in ChatGPT-antwoorden staan. Wie `OAI-SearchBot` blokkeert, verdwijnt eruit. Voor een bloemenwinkel weegt gevonden worden zwaarder dan allebei; daarom staat alles open.

### Eén portefeuillebrede waarschuwing, met een datum

Bij het nakijken van de andere JIW-domeinen bleek dat **`smoothbylau.nl` en `adriaantotaalonderhoud.nl` op dit moment GPTBot, OAI-SearchBot, ClaudeBot en PerplexityBot met een 403 wegsturen** (Googlebot komt er wel in). Fleurig, doelio.nl en het huidige fleurig-subdomein zijn schoon. Dat komt vrijwel zeker van Cloudflares "Block AI bots"-schakelaar op die zones.

Dat is nu al ongewenst, en het wordt erger: Cloudflare heeft aangekondigd dat **vanaf 15 september 2026** crawlers die zoeken en trainen combineren óók geblokkeerd worden door elke instelling die AI-training blokkeert, **inclusief de oude "Block AI bots"-optie**. Cloudflare noemt daarbij Googlebot, Applebot en BingBot met naam.

**Loop vóór 15 september 2026 alle JIW-zones langs.** De snelste controle is een curl per zone met een nagebootste user-agent:

```bash
for ua in GPTBot OAI-SearchBot ClaudeBot PerplexityBot Googlebot; do
  printf "%-16s " "$ua"
  curl -s -o /dev/null -m 10 -w "%{http_code}\n" -A "Mozilla/5.0 (compatible; $ua/1.0)" https://EEN-ZONE.nl/
done
```

Alles wat geen 200 geeft, staat achter die schakelaar.

---

## Deel 4. Week 1: wat buiten de site gebeurt

Voor een winkel met een pand telt dit deel zwaarder dan alles wat er op de site staat. De site is de plek waar iemand uitkomt; de vermeldingen hieronder bepalen of hij er komt.

### Google Bedrijfsprofiel: het belangrijkste wat er is

Iemand die "bloemist Oud-Beijerland" zoekt, krijgt eerst een kaart met drie bedrijven en pas daaronder de gewone resultaten. In die kaart komt de site niet voor: daar staat het bedrijfsprofiel. Voor een fysieke winkel is dit de grootste enkele knop die er te draaien is.

### Eerst: de stand van zaken, opgezocht op 14 augustus 2026

Twee dingen die je op dag één moet oplossen, en die zwaarder wegen dan alles wat er verder in dit document staat.

**Het profiel bestaat, maar staat in de verkeerde categorie.** Er staat een profiel **"Fleurig!", Molendijk 9, 3262 AH Oud-Beijerland** (Place ID `ChIJb8RELr03xEcRcX_r6qGIZog`) met als **hoofdcategorie `Winkel`, niet `Bloemist`**, nul recensies, nul foto's en een leeg website-veld. Het komt niet voor bij een zoekopdracht op "bloemist Oud-Beijerland", en dat is precies wat je verwacht: **de hoofdcategorie is de nummer 1 rangschikkingsfactor voor de kaart.** Dit ene veld goedzetten is de grootste ingreep in het hele project.

Reken erop dat een categoriewijziging opnieuw geverifieerd moet worden ("If you add or edit an existing category, you might be asked to verify your business again"). Doe hem één keer, goed.

**Er staat een tweede profiel op hetzelfde adres.** **"Peet the Flowerman", Molendijk 9**, categorie `Bloemist`, 4,3 sterren, 29 recensies, 36 foto's, website peettheflowerman.nl. En `bloemenwinkel.net/oud-beijerland` noemt Molendijk 9/11 als "Flowerman Peet The". Of dat een voorganger is die op permanent gesloten moet, of een apart bestaand bedrijf, is niet van buitenaf vast te stellen: **zoek dat als eerste uit in het account.** Twee profielen op één adres bijten elkaar, en een verkeerde bedrijfsnaam op het juiste adres is erger dan geen vermelding, want assistenten die op adres zoeken vinden die als eerste.

1. **Claim en verifieer het profiel.** Verifieer nooit door een tweede aan te maken.
2. **Website invullen op het nieuwe domein.** Doe dit pas na Deel 2, niet ervoor.
3. **Categorieën.** Hoofdcategorie **`Bloemist`**. Let op: de standaardtip uit elke florist-SEO-gids, "voeg Wedding Florist en Funeral Florist toe als tweede categorie", **werkt niet, want die categorieën bestaan niet** in Googles lijst, niet in het Nederlands en niet in het Engels. Wat er wél is: `Bloemenbezorgbedrijf`, `Bloembinder`, `Droogbloemenwinkel`, `Cadeauwinkel`, `Huwelijksservice`. Kies alleen wat de winkel echt *is*, niet wat hij ook verkoopt; een categorie die niet klopt verwatert waar het profiel voor verschijnt. Rouw- en trouwwerk horen thuis bij **Diensten**, niet bij categorieën.
4. **Openingstijden**, en belangrijker: **de afwijkende openingstijden rond feestdagen**. Een profiel dat op tweede kerstdag "open" zegt terwijl de deur dicht is, levert een boze recensie op. Zet ze een jaar vooruit klaar.
5. **Diensten** invullen. Dit is na de categorie de grootste knop, en het is een van de weinige onderdelen met echt testbewijs achter zich: twee onafhankelijke tests (Sterling Sky, Whitespark) zagen posities bewegen binnen 24 tot 72 uur na het toevoegen van diensten, zonder dat er iets aan de site veranderde. Vul in: rouwbloemwerk, bruidsboeketten en corsages, bloemenabonnement, boeket op maat, bezorging Hoeksche Waard, cadeaubon. Biedt Google voorgedefinieerde diensten aan bij `Bloemist`, gebruik die dan eerst: die werken aantoonbaar sterker dan zelfgetypte.
6. **Foto's.** Dit is het onderdeel dat het meest verwaarloosd wordt en het meest zichtbaar is. De winkelpui, het interieur, echt werk uit de winkel. Blijf ze toevoegen; een profiel waar de laatste foto van 2023 is, ziet er verlaten uit.
7. **Berichten** (Posts): het seizoenswerk hoort hier, niet op de site. Zie Deel 5.

Neem de gegevens letterlijk over uit `site.config.mjs`, tot en met de schrijfwijze van "Molendijk 9-11". Verschilt het adres tussen het profiel, de site en de gidsen, dan kost dat vertrouwen bij precies het onderdeel waar het om draait.

Als het profiel er staat: zet de Google Maps-URL erbij in `sameAs` in de `Florist`-gegevens in `index.html`, naast Instagram en Facebook. Dat is de expliciete koppeling tussen de site en het profiel.

### Search Console en Bing

**Google Search Console.** Maak een **domeineigenschap** (`bloemenwinkelfleurig.nl`), niet een URL-prefix. Een domeineigenschap dekt http, https, www en elk subdomein in één keer; een prefix-eigenschap dekt maar één van die vier en dan mis je de helft van je eigen gegevens. Verifiëren gaat via een DNS-record, en de DNS staat al bij Cloudflare, dus dat is een minuut werk.

Daarna:
- Sitemap indienen: `sitemap.xml`.
- URL-inspectie op de homepage → "Indexering aanvragen". Doe dat voor alle vijf de adressen. Bij vijf pagina's is dat sneller dan wachten.
- Kijk in de inspectie welke canonical Google zelf koos. Wijkt die af van de jouwe, dan is er iets mis met de omleidingen uit Deel 2.

**Bing Webmaster Tools.** Aanmaken en importeren uit Search Console; dat scheelt de hele verificatie. Bing is klein in Nederland, maar het is tien minuten werk en het is de bron onder een deel van de assistenten.

**IndexNow.** Cloudflare heeft er een schakelaar voor in het dashboard (Caching → Configuration). Bij vijf pagina's die zelden veranderen is de winst klein, maar hij is gratis en zet zichzelf aan.

### Vermeldingen in Nederland

Wat telt is niet het aantal, maar dat naam, adres en telefoonnummer overal **exact** hetzelfde staan. Een handvol kloppende vermeldingen is meer waard dan dertig waar het huisnummer of het telefoonnummer uiteenloopt.

De vier die er werkelijk toe doen:

1. **Google Bedrijfsprofiel** (zie boven).
2. **Apple Business Connect.** Gratis, en het voedt Apple Maps en Siri. Op iPhone is dit de kaart die mensen gebruiken. Wordt bijna altijd overgeslagen.
3. **Bing Places.** Voedt Bing Maps, en volgens het enige onderzoek dat er over lokale AI-antwoorden is, ook een deel van wat ChatGPT teruggeeft.
4. **Facebook.** De winkel heeft al een pagina. Zorg dat adres, tijden en telefoonnummer daar kloppen. In datzelfde onderzoek was Facebook de meest voorkomende bron in lokale AI-antwoorden.

Daarnaast, in aflopende volgorde van nut: het KvK-register (moet toch kloppen), Openingstijden.nl, DeTelefoongids/Telefoonboek.nl, en een vermelding bij een plaatselijke ondernemersvereniging of het winkelgebied. Betaal niet voor "500 vermeldingen"-pakketten: dat levert bij een winkel als deze niets op dat de vier hierboven niet al doen.

### Recensies

Google-recensies zijn voor een lokale winkel het zwaarste signaal na het profiel zelf, en het enige onderdeel van dit document dat de winkel zelf moet doen.

- **Vraag het persoonlijk, aan de balie, aan mensen die net iets moois hebben meegenomen.** Google Bedrijfsprofiel geeft je een korte link om te delen. Een kaartje bij de kassa met die link werkt.
- **Beantwoord elke recensie**, ook de goede, ook de korte. Dat is zichtbaar voor de volgende lezer.
- **Nooit betalen of belonen** voor een recensie, en nooit alleen aan tevreden klanten vragen. Beide zijn in strijd met het beleid van Google en kunnen het profiel kosten.

En dit hoort er expliciet bij: **zet geen `AggregateRating` in de gegevens op de site.** Een bedrijf dat zijn eigen sterren in de code van zijn eigen site zet, komt daar niet mee in de zoekresultaten (Google noemt dat self-serving) en het risico is een handmatige maatregel. De sterren horen bij Google te staan, niet bij ons. Er staat op deze site met opzet geen enkel verzonnen cijfer.

---

## Deel 5. De bloemenkalender, en waarom er geen seizoenspagina's komen

Een bloemenwinkel heeft een paar dagen per jaar waarop bijna de hele omzet binnenkomt. De verleiding is om daar pagina's voor te maken: "Moederdag boeketten Oud-Beijerland", "Valentijn bloemen bezorgen". **Niet doen.** Vijf goede pagina's die het hele jaar kloppen verslaan twaalf dunne pagina's die elf maanden per jaar leegstaan, en Google behandelt dat tweede patroon als wat het is.

Waar het seizoen wél hoort: in **berichten op het Google Bedrijfsprofiel** en op **Instagram**. Die zijn ervoor gemaakt, ze verlopen vanzelf, en ze laten precies zien wat er die week in de emmers staat.

De kalender, met wat er in de week ervoor de deur uit moet:

| Wanneer | Wat | Voorbereiden |
|---|---|---|
| 14 februari | Valentijnsdag | Berichten vanaf ~1 februari. Afwijkende openingstijden controleren |
| Maart tot mei | Tulpen, narcissen, ranonkels | Het seizoenswerk waar de winkel zich mee onderscheidt |
| Pasen (wisselt) | Voorjaarswerk, tafelstukken | Openingstijden tweede paasdag in het profiel zetten |
| April | Secretaressedag | Zakelijk; past bij het abonnement voor de zaak |
| Tweede zondag van mei | **Moederdag** | De grootste dag van het jaar. Berichten vanaf eind april, bezorging vroeg dichtzetten |
| 4 mei | Dodenherdenking | Rouw- en herdenkingswerk |
| Mei tot september | Bruidsseizoen | De trouwbloemenpagina is dan de pagina die telt |
| Juni | Pioenen | Kort seizoen, goed beeldmateriaal, sterk op Instagram |
| Derde zondag van juni | Vaderdag | Kleiner dan Moederdag, wel het noemen waard |
| 1 en 2 november | Allerheiligen en Allerzielen | Grafwerk. De rouwbloemenpagina, ruim vooraf |
| December | Advent, kerststukken, zakelijk | Openingstijden rond de feestdagen: dit is het moment dat een fout profiel klanten kost |

**Waar de zoekwoorden nu al op landen.** De vijf pagina's dekken samen: bloemist en bloemenwinkel Oud-Beijerland, boeket bestellen en op maat, bloemenabonnement (particulier én zakelijk, een hoek waar weinig winkels op schrijven), rouwbloemen en rouwboeket, trouwbloemen en bruidsboeket, plus bezorgen in de Hoeksche Waard. Dat is voor een winkel van deze omvang een dekkende set. Er hoeft niets bij.

**Als er ooit één pagina bij komt**, laat het dan het abonnement voor de zaak zijn: kantoren en wachtkamers in de Hoeksche Waard zoeken daar op, het is herhaalomzet in plaats van eenmalig, en er is nauwelijks concurrentie op die woorden. Dat is een echte pagina met een eigen doelgroep, geen seizoensvariant van iets dat er al staat.


---

## Deel 6. Het onderhoud van de site zelf

### Een pagina toevoegen

Op één plek aanmelden, de rest volgt.

1. `site.config.mjs` → een regel in `PAGINAS` (pad, bestand, component, prioriteit, frequentie, `inSitemap`).
2. Het HTML-bestand aanmaken met een eigen `<title>`, `description`, `canonical` (met `%SITE_URL%`), og-blok en JSON-LD.
3. De component in `src/pages/` en de entry ernaast, plus een regel in `src/entry-server.tsx`.
4. Een deelplaatje: voeg hem toe aan `DELEN` in `scripts/optimize-images.mjs` en draai `pnpm optimize-images`.

`pnpm build` bakt hem dan mee, zet hem in de sitemap en `pnpm audit:seo` controleert hem. Vergeet je stap 3, dan valt de build om met de naam van de pagina erbij.

### Wat de audit tegenhoudt

`pnpm audit:seo` blokkeert een deploy bij: een canonical die niet naar zichzelf wijst, `og:url` die daarvan afwijkt, een title boven 65 tekens, een beschrijving buiten 110 tot 165 tekens, twee pagina's met dezelfde title of beschrijving, een pagina die niet is voorgerenderd, een los stijlblad, een verwijzing naar een plaatje dat niet in de build zit, een `og:image` die geen deelplaatje is, een pagina die uit de sitemap valt of er juist in staat terwijl hij op noindex staat, gegevens die niet meer kloppen met `site.config.mjs`, en een ontbrekende 404 of maillogo.

Dat is met opzet streng. Deze fouten zijn alle onzichtbaar tijdens het klikken en kosten weken voordat je ze in de cijfers ziet.

### Foto's vervangen

Zet de nieuwe foto in `public/img` en draai `pnpm optimize-images`: JPEG's worden WebP van maximaal 1200 px, en de vijf deelplaatjes worden opnieuw uitgesneden op 1200 bij 630.

Vervang je een foto onder dezelfde naam, zet er dan `?v=JJJJMMDD` achter bij elke verwijzing (component, `og:image`, preload, schema.org), anders blijft de oude versie in de cache van Cloudflare en van de bezoeker staan. Zie CLAUDE.md.

Let op: opnieuw comprimeren van een foto die al WebP is maakt hem **groter**, niet kleiner. Bij de hero is dat gemeten: het origineel is 295 kB, opnieuw gecodeerd op kwaliteit 82 werd het 350 kB en zelfs op kwaliteit 68 nog 304 kB. Comprimeer alleen vanaf het origineel.

### De letters

`public/fonts` bevat twee variabele letterbestanden, gekopieerd uit node_modules door `pnpm fonts`. Werk je `@fontsource-variable/inter` of `-fraunces` bij, draai dat script dan opnieuw. De namen zijn vast, want er staat een preload op in elke pagina.

---

## Deel 7. Wat je gaat meten, en wanneer

Verwachtingen eerst: een nieuw domein zonder geschiedenis staat niet in week twee bovenaan. Wat je in de eerste maand ziet is of Google de site heeft **gevonden** en **begrepen**; of hij ook **gekozen** wordt, blijkt pas in maand drie tot zes.

| Wanneer | Waar je kijkt | Wat goed is |
|---|---|---|
| Dag 1 tot 3 | Search Console → Pagina-indexering | De vijf adressen staan op "Gecrawld" of "Geïndexeerd" |
| Week 1 | Search Console → URL-inspectie op de homepage | "URL staat op Google", canonical = het adres dat jij koos |
| Week 1 | Search Console → Verbeteringen | De `Florist`- en `BreadcrumbList`-gegevens worden herkend, zonder fouten |
| Week 2 | Zoek op `site:bloemenwinkelfleurig.nl` | Vijf resultaten, met de titles die jij schreef en niet door Google herschreven |
| Week 2 tot 4 | Search Console → Prestaties | Eerste vertoningen op "fleurig oud-beijerland" en "bloemist oud-beijerland" |
| Maand 1 | Google Business Profile → Prestaties | Routeaanvragen en telefoontjes; dat zijn de handelingen die geld opleveren, niet de weergaven |
| Maand 1 | Search Console → Core Web Vitals | Alle adressen groen. Zo niet, dan is er iets kapot, want de site is hier ruim onder de drempels gebouwd |
| Maand 3 | Prestaties, vergelijk met maand 1 | Groei in het aantal verschillende zoektermen, niet alleen in kliks |

Wat je **niet** moet meten, omdat het niets stuurt: de positie op één zoekwoord op één dag (dat verschilt per persoon en per plek), het aantal geïndexeerde pagina's (er zijn er vijf en dat blijft zo), en "AI-zichtbaarheid" uit een tool die er geld voor vraagt. Wat er in AI-antwoorden gebeurt, zie je in Search Console niet en in geen enkele tool betrouwbaar.

De enige twee getallen die er echt toe doen voor deze winkel: hoeveel mensen op **Route** drukken en hoeveel er **bellen**. Beide staan in Google Business Profile.
