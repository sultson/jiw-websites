import { useLang } from './hooks/useLang';
import Nav from './components/Nav';
import Hero from './components/Hero';
import UspStrip from './components/UspStrip';
import About from './components/About';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Visit from './components/Visit';
import Faq from './components/Faq';
import Footer from './components/Footer';
import StickyCta from './components/StickyBookCta';

export default function App() {
  const { lang, setLang, t } = useLang();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-cream">
      <Nav lang={lang} setLang={setLang} t={t} />

      <main className="flex-1">
        <Hero t={t} />
        <UspStrip t={t} />
        <About t={t} />
        <Services lang={lang} t={t} />
        <Gallery t={t} />
        <Reviews lang={lang} t={t} />
        <Visit t={t} />
        <Faq t={t} />
      </main>

      <Footer t={t} />

      <StickyCta t={t} />
    </div>
  );
}
