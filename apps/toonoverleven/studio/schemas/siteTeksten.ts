import { defineField, defineType, type FieldDefinition } from 'sanity';

/**
 * De teksten die het bestuur zelf bijhoudt, per plek op de site bij elkaar.
 *
 * Eén document, want het is één site. En bewust klein: de koppen en alinea's
 * van de 72 vastgestelde pagina's staan in de site zelf, en wat hier staat
 * zijn de stukken die veranderen zonder dat er aan de site gewerkt wordt: de
 * praktische gegevens, wie er in het bestuur zit, welke rollen open staan en
 * de regel boven het formulier. Bij elk veld staat op welke pagina het
 * uitkomt.
 *
 * Hier stond eerder ook een tabblad Voorpagina, met de kop, de uitnodiging en
 * "wat we doen". Sinds de site de vastgestelde structuur volgt, komen die
 * teksten niet meer uit het beheer, en een veld dat nergens uitkomt is een
 * belofte die de site niet waarmaakt. Dus die velden zijn weg.
 *
 * Wie een tekstveld leeg laat, krijgt de tekst te zien waarmee de site gebouwd
 * is: een veld dat nog niet is ingevuld kan de pagina dus nooit leeg maken.
 * Een lijst is de uitzondering. Wie het bestuur leegmaakt, krijgt op de site
 * geen bestuur uit de code terug maar de regel dat het nog niet in het beheer
 * staat.
 */

const regel = (name: string, title: string, description?: string): FieldDefinition =>
  defineField({ name, title, type: 'string', description }) as FieldDefinition;

const alinea = (name: string, title: string, description?: string, rows = 4): FieldDefinition =>
  defineField({ name, title, type: 'text', rows, description }) as FieldDefinition;

const alineas = (name = 'alineas', title = 'Tekst', description?: string): FieldDefinition =>
  defineField({
    name,
    title,
    type: 'array',
    of: [{ type: 'text', rows: 4 }],
    description: description ?? 'Elke regel hieronder is een alinea op de site.',
  }) as FieldDefinition;

/** Een blok teksten van één stuk van de site. */
const blok = (
  name: string,
  title: string,
  group: string,
  description: string,
  fields: FieldDefinition[],
) =>
  defineField({
    name,
    title,
    type: 'object',
    group,
    description,
    options: { collapsible: true, collapsed: false },
    fields,
  });

/**
 * Eén onderwerp binnen de praktische gegevens. Die horen op één tabblad bij
 * elkaar, want wie een tijd bijstelt kijkt meestal meteen ook naar de kosten
 * en de vakanties.
 */
const onderdeel = (
  name: string,
  title: string,
  description: string,
  fields: FieldDefinition[],
): FieldDefinition =>
  defineField({
    name,
    title,
    type: 'object',
    description,
    options: { collapsible: true, collapsed: false },
    fields,
  }) as FieldDefinition;

const personen = (name: string, title: string, description: string): FieldDefinition =>
  defineField({
    name,
    title,
    type: 'array',
    description,
    of: [
      {
        type: 'object',
        fields: [
          { name: 'naam', title: 'Naam', type: 'string' },
          { name: 'rol', title: 'Rol', type: 'string' },
        ],
        preview: { select: { title: 'naam', subtitle: 'rol' } },
      },
    ],
  }) as FieldDefinition;

