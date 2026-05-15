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
import OfferteModal from './components/OfferteModal';
import OfferteFab from './components/OfferteFab';
import { OfferteProvider } from './contexts/OfferteContext';

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
      <OfferteModal />
    </OfferteProvider>
  );
}
