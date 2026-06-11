import { useLang } from './hooks/useLang';
import Nav from './components/Nav';
import Hero from './components/Hero';
import UspStrip from './components/UspStrip';
import About from './components/About';
import Services from './components/Services';
import Products from './components/Products';
import Gallery from './components/Gallery';
import Visit from './components/Visit';
import Faq from './components/Faq';
import Footer from './components/Footer';
import WhatsAppBubble from './components/WhatsAppBubble';
import StickyCallCta from './components/StickyCallCta';

export default function App() {
  const { lang, setLang, t } = useLang();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-cream">
      <Nav lang={lang} setLang={setLang} t={t} />

      <main className="flex-1">
        <Hero t={t} />
        <UspStrip t={t} />
        <About t={t} />
        <Services t={t} lang={lang} />
        <Products t={t} />
        <Gallery t={t} lang={lang} />
        <Visit t={t} lang={lang} />
        <Faq t={t} />
      </main>

      <Footer t={t} lang={lang} />

      <WhatsAppBubble t={t} />
      <StickyCallCta t={t} />
    </div>
  );
}
