import { useState } from 'react';
import { useLang } from './hooks/useLang';
import Nav from './components/Nav';
import Hero from './components/Hero';
import UspStrip from './components/UspStrip';
import Treatments from './components/Treatments';
import Method from './components/Method';
import ForWhom from './components/ForWhom';
import Hendrien from './components/Hendrien';
import Reviews from './components/Reviews';
import Visit from './components/Visit';
import Faq from './components/Faq';
import Footer from './components/Footer';
import StickyBookCta from './components/StickyBookCta';
import BookingModal from './components/BookingModal';

export default function App() {
  const { lang, setLang, t } = useLang();
  const [bookOpen, setBookOpen] = useState(false);
  const openBook = () => setBookOpen(true);
  const closeBook = () => setBookOpen(false);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-paper">
      <Nav lang={lang} setLang={setLang} t={t} onBook={openBook} />

      <main className="flex-1">
        <Hero t={t} onBook={openBook} />
        <UspStrip t={t} />
        <Treatments t={t} onBook={openBook} />
        <Method t={t} />
        <ForWhom t={t} />
        <Hendrien t={t} />
        <Reviews t={t} />
        <Visit t={t} onBook={openBook} />
        <Faq t={t} />
      </main>

      <Footer t={t} onBook={openBook} />

      <StickyBookCta t={t} onBook={openBook} hidden={bookOpen} />
      <BookingModal open={bookOpen} onClose={closeBook} t={t} />
    </div>
  );
}
