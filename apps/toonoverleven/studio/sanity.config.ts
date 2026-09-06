import { defineConfig } from 'sanity';
import { structureTool, type StructureBuilder } from 'sanity/structure';
import { nlNLLocale } from '@sanity/locale-nl-nl';
// Subpad-import: de barrel van @sanity/icons v5 exporteert de iconen niet op een
// manier die de bundler ziet, dus `from '@sanity/icons'` faalt met MISSING_EXPORT.
import { HomeIcon } from '@sanity/icons/Home';
import { CalendarIcon } from '@sanity/icons/Calendar';
import { ThListIcon as ListIcon } from '@sanity/icons/ThList';
import { EditIcon } from '@sanity/icons/Edit';
import { CommentIcon } from '@sanity/icons/Comment';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';
import { HeartIcon } from '@sanity/icons/Heart';
import { schemaTypes } from './schemas';
import Start from './tools/Start';
import SitePreview from './tools/SitePreview';
import AgendaPaneel from './tools/AgendaPaneel';

// Geen geheim: het project-id is openbaar en alleen-lezen, en het staat ook in
// wrangler.jsonc. Hardcoded zodat een verse checkout bouwt zonder .env.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'z4gex0g7';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

/**
 * Wat er in het beheer staat, in de volgorde waarin het gebruikt wordt: de
 * agenda bovenaan, want dat is het scherm waar ze wekelijks in zitten.
 *
 * De agenda was drie lijsten (wat er nog komt, alles, de mededelingen) en dat
 * is drie keer dezelfde inhoud met een ander filter. Nu is het een kalender:
 * de maand met alles erop, zoals de site hem uitrekent. De lijst eronder is er
 * voor zoeken en voor wat lang geleden was.
 */
const structure = (S: StructureBuilder) =>
  S.list()
    .title('Toon over Leven')
    .items([
      S.listItem()
        .title('Agenda')
        .id('agenda')
        .icon(CalendarIcon)
        .child(S.component(AgendaPaneel).id('agenda').title('Agenda')),
      // De lijst met dezelfde agendapunten. Hij is er om te zoeken en om iets
      // van lang geleden terug te vinden, en hij is tegelijk het adres waar
      // "open dit document" vanuit de kalender op uitkomt.
      S.listItem()
        .title('Alle agendapunten')
        .id('activiteit')
        .icon(ListIcon)
        .child(
          S.documentList()
            .title('Alle agendapunten')
            .schemaType('activiteit')
            .filter('_type == "activiteit"')
            .defaultOrdering([{ field: 'datum', direction: 'asc' }]),
        ),
      S.documentTypeListItem('nieuws').title('Nieuws & Blog').icon(EditIcon),
      // De verhalen onder Ervaringen. Ze stonden in het schema en op de site,
      // maar niet in dit menu, en een document dat je niet kunt terugvinden
      // kun je ook niet intrekken. Dat is precies waar dat schema om draait.
      S.documentTypeListItem('verhaal').title('Verhalen van bezoekers').icon(CommentIcon),
      S.divider(),
      S.listItem()
        .title('Teksten op de site')
        .id('siteTeksten')
        .icon(DocumentTextIcon)
        .child(
          S.document()
            .schemaType('siteTeksten')
            .documentId('siteTeksten')
            .title('Teksten op de site')
            // defaultDocumentNode hieronder raakt alleen documenten die de
            // structuur zelf oplost. Een met de hand gebouwde node als deze
            // moet dezelfde tabbladen krijgen, anders ontbreekt het voorbeeld
            // juist op het document dat het meest bewerkt wordt.
            .views([
              S.view.form().title('Bewerken'),
              S.view.component(SitePreview).title('Voorbeeld'),
            ]),
        ),
      S.documentTypeListItem('sponsor').title('Sponsoren').icon(HeartIcon),
    ]);

export default defineConfig({
  name: 'toonoverleven',
  title: 'Toon over Leven',
  projectId,
  dataset,
  // Op hun eigen adres, /beheer, zodat ze één adres hoeven te onthouden in
  // plaats van een hostname op sanity.studio.
  basePath: '/beheer',
  plugins: [
    structureTool({
      structure,
      // Elk document krijgt een tweede tabblad met de echte site zoals hij er
      // met dit concept uitziet, zodat "hoe wordt dit?" beantwoord is zonder
      // te publiceren.
      defaultDocumentNode: (S) =>
        S.document().views([
          S.view.form().title('Bewerken'),
          S.view.component(SitePreview).title('Voorbeeld'),
        ]),
    }),
    nlNLLocale(),
  ],
  schema: {
    types: schemaTypes,
    // Klikken op een lege dag in de kalender opent een nieuw agendapunt met die
    // datum er al in. Een sjabloon met een parameter komt niet in het menu
    // "nieuw" terecht, dus het staat de gewone knop niet in de weg.
    templates: (previous) => [
      ...previous,
      {
        id: 'activiteit-op-datum',
        title: 'Agendapunt op een datum',
        schemaType: 'activiteit',
        parameters: [{ name: 'datum', type: 'string' }],
        value: ({ datum }: { datum?: string }) => (datum ? { datum } : {}),
      },
    ],
  },
  // Het eerste gereedschap krijgt de landingsroute, dus /beheer opent op een
  // welkomstscherm in plaats van op de lege rechterhelft van een lijst.
  tools: (previous) => [
    { name: 'start', title: 'Start', icon: HomeIcon, component: Start },
    ...previous,
  ],
  document: {
    // Er is één tekstendocument en dat bestaat al. "Nieuw" aanbieden levert
    // alleen een tweede op dat door niets gelezen wordt.
    newDocumentOptions: (previous) => previous.filter((item) => item.templateId !== 'siteTeksten'),
  },
});
