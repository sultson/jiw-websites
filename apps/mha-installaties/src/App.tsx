import { Suspense, lazy, useEffect, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import UspStrip from './components/UspStrip';
import Services from './components/Services';
import About from './components/About';
import Werkwijze from './components/Werkwijze';
import Work from './components/Work';
import Reviews from './components/Reviews';
import Werkzaamheden from './components/Werkzaamheden';
import Footer from './components/Footer';
import OfferteFab from './components/OfferteFab';
import { OfferteProvider, useOfferte } from './contexts/OfferteContext';

const OfferteModal = lazy(() => import('./components/OfferteModal'));

function DeferredOfferteModal() {
  const { isOpen } = useOfferte();
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => {
    if (isOpen) setHasOpened(true);
  }, [isOpen]);
  if (!hasOpened) return null;
  return (
    <Suspense fallback={null}>
      <OfferteModal />
    </Suspense>
  );
}

export default function App() {
  return (
    <OfferteProvider>
      <Nav />
      <main>
        <Hero />
        <Werkzaamheden />
        <UspStrip />
        <Services />
        <About />
        <Werkwijze />
        <Work />
        <Reviews />
      </main>
      <Footer />
      <OfferteFab />
      <DeferredOfferteModal />
    </OfferteProvider>
  );
}
