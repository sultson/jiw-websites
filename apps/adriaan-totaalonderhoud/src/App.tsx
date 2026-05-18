import { SiteProvider } from './contexts/SiteContext';
import { OfferteProvider } from './contexts/OfferteContext';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import Werkzaamheden from './components/Werkzaamheden';
import UspStrip from './components/UspStrip';
import Services from './components/Services';
import About from './components/About';
import Werkwijze from './components/Werkwijze';
import Projecten from './components/Projecten';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import OfferteModal from './components/OfferteModal';
import OfferteFab from './components/OfferteFab';

export default function App() {
  return (
    <SiteProvider>
      <OfferteProvider>
        <TopBar />
        <main>
          <Hero />
          <Werkzaamheden />
          <UspStrip />
          <Services />
          <About />
          <Werkwijze />
          <Projecten />
          <Reviews />
        </main>
        <Footer />
        <OfferteFab />
        <OfferteModal />
      </OfferteProvider>
    </SiteProvider>
  );
}
