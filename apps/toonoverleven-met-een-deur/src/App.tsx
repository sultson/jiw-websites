import { useEffect } from 'react';
import Nav from './components/Nav';
import Voet from './components/Voet';
import Melding from './components/Melding';
import ContactKnop from './components/ContactKnop';
import { useAgenda } from './agenda/useAgenda';
import { lopendeMelding } from './agenda/model';
import { content, isVoorbeeld, vindBericht } from './content';
import { usePad, useInterneLinks, useScrollBijNavigatie } from './router';
import { NIET_GEVONDEN, PADEN, PAGINAS, paginaTitel, type Pad } from './meta';
import Home from './pages/Home';
import WieWeZijn from './pages/WieWeZijn';
import AgendaPagina from './pages/AgendaPagina';
import NieuwsIndex from './pages/NieuwsIndex';
import NieuwsBericht from './pages/NieuwsBericht';
import Vrijwilliger from './pages/Vrijwilliger';
import Steun from './pages/Steun';
import Verantwoording from './pages/Verantwoording';
import Contact from './pages/Contact';
import NietGevonden from './pages/NietGevonden';

export default function App() {
  const pad = usePad();
  const agenda = useAgenda();
  const melding = lopendeMelding(agenda);

  useInterneLinks();
  useScrollBijNavigatie(pad);
  useTitel(pad);

  return (
    <div className="flex min-h-screen flex-col">
      {isVoorbeeld && <Voorbeeldbalk />}
      <Nav />
      {melding && <Melding melding={melding} />}
      <main className="flex-1">
        <Pagina pad={pad} agenda={agenda} />
      </main>
      <Voet />
      <ContactKnop />
    </div>
  );
}

function Pagina({ pad, agenda }: { pad: string; agenda: ReturnType<typeof useAgenda> }) {
  const { teksten, nieuws, sponsoren } = content;

  switch (pad) {
    case '/':
      return <Home teksten={teksten} agenda={agenda} berichten={nieuws.slice(0, 8)} />;
    case '/wie-we-zijn':
      return <WieWeZijn teksten={teksten} />;
    case '/agenda':
      return <AgendaPagina teksten={teksten} agenda={agenda} />;
    case '/nieuws':
      return <NieuwsIndex teksten={teksten} berichten={nieuws} />;
    case '/vrijwilliger':
      return <Vrijwilliger teksten={teksten} />;
    case '/steun':
      return <Steun teksten={teksten} sponsoren={sponsoren} />;
    case '/verantwoording':
      return <Verantwoording teksten={teksten} />;
    case '/contact':
      return <Contact teksten={teksten} />;
    default: {
      const artikel = /^\/nieuws\/([^/]+)$/.exec(pad);
      const bericht = artikel ? vindBericht(decodeURIComponent(artikel[1])) : undefined;
      if (bericht) return <NieuwsBericht bericht={bericht} berichten={nieuws} />;
      return <NietGevonden />;
    }
  }
}

/**
 * Hoe de pagina in het tabblad heet, terwijl je zonder herladen door de site
 * loopt. De Worker schrijft hetzelfde in de HTML voordat hij verstuurt; dat is
 * wat een zoekmachine leest, dit is wat de bezoeker ziet.
 */
function useTitel(pad: string) {
  useEffect(() => {
    if ((PADEN as readonly string[]).includes(pad)) {
      const vast = PAGINAS[pad as Pad];
      document.title = pad === '/' ? vast.titel : paginaTitel(vast.titel);
      return;
    }
    const artikel = /^\/nieuws\/([^/]+)$/.exec(pad);
    const bericht = artikel ? vindBericht(decodeURIComponent(artikel[1])) : undefined;
    document.title = paginaTitel(bericht ? bericht.titel : NIET_GEVONDEN);
  }, [pad]);
}

/**
 * Staat er een concept op het scherm, dan hoort daar geen twijfel over te zijn.
 * Alleen zichtbaar in het voorbeeld uit het beheer.
 */
function Voorbeeldbalk() {
  return (
    <p className="bg-groen-diep px-5 py-2 text-center text-sm font-semibold text-white">
      Voorbeeld: dit is de site met uw wijzigingen, ook wat nog niet gepubliceerd is.
    </p>
  );
}
