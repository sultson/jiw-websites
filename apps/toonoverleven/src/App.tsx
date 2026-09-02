import { useEffect, useMemo } from 'react';
import Nav from './components/Nav';
import Voet from './components/Voet';
import Melding from './components/Melding';
import ContactKnop from './components/ContactKnop';
import { useAgenda } from './agenda/useAgenda';
import { lopendeMelding } from './agenda/model';
import { content, isVoorbeeld } from './content';
import { usePad, useInterneLinks, useScrollBijNavigatie } from './router';
import { titelVan, VERHUISD } from './meta';
import { vindPagina } from './inhoud';
import { metFeiten } from './inhoud/feiten';
import { metEchteLinks } from './inhoud/links';
import Redactie from './pagina/Redactie';
import { onderaanVoor, sleuvenVoor, type Bronnen } from './pagina/sleuven';
import NieuwsIndex from './pages/NieuwsIndex';
import NieuwsBericht from './pages/NieuwsBericht';
import NietGevonden from './pages/NietGevonden';
import { NU } from './nu';
import type { Content } from './content/types';
import type { Bericht } from './content/types';

/**
 * Wat de Worker meegeeft als hij de pagina op de server tekent. In de browser
 * blijft dit leeg en leest de app hetzelfde uit het document.
 */
export type Start = { pad: string; inhoud: Content; voorbeeld: boolean; nu: number };

export default function App({ start }: { start?: Start } = {}) {
  const levendPad = usePad();
  const pad = start?.pad ?? levendPad;
  const inhoud = start?.inhoud ?? content;
  const voorbeeld = start?.voorbeeld ?? isVoorbeeld;

  const nu = useMemo(() => new Date(start?.nu ?? NU), [start?.nu]);
  const agenda = useAgenda(inhoud.agenda, nu);
  const melding = lopendeMelding(agenda);

  useInterneLinks();
  useScrollBijNavigatie(pad);
  useTitel(pad, inhoud.nieuws);

  const bronnen: Bronnen = {
    agenda,
    nu,
    berichten: inhoud.nieuws,
    verhalen: inhoud.verhalen,
    sponsoren: inhoud.sponsoren,
    teksten: inhoud.teksten,
  };

  return (
    <div className="flex min-h-screen flex-col">
      {voorbeeld && <Voorbeeldbalk />}
      <Nav />
      {melding && <Melding melding={melding} />}
      <main id="inhoud" className="flex-1">
        <Pagina pad={pad} bronnen={bronnen} />
      </main>
      <Voet sponsoren={inhoud.sponsoren} />
      <ContactKnop />
    </div>
  );
}

function Pagina({ pad, bronnen }: { pad: string; bronnen: Bronnen }) {
  // Een adres dat de site vroeger had, hoort op zijn nieuwe plek uit te komen.
  // De Worker doet dit met een 301; dit vangt het geval dat iemand al binnen is.
  const verhuisd = VERHUISD[pad];
  if (verhuisd) {
    const doel = vindPagina(verhuisd);
    if (doel) {
      const klaar = metEchteLinks(metFeiten(doel, bronnen.teksten));
      return (
        <Redactie
          pagina={klaar}
          sleuven={sleuvenVoor(klaar, bronnen)}
          onderaan={onderaanVoor(verhuisd, bronnen)}
        />
      );
    }
  }

  if (pad === '/nieuws') return <NieuwsIndex berichten={bronnen.berichten} />;

  const artikel = /^\/nieuws\/([^/]+)$/.exec(pad);
  if (artikel) {
    const bericht = zoekBericht(bronnen.berichten, artikel[1]);
    if (bericht) return <NieuwsBericht bericht={bericht} berichten={bronnen.berichten} />;
    return <NietGevonden />;
  }

  const gevonden = vindPagina(pad);
  if (!gevonden) return <NietGevonden />;

  const pagina = metEchteLinks(metFeiten(gevonden, bronnen.teksten));

  return (
    <Redactie
      pagina={pagina}
      sleuven={sleuvenVoor(pagina, bronnen)}
      onderaan={onderaanVoor(pad, bronnen)}
      eersteFoto={pad === '/'}
      // De agenda zet zijn kalender naast zijn lijst; met de kolom ernaast
      // erbij zouden dat drie kolommen op één scherm zijn en past er nog één
      // kaart naast de kalender.
      breed={pad === '/activiteiten/agenda'}
    />
  );
}

/**
 * Hoe de pagina in het tabblad heet, terwijl je zonder herladen door de site
 * loopt. De Worker schrijft hetzelfde in de HTML voordat hij verstuurt; dat is
 * wat een zoekmachine leest, dit is wat de bezoeker ziet.
 */
function useTitel(pad: string, berichten: Bericht[]) {
  useEffect(() => {
    const artikel = /^\/nieuws\/([^/]+)$/.exec(pad);
    const bericht = artikel ? zoekBericht(berichten, artikel[1]) : undefined;
    document.title = bericht ? `${bericht.titel} | Toon over Leven` : titelVan(pad);
  }, [pad, berichten]);
}

const zoekBericht = (berichten: Bericht[], slug: string): Bericht | undefined =>
  berichten.find((bericht) => bericht.slug === decodeURIComponent(slug));

/**
 * Staat er een concept op het scherm, dan hoort daar geen twijfel over te zijn.
 * Alleen zichtbaar in het voorbeeld uit het beheer.
 */
function Voorbeeldbalk() {
  return (
    <p className="bg-wijn px-5 py-2 text-center text-sm font-semibold text-white">
      Voorbeeld: dit is de site met uw wijzigingen, ook wat nog niet gepubliceerd is.
    </p>
  );
}
