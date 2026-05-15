import { useState } from 'react';
import { useLang } from './hooks/useLang';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import UspStrip from './components/UspStrip';
import Services from './components/Services';
import Projects from './components/Projects';
import Werkwijze from './components/Werkwijze';
import Reviews from './components/Reviews';
import Team from './components/Team';
import Faq from './components/Faq';
import CtaBand from './components/CtaBand';
import Footer from './components/Footer';
import FloatingFab from './components/FloatingFab';
import IntakeModal from './components/IntakeModal';

export default function App() {
  const { lang, setLang, t } = useLang();
  const [intakeOpen, setIntakeOpen] = useState(false);
  const openIntake = () => setIntakeOpen(true);
  const closeIntake = () => setIntakeOpen(false);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white">
      <Nav lang={lang} setLang={setLang} t={t} onIntake={openIntake} />

      <main className="flex-1">
        <Hero t={t} onIntake={openIntake} />
        <Marquee t={t} />
        <UspStrip t={t} />
        <Services t={t} lang={lang} onIntake={openIntake} />
        <Projects t={t} lang={lang} />
        <Werkwijze t={t} lang={lang} />
        <Reviews t={t} lang={lang} />
        <Team t={t} lang={lang} />
        <Faq t={t} onIntake={openIntake} />
        <CtaBand t={t} onIntake={openIntake} />
      </main>

      <Footer t={t} onIntake={openIntake} />

      <FloatingFab t={t} onIntake={openIntake} hidden={intakeOpen} />
      <IntakeModal open={intakeOpen} onClose={closeIntake} t={t} />
    </div>
  );
}
