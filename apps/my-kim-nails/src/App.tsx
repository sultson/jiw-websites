import { useCallback, useState } from 'react';
import { useLang } from './hooks/useLang';
import Nav from './components/Nav';
import Hero from './components/Hero';
import UspStrip from './components/UspStrip';
import HeadSpa from './components/HeadSpa';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import About from './components/About';
import Visit from './components/Visit';
import Faq from './components/Faq';
import Footer from './components/Footer';
import StickyBookCta from './components/StickyBookCta';
import BookingModal from './components/BookingModal';

export default function App() {
  const { lang, setLang, t } = useLang();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [prefillServiceId, setPrefillServiceId] = useState<string | null>(null);

  const openBooking = useCallback((serviceId?: string) => {
    setPrefillServiceId(serviceId ?? null);
    setBookingOpen(true);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-cream">
      <Nav lang={lang} setLang={setLang} t={t} onBook={() => openBooking()} />

      <main className="flex-1">
        <Hero t={t} onBook={() => openBooking()} />
        <UspStrip t={t} />
        <HeadSpa t={t} onBook={() => openBooking('head-spa-classic')} />
        <Services lang={lang} t={t} onBook={openBooking} />
        <Gallery t={t} />
        <Reviews lang={lang} t={t} />
        <About t={t} />
        <Visit lang={lang} t={t} />
        <Faq t={t} />
      </main>

      <Footer t={t} />

      <StickyBookCta t={t} onBook={() => openBooking()} hidden={bookingOpen} />

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        lang={lang}
        t={t}
        prefillServiceId={prefillServiceId}
      />
    </div>
  );
}
