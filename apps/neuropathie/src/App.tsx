import { useCallback, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import WatIsNeuropathie from './components/WatIsNeuropathie';
import VoorClienten from './components/VoorClienten';
import Overzicht from './components/Overzicht';
import VoorTherapeuten from './components/VoorTherapeuten';
import Ontstaan from './components/Ontstaan';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ContactModal, { type SubjectKey } from './components/ContactModal';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubject, setModalSubject] = useState<SubjectKey | undefined>(undefined);

  const openModal = useCallback((subject?: SubjectKey) => {
    setModalSubject(subject);
    setModalOpen(true);
  }, []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-canvas">
      <Nav onOpen={openModal} />

      <main className="flex-1">
        <Hero />
        <WatIsNeuropathie />
        <VoorClienten />
        <Overzicht onOpen={openModal} />
        <VoorTherapeuten />
        <Ontstaan />
        <Contact onOpen={openModal} />
      </main>

      <Footer />

      <ContactModal open={modalOpen} onClose={closeModal} presetSubject={modalSubject} />
    </div>
  );
}
