# Controle tegen informatiepakket — 22 september 2026

**Vervolg:** de vastgestelde ontwerpgaten zijn hersteld en gepubliceerd. Zie [repair-verification.md](./repair-verification.md) voor de actuele controle per tekortkoming, de publicatieversie en de expliciete beperking dat geen formulieren opnieuw zijn verstuurd. Onderstaande eerdere controle blijft als historisch verslag bewaard.

**Herzien na ontwerpcontrole:** de eerdere conclusie dat de uitvoering volledig aan het informatiepakket voldeed, was onjuist. Zie [design-gap-audit.md](./design-gap-audit.md) voor de bevestigde ontbrekende inhoud, vormgeving en CMS-koppelingen. Onderstaande tabel beschrijft eerdere controles en is geen bewijs van volledige ontwerpconformiteit.

De site, het CMS en de gekoppelde inhoud zijn gedeeltelijk bijgewerkt volgens het informatiepakket. De laatste formulier- en privacybeslissingen zijn op 22 september bevestigd en verwerkt: ontvanger `info@toonoverleven.nl`, 90 dagen automatische bewaring van de technische kopie.

| Eis uit het informatiepakket | Gecontroleerde uitvoering | Bewijs |
| --- | --- | --- |
| v5a-vormgeving en vijf gelijkwaardige bezoekroutes | Vijf kolommen op breed scherm, één kolom mobiel; aangeleverde vormgeving en beelden | Browsercontrole op de gepubliceerde versie; screenshots van desktoproutes en mobiele route; `src/next/approved.css` en `site.css` |
| Terugkerende blokken | Gedeelde eerste-stap- en welkomtemplates; keuzeblokken op vier routes | `@firstSteps`, `@visit` en vier routebomen in `pages.json`; live CMS-vergelijking van alle teksten en links |
| Vier aanvullende pagina’s, niet in het menu | Alle vier eigen adressen bereikbaar vanaf de eerste vier homepage-ingangen; menu bevat Activiteiten, Kennis, Over Toon en Contact | Browsercontrole en `Header` in `Site.tsx`; vier aangeleverde HTML-documenten |
| Agenda aanvullen en routes aan agenda koppelen | Dertien eenmalige, bevestigde momenten; vijf oude voorbeeldreeksen gearchiveerd; routekaarten zoeken op vaste activiteit | `events.json`; live Sanity-controle op datum, tijden, vaste activiteit en volgeboektstatus; geen verzonnen datum voor onbekende volgende bijeenkomsten |
| Sonnet vervangen en Henk noemen | Volledige titel, veertien regels, strofen en auteursvermelding overgenomen | Vergelijking van alle niet-lege Word-paragrafen met `@poem`; dezelfde CMS-tekst geverifieerd; serverrendering op `/ik-heb-kanker` |
| RSIN behouden | 820209685 zichtbaar in organisatiegegevens | Serverrenderingstest en live organisatiepagina |
| SponsorKliks behouden | Aankopen-sectie en SponsorKliks-link blijven aanwezig | Serverrenderingstest en goedgekeurde steuntekst |
| Raad van Advies corrigeren | Bram Harmsma, Helma Lodders en Mike Kastrop; beide te verwijderen namen weg | Live Sanity-query en serverrenderingstest |
| Sponsors controleren en Café het Plein toevoegen | 21 sponsors; logo en voorgeschreven link voor Café het Plein | Vergelijking met live homepage; lokale logo-assets; live Sanity-referentie van Café het Plein |
| IPSO-beelden en video’s | Zes aangeleverde foto’s verwerkt; bronbestandsnamen en context in assetregistratie en CMS | `image-sources.json`, assetmigratie en live beeldreferenties |
| Video-/cookieprivacy | Lokale posters; geen videonetwerkverkeer vóór toestemming; nocookie-player na klik; sluiten en externe YouTube-link beschikbaar | Browsernetwerkcontrole op lokale én gepubliceerde versie; alle drie videoplaatsingen servergetest |
| Sociale media en nieuwsbrief | Twee gewone sociale knoppen; ruimte voor toekomstige nieuwsbriefinschrijving | Homepage-template en nieuwsbriefblok; geen ingebedde feeds of schijninschrijfformulier |
| Formulier aansluiten | Bestaande server-, opslag- en e-mailkoppeling; naam en e-mail; foutmelding of succes na serverantwoord | `@jiw/cloudflare-forms` en Workerconfiguratie; eerdere browsercontrole met onderschepte fout- en succesrespons, gevolgd door precies één echte inzending naar `hallo@jouwidealewebsite.nl`; HTTP 200, `form_accepted`, geen e-mailfouten; daarna ontvanger gewijzigd zonder verdere formulierproef |
| CMS en gekoppelde resources | 30 pagina-/onderdeeldocumenten, teksten, links, beelden, events, sponsors en bestuur | Alle lokale tekst- en linkregels exact vergeleken met live Sanity; elke verwachte afbeelding heeft een CMS-assetreferentie; backup vóór migratie |
| CMS-pagina’s behouden vaste opmaak | Bestaande tekst, afbeelding en link zijn bewerkbaar; geen misleidende toevoeg-/verwijderacties op vaste layoutposities | `sitePage`-schema; types gecontroleerd tegen geïnstalleerde Sanity-versie |
| Geen bouwersnotities op de site | Ontwerpformulieren en voorbeeldagenda vervangen; dummysonnet verwijderd | Actieve templates en serverrenderingstest; informatiepakketnotities alleen in ontwikkelaarsdocumentatie |
| Volledige privacyverklaring op feitelijke verwerking | Verwerking, Cloudflare-opslag, e-mail, video’s en contactrechten beschreven; technische kopie wordt automatisch na 90 dagen verwijderd | Cloudflare lifecycle-regel voor `toonoverleven/` ingesteld en teruggelezen; mailboxbewaring afzonderlijk beschreven |

De site en Studio zijn gepubliceerd op het bestaande conceptadres. De hoofdwebsite `toonoverleven.nl` is niet vervangen; het concept blijft niet-indexeerbaar. Oude conceptadressen verwijzen met 301 naar nieuwe bestemmingen. Ontbrekende pagina’s geven 404. De volledige inhoud is servergerenderd en de browsercontroles vonden geen hydratatiefouten.

De eenmalige echte formulierproef heeft referentie `2ec78d5c-f828-465f-b3f2-e11cdfee1a52`. Zowel de organisatiebestemming als het ingevulde e-mailadres was daarbij `hallo@jouwidealewebsite.nl`. De browser registreerde precies één formulieraanroep en toonde succes; de Worker registreerde `form_accepted` zonder exceptions of bevestigingsmailfout. Dit bevestigt acceptatie door de verzendkoppeling, niet onafhankelijke controle van de inbox. Na de omschakeling naar het klantadres zijn geen formulierproeven uitgevoerd.
