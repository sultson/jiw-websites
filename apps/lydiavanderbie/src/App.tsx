import { useCallback, useEffect, useState } from 'react';
import { useLang } from './hooks/useLang';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Opleidingen from './components/Opleidingen';
import OnlineAcademie from './components/OnlineAcademie';
import Trainingen from './components/Trainingen';
import Behandelingen from './components/Behandelingen';
import Agenda from './components/Agenda';
import Over from './components/Over';
import CrkboBand from './components/CrkboBand';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LegalPage from './components/LegalPage';
import ContactModal from './components/ContactModal';

type Route = 'home' | 'privacy' | 'terms';

function routeFromPath(path: string): Route {
  if (path === '/privacy-policy') return 'privacy';
  if (path === '/algemene-voorwaarden') return 'terms';
  return 'home';
}

export default function App() {
  const { lang, setLang, t } = useLang();
  const route = routeFromPath(typeof window !== 'undefined' ? window.location.pathname : '/');
  const onHome = route === 'home';

  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubject, setModalSubject] = useState<string | undefined>(undefined);
  const openModal = useCallback((subject?: string) => {
    setModalSubject(subject);
    setModalOpen(true);
  }, []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  useEffect(() => {
    if (!onHome) window.scrollTo(0, 0);
  }, [onHome]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-canvas">
      <Nav lang={lang} setLang={setLang} t={t} onHome={onHome} onOpen={openModal} />

      {onHome ? (
        <main className="flex-1">
          <Hero t={t} onOpen={openModal} />
          <Marquee t={t} />
          <Over t={t} />
          <Behandelingen t={t} lang={lang} onOpen={openModal} />
          <CrkboBand t={t} />
          <Opleidingen t={t} lang={lang} onOpen={openModal} />
          <OnlineAcademie t={t} lang={lang} />
          <Trainingen t={t} lang={lang} />
          <Agenda t={t} lang={lang} onOpen={openModal} />
          <Reviews t={t} lang={lang} />
          <Contact t={t} onOpen={openModal} />
        </main>
      ) : (
        <div className="flex-1">
          <LegalPage doc={route === 'privacy' ? 'privacy' : 'terms'} t={t} lang={lang} />
        </div>
      )}

      <Footer t={t} onHome={onHome} />

      <ContactModal open={modalOpen} onClose={closeModal} t={t} lang={lang} presetSubject={modalSubject} />
    </div>
  );
}
