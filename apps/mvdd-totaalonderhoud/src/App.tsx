import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
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
        <About />
        <Services />
        <Gallery />
        <Reviews />
      </main>
      <Footer />
      <OfferteFab />
      <OfferteModal />
    </OfferteProvider>
  );
}