export const siteTeksten = defineType({
  name: 'siteTeksten',
  title: 'Teksten op de site',
  type: 'document',
  groups: [
    // Praktisch eerst: dat is wat het vaakst verandert.
    { name: 'praktisch', title: 'Praktisch', default: true },
    { name: 'over', title: 'Over ons' },
    { name: 'meedoen', title: 'Meedoen' },
    { name: 'contact', title: 'Contact' },
  ],
  fields: [
    blok(
      'praktisch',
      'Praktische gegevens',
      'praktisch',
      'Tijden, kosten, adres en bereikbaarheid. Deze regels staan op de pagina\'s onder Praktisch en op Voor verwijzers.',
      [
        onderdeel(
          'openingstijden',
          'Openingstijden',
          'Deze regels staan op Openingstijden en op Contact. Verander je ze hier, dan veranderen ze op allebei mee.',
          [
            regel('ochtend', 'De inloopochtend', 'Bijvoorbeeld: elke donderdag van 10:00 tot 12:00 uur.'),
            regel('avond', 'De inloopavond'),
            alinea(
              'afwijkingen',
              'Vakanties en tijdelijke wijzigingen',
              'Wanneer de deur dicht blijft. Zet een tijdelijke wijziging hier neer en haal hem er weer af zodra hij voorbij is.',
              3,
            ),
          ],
        ),
        onderdeel(
          'kosten',
          'Kosten',
          'Wat een bezoek kost. Staat op Kosten en bij de vragen over een bezoek. Wat één activiteit kost, vul je bij die activiteit zelf in.',
          [
            alinea('inloop', 'Wat de inloop en de wandelingen kosten', undefined, 2),
            alinea('activiteiten', 'Wat een workshop kost', undefined, 3),
            alinea(
              'drempel',
              'Als een bijdrage niet uitkomt',
              'De regel die duidelijk maakt dat geld niemand hoeft tegen te houden.',
              3,
            ),
          ],
        ),
        onderdeel(
          'locatie',
          'Locatie en bereikbaarheid',
          'Waar het huis staat en hoe je er komt. Staat op Locatie en bereikbaarheid, op Contact en bij de organisatiegegevens.',
          [
            alinea('adres', 'Adres', 'Elke regel hieronder komt onder elkaar te staan.', 2),
            alinea('route', 'Met de auto, de fiets of het openbaar vervoer', undefined, 3),
            alinea(
              'parkeren',
              'Parkeren',
              'Vul aan hoe het parkeren bij het huis werkt. Zolang dat er niet staat, leest een bezoeker dat hij het kan vragen.',
              3,
            ),
            alinea(
              'ingang',
              'Ingang en toegankelijkheid',
              'Schrijf hier alleen wat je zeker weet: welke ingang, hoeveel drempel, of er een toilet beneden is. Beloof niets wat je niet kunt waarmaken.',
              4,
            ),
            alinea('elders', 'Een activiteit op een andere plek', undefined, 3),
          ],
        ),
        onderdeel(
          'contact',
          'Bellen en mailen',
          'Wat er gebeurt nadat iemand belt of mailt. Staat op Contact. Het nummer en het mailadres zelf staan in de voettekst van de site.',
          [
            alinea('wieReageert', 'Wie er opneemt of terugschrijft', undefined, 2),
            alinea('watGebeurtEr', 'Wat iemand moet vertellen', undefined, 4),
            alinea(
              'reactietijd',
              'Hoe snel er antwoord komt',
              'Noem alleen een termijn die je waar kunt maken.',
              2,
            ),
          ],
        ),
        alinea(
          'verwijzers',
          'Voor verwijzers',
          'De alinea voor huisartsen, ziekenhuizen en het sociaal domein op de pagina Voor verwijzers.',
          5,
        ),
      ],
    ),

    blok(
      'naam',
      'Naam en organisatie',
      'over',
      'Waarom het huis anders heet. Staat op Wie wij zijn, onder de kop Naam en organisatie.',
      [alineas(), alinea('slot', 'Slotregel', 'De laatste alinea, na de uitleg.', 2)],
    ),
    blok(
      'verantwoording',
      'Bestuur en verantwoording',
      'over',
      'Wie erover gaat. Staat op Onze mensen en op Organisatie en verantwoording.',
      [
        personen('bestuur', 'Bestuur', 'Op Onze mensen en op Organisatie en verantwoording.'),
        personen('advies', 'Raad van advies', 'Op Organisatie en verantwoording.'),
        alinea('beloning', 'Beloningsbeleid', 'Op Organisatie en verantwoording, onder het bestuur.', 5),
      ],
    ),

    blok(
      'vrijwilliger',
      'Vrijwilliger worden',
      'meedoen',
      'Staat op de pagina Vrijwilliger worden.',
      [
        alinea('lead', 'Inleiding', 'De regel boven de rollen, onder de kop Wat kun je doen?', 3),
        defineField({
          name: 'rollen',
          title: 'Wat je kunt doen',
          type: 'array',
          description: 'Eén kaart per rol.',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'kop', title: 'Naam', type: 'string' },
                { name: 'tekst', title: 'Tekst', type: 'text', rows: 4 },
                { name: 'punten', title: 'Wat je doet', type: 'array', of: [{ type: 'string' }] },
                { name: 'slot', title: 'Slotregel', type: 'text', rows: 3 },
              ],
              preview: { select: { title: 'kop', subtitle: 'tekst' } },
            },
          ],
        }) as FieldDefinition,
        alinea('uitnodiging', 'De uitnodiging', 'Onderaan de pagina, onder de kop Interesse?', 3),
      ],
    ),
    blok(
      'steun',
      'Steun ons en Onze sponsors',
      'meedoen',
      'Staat op Steun ons en op de pagina met de logo\'s. De logo\'s zelf staan onder Sponsoren.',
      [
        alinea('anbi', 'Regel over de belastingaftrek', 'Onder het blok Eenmalig geven op Steun ons.', 3),
        regel('sponsorenTitel', 'Kop boven de sponsoren', 'Op Onze sponsors, en onderaan Steun ons.'),
        alinea('sponsorenTekst', 'Tekst boven de sponsoren', undefined, 2),
      ],
    ),

    blok(
      'contact',
      'Het formulier',
      'contact',
      'De kop en de regel boven het formulier, op Contact en onderaan Vrijwilliger worden.',
      [
        regel('formulierTitel', 'Kop boven het formulier'),
        alinea('formulierTekst', 'Tekst boven het formulier', undefined, 3),
      ],
    ),
  ],
  preview: { prepare: () => ({ title: 'Teksten op de site' }) },
});
