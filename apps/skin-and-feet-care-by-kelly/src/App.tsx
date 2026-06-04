import { useState } from 'react';
import { useLang } from './hooks/useLang';
import Nav from './components/Nav';
import Hero from './components/Hero';
import UspStrip from './components/UspStrip';
import About from './components/About';
import Marquee from './components/Marquee';
import Services from './components/Services';
import Voetzorg from './components/Voetzorg';
import Promise from './components/Promise';
import Reviews from './components/Reviews';
import Visit from './components/Visit';
import Faq from './components/Faq';
import Footer from './components/Footer';
import StickyBookCta from './components/StickyBookCta';
import WhatsappBubble from './components/WhatsappBubble';
import ContactModal from './components/ContactModal';

export default function App() {
  const { lang, setLang, t } = useLang();
  const [bookingOpen, setBookingOpen] = useState(false);
  const openBooking = () => setBookingOpen(true);
  const closeBooking = () => setBookingOpen(false);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-cream">
      <Nav lang={lang} setLang={setLang} t={t} onBook={openBooking} />

      <main className="flex-1">
        <Hero t={t} onBook={openBooking} />
        <UspStrip t={t} />
        <About t={t} />
        <Marquee t={t} />
        <Services lang={lang} t={t} onBook={openBooking} />
        <Voetzorg t={t} onBook={openBooking} />
        <Promise t={t} />
        <Reviews t={t} />
        <Visit lang={lang} t={t} />
        <Faq t={t} onBook={openBooking} />
      </main>

      <Footer t={t} />

      <StickyBookCta t={t} onBook={openBooking} hidden={bookingOpen} />
      <WhatsappBubble t={t} />
      <ContactModal open={bookingOpen} onClose={closeBooking} t={t} lang={lang} />
    </div>
  );
}
