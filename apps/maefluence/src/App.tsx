import { useEffect } from 'react';
import { useLang } from './hooks/useLang';
import { useRoute } from './hooks/useRoute';
import Nav from './components/Nav';
import Footer from './components/Footer';
import FloatingCta from './components/FloatingCta';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';

export default function App() {
  const { lang, setLang, t } = useLang();
  const { route, go } = useRoute();

  useEffect(() => {
    if (route === 'home') document.title = 'Maefluence · High-end social media strategie & content';
  }, [route]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-bone">
      <Nav lang={lang} setLang={setLang} t={t} route={route} go={go} />

      <main className="flex-1">
        {route === 'home' && <Home t={t} go={go} />}
        {route === 'about' && <About t={t} go={go} />}
        {route === 'services' && <Services t={t} />}
        {route === 'contact' && <Contact t={t} />}
      </main>

      <Footer t={t} go={go} />
      <FloatingCta t={t} />
    </div>
  );
}
