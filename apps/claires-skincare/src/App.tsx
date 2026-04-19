import { useLang } from './hooks/useLang';
import Nav from './components/Nav';
import Hero from './components/Hero';
import UspStrip from './components/UspStrip';
import SignatureFacial from './components/SignatureFacial';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import About from './components/About';
import Visit from './components/Visit';
import Faq from './components/Faq';
import Footer from './components/Footer';
import StickyBookCta from './components/StickyBookCta';

// TODO: vervang door eigen booking-systeem zodra bekend
const BOOKING_URL = 'https://www.treatwell.nl/place/claire-s-skincare-studio/';

function openBooking() {
  window.open(BOOKING_URL, '_blank', 'noopener,noreferrer');
}

export default function App() {
  const { lang, setLang, t } = useLang();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-cream">
      <Nav lang={lang} setLang={setLang} t={t} onBook={openBooking} />

      <main className="flex-1">
        <Hero t={t} onBook={openBooking} />
        <UspStrip t={t} />
        <SignatureFacial t={t} onBook={openBooking} />
        <Services lang={lang} t={t} onBook={openBooking} />
        <Gallery t={t} />
        <Reviews lang={lang} t={t} />
        <About t={t} />
        <Visit lang={lang} t={t} />
        <Faq t={t} />
      </main>

      <Footer t={t} />

      <StickyBookCta t={t} onBook={openBooking} />
    </div>
  );
}
