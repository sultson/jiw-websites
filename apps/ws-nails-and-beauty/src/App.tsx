import { useState } from 'react';
import { useLang } from './hooks/useLang';
import TopBar from './components/TopBar';
import Nav from './components/Nav';
import Hero from './components/Hero';
import UspStrip from './components/UspStrip';
import Work from './components/Work';
import Marquee from './components/Marquee';
import Aanbod from './components/Aanbod';
import About from './components/About';
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
    <div className="min-h-[100dvh] flex flex-col bg-porcelain">
      <TopBar lang={lang} t={t} />
      <Nav lang={lang} setLang={setLang} t={t} onBook={openBooking} />

      <main className="flex-1">
        <Hero t={t} onBook={openBooking} />
        <UspStrip t={t} />
        <About t={t} />
        <Work t={t} />
        <Marquee />
        <Aanbod t={t} onBook={openBooking} />
        <Reviews lang={lang} t={t} />
        <Visit t={t} onBook={openBooking} />
        <Faq t={t} onBook={openBooking} />
      </main>

      <Footer t={t} />

      <StickyBookCta t={t} onBook={openBooking} hidden={bookingOpen} />
      <BookingModal open={bookingOpen} onClose={closeBooking} t={t} />
    </div>
  );
}
