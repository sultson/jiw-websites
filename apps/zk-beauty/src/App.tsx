import { useLang } from './hooks/useLang';
import Nav from './components/Nav';
import Hero from './components/Hero';
import UspStrip from './components/UspStrip';
import Marquee from './components/Marquee';
import About from './components/About';
import Services from './components/Services';
import Work from './components/Work';
import Reviews from './components/Reviews';
import Visit from './components/Visit';
import Faq from './components/Faq';
import Footer from './components/Footer';
import WhatsAppFab from './components/WhatsAppFab';
import StickyBookCta from './components/StickyBookCta';

export default function App() {
  const { lang, setLang, t } = useLang();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-ivory">
      <Nav lang={lang} setLang={setLang} t={t} />

      <main className="flex-1">
        <Hero t={t} />
        <UspStrip t={t} />
        <Marquee t={t} />
        <About t={t} />
        <Services t={t} />
        <Work t={t} />
        <Reviews lang={lang} t={t} />
        <Visit lang={lang} t={t} />
        <Faq t={t} />
      </main>

      <Footer t={t} />

      <StickyBookCta t={t} />
      <WhatsAppFab />
    </div>
  );
}
