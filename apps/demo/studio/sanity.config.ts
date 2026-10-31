import { defineConfig } from 'sanity';
import { structureTool, type StructureBuilder } from 'sanity/structure';
import { nlNLLocale } from '@sanity/locale-nl-nl';
// Subpath import: the @sanity/icons v5 barrel fails the build with MISSING_EXPORT.
import { HomeIcon } from '@sanity/icons/Home';
import { schemaTypes } from './schemas';
import Start from './tools/Start';
import SitePreview from './tools/SitePreview';
import AlleenConcepten from './tools/AlleenConcepten';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'kkxa1yec';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

const views = (S: StructureBuilder) => [
  S.view.form().title('Bewerken'),
  S.view.component(SitePreview).title('Voorbeeld'),
];

const structure = (S: StructureBuilder) =>
  S.list()
    .title('Demo')
    .items([
      S.listItem()
        .title('Teksten op de site')
        .id('siteTeksten')
        .child(
          // A hand-built singleton does not get defaultDocumentNode's views.
          S.document().schemaType('siteTeksten').documentId('siteTeksten').title('Teksten op de site').views(views(S)),
        ),
      S.divider(),
      S.documentTypeListItem('bericht').title('Berichten'),
    ]);

export default defineConfig({
  name: 'demo',
  title: 'Demo',
  projectId,
  dataset,
  basePath: '/beheer',
  plugins: [
    structureTool({ structure, defaultDocumentNode: (S) => S.document().views(views(S)) }),
    nlNLLocale(),
  ],
  schema: { types: schemaTypes },
  releases: { enabled: false },
  scheduledDrafts: { enabled: false },
  studio: { components: { layout: AlleenConcepten } },
  tools: (previous) => [
    { name: 'start', title: 'Start', icon: HomeIcon, component: Start },
    ...previous.filter((tool) => tool.name !== 'releases'),
  ],
  document: {
    newDocumentOptions: (previous) => previous.filter((item) => item.templateId !== 'siteTeksten'),
  },
});
