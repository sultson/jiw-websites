import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Showcase from './components/Showcase';
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
        <Projects />
        <Showcase />
        <Reviews />
      </main>
      <Footer />
      <OfferteFab />
      <OfferteModal />
    </OfferteProvider>
  );
}
