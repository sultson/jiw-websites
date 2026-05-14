import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import ServiceArea from './components/ServiceArea';
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
        <Projects />
        <Gallery />
        <Reviews />
        <ServiceArea />
      </main>
      <Footer />
      <OfferteFab />
      <OfferteModal />
    </OfferteProvider>
  );
}
