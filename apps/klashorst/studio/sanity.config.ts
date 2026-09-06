import { defineConfig } from 'sanity';
import { structureTool, type StructureBuilder, type UserComponent } from 'sanity/structure';
import { nlNLLocale } from '@sanity/locale-nl-nl';
// Subpath import: @sanity/icons v5's barrel does not re-export the icons the
// bundler can see, so `from '@sanity/icons'` fails the build with MISSING_EXPORT.
import { HomeIcon } from '@sanity/icons/Home';
import { ThLargeIcon } from '@sanity/icons/ThLarge';
import { schemaTypes } from './schemas';
import Start from './tools/Start';
import SitePreview from './tools/SitePreview';
import SeoPanel from './tools/SeoPanel';
import { NIEUW, VolgordeCollectie, VolgordeGalerie } from './tools/Volgorde';
import AlleenConcepten from './tools/AlleenConcepten';

// Not secrets: the project id is public and read-only, and it also sits in
// wrangler.jsonc. Hardcoded so a checkout builds without an .env file.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'banas90d';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

/**
 * A wall, as one screen: the works in the grid the visitor sees, big thumbnails,
 * four to a row, dragged into place, with the + that adds one in the header.
 *
 * There used to be two entries per wall, the plugin's own list and this grid,
 * which split the editing over two screens that looked nothing alike. The list
 * had exactly one thing the grid did not, the + button, so that moved here and
 * the list went.
 *
 * The + is an intent rather than a button of our own: Sanity answers it with the
 * type's initial values, which is where a new work gets the `orderRank` that
 * hangs it at the end of the wall. `canHandleIntent` keeps the answer inside
 * this pane, so the new work opens next to the grid it was added to.
 *
 * The child is spelled out because a hand-built node reaches neither
 * `defaultDocumentNode` nor the views it hands out, and a work opened from a
 * tile has to be the same editor as one opened from anywhere else.
 */
const wand = (S: StructureBuilder, type: string, title: string, component: UserComponent) =>
  S.listItem()
    .id(type)
    .title(title)
    .icon(ThLargeIcon)
    .child(
      S.component(component)
        .id(type)
        .title(title)
        .menuItems([S.menuItem().title(NIEUW[type]).intent({ type: 'create', params: { type } })])
        .canHandleIntent((_intent, params) => params?.type === type)
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
 * that would let an edit break the page is deliberately not here. One entry per
 * wall: adding, editing and arranging a work all happen on the same screen.
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
      // Both walls are hung by dragging, not by typing a number into every
      // work and hoping the gaps still add up. The order in these two grids is
      // the order on the page, in the collection and in the 3D room.
      wand(S, 'werk', 'Klashorst Collectie', VolgordeCollectie),
      wand(S, 'galeriewerk', 'Andere Kunst', VolgordeGalerie),
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
  // One editor, one museum, nothing scheduled: a release is a way of preparing
  // a batch of changes for a date, and there is no such date here. Left on, its
  // switcher is only a way for the client to put their own Studio in read-only.
  releases: { enabled: false },
  scheduledDrafts: { enabled: false },
  studio: { components: { layout: AlleenConcepten } },
  // First tool wins the landing route, so /beheer opens on a welcome screen
  // rather than the structure list's empty right-hand pane. The Releases tab
  // goes with the feature above; leaving it would be a tab onto nothing.
  tools: (previous) => [
    { name: 'start', title: 'Start', icon: HomeIcon, component: Start },
    ...previous.filter((tool) => tool.name !== 'releases'),
  ],
  document: {
    // There is one texts document and it already exists. Offering "new" here
    // would only produce a second one that nothing reads.
    newDocumentOptions: (previous) => previous.filter((item) => item.templateId !== 'siteTeksten'),
  },
});
