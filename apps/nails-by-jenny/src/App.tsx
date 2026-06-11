import { useLang } from './hooks/useLang';
import Nav from './components/Nav';
import Hero from './components/Hero';
import UspStrip from './components/UspStrip';
import About from './components/About';
import Biab from './components/Biab';
import NailArt from './components/NailArt';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Marquee from './components/Marquee';
import Reviews from './components/Reviews';
import Visit from './components/Visit';
import Faq from './components/Faq';
import Footer from './components/Footer';
import StickyCallCta from './components/StickyCallCta';
import WhatsAppBubble from './components/WhatsAppBubble';

export default function App() {
  const { lang, setLang, t } = useLang();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-cream">
      <Nav lang={lang} setLang={setLang} t={t} />

      <main className="flex-1">
        <Hero t={t} />
        <UspStrip t={t} />
        <About t={t} />
        <Biab t={t} />
        <NailArt t={t} />
        <Services lang={lang} t={t} />
        <Gallery lang={lang} t={t} />
        <Marquee lang={lang} t={t} />
        <Reviews lang={lang} t={t} />
        <Visit t={t} />
        <Faq t={t} />
      </main>

      <Footer t={t} />

      <StickyCallCta t={t} />
      <WhatsAppBubble t={t} />
    </div>
  );
}
