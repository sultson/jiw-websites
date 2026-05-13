import Nav from './components/Nav';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Services from './components/Services';
import Gallery from './components/Gallery';
import About from './components/About';
import Reviews from './components/Reviews';
import Offerte from './components/Offerte';
import OfferteFab from './components/OfferteFab';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-bbn-ink text-zinc-100">
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Services />
        <Gallery />
        <About />
        <Reviews />
        <Offerte />
      </main>
      <Footer />
      <OfferteFab />
    </div>
  );
}
