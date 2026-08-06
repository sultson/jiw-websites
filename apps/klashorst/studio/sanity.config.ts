import { defineConfig } from 'sanity';
import { structureTool, type StructureBuilder } from 'sanity/structure';
import { nlNLLocale } from '@sanity/locale-nl-nl';
// Subpath import: @sanity/icons v5's barrel does not re-export the icons the
// bundler can see, so `from '@sanity/icons'` fails the build with MISSING_EXPORT.
import { HomeIcon } from '@sanity/icons/Home';
import { schemaTypes } from './schemas';
import Start from './tools/Start';
import SitePreview from './tools/SitePreview';

// Not secrets: the project id is public and read-only, and it also sits in
// wrangler.jsonc. Hardcoded so a checkout builds without an .env file.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'banas90d';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

/**
 * The whole editing surface, in Dutch, with four things in it: the texts on the
 * site, the collection, the gallery for other artists, and the blog. Anything
 * that would let an edit break the page is deliberately not here.
 */
const structure = (S: StructureBuilder) =>
  S.list()
    .title('Museum')
    .items([
      S.listItem()
        .title('Teksten op de site')
        .id('siteTeksten')
        .child(
          S.document()
            .schemaType('siteTeksten')
            .documentId('siteTeksten')
            .title('Teksten op de site')
            // defaultDocumentNode below only reaches documents the structure
            // resolves itself. A hand-built node like this one has to be given
            // the same views, or the preview tab is missing on exactly the
            // document the client edits most.
            .views([S.view.form().title('Bewerken'), S.view.component(SitePreview).title('Voorbeeld')]),
        ),
      S.divider(),
      S.documentTypeListItem('werk').title('Collectie'),
      S.documentTypeListItem('galeriewerk').title('Galerie: andere kunstenaars'),
      S.documentTypeListItem('nieuws').title('Blog'),
    ]);

export default defineConfig({
  name: 'klashorst',
  title: 'Klashorst Museum',
  projectId,
  dataset,
  // Served from the museum's own domain at /beheer, so the client has one
  // address to remember instead of a sanity.studio hostname.
  basePath: '/beheer',
  plugins: [
    structureTool({
      structure,
      // Every document gets a second tab showing the live site rendered with
      // this draft, so "hoe ziet dit eruit?" is answered without publishing.
      defaultDocumentNode: (S) =>
        S.document().views([
          S.view.form().title('Bewerken'),
          S.view.component(SitePreview).title('Voorbeeld'),
        ]),
    }),
    nlNLLocale(),
  ],
  schema: { types: schemaTypes },
  // First tool wins the landing route, so /beheer opens on a welcome screen
  // rather than the structure list's empty right-hand pane.
  tools: (previous) => [
    { name: 'start', title: 'Start', icon: HomeIcon, component: Start },
    ...previous,
  ],
  document: {
    // There is one texts document and it already exists. Offering "new" here
    // would only produce a second one that nothing reads.
    newDocumentOptions: (previous) => previous.filter((item) => item.templateId !== 'siteTeksten'),
  },
});
