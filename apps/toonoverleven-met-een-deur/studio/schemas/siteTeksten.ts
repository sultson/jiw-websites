import { defineField, defineType, type FieldDefinition } from 'sanity';

/**
 * Alle vaste teksten op de site, per pagina bij elkaar.
 *
 * Eén document, want het is één site. Wie hier iets leeg laat, krijgt de tekst
 * te zien waarmee de site gebouwd is: een veld dat nog niet is ingevuld kan de
 * pagina dus nooit leeg maken.
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

const kopEnTekst = (name: string, title: string, description?: string): FieldDefinition =>
  defineField({
    name,
    title,
    type: 'array',
    description,
    of: [
      {
        type: 'object',
        fields: [
          { name: 'kop', title: 'Kop', type: 'string' },
          { name: 'tekst', title: 'Tekst', type: 'text', rows: 3 },
        ],
        preview: { select: { title: 'kop', subtitle: 'tekst' } },
      },
    ],
  }) as FieldDefinition;

/** Een blok teksten van één stuk van de site. */
const blok = (name: string, title: string, group: string, fields: FieldDefinition[]) =>
  defineField({
    name,
    title,
    type: 'object',
    group,
    options: { collapsible: true, collapsed: false },
    fields,
  });

export const siteTeksten = defineType({
  name: 'siteTeksten',
  title: 'Teksten op de site',
  type: 'document',
  groups: [
    { name: 'home', title: 'Voorpagina', default: true },
    { name: 'over', title: 'Wie we zijn' },
    { name: 'meedoen', title: 'Meedoen' },
    { name: 'zakelijk', title: 'Verantwoording' },
    { name: 'contact', title: 'Contact' },
  ],
  fields: [
    blok('hero', 'Bovenaan de voorpagina', 'home', [
      regel('kicker', 'Regeltje erboven'),
      regel('titel', 'Kop', 'De eerste zin die iemand leest. Warm en uitnodigend, geen uitleg.'),
      alinea('lead', 'Tekst eronder', undefined, 3),
      regel('knop', 'Knop'),
      regel('knopTwee', 'Tweede knop'),
      regel('deurLabel', 'Tekst op de deur', 'Bijvoorbeeld: Doe de deur open.'),
      regel('deurOpenLabel', 'Tekst als de deur openstaat'),
    ]),
    blok('open', 'Wanneer de deur openstaat', 'home', [
      regel('titel', 'Kop'),
      alinea('tekst', 'Tekst', 'De regel waarin staat wanneer je zomaar kunt binnenlopen.', 3),
      kopEnTekst('punten', 'Korte feiten', 'Drie is genoeg. Meer wordt een rijtje in plaats van een antwoord.'),
    ]),
    blok('nieuwsBlok', 'Nieuws & Blog op de voorpagina', 'home', [
      regel('kicker', 'Regeltje erboven'),
      regel('titel', 'Kop'),
      alinea('lead', 'Tekst eronder', undefined, 2),
    ]),
    blok('agendaBlok', 'Agenda', 'home', [
      regel('kicker', 'Regeltje erboven'),
      regel('titel', 'Kop op de voorpagina'),
      alinea('lead', 'Tekst eronder op de voorpagina', undefined, 2),
      alinea(
        'paginaLead',
        'Tekst bovenaan de agendapagina',
        'Hoe iemand door de agenda loopt. Niet hetzelfde als de regel hierboven, anders staat dezelfde zin twee keer op de site.',
        3,
      ),
    ]),
    blok('welkom', 'Uitnodiging op de voorpagina', 'home', [
      regel('kicker', 'Regeltje erboven'),
      regel('titel', 'Kop'),
      alineas(),
      regel('knop', 'Knop'),
    ]),

    blok('wieWeZijn', 'Wie we zijn', 'over', [
      regel('kicker', 'Regeltje erboven'),
      regel('titel', 'Kop'),
      alinea('lead', 'Tekst eronder', undefined, 3),
      alineas(),
      defineField({
        name: 'voorWie',
        title: 'Voor wie het inloophuis er is',
        type: 'array',
        of: [{ type: 'string' }],
        description: 'Korte regels. Iemand moet zichzelf hierin kunnen herkennen.',
      }) as FieldDefinition,
    ]),
    blok('watWeDoen', 'Wat we doen', 'over', [
      regel('kicker', 'Regeltje erboven'),
      regel('titel', 'Kop'),
      alinea('lead', 'Tekst eronder', undefined, 3),
      defineField({
        name: 'items',
        title: 'De activiteiten',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              { name: 'kop', title: 'Naam', type: 'string' },
              { name: 'wanneer', title: 'Wanneer', type: 'string' },
              { name: 'tekst', title: 'Tekst', type: 'text', rows: 4 },
              {
                name: 'foto',
                title: 'Foto',
                type: 'image',
                options: { hotspot: true },
                description: 'Mag leeg blijven; dan blijft de foto staan die er nu is.',
              },
            ],
            preview: { select: { title: 'kop', subtitle: 'wanneer', media: 'foto' } },
          },
        ],
      }) as FieldDefinition,
      alinea('kosten', 'Wat het kost', undefined, 3),
    ]),
    blok('naam', 'Waarom we anders heten', 'over', [
      regel('kicker', 'Regeltje erboven'),
      regel('titel', 'Kop'),
      alineas(),
      alinea('slot', 'Regel in het gekleurde vlak', undefined, 2),
    ]),
    blok('jongeren', 'Het jongerenproject', 'over', [
      regel('kicker', 'Regeltje erboven'),
      regel('titel', 'Kop'),
      alinea('lead', 'Tekst eronder', undefined, 3),
      alineas(),
      regel('knop', 'Knop'),
    ]),

    blok('vrijwilliger', 'Vrijwilliger worden', 'meedoen', [
      regel('kicker', 'Regeltje erboven'),
      regel('titel', 'Kop'),
      alinea('lead', 'Tekst eronder', undefined, 3),
      defineField({
        name: 'rollen',
        title: 'Wat je kunt doen',
        type: 'array',
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
      regel('uitnodigingTitel', 'Kop van de uitnodiging'),
      alinea('uitnodiging', 'De uitnodiging', undefined, 3),
    ]),
    blok('steun', 'Steun ons', 'meedoen', [
      regel('kicker', 'Regeltje erboven'),
      regel('titel', 'Kop'),
      alinea('lead', 'Tekst eronder', undefined, 3),
      kopEnTekst('manieren', 'Manieren om te steunen'),
      alinea('anbi', 'Regel over de belastingaftrek', undefined, 3),
      regel('sponsorenTitel', 'Kop boven de sponsoren'),
      alinea('sponsorenTekst', 'Tekst boven de sponsoren', undefined, 2),
    ]),

    blok('verantwoording', 'Verantwoording', 'zakelijk', [
      regel('kicker', 'Regeltje erboven'),
      regel('titel', 'Kop'),
      alinea('lead', 'Tekst eronder', undefined, 3),
      alinea('doel', 'Wat de stichting wil bereiken', undefined, 6),
      alinea('beloning', 'Beloningsbeleid', undefined, 5),
      defineField({
        name: 'bestuur',
        title: 'Bestuur',
        type: 'array',
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
      }) as FieldDefinition,
      defineField({
        name: 'advies',
        title: 'Raad van advies',
        type: 'array',
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
      }) as FieldDefinition,
    ]),

    blok('contact', 'Kom langs', 'contact', [
      regel('kicker', 'Regeltje erboven'),
      regel('titel', 'Kop'),
      alinea('lead', 'Tekst eronder', undefined, 3),
      regel('formulierTitel', 'Kop boven het formulier'),
      alinea('formulierTekst', 'Tekst boven het formulier', undefined, 3),
      alinea('openingstijden', 'Inloopmomenten', 'Elke regel hieronder komt onder elkaar te staan.', 3),
    ]),
  ],
  preview: { prepare: () => ({ title: 'Teksten op de site' }) },
});
