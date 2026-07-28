import { useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import { Contact, Doelgroepen, Footer, Over, Pillars, Vakgebieden, Werkwijze } from './components/Sections';
import type { ServiceKey } from './data';

export default function App() {
  const [active, setActive] = useState<ServiceKey | null>(null);

  return (
    <div className="bg-ink">
      <Nav />
      <main>
        <Hero active={active} onSelect={setActive} />
        <Pillars />
        <Vakgebieden onSelect={setActive} />
        <Doelgroepen />
        <Werkwijze />
        <Over />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
