import { useEffect } from 'react';
import { usePerspective, useSetPerspective, type LayoutProps } from 'sanity';

/**
 * Keeps the Studio in the one state the museum can actually edit in.
 *
 * Sanity's navbar carries a perspective switcher: "Concepten", "Gepubliceerd",
 * and any content release. It looks like a filter and is not one. Choosing
 * "Gepubliceerd" puts the whole Studio in read-only, because a published
 * document is not a thing you edit — you edit its draft and publish that. Every
 * field greys out, the image field says "Alleen-lezen" with its Uploaden button
 * dead, and a new document opens with "Kan geen gepubliceerd document maken".
 *
 * From the client's side that is indistinguishable from a broken CMS: nothing
 * says which switch did it, and the switch is two words in the top right that
 * nobody remembers pressing. It happened here, and cost the museum a day of not
 * being able to add a work.
 *
 * So the perspective is pinned to drafts, and the switcher is taken out of the
 * navbar. Nothing is lost: this Studio has one editor, no releases and no
 * scheduled publishing, and the "Voorbeeld" tab on every document already shows
 * the site rendered with the draft, which is the only thing the published
 * perspective was ever going to be used for.
 *
 * The reset runs as well as the hiding, and has to: a Studio that was left in
 * the published perspective would otherwise open read-only with no visible way
 * back out of it.
 *
 * Two more things go with the switcher, both of them Sanity selling rather than
 * the museum editing. The lightning bolt in the navbar (and its twin in the user
 * menu) is the Growth trial: it counts days down and opens a dialog, and a
 * project on a trial lets you start using paid features that lock again when the
 * trial ends. The same trial can open that dialog by itself on load
 * (`#free-trial-modal`). Neither has a config switch, so they are hidden here;
 * the bolt is matched by its icon because the button carries no id of its own.
 */
export default function AlleenConcepten(props: LayoutProps) {
  const { selectedPerspectiveName } = usePerspective();
  const setPerspective = useSetPerspective();

  useEffect(() => {
    // Drafts is the absence of a perspective. Anything else — "published", or
    // a release id — is a state this Studio has no use for.
    if (selectedPerspectiveName !== undefined) setPerspective('drafts');
  }, [selectedPerspectiveName, setPerspective]);

  return (
    <>
      <style>{`
        [data-ui="ReleasesNav"],
        button:has([data-sanity-icon="bolt"]),
        #free-trial-modal,
        :has(> #free-trial-modal) { display: none !important; }
      `}</style>
      {props.renderDefault(props)}
    </>
  );
}
