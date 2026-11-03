import { useEffect } from 'react';
import { usePerspective, useSetPerspective, type LayoutProps } from 'sanity';

/**
 * Houdt de Studio in de enige stand waarin je kunt bewerken, en haalt eruit wat
 * Sanity verkoopt in plaats van wat de vereniging gebruikt.
 *
 * Rechtsboven staat standaard een keuzeschakelaar "Concepten / Gepubliceerd /
 * releases". Hij lijkt op een filter, maar "Gepubliceerd" zet de hele Studio op
 * alleen-lezen: elk veld wordt grijs en een nieuw document geeft "Kan geen
 * gepubliceerd document maken". Bij Klashorst kostte dat de klant een dag. Dus
 * staat de stand vast op concepten en is de schakelaar weg. Het tabblad
 * "Voorbeeld" laat al zien hoe de site met het concept eruitziet.
 *
 * De bliksemschicht in de bovenbalk (en dezelfde knop in het gebruikersmenu) is
 * de proefperiode van het betaalde Growth-abonnement. Tijdens die proef werken
 * betaalde functies gewoon, en na afloop zitten ze op slot met je werk erin. Hij
 * kan ook zelf een venster openen bij het laden (`#free-trial-modal`). Geen van
 * beide heeft een schakelaar in de config, dus ze worden hier verborgen; de knop
 * op zijn icoon, omdat hij geen eigen id heeft.
 */
export default function AlleenConcepten(props: LayoutProps) {
  const { selectedPerspectiveName } = usePerspective();
  const setPerspective = useSetPerspective();

  useEffect(() => {
    // Concepten is "geen perspectief". Alles anders is een stand zonder nut hier.
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
