import { useLang } from './hooks/useLang';
import Nav from './components/Nav';
import Hero from './components/Hero';
import UspStrip from './components/UspStrip';
import About from './components/About';
import Specialisaties from './components/Specialisaties';
import Services from './components/Services';
import MediaMarquee from './components/MediaMarquee';
import Reviews from './components/Reviews';
import Visit from './components/Visit';
import Faq from './components/Faq';
import Footer from './components/Footer';
import WhatsAppFab from './components/WhatsAppFab';

export default function App() {
  const { t } = useLang();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-cream">
      <Nav t={t} />

      <main className="flex-1">
        <Hero t={t} />
        <UspStrip t={t} />
        <About t={t} />
        <Specialisaties t={t} />
        <Services t={t} />
        <MediaMarquee t={t} />
        <Reviews t={t} />
        <Visit t={t} />
        <Faq t={t} />
      </main>

      <Footer t={t} />

      <WhatsAppFab />
    </div>
  );
}
