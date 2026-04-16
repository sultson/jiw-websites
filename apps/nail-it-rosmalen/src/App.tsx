import { useLang } from './hooks/useLang';
import Nav from './components/Nav';
import Hero from './components/Hero';
import UspStrip from './components/UspStrip';
import About from './components/About';
import Awards from './components/Awards';
import Products from './components/Products';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Visit from './components/Visit';
import Terms from './components/Terms';
import Faq from './components/Faq';
import Footer from './components/Footer';
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
        <Awards t={t} />
        <Services lang={lang} t={t} />
        <Products t={t} />
        <Gallery t={t} />
        <Reviews lang={lang} t={t} />
        <Terms t={t} />
        <Visit lang={lang} t={t} />
        <Faq t={t} />
      </main>

      <Footer t={t} />

      <StickyCallCta t={t} />
    </div>
  );
}
