# Toon over Leven — goedgekeurde herziening september 2026

De vormgeving en teksten zijn overgenomen uit `Toon-over-Leven-ontwerp-v5a.zip` (20 september), met de vier vervangende bezoekroutes uit `Toon-over-Leven-alleen-vier-paginas.zip` (21 september). `Toon-over-Leven-instructies.md` bevat de leidende correcties tot 22 september. De oorspronkelijke bestanden staan in het door de opdrachtgever aangeleverde informatiepakket.

## Inhoud en beheer

- `src/next/pages.json` bevat de goedgekeurde pagina’s als elementenboom, met bewerkbare tekstfragmenten, links en afbeeldingen. Er wordt geen JavaScript of HTML uit het CMS uitgevoerd. De opmaak blijft vast; redacteuren bewerken de inhoud via **Pagina’s en vaste onderdelen**.
- De eerste vier homepage-ingangen leiden naar `/ik-heb-kanker`, `/na-de-behandeling`, `/jong-en-kanker` en `/voor-naasten`. Ze staan niet in het hoofdmenu. De vijfde blijft de bestaande route naar contact of een activiteit.
- Het welkom, de eerste stap, de voettekst en het sonnet zijn afzonderlijke gedeelde CMS-documenten. Het sonnet is letterlijk overgenomen uit `Toon Over Leven21-09.docx`, inclusief strofen en de vermelding **Henk**.
- Inlooptijden en adres worden beheerd bij **Praktische gegevens en bestuur** en werken door op Praktisch en in het welkomstblok. Bestuur en Raad van Advies komen uit hetzelfde document. RSIN **820209685** en SponsorKliks blijven behouden.
- CMS-pagina’s hebben een eigen voorbeeldtabblad; wijzigingen verschijnen zonder nieuwe build. De bestaande nieuwsberichten en bezoekersverhalen zijn bewaard. Verhalen zijn in de nieuwe goedgekeurde navigatie niet als zelfstandige rubriek opgenomen.

## Agenda

`src/next/events.json` bevat de 13 bevestigde agendamomenten uit `toon-over-leven-evenementen.md`. De vijf oude, fictieve herhaalreeksen zijn in Sanity gearchiveerd. Er zijn geen toekomstige datums voor meditatie, mandala, encaustic of journaling verzonnen. De bezoekroutes tonen de eerstvolgende bevestigde datum van hun vaste activiteit, of **Vraag naar een volgende datum**.

Een agendamoment kan meerdere categorieën hebben, een vaste activiteit, een volgeboekt-status en een eigen aanmeldadres of aanmeldlink. De complete beschrijving staat op `/activiteit/<slug>`; de algemene activiteitpagina toont de geplande momenten. Algemene activiteiten zijn niet gepresenteerd als exclusieve jongeren- of nabestaandengroepen.

Het sponsordiner is genormaliseerd naar **6 november 2026**. De live homepage bevestigt 2026; de programmatekst uit de agenda bevatte abusievelijk 2025. De live registratiebestemming is `https://acties.tegenkanker.nl/project/sponsordiner`.

## Beelden en sponsors

De webversies zijn beperkt tot maximaal 1600 pixels en gecomprimeerd naar WebP. `src/next/image-sources.json` bewaart de originele bestandsnamen en herkomst. De originele IPSO-bestandsnamen worden ook op de CMS-assets vastgelegd. IPSO-foto’s worden niet voorgesteld als foto’s van Toon zelf; de behouden sfeerbeelden tonen fictieve personen/locaties.

De sponsorlinks zijn vergeleken met de live homepage op 22 september. Café het Plein is toegevoegd met het door de opdrachtgever opgegeven logo en de live link naar Zeewolde Actueel. Vaillant Fonds is behouden uit het bestaande CMS en de goedgekeurde sponsorlijst.

## Privacy en formulieren

Video’s gebruiken lokale posters. Voor toestemming wordt geen YouTube-player, thumbnail of ander videobestand extern opgevraagd. Na een expliciete klik wordt de privacyvriendelijke player geladen; sluiten trekt de sessietoestemming in. Toestemming wordt niet onthouden. Facebook en Instagram blijven twee gewone knoppen. De nieuwsbrief heeft een rustige reservering zonder niet-werkend inschrijfformulier.

Het kennismakingsformulier vraagt alleen naam en e-mailadres en gebruikt de bestaande `@jiw/cloudflare-forms`-koppeling. Succes wordt alleen na een geslaagde serverrespons getoond. De configuratie verzendt naar `info@toonoverleven.nl`. Op 22 september is eerst precies één echte formulierinzending uitgevoerd met `hallo@jouwidealewebsite.nl` als ontvanger én aanvrager; notificatie en bevestiging zijn zonder serverfout verwerkt. Daarna is de ontvanger gewijzigd, zonder nieuwe formulierproef. Technische kopieën in Cloudflare R2 worden automatisch na 90 dagen verwijderd via de prefixregel `expire-toonoverleven-after-90-days` voor `toonoverleven/`. Andere bucketregels zijn behouden. E-mailberichten worden bewaard zolang nodig voor de afhandeling; deze mailboxen vallen niet onder de automatische R2-verwijdering. De huidige conceptdomain blijft niet-indexeerbaar; de bestaande hoofdsite wordt niet overgenomen.

## Migratie en controle

Vanaf de repositoryroot:

- `pnpm --filter @jiw/toonoverleven migrate:approved` — inventarisatie en lokale backup, zonder wijzigingen.
- `pnpm --filter @jiw/toonoverleven migrate:approved --apply` — ontbrekende documenten en assets toevoegen, voorbeeldreeksen archiveren en de Raad van Advies corrigeren. Bestaande nieuwsberichten en latere redactionele wijzigingen worden behouden. Backups staan in de genegeerde map `raw/cms-backups`.
- `pnpm --filter @jiw/toonoverleven check:approved` — serverrendering, links, lokale beelden, CMS-tekst, lege agenda, videoprivacy en expliciete inhoudelijke correcties.
- `pnpm --filter @jiw/toonoverleven lint` en `pnpm --filter @jiw/toonoverleven-studio lint`.
- `pnpm --filter @jiw/toonoverleven ship:dry-run` controleert de volledige site, Studio en Worker vóór uitrollen.

Oude siteadressen verwijzen permanent naar hun nieuwe bestemming. De server levert de volledige tekst vóór JavaScript; er zijn geen scroll-reveals of verborgen contentblokken. De nieuwe styling behoudt uitsluitend functionele interacties.


De aanvullende ontwerpcontrole en herstelde onderdelen staan in [repair-verification.md](./repair-verification.md). De oorspronkelijke gatenanalyse blijft bewaard in [design-gap-audit.md](./design-gap-audit.md).

Voor activiteiten met aanmelden verschijnt een eigen aanmeldpagina met de gekozen datum, tenzij in het CMS een expliciet e-mailadres of externe aanmeldpagina is opgegeven. Volgeboekte activiteiten bieden geen formulier. De server controleert het actuele agendamoment vóór verwerking; een ontvangstbevestiging is nog geen definitieve deelnamebevestiging. Er zijn bij dit herstel geen formulieren verstuurd.
