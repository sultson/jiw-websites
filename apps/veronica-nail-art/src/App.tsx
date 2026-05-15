import Nav from './components/Nav';
import Hero from './components/Hero';
import UspStrip from './components/UspStrip';
import About from './components/About';
import Craft from './components/Craft';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Visit from './components/Visit';
import Faq from './components/Faq';
import Footer from './components/Footer';
import StickyCallCta from './components/StickyCallCta';

export default function App() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-cream">
      <Nav />

      <main className="flex-1">
        <Hero />
        <UspStrip />
        <About />
        <Craft />
        <Services />
        <Gallery />
        <Reviews />
        <Visit />
        <Faq />
      </main>

      <Footer />

      <StickyCallCta />
    </div>
  );
}
