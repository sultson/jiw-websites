import { useState } from 'react';
import { useLang } from './hooks/useLang';
import { useReveal } from './hooks/useReveal';
import Nav from './components/Nav';
import Hero from './components/Hero';
import UspStrip from './components/UspStrip';
import About from './components/About';
import Services from './components/Services';
import Work from './components/Work';
import Reviews from './components/Reviews';
import Booking from './components/Booking';
import Visit from './components/Visit';
import Faq from './components/Faq';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import BookingModal from './components/BookingModal';

export default function App() {
  const { lang, setLang, t } = useLang();
  const [bookingOpen, setBookingOpen] = useState(false);
  useReveal();

  const openBooking = () => setBookingOpen(true);
  const closeBooking = () => setBookingOpen(false);

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Nav lang={lang} setLang={setLang} t={t} onBook={openBooking} />

      <main className="flex-1">
        <Hero t={t} onBook={openBooking} />
        <UspStrip t={t} />
        <About t={t} />
        <Services t={t} onBook={openBooking} />
        <Work t={t} />
        <Reviews t={t} />
        <Booking t={t} />
        <Visit t={t} />
        <Faq t={t} />
      </main>

      <Footer t={t} onBook={openBooking} />

      <FloatingActions t={t} onBook={openBooking} hidden={bookingOpen} />
      <BookingModal open={bookingOpen} onClose={closeBooking} t={t} />
    </div>
  );
}
