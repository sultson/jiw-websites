import { defineConfig } from 'sanity';
import { structureTool, type StructureBuilder, type UserComponent } from 'sanity/structure';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';
import type { ConfigContext } from 'sanity';
import { nlNLLocale } from '@sanity/locale-nl-nl';
// Subpath import: @sanity/icons v5's barrel does not re-export the icons the
// bundler can see, so `from '@sanity/icons'` fails the build with MISSING_EXPORT.
import { HomeIcon } from '@sanity/icons/Home';
import { ThLargeIcon } from '@sanity/icons/ThLarge';
import { schemaTypes } from './schemas';
import Start from './tools/Start';
import SitePreview from './tools/SitePreview';
import SeoPanel from './tools/SeoPanel';
import { VolgordeCollectie, VolgordeGalerie } from './tools/Volgorde';

// Not secrets: the project id is public and read-only, and it also sits in
// wrangler.jsonc. Hardcoded so a checkout builds without an .env file.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'banas90d';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

/**
 * The same drag as the list above it, in the grid the visitor sees: big
 * thumbnails, four to a row, so the museum arranges the wall by looking at the
 * work rather than at a column of stamps. Both write the same `orderRank`, so
 * the two can never disagree about where a work hangs.
 *
 * The child is spelled out because a hand-built node reaches neither
 * `defaultDocumentNode` nor the views it hands out, and a work opened from a
 * tile has to be the same editor as one opened from the list.
 */
const volgorde = (S: StructureBuilder, type: string, title: string, component: UserComponent) =>
  S.listItem()
    .id(`volgorde-${type}`)
    .title(title)
    .icon(ThLargeIcon)
    .child(
      S.component(component)
        .id(`volgorde-${type}`)
        .title(title)
        .child((documentId: string) =>
          S.document()
            .documentId(documentId)
            .schemaType(type)
            .views([S.view.form().title('Bewerken'), S.view.component(SitePreview).title('Voorbeeld')]),
        ),
    );

/**
 * The whole editing surface, in Dutch, with four things in it: the texts on the
 * site, the collection, the gallery for other artists, and the blog. Anything
 * that would let an edit break the page is deliberately not here. Each of the
 * two walls is followed by the screen that arranges it.
 */
const structure = (S: StructureBuilder, context: ConfigContext) =>
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
      // Both walls are hung by dragging, not by typing a number into every
      // work and hoping the gaps still add up. The order in these two lists is
      // the order on the page, in the grid and in the 3D room.
      orderableDocumentListDeskItem({
        type: 'werk',
        title: 'Klashorst Collectie',
        S,
        context,
      }),
      volgorde(S, 'werk', 'Volgorde van de collectie', VolgordeCollectie),
      S.divider(),
      orderableDocumentListDeskItem({
        type: 'galeriewerk',
        title: 'Andere Kunst',
        S,
        context,
      }),
      volgorde(S, 'galeriewerk', 'Volgorde van Andere Kunst', VolgordeGalerie),
      S.divider(),
      // A blog is ordered by date, so this one stays a plain list.
      S.documentTypeListItem('nieuws').title('Dirty Diaries'),
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
      // A blog post gets a third: what a search engine will make of it.
      defaultDocumentNode: (S, { schemaType }) => {
        const views = [
          S.view.form().title('Bewerken'),
          S.view.component(SitePreview).title('Voorbeeld'),
        ];
        if (schemaType === 'nieuws') views.push(S.view.component(SeoPanel).title('Vindbaarheid'));
        return S.document().views(views);
      },
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
