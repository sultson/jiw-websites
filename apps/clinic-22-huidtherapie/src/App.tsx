import { useState } from 'react';
import { useLang } from './hooks/useLang';
import Nav from './components/Nav';
import Hero from './components/Hero';
import UspStrip from './components/UspStrip';
import About from './components/About';
import Expertise from './components/Expertise';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Visit from './components/Visit';
import Faq from './components/Faq';
import Footer from './components/Footer';
import StickyBookCta from './components/StickyBookCta';
import BookingModal from './components/BookingModal';

export default function App() {
  const { lang, setLang, t } = useLang();
  const [bookingOpen, setBookingOpen] = useState(false);
  const openBooking = () => setBookingOpen(true);
  const closeBooking = () => setBookingOpen(false);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-ivory">
      <Nav lang={lang} setLang={setLang} t={t} onBook={openBooking} />

      <main className="flex-1">
        <Hero t={t} onBook={openBooking} />
        <UspStrip t={t} />
        <Gallery t={t} />
        <About t={t} />
        <Expertise t={t} onBook={openBooking} />
        <Services lang={lang} t={t} onBook={openBooking} />
        <Reviews lang={lang} t={t} />
        <Visit lang={lang} t={t} onBook={openBooking} />
        <Faq t={t} onBook={openBooking} />
      </main>

      <Footer t={t} />

      <StickyBookCta t={t} onBook={openBooking} hidden={bookingOpen} />
      <BookingModal open={bookingOpen} onClose={closeBooking} t={t} />
    </div>
  );
}
